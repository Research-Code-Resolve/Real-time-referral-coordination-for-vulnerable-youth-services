export default function OrganisationCard({ org, onView }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 flex flex-col gap-3">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-sky-600">{org.category}</p>
        <h3 className="text-base font-semibold text-slate-800 mt-1">{org.name}</h3>
        <p className="text-sm text-slate-500 mt-1">{org.service_type}</p>
      </div>
      <div className="text-xs text-slate-400 space-y-0.5">
        <p>{org.location}</p>
        {org.availability && <p>{org.availability}</p>}
      </div>
      <button
        onClick={() => onView(org)}
        className="mt-auto text-sm font-medium text-slate-900 hover:underline text-left"
      >
        View Organisation →
      </button>
    </div>
  );
}
