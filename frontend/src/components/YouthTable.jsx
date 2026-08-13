import { PriorityPill } from "./StatusPill.jsx";
import { Inbox } from "lucide-react";

export default function YouthTable({ youth, loading, error, onOpenYouth, emptyHint }) {
  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-100 bg-white p-10 text-center text-sm text-slate-400">
        Loading cases…
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

  if (!youth.length) {
    return (
      <div className="rounded-2xl border border-slate-100 bg-white p-10 text-center">
        <div className="mx-auto mb-3 h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center">
          <Inbox className="h-4.5 w-4.5 text-slate-400" strokeWidth={1.5} />
        </div>
        <p className="text-sm text-slate-500">{emptyHint || "No cases yet."}</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-100 bg-white overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-100 text-left text-xs font-medium uppercase tracking-wide text-slate-400">
            <th className="px-5 py-3">Case</th>
            <th className="px-5 py-3">Age</th>
            <th className="px-5 py-3">Gender</th>
            <th className="px-5 py-3">Location</th>
            <th className="px-5 py-3">Priority</th>
          </tr>
        </thead>
        <tbody>
          {youth.map((y) => (
            <tr
              key={y.id}
              onClick={() => onOpenYouth(y)}
              className="border-b border-slate-50 last:border-0 hover:bg-slate-50 cursor-pointer transition"
            >
              <td className="px-5 py-3.5 font-medium text-slate-700">Case #{y.id}</td>
              <td className="px-5 py-3.5 text-slate-600">{y.age}</td>
              <td className="px-5 py-3.5 text-slate-600">{y.gender}</td>
              <td className="px-5 py-3.5 text-slate-600">{y.location}</td>
              <td className="px-5 py-3.5">
                <PriorityPill value={y.priority} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
