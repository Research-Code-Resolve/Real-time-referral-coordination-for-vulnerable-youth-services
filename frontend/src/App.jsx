import { useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SocialWorkerDashboard from "./pages/SocialWorkerDashboard.jsx";
import PartnerDashboard from "./pages/PartnerDashboard.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import YouthCasesPage from "./pages/YouthCasesPage.jsx";
import ServiceDirectoryPage from "./pages/ServiceDirectoryPage.jsx";
import ReferralsPage from "./pages/ReferralsPage.jsx";
import TrackingPage from "./pages/TrackingPage.jsx";
import NotificationsPage from "./pages/NotificationsPage.jsx";
import DashboardLayout from "./components/DashboardLayout.jsx";
import { clearSession } from "./lib/api.js";

const DASHBOARDS = {
  SOCIAL_WORKER: SocialWorkerDashboard,
  PARTNER: PartnerDashboard,
  SUPER_ADMIN: AdminDashboard,
};

export default function App() {
  const navigate = useNavigate();
  const [me, setMe] = useState(() => {
    const stored = sessionStorage.getItem("me");
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    function handleSessionExpired() {
      setMe(null);
      navigate("/login", { replace: true });
    }
    window.addEventListener("swconnect:session-expired", handleSessionExpired);
    return () =>
      window.removeEventListener("swconnect:session-expired", handleSessionExpired);
  }, [navigate]);

  function handleLoginSuccess(meResponse) {
    setMe(meResponse);
    navigate("/dashboard", { replace: true });
  }

  function handleLogout() {
    clearSession();
    setMe(null);
    navigate("/", { replace: true });
  }

  function handleNewReferral() {
    navigate("/dashboard?new=1");
  }

  const DashboardForRole = me ? DASHBOARDS[me.role] : null;

  function renderUnknownRole() {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-sm bg-white rounded-3xl shadow-sm border border-slate-100 p-8 text-center">
          <p className="text-sm text-slate-600 mb-4">
            Signed in as <span className="font-medium">{me.username}</span>, but
            role "{me.role}" isn't recognised by this app yet.
          </p>
          <button
            onClick={handleLogout}
            className="text-sm text-slate-500 hover:text-slate-700 underline underline-offset-2"
          >
            Log out
          </button>
        </div>
      </div>
    );
  }

  function withLayout(page) {
    return !me ? (
      <Navigate to="/login" replace />
    ) : (
      <DashboardLayout me={me} onNewReferral={handleNewReferral} onLogout={handleLogout}>
        {page}
      </DashboardLayout>
    );
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          me ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <LandingPage onGetStarted={() => navigate("/login")} onLogin={() => navigate("/login")} />
          )
        }
      />
      <Route
        path="/login"
        element={
          me ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <LoginPage onLoginSuccess={handleLoginSuccess} />
          )
        }
      />
      <Route
        path="/dashboard"
        element={
          !me ? (
            <Navigate to="/login" replace />
          ) : DashboardForRole ? (
            <DashboardLayout me={me} onNewReferral={handleNewReferral} onLogout={handleLogout}>
              <DashboardForRole me={me} onLogout={handleLogout} />
            </DashboardLayout>
          ) : (
            renderUnknownRole()
          )
        }
      />
      <Route path="/youth" element={withLayout(<YouthCasesPage me={me} onLogout={handleLogout} />)} />
      <Route path="/services" element={withLayout(<ServiceDirectoryPage me={me} onLogout={handleLogout} />)} />
      <Route path="/referrals" element={withLayout(<ReferralsPage me={me} onLogout={handleLogout} />)} />
      <Route path="/tracking" element={withLayout(<TrackingPage me={me} onLogout={handleLogout} />)} />
      <Route path="/notifications" element={withLayout(<NotificationsPage me={me} onLogout={handleLogout} />)} />
      <Route path="*" element={<Navigate to={me ? "/dashboard" : "/"} replace />} />
    </Routes>
  );
}
