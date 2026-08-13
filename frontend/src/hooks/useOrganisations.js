import { useCallback, useEffect, useState } from "react";
import { api, ApiError } from "../lib/api.js";

export function useOrganisations() {
  const [organisations, setOrganisations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await api.listOrganisations();
      setOrganisations(Array.isArray(data) ? data : data?.results || []);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't load organisations.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { organisations, loading, error, reload: load };
}