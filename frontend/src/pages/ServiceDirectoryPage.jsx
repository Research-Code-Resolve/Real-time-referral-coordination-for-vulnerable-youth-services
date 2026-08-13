import { useState } from "react";
import { Search as SearchIcon } from "lucide-react";
import AppHeader from "../components/AppHeader.jsx";
import OrganisationCard from "../components/OrganisationCard.jsx";
import OrganisationDetailModal from "../components/OrganisationDetailModal.jsx";
import CreateReferralModal from "../components/CreateReferralModal.jsx";
import { useOrganisations } from "../hooks/useOrganisations.js";

const CATEGORY_OPTIONS = [
  "All", "Health", "Mental Health", "Shelter", "Legal", "GBV",
  "Education", "Vocational Training", "Psychosocial Support", "Livelihood",
];

export default function ServiceDirectoryPage({ me, onLogout }) {
  const { organisations, loading, error } = useOrganisations();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [openOrg, setOpenOrg] = useState(null);
  const [referring, setReferring] = useState(null);

  const filtered = organisations.filter((org) => {
    const matchesSearch =
      !search ||
      org.name.toLowerCase().includes(search.toLowerCase()) ||
      org.location.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "All" || org.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <AppHeader me={me} onLogout={onLogout} />
      <main className="max-w-6xl mx-auto px-6 py-8 space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Service Directory</h1>
          <p className="text-sm text-slate-400 mt-1">
            Find organisations that provide the service a youth needs.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or location…"
              className="input pl-9"
            />
          </div>
          <select className="input w-auto" value={category} onChange={(e) => setCategory(e.target.value)}>
            {CATEGORY_OPTIONS.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <p className="text-sm text-slate-400">Loading organisations…</p>
        ) : error ? (
          <p className="text-sm text-red-600">{error}</p>
        ) : filtered.length === 0 ? (
          <p className="text-sm text-slate-500">No organisations match your search.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((org) => (
              <OrganisationCard key={org.id} org={org} onView={setOpenOrg} />
            ))}
          </div>
        )}
      </main>

      {openOrg && (
        <OrganisationDetailModal
          org={openOrg}
          onClose={() => setOpenOrg(null)}
          onRefer={(org) => {
            setReferring(org);
            setOpenOrg(null);
          }}
        />
      )}

      {referring && (
        <CreateReferralModal
          me={me}
          initialOrganisationId={referring.id}
          onClose={() => setReferring(null)}
          onCreated={() => setReferring(null)}
        />
      )}
    </>
  );
}
