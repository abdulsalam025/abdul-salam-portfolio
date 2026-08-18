import { Activity, AlertCircle, Boxes, Cpu, GitBranch, User } from "lucide-react";
import { CURRENT_FOCUS, TECH_STACK } from "../../data/projects";
import "./EngineeringDashboard.css";

function GithubStat({ icon: Icon, value, label, status }) {
  const isLoading = status === "loading";
  const isError = status === "error";
  const display = isLoading ? "..." : isError ? "n/a" : value;

  return (
    <div className="dash-stat">
      <Icon size={18} aria-hidden="true" />
      <div>
        <strong aria-live="polite">{display}</strong>
        <span>{label}</span>
      </div>
    </div>
  );
}

export default function EngineeringDashboard({ projectCount, repos, followers, status }) {
  const systemStatus =
    status === "success" ? "GitHub connected" : status === "loading" ? "Checking GitHub" : "GitHub unavailable";

  return (
    <section className="section dashboard-section" id="dashboard" aria-labelledby="dashboard-heading">
      <div className="section-label">07 - DASHBOARD</div>
      <div className="section-heading">
        <h2 id="dashboard-heading">
          Engineering <span className="gradient-text">Profile.</span>
        </h2>
        <p>Live public signals plus the work this portfolio can actually stand behind.</p>
      </div>

      <div className="dash-grid">
        <article className="glass-panel dash-card">
          <span className="eyebrow">PROJECTS</span>
          <div className="dash-stat dash-stat-solo">
            <Boxes size={18} aria-hidden="true" />
            <div>
              <strong>{projectCount}</strong>
              <span>Documented in this portfolio</span>
            </div>
          </div>
        </article>

        <article className="glass-panel dash-card">
          <span className="eyebrow">PUBLIC GITHUB</span>
          <div className="dash-stat-row">
            <GithubStat icon={GitBranch} value={repos} label="Public repositories" status={status} />
            <GithubStat icon={User} value={followers} label="Followers" status={status} />
          </div>
          {status === "loading" && <p className="dashboard-note">Loading public GitHub profile...</p>}
          {status === "error" && (
            <p className="dashboard-note dashboard-note-error">
              <AlertCircle size={16} aria-hidden="true" />
              GitHub data unavailable right now - this updates automatically once the connection succeeds.
            </p>
          )}
          {status === "success" && (
            <p className="dashboard-note">Fetched from the public GitHub API for abdulsalam025.</p>
          )}
        </article>

        <article className="glass-panel dash-card">
          <span className="eyebrow">SYSTEM STATUS</span>
          <div className="dash-stat dash-stat-solo">
            <Activity size={18} aria-hidden="true" />
            <div>
              <strong>{systemStatus}</strong>
              <span>No invented uptime, accuracy, or traffic numbers</span>
            </div>
          </div>
        </article>

        <article className="glass-panel dash-card dash-card-wide">
          <span className="eyebrow">CURRENT FOCUS</span>
          <div className="dash-stat">
            <Cpu size={18} aria-hidden="true" />
            <div>
              <strong>What I am studying now</strong>
              <span>Marked only when it is actually in progress</span>
            </div>
          </div>
          <div className="tags dash-tags">
            {CURRENT_FOCUS.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </article>

        <article className="glass-panel dash-card dash-card-wide">
          <span className="eyebrow">TECH STACK IN USE</span>
          <div className="tags dash-tags">
            {TECH_STACK.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}