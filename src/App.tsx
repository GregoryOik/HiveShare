import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import Membership from './pages/Membership';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Success from './pages/Success';
import Cancel from './pages/Cancel';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
import { AuthProvider, useAuth } from './lib/useAuth';
import { ErrorBoundary } from './components/ErrorBoundary';
import CookieConsent from './components/CookieConsent';

function ProtectedRoute({ children, requireAdmin = false }: { children: React.ReactNode, requireAdmin?: boolean }) {
  const { user, profile, loading } = useAuth();

  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-hive-bg text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-honey border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs uppercase tracking-widest text-white/50">Loading...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && profile?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

export default function App() {
  const isDashboardSubdomain = window.location.hostname.startsWith('dashboard.');

  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Dashboard Subdomain Routes */}
            {isDashboardSubdomain && <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />}
            {isDashboardSubdomain && <Route path="/dashboard" element={<Navigate to="/" replace />} />}
            
            {/* Standard Domain Routes */}
            {!isDashboardSubdomain && <Route path="/" element={<Landing />} />}
            {!isDashboardSubdomain && <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />}

            {/* Shared Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/membership" element={
              <ProtectedRoute>
                <Membership />
              </ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute requireAdmin={true}>
                <Admin />
              </ProtectedRoute>
            } />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/success" element={<ProtectedRoute><Success /></ProtectedRoute>} />
            <Route path="/cancel" element={<ProtectedRoute><Cancel /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <CookieConsent />
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}
