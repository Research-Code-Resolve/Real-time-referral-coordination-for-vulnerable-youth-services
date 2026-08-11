import { ShieldCheck } from "lucide-react";
import AppHeader from "../components/AppHeader.jsx";

// Per the contract: "Admin area (or Django admin directly for MVP)" —
// there's no admin-specific API documented yet, so this just hands off
// to Django admin rather than guessing at screens that aren't specified.
export default function AdminDashboard({ me, onLogout }) {
  return (
    <div className="min-h-screen w-full bg-slate-50">
      <AppHeader me={me} onLogout={onLogout} />
      <main className="max-w-2xl mx-auto px-6 py-16 text-center">
        <div className="mx-auto mb-5 h-14 w-14 rounded-full bg-slate-100 flex items-center justify-center">
          <ShieldCheck className="h-6 w-6 text-slate-500" strokeWidth={1.5} />
        </div>
        <h1 className="text-xl font-semibold text-slate-800 mb-2">
          Admin area
        </h1>
        <p className="text-sm text-slate-500 mb-6">
          Account creation and management run through Django admin for now —
          there's no dedicated admin API in the contract yet.
        </p>
        <a
          href="http://localhost:8000/admin/"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 text-sm font-medium bg-slate-900 hover:bg-slate-800 text-white rounded-full px-6 py-3 transition"
        >
          Open Django admin
        </a>
      </main>
    </div>
  );
}
