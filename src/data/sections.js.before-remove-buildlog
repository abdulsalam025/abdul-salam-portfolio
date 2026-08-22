export const SECTIONS = [
  { id: "home", number: "00", label: "Home", group: "Page" },
  { id: "about", number: "01", label: "About", group: "Page" },
  { id: "education", number: "02", label: "Education", group: "Page" },
  { id: "skills", number: "03", label: "Skills", group: "Page" },
  { id: "projects", number: "04", label: "Projects", group: "Page" },
  { id: "resume", number: "05", label: "Resume", group: "Page" },
  { id: "contact", number: "06", label: "Contact", group: "Page" },
  { id: "dashboard", number: "07", label: "Dashboard", group: "Systems" },
  { id: "ailab", number: "08", label: "AI Lab", group: "Systems" },
  { id: "github", number: "09", label: "GitHub", group: "Systems" },
  { id: "buildlog", number: "10", label: "Build Log", group: "Systems" },
  { id: "roadmap", number: "11", label: "Roadmap", group: "Systems" },
  { id: "notes", number: "12", label: "Notes", group: "Systems" },
  { id: "timeline", number: "13", label: "Timeline", group: "Systems" }
];
export function sectionExists(id) { return typeof document !== "undefined" && !!document.getElementById(id); }
export function scrollToSection(id) {
  const node = document.getElementById(id);
  if (!node) return false;
  node.scrollIntoView({ behavior: "smooth", block: "start" });
  return true;
}