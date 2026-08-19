import { PROJECTS } from "../../data/projects";
import "./ProjectGrid.css";

function Card({ project, featured, onOpen }) {
  return (
    <article
      className={featured ? "glass-panel project-card pg-card is-featured" : "glass-panel project-card pg-card"}
      onClick={() => onOpen(project.id)}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onOpen(project.id); } }}
      role="button"
      tabIndex={0}
      aria-label={"Open case study: " + project.title}
    >
      <div className="project-number">{project.number}</div>
      <div className="pg-body">
        <span className="eyebrow">{project.type}</span>
        <span className={"pg-status is-" + String(project.status || "academic").toLowerCase().replace(" ", "-")}>{project.status || "Academic Project"}</span>
        <h3>{project.title}</h3>
        <p>{project.desc}</p>
        <div className="tags">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
      </div>
    </article>
  );
}

export default function ProjectGrid({ onOpen }) {
  const featured = PROJECTS.find((item) => item.featured) || PROJECTS[0];
  const rest = PROJECTS.filter((item) => item.id !== featured.id);
  return (
    <div className="pg-wrap">
      <Card project={featured} featured onOpen={onOpen} />
      <div className="projects-grid pg-rest">
        {rest.map((project) => <Card key={project.id} project={project} onOpen={onOpen} />)}
      </div>
    </div>
  );
}