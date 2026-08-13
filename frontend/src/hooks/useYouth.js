import { useCallback, useEffect, useState } from "react";
import { api, ApiError } from "../lib/api.js";

export function useYouth() {
  const [youth, setYouth] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await api.listYouth();
      setYouth(Array.isArray(data) ? data : data?.results || []);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't load youth cases.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function addYouth(created) {
    setYouth((ys) => [created, ...ys]);
  }

  function replaceYouth(updated) {
    setYouth((ys) => ys.map((y) => (y.id === updated.id ? updated : y)));
  }

  return { youth, loading, error, reload: load, addYouth, replaceYouth };
}