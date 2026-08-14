import Sidebar from './Sidebar.jsx';
import { useNotifications } from '../hooks/useNotifications.js';

export default function DashboardLayout({ me, onNewReferral, onLogout, children }) {
  const { unreadCount } = useNotifications();

  return (
    <div className="min-h-screen w-full flex bg-slate-50">
      <Sidebar
        userName={me?.username}
        role={me?.role}
        organisation={me?.organisation}
        unreadCount={unreadCount}
        onNewReferral={onNewReferral}
        onLogout={onLogout}
      />
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}
