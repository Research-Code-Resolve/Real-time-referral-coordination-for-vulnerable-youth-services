import { useState } from "react";
import { Search as SearchIcon, UserPlus } from "lucide-react";
import AppHeader from "../components/AppHeader.jsx";
import YouthTable from "../components/YouthTable.jsx";
import RegisterYouthModal from "../components/RegisterYouthModal.jsx";
import YouthDetailModal from "../components/YouthDetailModal.jsx";
import ReferralDetailModal from "../components/ReferralDetailModal.jsx";
import CreateReferralModal from "../components/CreateReferralModal.jsx";
import { useYouth } from "../hooks/useYouth.js";

const STATUS_OPTIONS = ["All", "Open", "In Progress", "Closed"];
const PRIORITY_OPTIONS = ["All", "Low", "Medium", "High", "Emergency"];

export default function YouthCasesPage({ me, onLogout }) {
  const { youth, loading, error, addYouth } = useYouth();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [registering, setRegistering] = useState(false);
  const [openYouth, setOpenYouth] = useState(null);
  const [openReferral, setOpenReferral] = useState(null);
  const [referralDraftFor, setReferralDraftFor] = useState(null);

  const filtered = youth.filter((y) => {
    const matchesSearch =
      !search ||
      y.full_name.toLowerCase().includes(search.toLowerCase()) ||
      String(y.id).includes(search);
    const matchesStatus = statusFilter === "All" || y.status === statusFilter;
    const matchesPriority = priorityFilter === "All" || y.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <>
      <AppHeader me={me} onLogout={onLogout} />
      <main className="max-w-6xl mx-auto px-6 py-8 space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-slate-800">Youth Cases</h1>
            <p className="text-sm text-slate-400 mt-1">Register and manage youth cases.</p>
          </div>
          <button
            onClick={() => setRegistering(true)}
            className="inline-flex items-center gap-2 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium px-5 py-2.5 transition"
          >
            <UserPlus className="h-4 w-4" />
            Register Youth
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or case ID…"
              className="input pl-9"
            />
          </div>
          <select className="input w-auto" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <select className="input w-auto" value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
            {PRIORITY_OPTIONS.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        <YouthTable
          youth={filtered}
          loading={loading}
          error={error}
          onOpenYouth={setOpenYouth}
          emptyHint="No cases match your search."
        />
      </main>

      {registering && (
        <RegisterYouthModal
          onClose={() => setRegistering(false)}
          onCreated={(created) => {
            addYouth(created);
            setRegistering(false);
          }}
        />
      )}

      {openYouth && (
        <YouthDetailModal
          youth={openYouth}
          onClose={() => setOpenYouth(null)}
          onOpenReferral={(r) => setOpenReferral(r)}
          onCreateReferral={(y) => {
            setReferralDraftFor(y);
            setOpenYouth(null);
          }}
        />
      )}

      {referralDraftFor && (
        <CreateReferralModal
          me={me}
          initialYouthId={referralDraftFor.id}
          onClose={() => setReferralDraftFor(null)}
          onCreated={() => setReferralDraftFor(null)}
        />
      )}

      {openReferral && (
        <ReferralDetailModal
          referral={openReferral}
          me={me}
          onClose={() => setOpenReferral(null)}
          onUpdated={(updated) => setOpenReferral(updated)}
        />
      )}
    </>
  );
}
