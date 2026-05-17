import { useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import AuthPage from './components/Auth/AuthPage';
import DashboardLayout from './components/Dashboard/DashboardLayout';
import AdminLogin from './components/Admin/AdminLogin';
import AdminPortal from './components/Admin/AdminPortal';

function App() {
  const [user, setUser] = useState<{ name: string; phone: string } | null>(null);
  const [adminSession, setAdminSession] = useState(false);

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-gradient-to-b from-forest-50 via-forest-100 to-emerald-50 text-slate-900">
        <Routes>
          <Route path="/" element={<AuthPage onLogin={setUser} />} />
          <Route
            path="/dashboard/*"
            element={
              user ? (
                <DashboardLayout onLogout={() => setUser(null)} user={user} />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route path="/admin" element={<AdminLogin onAdminLogin={() => setAdminSession(true)} />} />
          <Route
            path="/admin/portal"
            element={
              adminSession ? (
                <AdminPortal onLogout={() => setAdminSession(false)} />
              ) : (
                <Navigate to="/admin" replace />
              )
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </LanguageProvider>
  );
}

export default App;
