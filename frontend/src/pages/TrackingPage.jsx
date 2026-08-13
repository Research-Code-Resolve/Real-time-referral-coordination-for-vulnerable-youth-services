import { useState } from "react";
import AppHeader from "../components/AppHeader.jsx";
import ReferralsTable from "../components/ReferralsTable.jsx";
import ReferralDetailModal from "../components/ReferralDetailModal.jsx";
import { useReferrals } from "../hooks/useReferrals.js";

const STAGES = [
  "Submitted", "Received", "Accepted", "Appointment Scheduled",
  "Client Arrived", "Service In Progress", "Service Completed", "Closed",
];

export default function TrackingPage({ me, onLogout }) {
  const { referrals, loading, error, replaceReferral } = useReferrals();
  const [openReferral, setOpenReferral] = useState(null);
  const [stage, setStage] = useState("All");

  const filtered = stage === "All" ? referrals : referrals.filter((r) => r.status === stage);

  return (
    <>
      <AppHeader me={me} onLogout={onLogout} />
      <main className="max-w-6xl mx-auto px-6 py-8 space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Tracking</h1>
          <p className="text-sm text-slate-400 mt-1">Follow referrals through each stage.</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {["All", ...STAGES].map((s) => (
            <button
              key={s}
              onClick={() => setStage(s)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition ${
                stage === s
                  ? "bg-slate-900 text-white"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <ReferralsTable
          referrals={filtered}
          loading={loading}
          error={error}
          onOpenReferral={setOpenReferral}
          emptyHint="No referrals at this stage."
        />
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
