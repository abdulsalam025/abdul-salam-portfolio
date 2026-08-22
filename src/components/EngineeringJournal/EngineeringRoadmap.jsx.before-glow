import { Activity, ArrowRight, Check } from "lucide-react";
import "./RoadmapLook.css";

const STATUS = [
  { id: "all", label: "All stations" },
  { id: "completed", label: "Completed" },
  { id: "current", label: "Current" },
  { id: "next", label: "Next" },
];

function Icon({ status }) {
  if (status === "completed") return <Check size={16} aria-hidden="true" />;
  if (status === "current") return <Activity size={16} aria-hidden="true" />;
  return <ArrowRight size={16} aria-hidden="true" />;
}

export default function EngineeringRoadmap({ journal }) {
  const { roadStats } = journal;
  return (
    <section className="section road-section" id="roadmap" aria-labelledby="roadmap-heading">
      <div className="section-label">11 - ROADMAP</div>
      <div className="section-heading road-heading">
        <h2 id="roadmap-heading">A path, not a <span className="gradient-text">progress bar.</span></h2>
        <p>{roadStats.completed} completed / {roadStats.current} current / {roadStats.next} next. Nothing is marked finished unless the work is actually done.</p>
      </div>
      <div className="road-legend glass-panel">
        <div className="road-legend-stats" aria-label="Roadmap totals">
          <span><strong>{String(roadStats.completed).padStart(2, "0")}</strong> completed</span>
          <span><strong>{String(roadStats.current).padStart(2, "0")}</strong> in progress</span>
          <span><strong>{String(roadStats.next).padStart(2, "0")}</strong> ahead</span>
        </div>
        <div className="road-tabs" role="tablist" aria-label="Roadmap status">
          {STATUS.map((item) => (
            <button key={item.id} type="button" role="tab" aria-selected={journal.roadStatus === item.id} className={journal.roadStatus === item.id ? "road-tab is-on" : "road-tab"} onClick={() => journal.setRoadStatus(item.id)}>
              {item.label}
            </button>
          ))}
        </div>
      </div>
      {journal.roadmap.length === 0 && (
        <div className="glass-panel road-empty">No stations in that filter. Completed is empty on purpose.</div>
      )}
      <ol className="road-via">
        {journal.roadmap.map((item, index) => (
          <li key={item.id} className={"road-station is-" + item.status}>
            <div className="road-mile" aria-hidden="true"><span>{String(index + 1).padStart(2, "0")}</span></div>
            <article className="glass-panel road-panel">
              <header className="road-panel-head">
                <span className={"road-seal is-" + item.status}><Icon status={item.status} />{item.status}</span>
                <h3>{item.title}</h3>
              </header>
              <p className="road-why">{item.why}</p>
              <div className="road-cols">
                {item.learned ? <div><span className="eyebrow">Learned</span><p>{item.learned}</p></div> : null}
                <div><span className="eyebrow">{item.status === "next" ? "Will learn" : "Learning now"}</span><p>{item.learning}</p></div>
                <div><span className="eyebrow">How I apply it</span><p>{item.apply}</p></div>
              </div>
              {item.evidence.length > 0 && <div className="tags">{item.evidence.map((name) => <span key={name}>{name}</span>)}</div>}
            </article>
          </li>
        ))}
      </ol>
    </section>
  );
}