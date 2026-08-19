import { useEffect, useMemo, useRef, useState } from "react";
import { Search } from "lucide-react";
import { SECTIONS, scrollToSection, sectionExists } from "../../data/sections";
import "./CommandCenter.css";

export default function CommandCenter({ open, onClose }) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef(null);
  const lastFocus = useRef(null);

  const items = useMemo(() => {
    const q = query.trim().toLowerCase();
    return SECTIONS.filter((item) => {
      if (!sectionExists(item.id)) return false;
      if (!q) return true;
      return item.label.toLowerCase().includes(q) || item.id.includes(q) || item.number.includes(q) || item.group.toLowerCase().includes(q);
    });
  }, [query, open]);

  useEffect(() => {
    if (!open) return undefined;
    lastFocus.current = document.activeElement;
    setQuery("");
    setActive(0);
    const t = window.setTimeout(() => { if (inputRef.current) inputRef.current.focus(); }, 20);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.clearTimeout(t);
      document.body.style.overflow = prev;
      if (lastFocus.current && lastFocus.current.focus) lastFocus.current.focus();
    };
  }, [open]);

  useEffect(() => { setActive(0); }, [query]);

  const run = (item) => {
    if (!item) return;
    onClose();
    window.setTimeout(() => scrollToSection(item.id), 30);
  };

  const onKeyDown = (event) => {
    if (event.key === "Escape") { event.preventDefault(); onClose(); }
    if (event.key === "ArrowDown") { event.preventDefault(); setActive((i) => (items.length ? (i + 1) % items.length : 0)); }
    if (event.key === "ArrowUp") { event.preventDefault(); setActive((i) => (items.length ? (i - 1 + items.length) % items.length : 0)); }
    if (event.key === "Enter") { event.preventDefault(); run(items[active]); }
  };

  if (!open) return null;

  return (
    <div className="cmd-overlay" onClick={onClose} onKeyDown={onKeyDown}>
      <div className="cmd-modal glass-panel" role="dialog" aria-modal="true" aria-label="Command center" onClick={(event) => event.stopPropagation()}>
        <div className="cmd-header">
          <Search size={20} aria-hidden="true" />
          <input ref={inputRef} className="cmd-input" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search sections..." aria-label="Search commands" />
        </div>
        <div className="cmd-list" role="listbox" aria-label="Commands">
          {items.length === 0 && <p className="cmd-empty">No matching section on this page.</p>}
          {items.map((item, index) => (
            <button key={item.id} type="button" role="option" aria-selected={index === active} className={index === active ? "cmd-item is-active" : "cmd-item"} onMouseEnter={() => setActive(index)} onClick={() => run(item)}>
              <span className="cmd-num">{item.number}</span>
              <span>{item.label}</span>
              <span className="cmd-group">{item.group}</span>
            </button>
          ))}
        </div>
        <p className="cmd-hint">Up / Down to move. Enter to go. Esc to close.</p>
      </div>
    </div>
  );
}