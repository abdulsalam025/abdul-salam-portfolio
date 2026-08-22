import { useEffect, useState } from "react";
import { SECTIONS, activeSectionId, scrollToSection, sectionExists } from "../../data/sections";
import "./EngineeringScrollNav.css";

export default function EngineeringScrollNav() {
  const [active, setActive] = useState("home");
  const [present, setPresent] = useState([]);

  useEffect(() => {
    let raf = 0;

    const scan = () => {
      const found = SECTIONS.filter((item) => sectionExists(item.id));
      setPresent((prev) => {
        if (prev.length === found.length && prev.every((item, i) => item.id === found[i].id)) {
          return prev;
        }
        return found;
      });
      return found;
    };

    const tick = () => {
      const found = scan();
      if (!found.length) return;
      const next = activeSectionId(found);
      if (next) setActive(next);
    };

    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        raf = 0;
        tick();
      });
    };

    tick();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    const poll = window.setInterval(tick, 700);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.clearInterval(poll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  if (present.length < 3) return null;

  const roots = present.filter((item) => item.depth === 0);
  const activeRoot =
    (present.find((item) => item.id === active) || {}).depth === 1
      ? "engineering"
      : active;
  const rootIndex = Math.max(0, roots.findIndex((item) => item.id === activeRoot));
  const progress = roots.length > 1 ? (rootIndex / (roots.length - 1)) * 100 : 0;

  return (
    <nav className="esn" aria-label="Site architecture">
      <span className="esn-track" aria-hidden="true">
        <i style={{ height: progress + "%" }} />
      </span>
      {present.map((item) => {
        const on = active === item.id;
        const parentOn = item.id === "engineering" && present.some((row) => row.depth === 1 && row.id === active);
        const cls =
          "esn-item" +
          (item.depth ? " is-child" : "") +
          (on ? " is-on" : "") +
          (parentOn ? " is-branch" : "");
        return (
          <button
            key={item.id}
            type="button"
            className={cls}
            aria-current={on ? "true" : undefined}
            onClick={() => {
              setActive(item.id);
              scrollToSection(item.id);
            }}
          >
            <span className="esn-dot" aria-hidden="true" />
            {item.depth === 0 ? <span className="esn-num">{item.number}</span> : null}
            <span className="esn-label">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}