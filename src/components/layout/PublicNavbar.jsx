import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Sun,
  Moon,
  LogOut,
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
      window.location.href = import.meta.env.BASE_URL;
    }, 400);
  };

  return (
    <>
      <header
        className="public-header"
        style={{
          height: 'var(--header-height)',
          position: 'sticky',
          top: 0,
          zIndex: 40,
        }}
      >
        <div className="container h-full flex items-center justify-between public-navbar__inner">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2" style={{ textDecoration: 'none' }}>
            <span className="brand-mark" aria-hidden="true">
              <img src={`${import.meta.env.BASE_URL}uselogo.jpg`} alt="" className="brand-mark__image" />
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
              <span className="text-xs public-nav__reset-label">Reset Demo</span>
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
                    navigate('/', { replace: true });
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
                <button type="button" onClick={() => { logout(); navigate('/', { replace: true }); toast.info('Logged out.'); setMobileMenuOpen(false); }}>
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
  return (
    <footer
      style={{
        backgroundColor: 'var(--bg-surface)',
        borderTop: '1px solid var(--border-color)',
        padding: 'clamp(2rem, 5vw, 3rem) 0 2rem 0',
        marginTop: 'auto',
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))',
            gap: 'clamp(1.5rem, 4vw, 3rem)',
            marginBottom: '2.5rem',
          }}
        >
          {/* Column 1 — UniVents */}
          <div style={{ maxWidth: 320 }}>
            <div className="flex items-center gap-2" style={{ marginBottom: '0.75rem' }}>
              <span className="brand-mark" aria-hidden="true">
                <img src={`${import.meta.env.BASE_URL}uselogo.jpg`} alt="" className="brand-mark__image" />
              </span>
              <span style={{ fontSize: '1.15rem', fontWeight: 800 }}>UniVents</span>
            </div>
            <p className="text-sm text-secondary" style={{ lineHeight: 1.6, marginBottom: '0.35rem' }}>
              One campus. Every event.
            </p>
            <p className="text-sm text-secondary" style={{ lineHeight: 1.6 }}>
              Campus event discovery and management.
            </p>
          </div>

          {/* Column 2 — About & Support */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.85rem' }}>About &amp; Support</h4>
            <div className="flex flex-col gap-2 text-sm text-secondary">
              <Link to="/about">About Us</Link>
              <Link to="/contact">Contact Us</Link>
            </div>
          </div>

          {/* Column 3 — Explore Campus */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.85rem' }}>Explore Campus</h4>
            <div className="flex flex-col gap-2 text-sm text-secondary">
              <Link to="/events">All Campus Events</Link>
              <Link to="/events?category=technical">Technical Workshops</Link>
              <Link to="/events?category=hackathons">Collegiate Hackathons</Link>
              <Link to="/events?category=career">Career &amp; Networking</Link>
              <Link to="/events?category=cultural">Cultural &amp; Arts</Link>
            </div>
          </div>
        </div>

        {/* Bottom Row */}
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
          <span>© 2026 UniVents. All rights reserved.</span>
          <span style={{ opacity: 0.85 }}>Client-side demonstration mode</span>
        </div>
      </div>
    </footer>
  );
}
