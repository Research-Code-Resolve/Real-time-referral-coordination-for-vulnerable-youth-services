import { useEffect, useState } from "react";
import Modal from "./Modal.jsx";
import { PriorityPill } from "./StatusPill.jsx";
import ReferralsTable from "./ReferralsTable.jsx";
import { api } from "../lib/api.js";
import { normalizeReferral } from "../lib/referrals.js";

export default function YouthDetailModal({ youth, onClose, onCreateReferral, onOpenReferral }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    api
      .listReferralsForYouth(youth.id)
      .then((data) => {
        if (active) setHistory((Array.isArray(data) ? data : []).map(normalizeReferral));
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [youth.id]);

  return (
    <Modal title={`Case #${youth.id}`} onClose={onClose}>
      <div className="space-y-6">
        <div className="space-y-2 text-sm">
          <Row label="Full name">{youth.full_name}</Row>
          <Row label="Age">{youth.age}</Row>
          <Row label="Gender">{youth.gender}</Row>
          <Row label="Location">{youth.location}</Row>
          <Row label="Presenting problem">{youth.primary_need}</Row>
          {youth.immediate_needs && <Row label="Immediate needs">{youth.immediate_needs}</Row>}
          <Row label="Priority">
            <PriorityPill value={youth.priority} />
          </Row>
          <Row label="Case status">{youth.status}</Row>
        </div>

        <div className="border-t border-slate-100 pt-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-slate-700">Referral history</h3>
            <button
              onClick={() => onCreateReferral(youth)}
              className="text-sm font-medium text-slate-900 hover:underline"
            >
              + Create Referral
            </button>
          </div>
          <ReferralsTable
            referrals={history}
            loading={loading}
            error=""
            onOpenReferral={onOpenReferral}
            emptyHint="No referrals for this case yet."
          />
        </div>
      </div>
    </Modal>
  );
}

function Row({ label, children }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-slate-400">{label}</span>
      <span className="text-slate-700 text-right">{children}</span>
    </div>
  );
}
