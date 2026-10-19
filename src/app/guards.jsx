import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { ShieldAlert } from 'lucide-react';
import { Button } from '../components/ui/Button.jsx';

export function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/403" replace />;
  }

  return children;
}

export function AccessDeniedPage() {
  const { user } = useAuth();

  const getDashboardPath = () => {
    if (!user) return '/login';
    if (user.role === 'admin') return '/admin/dashboard';
    if (user.role === 'organizer') return '/organizer/dashboard';
    return '/student/dashboard';
  };

  return (
    <div
      className="container flex flex-col items-center justify-center text-center"
      style={{ minHeight: '70vh', padding: '3rem 1.5rem' }}
    >
      <div
        style={{
          backgroundColor: 'var(--error-light)',
          color: 'var(--error)',
          padding: '1.25rem',
          borderRadius: '50%',
          marginBottom: '1.5rem',
          display: 'inline-flex',
        }}
      >
        <ShieldAlert size={44} />
      </div>

      <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.75rem' }}>
        Access Restricted (403)
      </h1>
      <p style={{ color: 'var(--text-secondary)', maxWidth: '480px', marginBottom: '2rem' }}>
        Your active role (<strong>{user?.role || 'Guest'}</strong>) does not have authorization to view this area.
        You can switch to an authorized demo role or return to your own dashboard.
      </p>

      <div className="flex gap-3">
        <Link to={getDashboardPath()}>
          <Button variant="primary">Return to My Dashboard</Button>
        </Link>
        <Link to="/login">
          <Button variant="secondary">Switch Role</Button>
        </Link>
      </div>
    </div>
  );
}

export function NotFoundPage() {
  return (
    <div
      className="container flex flex-col items-center justify-center text-center"
      style={{ minHeight: '70vh', padding: '3rem 1.5rem' }}
    >
      <h1 style={{ fontSize: '4rem', fontWeight: 900, color: 'var(--primary)', lineHeight: 1 }}>
        404
      </h1>
      <h2 style={{ fontSize: '1.75rem', fontWeight: 700, margin: '1rem 0 0.5rem 0' }}>
        Page Not Found
      </h2>
      <p style={{ color: 'var(--text-secondary)', maxWidth: '440px', marginBottom: '2rem' }}>
        The campus page or event URL you are looking for has been moved or does not exist.
      </p>
      <Link to="/">
        <Button variant="primary">Back to Homepage</Button>
      </Link>
    </div>
  );
}
