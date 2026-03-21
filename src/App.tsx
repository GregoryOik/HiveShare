import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
import { AuthProvider, useAuth } from './lib/useAuth';
import { ErrorBoundary } from './components/ErrorBoundary';

function ProtectedRoute({ children, requireAdmin = false }: { children: React.ReactNode, requireAdmin?: boolean }) {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen bg-[#1A1208] text-white flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
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
            <Route path="*" element={<Navigate to={isDashboardSubdomain ? "/" : "/"} replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}
