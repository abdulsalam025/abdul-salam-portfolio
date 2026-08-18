import { Check, Activity, ArrowRight } from "lucide-react";
import "./Journal.css";

const STATUS = [
  { id: "all", label: "All" },
  { id: "completed", label: "Completed" },
  { id: "current", label: "Current" },
  { id: "next", label: "Next" },
];

function StatusIcon({ status }) {
  if (status === "completed") return <Check size={16} aria-hidden="true" />;
  if (status === "current") return <Activity size={16} aria-hidden="true" />;
  return <ArrowRight size={16} aria-hidden="true" />;
}

export default function EngineeringRoadmap({ journal }) {
  const { roadStats } = journal;
  return (
    <section className="section journal-section" id="roadmap" aria-labelledby="roadmap-heading">
      <div className="section-label">11 - ROADMAP</div>
      <div className="section-heading">
        <h2 id="roadmap-heading">Completed, current, <span className="gradient-text">next.</span></h2>
        <p>Nothing is marked completed unless the work is actually done. Python is current, not finished.</p>
      </div>
      <div className="glass-panel journal-toolbar">
        <div className="journal-stats">
          <span><strong>{roadStats.completed}</strong> completed</span>
          <span><strong>{roadStats.current}</strong> current</span>
          <span><strong>{roadStats.next}</strong> next</span>
          <span><strong>{Math.round(roadStats.completedShare * 100)}%</strong> of this list marked completed</span>
        </div>
        <div className="journal-controls" role="tablist" aria-label="Roadmap status">
          {STATUS.map((item) => (
            <button key={item.id} type="button" className={journal.roadStatus === item.id ? "modal-tab active" : "modal-tab"} onClick={() => journal.setRoadStatus(item.id)}>{item.label}</button>
          ))}
        </div>
      </div>
      <div className="road-grid">
        {journal.roadmap.map((item) => (
          <article key={item.id} className="glass-panel road-card" data-status={item.status}>
            <header>
              <StatusIcon status={item.status} />
              <span className="eyebrow">{item.status}</span>
              <h3>{item.title}</h3>
            </header>
            <p><strong>Why.</strong> {item.why}</p>
            {item.learned ? <p><strong>What I learned.</strong> {item.learned}</p> : null}
            <p><strong>{item.status === "next" ? "What I will learn." : "What I am learning."}</strong> {item.learning}</p>
            <p><strong>How I will apply it.</strong> {item.apply}</p>
            {item.evidence.length > 0 && <div className="tags">{item.evidence.map((name) => <span key={name}>{name}</span>)}</div>}
          </article>
        ))}
      </div>
    </section>
  );
}