import { Users, LogOut } from "lucide-react";

const ROLE_LABELS = {
  SOCIAL_WORKER: "Social Worker",
  PARTNER: "Partner",
  SUPER_ADMIN: "Super Admin",
};

export default function AppHeader({ me, onLogout, right }) {
  return (
    <header className="w-full border-b border-slate-100 bg-white">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center">
            <Users className="h-4.5 w-4.5 text-slate-500" strokeWidth={1.5} />
          </div>
          <span className="font-semibold text-slate-800">Social Work Connect</span>
        </div>

        <div className="flex items-center gap-5">
          {right}
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-slate-700 leading-tight">
              {me.username}
            </p>
            <p className="text-xs text-slate-400 leading-tight">
              {ROLE_LABELS[me.role] || me.role}
              {me.organisation ? ` · ${me.organisation}` : ""}
            </p>
          </div>
          <button
            onClick={onLogout}
            className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition"
          >
            <LogOut className="h-4 w-4" strokeWidth={1.75} />
            <span className="hidden sm:inline">Log out</span>
          </button>
        </div>
      </div>
    </header>
  );
}
