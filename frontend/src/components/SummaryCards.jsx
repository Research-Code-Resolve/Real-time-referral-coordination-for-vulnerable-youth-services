import { Activity, AlertTriangle, CheckCircle2 } from "lucide-react";

const CARDS = [
  { key: "active", label: "Active", icon: Activity, tone: "text-slate-700 bg-slate-100" },
  { key: "urgent", label: "Urgent", icon: AlertTriangle, tone: "text-red-700 bg-red-50" },
  { key: "closed", label: "Closed", icon: CheckCircle2, tone: "text-emerald-700 bg-emerald-50" },
];

export default function SummaryCards({ summary, loading }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {CARDS.map(({ key, label, icon: Icon, tone }) => (
        <div
          key={key}
          className="rounded-2xl border border-slate-100 bg-white p-5"
        >
          <div className={`h-9 w-9 rounded-full flex items-center justify-center mb-3 ${tone}`}>
            <Icon className="h-4.5 w-4.5" strokeWidth={1.75} />
          </div>
          <p className="text-2xl font-semibold text-slate-800">
            {loading ? "–" : summary[key]}
          </p>
          <p className="text-sm text-slate-400">{label}</p>
        </div>
      ))}
    </div>
  );
}
