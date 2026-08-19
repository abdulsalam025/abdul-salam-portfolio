import { useMemo, useState } from "react";
import { SKILLS } from "../../data/skills";
import "./SkillsEvidence.css";

export default function SkillsEvidence() {
  const [openId, setOpenId] = useState(SKILLS[0].id);
  const [query, setQuery] = useState("");
  const open = SKILLS.find((item) => item.id === openId) || SKILLS[0];
  const items = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return SKILLS;
    return SKILLS.filter((item) => [item.name, item.category, item.know, ...(item.usedIn || [])].join(" ").toLowerCase().includes(q));
  }, [query]);

  return (
    <div className="sk-wrap">
      <label className="sk-search">
        <span className="eyebrow">Filter</span>
        <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search a skill or project" aria-label="Filter skills" />
      </label>
      {items.length === 0 && <p className="sk-empty">No skill matches that filter.</p>}
      <div className="sk-layout">
        <div className="skills-grid sk-grid" role="list">
          {items.map((item, index) => (
            <button key={item.id} type="button" role="listitem" className={item.id === open.id ? "glass-panel skill-card sk-card is-on" : "glass-panel skill-card sk-card"} onClick={() => setOpenId(item.id)} aria-pressed={item.id === open.id}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div><h3>{item.name}</h3><p>{item.category} - {item.level}</p></div>
            </button>
          ))}
        </div>
        <aside className="glass-panel sk-detail" aria-live="polite">
          <span className="eyebrow">{open.category}</span>
          <h3>{open.name}</h3>
          <p><strong>Stage.</strong> {open.level}</p>
          <p><strong>Where used.</strong> {open.usedIn.length ? open.usedIn.join(", ") : "No shipped project yet. Still in coursework."}</p>
          <p><strong>What I know.</strong> {open.know}</p>
          <p><strong>What I am learning.</strong> {open.learning}</p>
          <p><strong>Next application.</strong> {open.next}</p>
        </aside>
      </div>
    </div>
  );
}