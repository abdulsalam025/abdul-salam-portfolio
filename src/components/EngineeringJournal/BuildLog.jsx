import { useEffect } from "react";
import { ChevronDown, Search } from "lucide-react";
import { formatLogDate } from "../../lib/engineeringJournal";
import "./Journal.css";

export default function BuildLog({ journal }) {
  useEffect(() => {
    const onKey = (event) => {
      const tag = (event.target && event.target.tagName) || "";
      if (tag === "INPUT" || tag === "SELECT" || tag === "TEXTAREA") return;
      if (event.key === "j") journal.cycle(1);
      if (event.key === "k") journal.cycle(-1);
      if (event.key === "Escape") journal.openEntry(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [journal]);

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(journal.source, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "abdul-salam-build-log.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="section journal-section" id="buildlog" aria-labelledby="buildlog-heading">
      <div className="section-label">08 — WHAT CHANGED AND WHY</div>
      <div className="section-heading">
        <h2 id="buildlog-heading">What changed, and <span className="gradient-text">why.</span></h2>
        <p>Every row is a real change. Undated rows are undated. Counts are computed from this file, not invented KPIs.</p>
      </div>
      <div className="glass-panel journal-toolbar">
        <div className="journal-stats" aria-label="Log totals">
          <span><strong>{journal.stats.entries}</strong> entries</span>
          <span><strong>{journal.stats.dated}</strong> dated</span>
          <span><strong>{journal.stats.undated}</strong> date unknown</span>
          <span><strong>{journal.visibleStats.entries}</strong> visible</span>
        </div>
        <div className="journal-controls">
          <label><Search size={14} aria-hidden="true" /><input type="search" value={journal.query} onChange={(e) => journal.setQuery(e.target.value)} placeholder="Search change, problem, lesson" aria-label="Search build log" /></label>
          <label>Project<select value={journal.project} onChange={(e) => journal.setProject(e.target.value)}><option value="all">All</option>{journal.projects.map((name) => <option key={name} value={name}>{name}</option>)}</select></label>
          <label>Tag<select value={journal.tag} onChange={(e) => journal.setTag(e.target.value)}><option value="all">All</option>{journal.tags.map((name) => <option key={name} value={name}>{name}</option>)}</select></label>
          <label>Order<select value={journal.order} onChange={(e) => journal.setOrder(e.target.value)}><option value="newest">Newest dated first</option><option value="oldest">Oldest dated first</option></select></label>
          <button type="button" className="glass-btn secondary-button" onClick={exportJson}>Export JSON</button>
        </div>
        <p className="journal-hint">j / k moves the open entry. Filters persist in localStorage.</p>
      </div>
      {journal.entries.length === 0 && <div className="glass-panel journal-empty">No entries match those filters.</div>}
      <ol className="journal-list">
        {journal.entries.map((row) => {
          const open = journal.openId === row.id;
          return (
            <li key={row.id} id={row.id} className="glass-panel journal-item">
              <button type="button" className="journal-head" aria-expanded={open} onClick={() => journal.openEntry(open ? null : row.id)}>
                <span className="journal-date">{formatLogDate(row)}</span>
                <span className="journal-project">{row.project}</span>
                <strong>{row.change}</strong>
                <ChevronDown size={16} className={open ? "is-open" : ""} aria-hidden="true" />
              </button>
              {open && (
                <div className="journal-body">
                  <p><strong>Problem.</strong> {row.problem}</p>
                  <p><strong>Solution.</strong> {row.solution}</p>
                  <p><strong>Lesson.</strong> {row.lesson}</p>
                  <div className="tags">{row.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
}