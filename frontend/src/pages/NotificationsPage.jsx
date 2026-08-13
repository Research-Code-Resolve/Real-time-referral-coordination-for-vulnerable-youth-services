import { useState } from "react";
import { Bell, BellOff } from "lucide-react";
import AppHeader from "../components/AppHeader.jsx";
import ReferralDetailModal from "../components/ReferralDetailModal.jsx";
import { useNotifications } from "../hooks/useNotifications.js";
import { useReferrals } from "../hooks/useReferrals.js";

export default function NotificationsPage({ me, onLogout }) {
  const { notifications, loading, error, markRead } = useNotifications();
  const { referrals, replaceReferral } = useReferrals();
  const [filter, setFilter] = useState("All");
  const [openReferral, setOpenReferral] = useState(null);

  const visible = filter === "Unread" ? notifications.filter((n) => !n.is_read) : notifications;

  function handleOpen(notification) {
    if (!notification.is_read) markRead(notification.id);
    const referral = referrals.find((r) => r.id === notification.referral);
    if (referral) setOpenReferral(referral);
  }

  return (
    <>
      <AppHeader me={me} onLogout={onLogout} />
      <main className="max-w-3xl mx-auto px-6 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-slate-800">Notifications</h1>
          <div className="flex gap-2">
            {["All", "Unread"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition ${
                  filter === f
                    ? "bg-slate-900 text-white"
                    : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <p className="text-sm text-slate-400">Loading notifications…</p>
        ) : error ? (
          <p className="text-sm text-red-600">{error}</p>
        ) : visible.length === 0 ? (
          <div className="rounded-2xl border border-slate-100 bg-white p-10 text-center">
            <div className="mx-auto mb-3 h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center">
              <BellOff className="h-4.5 w-4.5 text-slate-400" strokeWidth={1.5} />
            </div>
            <p className="text-sm text-slate-500">Nothing here.</p>
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-100 bg-white divide-y divide-slate-50">
            {visible.map((n) => (
              <button
                key={n.id}
                onClick={() => handleOpen(n)}
                className="w-full text-left px-5 py-4 flex items-start gap-3 hover:bg-slate-50 transition"
              >
                <div
                  className={`mt-0.5 h-8 w-8 shrink-0 rounded-full flex items-center justify-center ${
                    n.is_urgent ? "bg-red-50 text-red-600" : "bg-slate-100 text-slate-500"
                  }`}
                >
                  <Bell className="h-4 w-4" strokeWidth={1.75} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${n.is_read ? "text-slate-500" : "text-slate-800 font-medium"}`}>
                    {n.message}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {new Date(n.created_at).toLocaleString()}
                  </p>
                </div>
                {!n.is_read && <span className="h-2 w-2 rounded-full bg-sky-500 mt-2 shrink-0" />}
              </button>
            ))}
          </div>
        )}
      </main>

      {openReferral && (
        <ReferralDetailModal
          referral={openReferral}
          me={me}
          onClose={() => setOpenReferral(null)}
          onUpdated={(updated) => {
            replaceReferral(updated);
            setOpenReferral(updated);
          }}
        />
      )}
    </>
  );
}
