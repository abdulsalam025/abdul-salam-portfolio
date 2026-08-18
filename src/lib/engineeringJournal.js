export function uniqueValues(rows, key) {
  return Array.from(new Set(rows.map((row) => row[key]).filter(Boolean))).sort();
}
export function uniqueTags(rows) {
  const tags = new Set();
  rows.forEach((row) => (row.tags || []).forEach((tag) => tags.add(tag)));
  return Array.from(tags).sort();
}
export function compareLogDate(a, b) {
  if (!a.date && !b.date) return 0;
  if (!a.date) return 1;
  if (!b.date) return -1;
  return a.date < b.date ? -1 : a.date > b.date ? 1 : 0;
}
export function queryBuildLog(rows, { query = "", project = "all", tag = "all", order = "newest" } = {}) {
  const q = query.trim().toLowerCase();
  let next = rows.filter((row) => {
    if (project !== "all" && row.project !== project) return false;
    if (tag !== "all" && !(row.tags || []).includes(tag)) return false;
    if (!q) return true;
    const hay = [row.project, row.change, row.problem, row.solution, row.lesson, ...(row.tags || [])].join(" ").toLowerCase();
    return hay.includes(q);
  });
  next = next.slice().sort(compareLogDate);
  if (order === "newest") next.reverse();
  return next;
}
export function logStats(rows) {
  const dated = rows.filter((row) => row.datePrecision === "day").length;
  return { entries: rows.length, dated, undated: rows.length - dated, projects: uniqueValues(rows, "project").length };
}
export function queryRoadmap(rows, status = "all") {
  if (status === "all") return rows;
  return rows.filter((row) => row.status === status);
}
export function roadmapStats(rows) {
  const counts = { completed: 0, current: 0, next: 0 };
  rows.forEach((row) => { if (counts[row.status] !== undefined) counts[row.status] += 1; });
  return { ...counts, total: rows.length, completedShare: rows.length ? counts.completed / rows.length : 0 };
}
export function formatLogDate(row) {
  if (!row.date || row.datePrecision === "unknown") return "Date not recorded";
  return row.date;
}