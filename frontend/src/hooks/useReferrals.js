import { useCallback, useEffect, useState } from "react";
import { api, ApiError } from "../lib/api.js";
import { normalizeReferral } from "../lib/referrals.js";

/**
 * Loads GET /api/referrals/. The backend already scopes the result by
 * role (Social Worker & Super Admin see everything, Partner sees only
 * their own org's referrals) — the frontend just displays whatever
 * comes back.
 */
export function useReferrals() {
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await api.listReferrals();
      const list = Array.isArray(data) ? data : data?.results || [];
      setReferrals(list.map(normalizeReferral));
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Couldn't load referrals."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function replaceReferral(updated) {
    setReferrals((rs) => rs.map((r) => (r.id === updated.id ? updated : r)));
  }

  function addReferral(created) {
    setReferrals((rs) => [normalizeReferral(created), ...rs]);
  }

  return { referrals, loading, error, reload: load, replaceReferral, addReferral };
}
