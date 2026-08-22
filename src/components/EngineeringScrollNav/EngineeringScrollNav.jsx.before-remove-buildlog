import { useEffect, useState } from "react";
import { SECTIONS, scrollToSection, sectionExists } from "../../data/sections";
import "./EngineeringScrollNav.css";

export default function EngineeringScrollNav() {
  const [active, setActive] = useState("home");
  const [present, setPresent] = useState([]);

  useEffect(() => {
    const found = SECTIONS.filter((item) => sectionExists(item.id));
    setPresent(found);
    if (!found.length) return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { threshold: [0.2, 0.45, 0.7], rootMargin: "-18% 0px -48% 0px" }
    );
    found.forEach((item) => {
      const node = document.getElementById(item.id);
      if (node) observer.observe(node);
    });
    return () => observer.disconnect();
  }, []);

  if (present.length < 3) return null;

  return (
    <nav className="esn" aria-label="Section progress">
      {present.map((item) => (
        <button key={item.id} type="button" className={active === item.id ? "esn-item is-on" : "esn-item"} onClick={() => scrollToSection(item.id)} title={item.label}>
          <span className="esn-num">{item.number}</span>
          <span className="esn-label">{item.label}</span>
        </button>
      ))}
    </nav>
  );
}