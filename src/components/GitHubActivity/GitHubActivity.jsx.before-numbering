import { Activity, AlertCircle, ExternalLink, GitBranch, Star, User } from "lucide-react";
import "./GitHubActivity.css";

function formatDate(value) {
  if (!value) return "unknown";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "unknown";
  return date.toLocaleDateString();
}

export default function GitHubActivity({ github }) {
  const profile = github.data && github.data.profile;
  const repos = ((github.data && github.data.repos) || []).slice(0, 3);
  const events = ((github.data && github.data.events) || []).slice(0, 4);

  return (
    <section className="section gh-section" id="github" aria-labelledby="github-heading">
      <div className="section-label">GITHUB</div>
      <div className="section-heading">
        <h2 id="github-heading">Public <span className="gradient-text">GitHub.</span></h2>
        <p>Live numbers from the public API for abdulsalam025. Nothing here is estimated.</p>
      </div>
      {github.status === "loading" && !github.data && (
        <div className="glass-panel gh-state" role="status">Loading public GitHub data...</div>
      )}
      {(github.status === "error" || github.status === "ratelimit") && !github.data && (
        <div className="glass-panel gh-state" role="alert">
          <AlertCircle size={18} aria-hidden="true" />
          <div>
            <h3>{github.status === "ratelimit" ? "API rate limit reached" : "GitHub data unavailable"}</h3>
            <p>{github.error || "The public API did not respond."}</p>
            <a className="glass-btn primary-button" href="https://github.com/abdulsalam025" target="_blank" rel="noopener noreferrer">View GitHub profile <ExternalLink size={16} /></a>
          </div>
        </div>
      )}
      {profile && (
        <>
          <div className="gh-metrics">
            <article className="glass-panel gh-metric"><GitBranch size={16} /><strong>{profile.publicRepos}</strong><span>Public repositories</span></article>
            <article className="glass-panel gh-metric"><User size={16} /><strong>{profile.followers}</strong><span>Followers</span></article>
            <article className="glass-panel gh-metric"><Activity size={16} /><strong>{events.length ? events.length + " shown" : "none"}</strong><span>Recent public events</span></article>
          </div>
          {github.status === "empty" && <p className="gh-note">No public repositories.</p>}
          <div className="gh-recent">
            {repos.map((repo) => (
              <article key={repo.id} className="glass-panel gh-repo">
                <a href={repo.htmlUrl} target="_blank" rel="noopener noreferrer"><strong>{repo.name}</strong> <ExternalLink size={14} /></a>
                <p>{repo.description || "No description on GitHub."}</p>
                <div className="gh-repo-meta">
                  <span>{repo.language || "language n/a"}</span>
                  <span><Star size={12} /> {repo.stars}</span>
                  <span>updated {formatDate(repo.pushedAt || repo.updatedAt)}</span>
                </div>
              </article>
            ))}
          </div>
          <a className="glass-btn primary-button gh-profile-btn" href={profile.htmlUrl} target="_blank" rel="noopener noreferrer">View GitHub profile <ExternalLink size={16} /></a>
          {github.error && <p className="gh-note">{github.error}</p>}
        </>
      )}
    </section>
  );
}