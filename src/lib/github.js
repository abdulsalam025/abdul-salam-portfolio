const API = "https://api.github.com";
export const GITHUB_USERNAME = "abdulsalam025";
const CACHE_KEY = "gh-snapshot-v1-" + GITHUB_USERNAME;
const CACHE_MS = 5 * 60 * 1000;

export function readCache() {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || !parsed.savedAt || Date.now() - parsed.savedAt > CACHE_MS) return null;
    return parsed.data;
  } catch (error) {
    return null;
  }
}

export function writeCache(data) {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ savedAt: Date.now(), data }));
  } catch (error) {}
}

function rateLimitFrom(response) {
  const remaining = Number(response.headers.get("X-RateLimit-Remaining"));
  const limit = Number(response.headers.get("X-RateLimit-Limit"));
  const reset = Number(response.headers.get("X-RateLimit-Reset"));
  return {
    remaining: Number.isFinite(remaining) ? remaining : null,
    limit: Number.isFinite(limit) ? limit : null,
    reset: Number.isFinite(reset) ? reset : null,
  };
}

class GitHubError extends Error {
  constructor(message, code, rateLimit) {
    super(message);
    this.code = code;
    this.rateLimit = rateLimit;
  }
}

async function githubGet(path, signal) {
  const response = await fetch(API + path, {
    signal,
    headers: {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });
  const rateLimit = rateLimitFrom(response);
  if (response.status === 403 && rateLimit.remaining === 0) {
    throw new GitHubError("GitHub API rate limit reached.", "ratelimit", rateLimit);
  }
  if (response.status === 403) {
    throw new GitHubError("GitHub API returned 403 Forbidden.", "forbidden", rateLimit);
  }
  if (response.status === 404) {
    throw new GitHubError("GitHub profile was not found.", "notfound", rateLimit);
  }
  if (!response.ok) {
    throw new GitHubError("GitHub API error (" + response.status + ").", "error", rateLimit);
  }
  return { json: await response.json(), rateLimit };
}

function eventTitle(event) {
  const repo = event.repo && event.repo.name ? event.repo.name : "unknown repo";
  switch (event.type) {
    case "PushEvent": {
      const commits = event.payload && Array.isArray(event.payload.commits) ? event.payload.commits.length : 0;
      return "Pushed " + commits + " commit(s) to " + repo;
    }
    case "CreateEvent":
      return "Created " + (event.payload && event.payload.ref_type ? event.payload.ref_type : "ref") + " on " + repo;
    case "WatchEvent":
      return "Starred " + repo;
    case "ForkEvent":
      return "Forked " + repo;
    case "IssuesEvent":
      return (event.payload && event.payload.action ? event.payload.action : "updated") + " an issue on " + repo;
    case "PullRequestEvent":
      return (event.payload && event.payload.action ? event.payload.action : "updated") + " a pull request on " + repo;
    case "PublicEvent":
      return "Made " + repo + " public";
    default:
      return (event.type || "Event") + " on " + repo;
  }
}

export function aggregateLanguages(languageMaps) {
  const totals = {};
  languageMaps.forEach((map) => {
    Object.keys(map || {}).forEach((name) => {
      totals[name] = (totals[name] || 0) + Number(map[name] || 0);
    });
  });
  const grand = Object.values(totals).reduce((sum, n) => sum + n, 0);
  return Object.keys(totals)
    .map((name) => ({
      name,
      bytes: totals[name],
      percent: grand > 0 ? (totals[name] / grand) * 100 : 0,
    }))
    .sort((a, b) => b.bytes - a.bytes);
}

export async function fetchGitHubSnapshot(username, signal) {
  const userRes = await githubGet("/users/" + username, signal);
  const reposRes = await githubGet("/users/" + username + "/repos?per_page=100&sort=updated", signal);
  let events = [];
  let eventsError = null;
  try {
    const eventsRes = await githubGet("/users/" + username + "/events/public?per_page=20", signal);
    events = Array.isArray(eventsRes.json) ? eventsRes.json : [];
  } catch (error) {
    eventsError = error.message;
  }

  const repos = Array.isArray(reposRes.json) ? reposRes.json : [];
  const languageTargets = repos.filter((repo) => !repo.fork).slice(0, 8);
  const languageMaps = [];
  const languageErrors = [];
  for (const repo of languageTargets) {
    try {
      const langRes = await githubGet("/repos/" + repo.full_name + "/languages", signal);
      languageMaps.push(langRes.json || {});
    } catch (error) {
      languageErrors.push(repo.full_name);
    }
  }

  return {
    fetchedAt: new Date().toISOString(),
    rateLimit: reposRes.rateLimit || userRes.rateLimit,
    profile: {
      login: userRes.json.login,
      name: userRes.json.name,
      bio: userRes.json.bio,
      avatarUrl: userRes.json.avatar_url,
      htmlUrl: userRes.json.html_url,
      location: userRes.json.location,
      publicRepos: userRes.json.public_repos,
      followers: userRes.json.followers,
      following: userRes.json.following,
      createdAt: userRes.json.created_at,
      updatedAt: userRes.json.updated_at,
    },
    repos: repos.map((repo) => ({
      id: repo.id,
      name: repo.name,
      fullName: repo.full_name,
      htmlUrl: repo.html_url,
      description: repo.description,
      language: repo.language,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      updatedAt: repo.updated_at,
      pushedAt: repo.pushed_at,
      fork: repo.fork,
      topics: Array.isArray(repo.topics) ? repo.topics : [],
    })),
    languages: aggregateLanguages(languageMaps),
    languageCoverage: { requested: languageTargets.length, failed: languageErrors },
    events: events.map((event) => ({
      id: event.id,
      type: event.type,
      createdAt: event.created_at,
      title: eventTitle(event),
      repoUrl: event.repo && event.repo.name ? "https://github.com/" + event.repo.name : null,
    })),
    eventsError,
  };
}