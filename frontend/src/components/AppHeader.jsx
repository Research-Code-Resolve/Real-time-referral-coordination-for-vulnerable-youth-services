import { Users } from "lucide-react";

const ROLE_LABELS = {
  SOCIAL_WORKER: "Social Worker",
  PARTNER: "Partner",
  SUPER_ADMIN: "Super Admin",
};

export default function AppHeader({ me, right }) {
  return (
    <header className="w-full border-b border-slate-100 bg-white">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-full bg-deepblue-50 flex items-center justify-center">
            <Users className="h-4.5 w-4.5 text-deepblue-500" strokeWidth={1.5} />
          </div>
          <span className="font-semibold text-slate-800">Social Work Connect</span>
        </div>

        <div className="flex items-center gap-5">
          {right}
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-slate-700 leading-tight">
              {me.organisation || ROLE_LABELS[me.role] || me.role}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
