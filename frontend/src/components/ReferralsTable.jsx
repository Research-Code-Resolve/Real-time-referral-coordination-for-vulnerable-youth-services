import { StatusPill, PriorityPill } from "./StatusPill.jsx";
import { Inbox } from "lucide-react";

export default function ReferralsTable({ referrals, loading, error, onOpenReferral, emptyHint }) {
  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-100 bg-white p-10 text-center text-sm text-slate-400">
        Loading referrals…
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-sm text-red-600">
        {error}
      </div>
    );
  }

  if (!referrals.length) {
    return (
      <div className="rounded-2xl border border-slate-100 bg-white p-10 text-center">
        <div className="mx-auto mb-3 h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center">
          <Inbox className="h-4.5 w-4.5 text-slate-400" strokeWidth={1.5} />
        </div>
        <p className="text-sm text-slate-500">
          {emptyHint || "No referrals yet."}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-100 bg-white overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-100 text-left text-xs font-medium uppercase tracking-wide text-slate-400">
            <th className="px-5 py-3">Case</th>
            <th className="px-5 py-3">Service</th>
            <th className="px-5 py-3">Receiving org</th>
            <th className="px-5 py-3">Priority</th>
            <th className="px-5 py-3">Status</th>
            <th className="px-5 py-3">Date</th>
          </tr>
        </thead>
        <tbody>
          {referrals.map((r) => (
            <tr
              key={r.id}
              onClick={() => onOpenReferral(r)}
              className="border-b border-slate-50 last:border-0 hover:bg-slate-50 cursor-pointer transition"
            >
              <td className="px-5 py-3.5 font-medium text-slate-700">{r.caseId}</td>
              <td className="px-5 py-3.5 text-slate-600">{r.service}</td>
              <td className="px-5 py-3.5 text-slate-600">{r.receivingOrganisation}</td>
              <td className="px-5 py-3.5"><PriorityPill value={r.priority} /></td>
              <td className="px-5 py-3.5"><StatusPill value={r.status} /></td>
              <td className="px-5 py-3.5 text-slate-500">
                {r.createdAt
                  ? new Date(r.createdAt).toLocaleDateString()
                  : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
