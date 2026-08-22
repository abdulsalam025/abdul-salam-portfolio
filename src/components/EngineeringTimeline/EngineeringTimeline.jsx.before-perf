import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import { TIMELINE, TIMELINE_FILTERS } from "../../data/timeline";
import "./EngineeringTimeline.css";

export default function EngineeringTimeline({ onOpenProject }) {
  const [filter, setFilter] = useState("all");
  const [openId, setOpenId] = useState(null);
  const [litId, setLitId] = useState(null);
  const [progress, setProgress] = useState(0);
  const trackRef = useRef(null);

  const items = useMemo(
    () => (filter === "all" ? TIMELINE : TIMELINE.filter((item) => item.category === filter)),
    [filter]
  );

  useEffect(() => {
    setLitId(items[0] ? items[0].id : null);
    setProgress(0);
  }, [filter, items]);

  useEffect(() => {
    const root = trackRef.current;
    if (!root) return undefined;
    const nodes = Array.from(root.querySelectorAll("[data-tl]"));
    if (!nodes.length) return undefined;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setLitId(visible[0].target.getAttribute("data-tl"));
      },
      { threshold: [0.2, 0.45, 0.75], rootMargin: "-18% 0px -40% 0px" }
    );
    nodes.forEach((node) => io.observe(node));

    const onScroll = () => {
      const rect = root.getBoundingClientRect();
      const view = window.innerHeight * 0.55;
      const start = rect.top - view;
      const span = rect.height;
      const next = span <= 0 ? 0 : Math.min(1, Math.max(0, (0 - start) / span));
      setProgress(next);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [items]);

  return (
    <section className="section tl-section" id="timeline" aria-labelledby="timeline-heading">
      <div className="section-label">13 - TIMELINE</div>
      <div className="section-heading">
        <h2 id="timeline-heading">Work on a <span className="gradient-text">line.</span></h2>
        <p>Scroll the record. The beam follows you. Filters still hide anything that is not in that category.</p>
      </div>
      <div className="tl-filters" role="tablist" aria-label="Timeline categories">
        {TIMELINE_FILTERS.map((item) => (
          <button key={item.id} type="button" role="tab" aria-selected={filter === item.id} className={filter === item.id ? "tl-chip is-on" : "tl-chip"} onClick={() => setFilter(item.id)}>
            {item.id === "all" ? <span className="tl-chip-dot" aria-hidden="true" /> : item.label}
          </button>
        ))}
      </div>
      {items.length === 0 && <div className="glass-panel tl-empty">No items in that category.</div>}
      <ol className="tl-track" ref={trackRef}>
        <span className="tl-beam" style={{ transform: "scaleY(" + progress + ")" }} aria-hidden="true" />
        <span className="tl-comet" style={{ top: (progress * 100) + "%" }} aria-hidden="true" />
        {items.map((item, index) => {
          const open = openId === item.id;
          const lit = litId === item.id;
          const side = index % 2 === 0 ? "left" : "right";
          return (
            <motion.li
              key={item.id}
              data-tl={item.id}
              className={"tl-item is-" + side + (lit ? " is-lit" : "")}
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.35 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="tl-orb" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
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
            </motion.li>
          );
        })}
      </ol>
    </section>
  );
}