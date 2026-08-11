const STATUS_STYLES = {
  submitted: "bg-slate-50 text-slate-600 border-slate-200",
  received: "bg-blue-50 text-blue-700 border-blue-200",
  accepted: "bg-indigo-50 text-indigo-700 border-indigo-200",
  declined: "bg-red-50 text-red-700 border-red-200",
  "information requested": "bg-amber-50 text-amber-700 border-amber-200",
  "appointment scheduled": "bg-cyan-50 text-cyan-700 border-cyan-200",
  "client arrived": "bg-teal-50 text-teal-700 border-teal-200",
  "service in progress": "bg-blue-50 text-blue-700 border-blue-200",
  "service completed": "bg-emerald-50 text-emerald-700 border-emerald-200",
  closed: "bg-gray-50 text-gray-700 border-gray-200",
};

const PRIORITY_STYLES = {
  emergency: "bg-red-50 text-red-700 border-red-200",
  high: "bg-orange-50 text-orange-700 border-orange-200",
  medium: "bg-amber-50 text-amber-700 border-amber-200",
  low: "bg-slate-50 text-slate-500 border-slate-200",
};

export function StatusPill({ value }) {
  const style =
    STATUS_STYLES[value?.toLowerCase()] ||
    "bg-slate-50 text-slate-600 border-slate-200";
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${style}`}
    >
      {value || "—"}
    </span>
  );
}

export function PriorityPill({ value }) {
  // Display Emergency as "Urgent"
  const displayValue = value === "Emergency" ? "Urgent" : value;
  const style =
    PRIORITY_STYLES[value?.toLowerCase()] ||
    "bg-slate-50 text-slate-600 border-slate-200";
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${style}`}
    >
      {displayValue || "—"}
    </span>
  );
}
