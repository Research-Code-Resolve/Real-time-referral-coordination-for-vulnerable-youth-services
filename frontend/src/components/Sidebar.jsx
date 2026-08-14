import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Building2,
  Send,
  Activity,
  Bell,
  Plus,
  LogOut,
} from 'lucide-react';

const NAV_BY_ROLE = {
  SOCIAL_WORKER: [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/youth', label: 'Youth Cases', icon: Users },
    { to: '/services', label: 'Organisations', icon: Building2 },
    { to: '/referrals', label: 'Referrals', icon: Send },
    { to: '/tracking', label: 'Tracking', icon: Activity },
    { to: '/notifications', label: 'Notifications', icon: Bell },
  ],
  SUPER_ADMIN: [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/youth', label: 'Youth Cases', icon: Users },
    { to: '/services', label: 'Organisations', icon: Building2 },
    { to: '/referrals', label: 'Referrals', icon: Send },
    { to: '/tracking', label: 'Tracking', icon: Activity },
    { to: '/notifications', label: 'Notifications', icon: Bell },
  ],
  PARTNER: [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/referrals', label: 'Referrals', icon: Send },
    { to: '/tracking', label: 'Tracking', icon: Activity },
    { to: '/notifications', label: 'Notifications', icon: Bell },
  ],
};

export default function Sidebar({ userName, role, organisation, unreadCount = 0, onNewReferral, onLogout }) {
  const navItems = NAV_BY_ROLE[role] || NAV_BY_ROLE.SOCIAL_WORKER;

  return (
    <aside className="hidden md:flex md:flex-col md:w-64 md:shrink-0 bg-deepblue-500 text-slate-300 min-h-screen">
      <div className="px-5 pt-6 pb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sage-400 text-deepblue-900 font-bold text-sm">
            C
          </div>
          <span className="text-white font-semibold text-base">CompassLink</span>
        </div>
        <p className="mt-1 text-xs text-slate-400">Youth Referral Services</p>
      </div>

      {role === 'SOCIAL_WORKER' && (
        <div className="px-5 mb-6">
          <button
            onClick={onNewReferral}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-sage-500 hover:bg-sage-600 text-white text-sm font-semibold py-2.5 transition"
          >
            <Plus className="h-4 w-4" />
            New Referral
          </button>
        </div>
      )}

      <nav className="flex-1 px-3 space-y-1">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                isActive
                  ? 'bg-deepblue-600 text-white'
                  : 'text-slate-400 hover:bg-deepblue-600/60 hover:text-slate-200'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-r bg-sage-400" />
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

      <div className="border-t border-deepblue-600 px-5 py-4 space-y-3">
        <div>
          <p className="text-sm font-medium text-slate-200 truncate">
            {organisation ?? role?.replace('_', ' ')}
          </p>
          <p className="mt-0.5 text-xs text-slate-500 truncate">{userName}</p>
        </div>
        <button
          onClick={onLogout}
          className="flex items-center gap-2 text-xs text-slate-400 hover:text-white transition"
        >
          <LogOut className="h-3.5 w-3.5" />
          Log out
        </button>
      </div>
    </aside>
  );
}
