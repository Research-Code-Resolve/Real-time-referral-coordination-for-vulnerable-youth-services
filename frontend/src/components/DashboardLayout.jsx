import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import ChatWidget from './ChatWidget.jsx';
import { useNotifications } from '../hooks/useNotifications.js';

export default function DashboardLayout({ me, onNewReferral, onLogout, children }) {
  const { unreadCount } = useNotifications();
  const location = useLocation();

  return (
    <div className="min-h-screen w-full flex">
      <Sidebar
        userName={me?.username}
        role={me?.role}
        organisation={me?.organisation}
        unreadCount={unreadCount}
        onNewReferral={onNewReferral}
        onLogout={onLogout}
      />
      <div className="flex-1 min-w-0 min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(107,143,113,0.16),transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(31,58,95,0.12),transparent_35%),#f4f7f5]">
        {children}
      </div>
      <ChatWidget currentPage={location.pathname.replace('/', '') || 'dashboard'} />
    </div>
  );
}