import { useState } from "react";
import { UserPlus, Search, Send, ListChecks, AlertTriangle } from "lucide-react";
import AppHeader from "../components/AppHeader.jsx";
import SummaryCards from "../components/SummaryCards.jsx";
import ReferralsTable from "../components/ReferralsTable.jsx";
import CreateReferralModal from "../components/CreateReferralModal.jsx";
import ReferralDetailModal from "../components/ReferralDetailModal.jsx";
import { useReferrals } from "../hooks/useReferrals.js";
import { computeSummary, sortByRecentActivity } from "../lib/referrals.js";

const QUICK_ACTIONS = [
  { key: "register", label: "Register Youth", icon: UserPlus, wired: false },
  { key: "find", label: "Find a Service", icon: Search, wired: false },
  { key: "create", label: "Create Referral", icon: Send, wired: true },
  { key: "view", label: "View All Referrals", icon: ListChecks, wired: true },
];

export default function SocialWorkerDashboard({ me, onLogout }) {
  const { referrals, loading, error, reload, replaceReferral, addReferral } = useReferrals();
  const [openReferral, setOpenReferral] = useState(null);
  const [creating, setCreating] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const summary = computeSummary(referrals);
  const urgent = referrals.filter(
    (r) =>
      (r.priority === "Emergency" || r.priority === "High") &&
      ![
        "closed",
        "service completed",
        "declined",
      ].includes(r.status.toLowerCase())
  );
  const recent = sortByRecentActivity(referrals).slice(0, showAll ? undefined : 6);

  function handleQuickAction(key) {
    if (key === "create") setCreating(true);
    if (key === "view") setShowAll(true);
    // "register" and "find" have no endpoint in the API contract yet —
    // buttons are visible (per the spec) but intentionally inert.
  }

  return (
    <div className="min-h-screen w-full bg-slate-50">
      <AppHeader me={me} onLogout={onLogout} />

      <main className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">
            Welcome back, {me.username.split("@")[0]}
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Here's what needs your attention today.
          </p>
        </div>

        <SummaryCards summary={summary} loading={loading} />

        {/* Quick actions */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {QUICK_ACTIONS.map(({ key, label, icon: Icon, wired }) => (
            <button
              key={key}
              onClick={() => handleQuickAction(key)}
              disabled={!wired}
              title={wired ? undefined : "Not wired yet — no endpoint in the API contract"}
              className="rounded-2xl border border-slate-100 bg-white p-5 text-left hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <Icon className="h-5 w-5 text-slate-500 mb-3" strokeWidth={1.5} />
              <p className="text-sm font-medium text-slate-700">{label}</p>
              {!wired && <p className="text-xs text-slate-400 mt-0.5">Coming soon</p>}
            </button>
          ))}
        </div>

        {/* Urgent cases */}
        {urgent.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="h-4 w-4 text-red-600" strokeWidth={1.75} />
              <h2 className="text-sm font-semibold text-slate-700">
                Urgent cases ({urgent.length})
              </h2>
            </div>
            <ReferralsTable
              referrals={urgent}
              loading={false}
              error=""
              onOpenReferral={setOpenReferral}
            />
          </section>
        )}

        {/* Recent referrals */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-slate-700">
              {showAll ? "All referrals" : "Recent referrals"}
            </h2>
            {!showAll && referrals.length > 6 && (
              <button
                onClick={() => setShowAll(true)}
                className="text-sm text-slate-500 hover:text-slate-800 transition"
              >
                View all →
              </button>
            )}
          </div>
          <ReferralsTable
            referrals={recent}
            loading={loading}
            error={error}
            onOpenReferral={setOpenReferral}
            emptyHint="No referrals yet — create one to get started."
          />
        </section>
      </main>

      {creating && (
        <CreateReferralModal
          me={me}
          onClose={() => setCreating(false)}
          onCreated={(created) => {
            addReferral(created);
            setCreating(false);
          }}
        />
      )}

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
    </div>
  );
}
