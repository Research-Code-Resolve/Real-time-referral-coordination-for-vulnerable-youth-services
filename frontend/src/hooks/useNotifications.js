import { useCallback, useEffect, useState } from "react";
import { api, ApiError } from "../lib/api.js";

export function useNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await api.listNotifications();
      setNotifications(Array.isArray(data) ? data : data?.results || []);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't load notifications.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function markRead(id) {
    setNotifications((ns) => ns.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
    try {
      await api.markNotificationRead(id);
    } catch {
      // revert on failure
      setNotifications((ns) => ns.map((n) => (n.id === id ? { ...n, is_read: false } : n)));
    }
  }

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return { notifications, loading, error, reload: load, markRead, unreadCount };
}