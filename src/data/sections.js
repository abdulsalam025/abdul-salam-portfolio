export const SECTIONS = [
  { id: "home", number: "00", label: "Home", group: "Page", depth: 0 },
  { id: "about", number: "01", label: "About", group: "Page", depth: 0 },
  { id: "education", number: "02", label: "Education", group: "Page", depth: 0 },
  { id: "skills", number: "03", label: "Skills", group: "Page", depth: 0 },
  { id: "projects", number: "04", label: "Projects", group: "Page", depth: 0 },
  { id: "resume", number: "05", label: "Resume", group: "Page", depth: 0 },
  { id: "engineering", number: "06", label: "Engineering", group: "Engineering", depth: 0 },
  { id: "dashboard", number: "06", label: "Profile", group: "Engineering", depth: 1 },
  { id: "ailab", number: "06", label: "Lab", group: "Engineering", depth: 1 },
  { id: "timeline", number: "06", label: "Journey", group: "Engineering", depth: 1 },
  { id: "roadmap", number: "06", label: "Roadmap", group: "Engineering", depth: 1 },
  { id: "github", number: "07", label: "GitHub", group: "Page", depth: 0 },
  { id: "contact", number: "08", label: "Contact", group: "Page", depth: 0 },
];

export function sectionExists(id) {
  return typeof document !== "undefined" && !!document.getElementById(id);
}

export function scrollToSection(id) {
  const node = document.getElementById(id);
  if (!node) return false;
  const reduce =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  node.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  return true;
}

export function activeSectionId(items) {
  if (!items.length) return "";
  const marker = Math.round(window.innerHeight * 0.28);
  let current = items[0].id;
  for (let i = 0; i < items.length; i += 1) {
    const node = document.getElementById(items[i].id);
    if (!node) continue;
    if (node.getBoundingClientRect().top - marker <= 0) current = items[i].id;
  }
  return current;
}