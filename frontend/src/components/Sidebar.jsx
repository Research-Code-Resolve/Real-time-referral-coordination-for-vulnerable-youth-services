import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Building2,
  Send,
  Activity,
  Bell,
  Plus,
} from 'lucide-react';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/youth', label: 'Youth Cases', icon: Users },
  { to: '/services', label: 'Organisations', icon: Building2 },
  { to: '/referrals', label: 'Referrals', icon: Send },
  { to: '/tracking', label: 'Tracking', icon: Activity },
  { to: '/notifications', label: 'Notifications', icon: Bell },
];

export default function Sidebar({ userName, role, organisation, unreadCount = 0, onNewReferral }) {
  return (
    <aside className="hidden md:flex md:flex-col md:w-64 md:shrink-0 bg-slate-900 text-slate-300 min-h-screen">
      <div className="px-5 pt-6 pb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-400 text-slate-900 font-bold text-sm">
            C
          </div>
          <span className="text-white font-semibold text-base">CompassLink</span>
        </div>
        <p className="mt-1 text-xs text-slate-500">Youth Referral Services</p>
      </div>

      {role === 'SOCIAL_WORKER' && (
        <div className="px-5 mb-6">
          <button
            onClick={onNewReferral}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-semibold py-2.5 transition"
          >
            <Plus className="h-4 w-4" />
            New Referral
          </button>
        </div>
      )}

      <nav className="flex-1 px-3 space-y-1">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                isActive
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-r bg-sky-400" />
                )}
                <Icon className="h-4 w-4" />
                {label}
                {label === 'Notifications' && unreadCount > 0 && (
                  <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[11px] font-semibold text-white">
                    {unreadCount}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-slate-800 px-5 py-4">
        <p className="text-sm font-medium text-slate-200 truncate">
          {organisation ?? role?.replace('_', ' ')}
        </p>
        <p className="mt-0.5 text-xs text-slate-500 truncate">{userName}</p>
      </div>
    </aside>
  );
}
