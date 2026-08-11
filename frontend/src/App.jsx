import { useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SocialWorkerDashboard from "./pages/SocialWorkerDashboard.jsx";
import PartnerDashboard from "./pages/PartnerDashboard.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
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

  const DashboardForRole = me ? DASHBOARDS[me.role] : null;

  function renderUnknownRole() {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-sm bg-white rounded-3xl shadow-sm border border-slate-100 p-8 text-center">
          <p className="text-sm text-slate-600 mb-4">
            Signed in as <span className="font-medium">{me.username}</span>, but role "{me.role}" isn't recognised by this app yet.
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
            <DashboardForRole me={me} onLogout={handleLogout} />
          ) : (
            renderUnknownRole()
          )
        }
      />
      <Route path="*" element={<Navigate to={me ? "/dashboard" : "/"} replace />} />
    </Routes>
  );
}
