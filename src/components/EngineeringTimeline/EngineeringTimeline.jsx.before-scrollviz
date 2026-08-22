import { useMemo, useState } from "react";
import { ArrowRight, ChevronDown } from "lucide-react";
import { TIMELINE, TIMELINE_FILTERS } from "../../data/timeline";
import "./EngineeringTimeline.css";

export default function EngineeringTimeline({ onOpenProject }) {
  const [filter, setFilter] = useState("all");
  const [openId, setOpenId] = useState(null);
  const items = useMemo(
    () => (filter === "all" ? TIMELINE : TIMELINE.filter((item) => item.category === filter)),
    [filter]
  );
  return (
    <section className="section tl-section" id="timeline" aria-labelledby="timeline-heading">
      <div className="section-label">13 - TIMELINE</div>
      <div className="section-heading">
        <h2 id="timeline-heading">Work on a <span className="gradient-text">line.</span></h2>
        <p>Filter the real record. Status is completed, ongoing or previous - not invented impact.</p>
      </div>
      <div className="tl-filters" role="tablist" aria-label="Timeline categories">
        {TIMELINE_FILTERS.map((item) => (
          <button key={item.id} type="button" role="tab" aria-selected={filter === item.id} className={filter === item.id ? "tl-chip is-on" : "tl-chip"} onClick={() => setFilter(item.id)}>
            {item.id === "all" ? <span className="tl-chip-dot" aria-hidden="true" /> : item.label}
          </button>
        ))}
      </div>
      {items.length === 0 && <div className="glass-panel tl-empty">No items in that category.</div>}
      <ol className="tl-track">
        {items.map((item, index) => {
          const open = openId === item.id;
          const side = index % 2 === 0 ? "left" : "right";
          return (
            <li key={item.id} className={"tl-item is-" + side} id={item.id}>
              <article className="glass-panel tl-card">
                <header className="tl-card-top">
                  <span className="tl-kicker">{item.recency} - {item.category.replace("-", " / ")}</span>
                  <span className={"tl-status is-" + item.status}>{item.status}</span>
                </header>
                <h3>{item.title}</h3>
                <p>{item.summary}</p>
                <div className="tags">{item.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
                <div className="tl-actions">
                  <button type="button" className="tl-details" aria-expanded={open} onClick={() => setOpenId(open ? null : item.id)}>
                    View details <ChevronDown size={16} className={open ? "is-open" : ""} />
                  </button>
                  {item.projectId && (
                    <button type="button" className="tl-details" onClick={() => onOpenProject && onOpenProject(item.projectId)}>
                      Case study <ArrowRight size={16} />
                    </button>
                  )}
                  {item.href && <a className="tl-details" href={item.href}>Open section <ArrowRight size={16} /></a>}
                </div>
                {open && <ul className="tl-body">{item.details.map((line) => <li key={line}>{line}</li>)}</ul>}
              </article>
            </li>
          );
        })}
      </ol>
    </section>
  );
}