import { useEffect, useState } from "react";
import { GITHUB_USERNAME, fetchGitHubSnapshot, readCache, writeCache } from "../lib/github";

export function useGitHub(username = GITHUB_USERNAME) {
  const [state, setState] = useState({
    status: "loading",
    data: null,
    error: "",
    fromCache: false,
  });

  useEffect(() => {
    const cached = readCache();
    if (cached) {
      setState({ status: "success", data: cached, error: "", fromCache: true });
    }

    const controller = new AbortController();
    let cancelled = false;

    fetchGitHubSnapshot(username, controller.signal)
      .then((snapshot) => {
        if (cancelled) return;
        writeCache(snapshot);
        const empty = !snapshot.repos || snapshot.repos.length === 0;
        setState({
          status: empty ? "empty" : "success",
          data: snapshot,
          error: "",
          fromCache: false,
        });
      })
      .catch((error) => {
        if (cancelled || error.name === "AbortError") return;
        const code = error.code || "error";
        setState((prev) => {
          if (prev.data) {
            return {
              status: prev.data.repos && prev.data.repos.length ? "success" : "empty",
              data: prev.data,
              error: error.message,
              fromCache: prev.fromCache,
            };
          }
          return {
            status: code === "ratelimit" ? "ratelimit" : "error",
            data: null,
            error: error.message,
            fromCache: false,
          };
        });
      });

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [username]);

  return state;
}

export function dashboardStatus(github) {
  if (github.status === "loading" && !github.data) return "loading";
  if (github.status === "ratelimit" || github.status === "error") return "error";
  if (github.data && github.data.profile) return "success";
  return "error";
}