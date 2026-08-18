import { useCallback, useEffect, useMemo, useState } from "react";
import { BUILD_LOG } from "../data/buildLog";
import { ROADMAP } from "../data/roadmap";
import { logStats, queryBuildLog, queryRoadmap, roadmapStats, uniqueTags, uniqueValues } from "../lib/engineeringJournal";

const STORAGE_KEY = "as-journal-v1";
function readPrefs() { try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"); } catch (error) { return {}; } }
function writePrefs(prefs) { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs)); } catch (error) {} }
function entryFromHash() { const hash = window.location.hash || ""; return hash.indexOf("#log-") === 0 ? hash.slice(1) : null; }

export function useJournal() {
  const prefs = readPrefs();
  const [query, setQuery] = useState(prefs.query || "");
  const [project, setProject] = useState(prefs.project || "all");
  const [tag, setTag] = useState(prefs.tag || "all");
  const [order, setOrder] = useState(prefs.order || "newest");
  const [roadStatus, setRoadStatus] = useState(prefs.roadStatus || "all");
  const [openId, setOpenId] = useState(entryFromHash);
  useEffect(() => { writePrefs({ query, project, tag, order, roadStatus }); }, [query, project, tag, order, roadStatus]);
  useEffect(() => { const onHash = () => setOpenId(entryFromHash()); window.addEventListener("hashchange", onHash); return () => window.removeEventListener("hashchange", onHash); }, []);
  const projects = useMemo(() => uniqueValues(BUILD_LOG, "project"), []);
  const tags = useMemo(() => uniqueTags(BUILD_LOG), []);
  const entries = useMemo(() => queryBuildLog(BUILD_LOG, { query, project, tag, order }), [query, project, tag, order]);
  const roadmap = useMemo(() => queryRoadmap(ROADMAP, roadStatus), [roadStatus]);
  const stats = useMemo(() => logStats(BUILD_LOG), []);
  const visibleStats = useMemo(() => logStats(entries), [entries]);
  const roadStats = useMemo(() => roadmapStats(ROADMAP), []);
  const openEntry = useCallback((id) => { setOpenId(id); if (id) history.replaceState(null, "", "#" + id); }, []);
  const cycle = useCallback((delta) => {
    setOpenId((current) => {
      if (!entries.length) return current;
      const index = Math.max(0, entries.findIndex((row) => row.id === current));
      const next = entries[(index + delta + entries.length) % entries.length];
      history.replaceState(null, "", "#" + next.id);
      return next.id;
    });
  }, [entries]);
  return { query, setQuery, project, setProject, tag, setTag, order, setOrder, roadStatus, setRoadStatus, openId, openEntry, cycle, projects, tags, entries, roadmap, stats, visibleStats, roadStats, source: BUILD_LOG };
}