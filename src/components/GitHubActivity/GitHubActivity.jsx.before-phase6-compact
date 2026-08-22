import { useMemo, useState } from "react";
import { Activity, AlertCircle, ExternalLink, FileText, GitBranch, Search, Star, User } from "lucide-react";
import "./GitHubActivity.css";

function formatDate(value) {
  if (!value) return "unknown";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "unknown";
  return date.toLocaleString();
}

function resetLabel(reset) {
  if (!reset) return "unknown";
  return new Date(reset * 1000).toLocaleTimeString();
}

export default function GitHubActivity({ github }) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("updated");

  const profile = github.data && github.data.profile;
  const repos = (github.data && github.data.repos) || [];
  const languages = (github.data && github.data.languages) || [];
  const events = (github.data && github.data.events) || [];
  const rate = github.data && github.data.rateLimit;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const next = repos.filter((repo) => {
      if (!q) return true;
      return (
        repo.name.toLowerCase().includes(q) ||
        (repo.description && repo.description.toLowerCase().includes(q)) ||
        (repo.language && repo.language.toLowerCase().includes(q))
      );
    });
    next.sort((a, b) => {
      if (sort === "stars") return (b.stars || 0) - (a.stars || 0);
      if (sort === "name") return a.name.localeCompare(b.name);
      return new Date(b.pushedAt || b.updatedAt) - new Date(a.pushedAt || a.updatedAt);
    });
    return next;
  }, [repos, query, sort]);

  return (
    <section className="section gh-section" id="github" aria-labelledby="github-heading">
      <div className="section-label">09 - GITHUB</div>
      <div className="section-heading">
        <h2 id="github-heading">
          Public GitHub <span className="gradient-text">signal.</span>
        </h2>
        <p>Live data from the public API for abdulsalam025. Nothing here is estimated or invented.</p>
      </div>

      {github.status === "loading" && !github.data && (
        <div className="glass-panel gh-state" role="status">Loading public GitHub data...</div>
      )}

      {github.status === "error" && !github.data && (
        <div className="glass-panel gh-state" role="alert">
          <AlertCircle size={18} aria-hidden="true" />
          <div>
            <h3>GitHub data unavailable</h3>
            <p>{github.error || "The public API did not respond."}</p>
            <a className="glass-btn primary-button" href="https://github.com/abdulsalam025" target="_blank" rel="noopener noreferrer">
              Open profile <ExternalLink size={16} />
            </a>
          </div>
        </div>
      )}

      {github.status === "ratelimit" && !github.data && (
        <div className="glass-panel gh-state" role="alert">
          <AlertCircle size={18} aria-hidden="true" />
          <div>
            <h3>API rate limit reached</h3>
            <p>Unauthenticated GitHub allows 60 requests/hour/IP. This UI does not embed a token.</p>
          </div>
        </div>
      )}

      {profile && (
        <>
          <div className="gh-grid">
            <article className="glass-panel gh-profile">
              <img src={profile.avatarUrl} alt="" width="72" height="72" className="gh-avatar" />
              <div>
                <span className="eyebrow">PUBLIC PROFILE</span>
                <h3>{profile.name || profile.login}</h3>
                <p>@{profile.login}{profile.location ? " - " + profile.location : ""}</p>
                {profile.bio && <p>{profile.bio}</p>}
                <a href={profile.htmlUrl} target="_blank" rel="noopener noreferrer">
                  github.com/{profile.login} <ExternalLink size={14} />
                </a>
              </div>
            </article>

            <article className="glass-panel gh-metrics">
              <div className="gh-metric"><GitBranch size={16} /><strong>{profile.publicRepos}</strong><span>Public repos</span></div>
              <div className="gh-metric"><User size={16} /><strong>{profile.followers}</strong><span>Followers</span></div>
              <div className="gh-metric"><Activity size={16} /><strong>{profile.following}</strong><span>Following</span></div>
              <p className="gh-note">Profile updated {formatDate(profile.updatedAt)}</p>
              {rate && (
                <p className="gh-note">
                  Rate limit remaining {rate.remaining}/{rate.limit}
                  {rate.reset ? " - resets " + resetLabel(rate.reset) : ""}
                </p>
              )}
              {github.fromCache && <p className="gh-note">Showing session cache (max 5 minutes) while a refresh runs.</p>}
              {github.error && <p className="gh-note">{github.error}</p>}
            </article>
          </div>

          <article className="glass-panel gh-langs">
            <span className="eyebrow">LANGUAGE BYTES</span>
            <h3>From /repos/.../languages</h3>
            {languages.length === 0 && (
              <p>No language byte totals yet. GitHub only reports this per repository, and empty repos contribute nothing.</p>
            )}
            {languages.length > 0 && (
              <>
                <div className="gh-langbar" aria-hidden="true">
                  {languages.map((lang) => (
                    <span key={lang.name} style={{ width: lang.percent + "%" }} title={lang.name + " " + lang.percent.toFixed(1) + "%"} />
                  ))}
                </div>
                <ul className="gh-langlist">
                  {languages.map((lang) => (
                    <li key={lang.name}>
                      <strong>{lang.name}</strong>
                      <span>{lang.bytes} bytes - {lang.percent.toFixed(1)}%</span>
                    </li>
                  ))}
                </ul>
                <p className="gh-note">
                  Computed from {github.data.languageCoverage.requested} non-fork repo(s).
                  {github.data.languageCoverage.failed.length
                    ? " Failed: " + github.data.languageCoverage.failed.join(", ")
                    : " All language endpoints succeeded."}
                </p>
              </>
            )}
          </article>

          <article className="glass-panel gh-repos">
            <div className="gh-toolbar">
              <label>
                <Search size={14} aria-hidden="true" />
                <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Filter repos" aria-label="Filter repositories" />
              </label>
              <label>
                Sort
                <select value={sort} onChange={(e) => setSort(e.target.value)}>
                  <option value="updated">Recently pushed</option>
                  <option value="stars">Stars</option>
                  <option value="name">Name</option>
                </select>
              </label>
            </div>
            {github.status === "empty" && <p>No public repositories.</p>}
            {filtered.length === 0 && repos.length > 0 && <p>No repository matches that filter.</p>}
            <ul className="gh-repolist">
              {filtered.map((repo) => (
                <li key={repo.id}>
                  <a href={repo.htmlUrl} target="_blank" rel="noopener noreferrer">
                    <strong>{repo.name}</strong>
                    <ExternalLink size={14} />
                  </a>
                  <p>{repo.description || "No description on GitHub."}</p>
                  <div className="gh-repo-meta">
                    <span>{repo.language || "language n/a"}</span>
                    <span><Star size={12} /> {repo.stars}</span>
                    <span>forks {repo.forks}</span>
                    <span>pushed {formatDate(repo.pushedAt)}</span>
                    {repo.fork && <span>fork</span>}
                  </div>
                </li>
              ))}
            </ul>
          </article>

          <article className="glass-panel gh-events">
            <span className="eyebrow">PUBLIC EVENTS</span>
            <h3>Latest events from the public timeline</h3>
            <p className="gh-note">This is not a contribution graph. GitHub does not expose that calendar to unauthenticated frontends.</p>
            {github.data.eventsError && <p className="gh-note">Events unavailable: {github.data.eventsError}</p>}
            {events.length === 0 && !github.data.eventsError && <p>No public events returned.</p>}
            <ol>
              {events.map((event) => (
                <li key={event.id}>
                  <FileText size={14} aria-hidden="true" />
                  <div>
                    <strong>{event.title}</strong>
                    <span>{formatDate(event.createdAt)}</span>
                  </div>
                </li>
              ))}
            </ol>
          </article>
        </>
      )}
    </section>
  );
}