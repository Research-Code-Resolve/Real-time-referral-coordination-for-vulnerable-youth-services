import { useState } from "react";
import AppHeader from "../components/AppHeader.jsx";
import ReferralsTable from "../components/ReferralsTable.jsx";
import ReferralDetailModal from "../components/ReferralDetailModal.jsx";
import { useReferrals } from "../hooks/useReferrals.js";
import { sortByRecentActivity } from "../lib/referrals.js";

export default function ReferralsPage({ me, onLogout }) {
  const { referrals, loading, error, replaceReferral } = useReferrals();
  const [openReferral, setOpenReferral] = useState(null);

  return (
    <>
      <AppHeader me={me} onLogout={onLogout} />
      <main className="max-w-6xl mx-auto px-6 py-8 space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Referrals</h1>
          <p className="text-sm text-slate-400 mt-1">All referrals you have access to.</p>
        </div>
        <ReferralsTable
          referrals={sortByRecentActivity(referrals)}
          loading={loading}
          error={error}
          onOpenReferral={setOpenReferral}
          emptyHint="No referrals yet."
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
