import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Code2, FileText, X } from "lucide-react";
import { getProjectById } from "../../data/projects";
import "./ProjectCaseStudies.css";

const TABS = [
  { id: "problem", label: "Problem" },
  { id: "solution", label: "Solution" },
  { id: "architecture", label: "Architecture" },
  { id: "engineering", label: "Engineering" },
  { id: "learnings", label: "Learnings" },
];

export default function ProjectCaseStudies({ projectId, onClose }) {
  const project = getProjectById(projectId);
  const [tab, setTab] = useState("problem");
  const [activeNode, setActiveNode] = useState(null);
  const closeRef = useRef(null);
  const previouslyFocused = useRef(null);

  useEffect(() => {
    setTab("problem");
    setActiveNode(project?.architecture?.[0]?.id || null);
  }, [projectId, project]);

  useEffect(() => {
    if (!project) return undefined;

    previouslyFocused.current = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const timer = window.setTimeout(() => {
      closeRef.current?.focus();
    }, 20);

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      if (previouslyFocused.current && typeof previouslyFocused.current.focus === "function") {
        previouslyFocused.current.focus();
      }
    };
  }, [project, onClose]);

  const node = project?.architecture?.find((item) => item.id === activeNode) || project?.architecture?.[0];

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          className="project-modal-overlay case-study-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="glass-panel project-modal case-study-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="case-study-title"
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              ref={closeRef}
              type="button"
              className="modal-close"
              onClick={onClose}
              aria-label="Close case study"
            >
              <X size={20} />
            </button>

            <div className="case-study-header">
              <span className="eyebrow">{project.type}</span>
              <h2 id="case-study-title">{project.title}</h2>
              <p>{project.desc}</p>
              <div className="tags">
                {project.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </div>

            <div className="modal-tabs case-study-tabs" role="tablist" aria-label="Case study sections">
              {TABS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={tab === item.id}
                  className={`modal-tab ${tab === item.id ? "active" : ""}`}
                  onClick={() => setTab(item.id)}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="case-study-body" role="tabpanel">
              {tab === "problem" && (
                <div className="case-study-grid">
                  <article className="case-block">
                    <h4>PROBLEM</h4>
                    <p>{project.problem}</p>
                  </article>
                  <article className="case-block">
                    <h4>GOAL</h4>
                    <p>{project.goal}</p>
                  </article>
                  <article className="case-block">
                    <h4>USERS</h4>
                    <ul>
                      {project.users.map((user) => (
                        <li key={user}>{user}</li>
                      ))}
                    </ul>
                  </article>
                </div>
              )}

              {tab === "solution" && (
                <div className="case-study-grid">
                  <article className="case-block">
                    <h4>SOLUTION</h4>
                    <p>{project.solution}</p>
                  </article>
                  <article className="case-block">
                    <h4>TECHNOLOGY</h4>
                    <ul>
                      {project.technology.map((item) => (
                        <li key={item.name}>
                          <strong>{item.name}</strong> - {item.role}
                        </li>
                      ))}
                    </ul>
                  </article>
                  <article className="case-block">
                    <h4>IMPLEMENTATION</h4>
                    <ul>
                      {project.implementation.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </article>
                </div>
              )}

              {tab === "architecture" && (
                <div className="case-arch">
                  <p className="case-arch-hint">Select a node to inspect its role, data flow and technology.</p>
                  <div className="case-arch-flow" role="list">
                    {project.architecture.map((item, index) => (
                      <div key={item.id} className="case-arch-step" role="listitem">
                        <button
                          type="button"
                          className={`case-arch-node ${node?.id === item.id ? "is-active" : ""}`}
                          onClick={() => setActiveNode(item.id)}
                          aria-pressed={node?.id === item.id}
                        >
                          <span>{String(index + 1).padStart(2, "0")}</span>
                          {item.label}
                        </button>
                        {index < project.architecture.length - 1 && (
                          <span className="case-arch-arrow" aria-hidden="true">
                            -&gt;
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                  {node && (
                    <div className="case-block case-arch-detail">
                      <h4>{node.label}</h4>
                      <p><strong>Role.</strong> {node.role}</p>
                      <p><strong>Responsibility.</strong> {node.responsibility}</p>
                      <p><strong>Data flow.</strong> {node.dataFlow}</p>
                      <p><strong>Technology.</strong> {node.technology}</p>
                    </div>
                  )}
                </div>
              )}

              {tab === "engineering" && (
                <div className="case-study-grid">
                  {project.challenges.map((item) => (
                    <article className="case-block" key={item.problem}>
                      <h4>CHALLENGE</h4>
                      <p>{item.problem}</p>
                      <h4>SOLUTION</h4>
                      <p>{item.solution}</p>
                    </article>
                  ))}
                </div>
              )}

              {tab === "learnings" && (
                <div className="case-study-grid">
                  <article className="case-block">
                    <h4>LEARNINGS</h4>
                    <ul>
                      {project.learnings.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </article>
                  <article className="case-block">
                    <h4>FUTURE IMPROVEMENTS</h4>
                    <ul>
                      {project.future.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </article>
                </div>
              )}
            </div>

            <div className="modal-footer case-study-footer">
              <div>
                <span className="modal-footer-label">PROJECT</span>
                <strong>{project.number} / {project.type}</strong>
              </div>
              <div className="case-study-actions">
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    className="glass-btn secondary-button"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Live demo <ArrowRight size={18} />
                  </a>
                )}
                {project.sourceUrl && (
                  <a
                    href={project.sourceUrl}
                    className="glass-btn secondary-button"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Source code <Code2 size={18} />
                  </a>
                )}
                {!project.liveUrl && !project.sourceUrl && (
                  <p className="case-study-unavailable">
                    <FileText size={16} />
                    Live demo and source are not published yet.
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}