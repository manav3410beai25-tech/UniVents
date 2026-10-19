import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Calendar,
  Sun,
  Moon,
  LogOut,
  User,
  Compass,
  Menu,
  X,
  RotateCcw,
  Shield,
  Layers,
  GraduationCap
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import { useNotifications } from '../../context/NotificationContext.jsx';
import { ConfirmDialog } from '../ui/ConfirmDialog.jsx';
import { resetDemoData } from '../../services/storageService.js';
import { useToast } from '../ui/Toast.jsx';

export function PublicNavbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();
  const toast = useToast();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);

  const getDashboardPath = () => {
    if (!user) return '/login';
    if (user.role === 'admin') return '/admin/dashboard';
    if (user.role === 'organizer') return '/organizer/dashboard';
    return '/student/dashboard';
  };

  const handleResetData = () => {
    resetDemoData();
    toast.success('Demo data restored to initial sample state.');
    setTimeout(() => {
      window.location.href = '/';
    }, 400);
  };

  return (
    <>
      <header
        className="public-header"
        style={{
          height: 'var(--header-height)',
          backgroundColor: 'var(--bg-surface)',
          borderBottom: '1px solid var(--border-color)',
          position: 'sticky',
          top: 0,
          zIndex: 40,
        }}
      >
        <div className="container h-full flex items-center justify-between public-navbar__inner">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2" style={{ textDecoration: 'none' }}>
            <span className="brand-mark" aria-hidden="true">
              <img src="/uselogo.jpg" alt="" className="brand-mark__image" />
            </span>
            <div className="flex flex-col">
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                UniVents
              </span>
              <span className="text-xs text-secondary public-brand__tagline" style={{ fontWeight: 500 }}>
                One Campus. Every Event.
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="flex items-center gap-6" id="desktop-nav">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `text-sm font-medium ${isActive ? 'text-primary' : 'text-secondary'}`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/events"
              className={({ isActive }) =>
                `text-sm font-medium ${isActive ? 'text-primary' : 'text-secondary'}`
              }
            >
              Explore Events
            </NavLink>
          </nav>

          {/* Right Action Icons & Auth */}
          <div className="flex items-center gap-3 public-navbar__actions">
            <button
              className="btn btn-ghost btn-sm mobile-menu-toggle"
              onClick={() => setMobileMenuOpen((open) => !open)}
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={19} /> : <Menu size={19} />}
            </button>
            {/* Quick Demo Reset Button */}
            <button
              onClick={() => setResetDialogOpen(true)}
              className="btn btn-ghost btn-sm"
              title="Reset Demo Data"
              style={{ color: 'var(--text-secondary)' }}
            >
              <RotateCcw size={16} />
              <span className="text-xs" style={{ display: 'none', md: 'inline' }}>Reset Demo</span>
            </button>

            {/* Dark Mode Switcher */}
            <button
              onClick={toggleTheme}
              className="btn btn-ghost btn-sm"
              aria-label="Toggle theme"
              style={{ width: 36, height: 36, padding: 0, borderRadius: '50%' }}
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Auth Buttons / User Pill */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link
                  to={getDashboardPath()}
                  className="btn btn-primary btn-sm"
                  style={{ gap: '0.4rem' }}
                >
                  {user.role === 'admin' ? (
                    <Shield size={16} />
                  ) : user.role === 'organizer' ? (
                    <Layers size={16} />
                  ) : (
                    <GraduationCap size={16} />
                  )}
                  <span>Dashboard</span>
                  {unreadCount > 0 && (
                    <span
                      style={{
                        backgroundColor: '#ef4444',
                        color: '#fff',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        padding: '1px 6px',
                        borderRadius: '999px',
                      }}
                    >
                      {unreadCount}
                    </span>
                  )}
                </Link>

                <button
                  onClick={() => {
                    logout();
                    navigate('/');
                    toast.info('Logged out.');
                  }}
                  className="btn btn-ghost btn-sm"
                  title="Logout"
                  style={{ width: 36, height: 36, padding: 0 }}
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn btn-secondary btn-sm">
                  Sign In
                </Link>
                <Link to="/signup" className="btn btn-primary btn-sm">
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
        {mobileMenuOpen && (
          <nav className="mobile-nav" aria-label="Mobile navigation">
            <NavLink to="/" onClick={() => setMobileMenuOpen(false)}>Home</NavLink>
            <NavLink to="/events" onClick={() => setMobileMenuOpen(false)}>Explore Events</NavLink>
            {!isAuthenticated && <NavLink to="/login" onClick={() => setMobileMenuOpen(false)}>Sign In</NavLink>}
            {!isAuthenticated && <NavLink to="/signup" onClick={() => setMobileMenuOpen(false)}>Get Started</NavLink>}
            {isAuthenticated && <Link to={getDashboardPath()} onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>}
            <div className="mobile-nav__utilities">
              <button type="button" onClick={toggleTheme}>
                {isDark ? <Sun size={17} /> : <Moon size={17} />}
                <span>{isDark ? 'Light mode' : 'Dark mode'}</span>
              </button>
              {isAuthenticated && (
                <button type="button" onClick={() => { logout(); navigate('/'); toast.info('Logged out.'); setMobileMenuOpen(false); }}>
                  <LogOut size={17} />
                  <span>Log out</span>
                </button>
              )}
              <button type="button" onClick={() => setResetDialogOpen(true)}>
                <RotateCcw size={16} />
                <span>Reset demo data</span>
              </button>
            </div>
          </nav>
        )}
      </header>

      {/* Demo Reset Confirm Dialog */}
      <ConfirmDialog
        isOpen={resetDialogOpen}
        onClose={() => setResetDialogOpen(false)}
        onConfirm={handleResetData}
        title="Reset Demo Data?"
        message="This will restore all default events, organizers, categories, registrations and demo users to their initial state, and end your active session."
        confirmText="Reset All Data"
        variant="danger"
      />

    </>
  );
}

