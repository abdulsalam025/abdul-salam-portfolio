import { Boxes, Cpu, Activity, GitBranch, User, AlertCircle } from "lucide-react";
import "./EngineeringDashboard.css";

const TECH_STACK = ["React", "Vite", "JavaScript", "Framer Motion", "Node.js", "Express", "MongoDB"];
const CURRENT_FOCUS = ["AI & ML", "Programming", "Engineering", "Software Development"];

function GithubStat({ icon: Icon, value, label, status }) {
  return (
    <div className="glass-panel dashboard-card">
      <Icon size={22} className="dashboard-icon" />
      {status === "loading" && <span className="dashboard-value dashboard-value-muted">...</span>}
      {status === "error" && <AlertCircle size={22} className="dashboard-value-error" />}
      {status === "success" && <span className="dashboard-value">{value}</span>}
      <span className="dashboard-label">{label}</span>
    </div>
  );
}

export default function EngineeringDashboard({ projectCount, repos, followers, status }) {
  return (
    <section className="section dashboard-section" id="dashboard">
      <div className="section-label">07 - ENGINEERING DASHBOARD</div>
      <div className="section-heading">
        <h2>Engineering <span className="gradient-text">Snapshot.</span></h2>
        <p>A live, honest look at what's actually built and in progress.</p>
      </div>

      <div className="dashboard-grid">
        <div className="glass-panel dashboard-card">
          <Boxes size={22} className="dashboard-icon" />
          <span className="dashboard-value">{projectCount}</span>
          <span className="dashboard-label">Projects Shipped</span>
        </div>

        <GithubStat icon={GitBranch} value={repos} label="Public Repositories" status={status} />
        <GithubStat icon={User} value={followers} label="GitHub Followers" status={status} />

        <div className="glass-panel dashboard-card dashboard-card-wide">
          <Cpu size={22} className="dashboard-icon" />
          <span className="dashboard-label">Tech Stack</span>
          <div className="dashboard-tags">
            {TECH_STACK.map((t) => <span key={t}>{t}</span>)}
          </div>
        </div>

        <div className="glass-panel dashboard-card dashboard-card-wide">
          <Activity size={22} className="dashboard-icon" />
          <span className="dashboard-label">Current Focus</span>
          <div className="dashboard-tags">
            {CURRENT_FOCUS.map((t) => <span key={t}>{t}</span>)}
          </div>
        </div>
      </div>

      {status === "error" && (
        <p className="dashboard-note">GitHub data unavailable right now - this updates automatically once the connection succeeds.</p>
      )}
    </section>
  );
}