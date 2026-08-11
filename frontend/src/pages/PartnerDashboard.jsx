import { useState } from "react";
import AppHeader from "../components/AppHeader.jsx";
import SummaryCards from "../components/SummaryCards.jsx";
import ReferralsTable from "../components/ReferralsTable.jsx";
import ReferralDetailModal from "../components/ReferralDetailModal.jsx";
import { useReferrals } from "../hooks/useReferrals.js";
import { computeSummary, sortByRecentActivity } from "../lib/referrals.js";

// Per the contract, GET /api/referrals/ already comes back filtered to
// this partner's own organisation — nothing extra to filter here.
export default function PartnerDashboard({ me, onLogout }) {
  const { referrals, loading, error, replaceReferral } = useReferrals();
  const [openReferral, setOpenReferral] = useState(null);
  const summary = computeSummary(referrals);

  return (
    <div className="min-h-screen w-full bg-slate-50">
      <AppHeader me={me} onLogout={onLogout} />

      <main className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">
            Referrals for {me.organisation}
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Update the status of referrals sent to your organisation.
          </p>
        </div>

        <SummaryCards summary={summary} loading={loading} />

        <section>
          <h2 className="text-sm font-semibold text-slate-700 mb-3">
            Referrals
          </h2>
          <ReferralsTable
            referrals={sortByRecentActivity(referrals)}
            loading={loading}
            error={error}
            onOpenReferral={setOpenReferral}
            emptyHint="No referrals have been sent to your organisation yet."
          />
        </section>
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
    </div>
  );
}