export function PublicFooter() {
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const toast = useToast();

  const handleResetData = () => {
    resetDemoData();
    toast.success('Demo data restored to initial sample state.');
    setTimeout(() => {
      window.location.href = '/';
    }, 400);
  };

  return (
    <footer
      style={{
        backgroundColor: 'var(--bg-surface)',
        borderTop: '1px solid var(--border-color)',
        padding: '3rem 0 2rem 0',
        marginTop: 'auto',
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '2.5rem',
            marginBottom: '2.5rem',
          }}
        >
          <div>
            <div className="flex items-center gap-2" style={{ marginBottom: '0.75rem' }}>
              <span className="brand-mark" aria-hidden="true">
                <img src="/uselogo.jpg" alt="" className="brand-mark__image" />
              </span>
              <span style={{ fontSize: '1.15rem', fontWeight: 800 }}>Univents</span>
            </div>
            <p className="text-sm text-secondary" style={{ maxWidth: 280, lineHeight: 1.6 }}>
              Centralized campus event discovery, seamless student registrations, and university-wide organizer management.
            </p>
          </div>

          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.85rem' }}>Explore Campus</h4>
            <div className="flex flex-col gap-2 text-sm text-secondary">
              <Link to="/events?category=technical">Technical Workshops</Link>
              <Link to="/events?category=hackathons">Collegiate Hackathons</Link>
              <Link to="/events?category=career">Career & Networking Fairs</Link>
              <Link to="/events?category=cultural">Cultural Galas & Festivals</Link>
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.85rem' }}>Simulated Roles</h4>
            <div className="flex flex-col gap-2 text-sm text-secondary">
              <Link to="/login?role=student">Student Experience</Link>
              <Link to="/login?role=organizer">Organizer Studio</Link>
              <Link to="/login?role=admin">Administrator Review Queue</Link>
              <button
                onClick={() => setResetDialogOpen(true)}
                className="text-left"
                style={{ color: 'var(--error)', fontWeight: 500 }}
              >
                Reset Demo Data
              </button>
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.85rem' }}>Demo Architecture</h4>
            <p className="text-xs text-secondary" style={{ lineHeight: 1.6 }}>
              Powered by React 19, Vite, Context API &amp; versioned browser localStorage. Designed as a modern SaaS portal with zero backend requirements.
            </p>
          </div>
        </div>

        <div
          style={{
            borderTop: '1px solid var(--border-color)',
            paddingTop: '1.5rem',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1rem',
          }}
          className="text-xs text-secondary"
        >
          <span>© 2026 Univents Portal. Built for University Campus Demonstrations.</span>
          <div className="flex gap-4">
            <span>Client-side Mock Portal</span>
            <span>Local Session Mode</span>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={resetDialogOpen}
        onClose={() => setResetDialogOpen(false)}
        onConfirm={handleResetData}
        title="Reset Demo Data?"
        message="This will restore all default events, organizers, categories, registrations and demo users to their initial state, and end your active session."
        confirmText="Reset All Data"
        variant="danger"
      />
    </footer>
  );
}
