import { useState, useEffect } from 'react';
import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarCheck,
  Bookmark,
  Bell,
  PlusCircle,
  FolderKanban,
  CheckSquare,
  Tags,
  LogOut,
  User,
  Sun,
  Moon,
  RotateCcw,
  Menu,
  ChevronRight,
  Shield,
  Layers,
  GraduationCap,
  Compass
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import { useNotifications } from '../../context/NotificationContext.jsx';
import { resetDemoData } from '../../services/storageService.js';
import { ConfirmDialog } from '../ui/ConfirmDialog.jsx';
import { useToast } from '../ui/Toast.jsx';
import { MobileBottomNav } from './MobileBottomNav.jsx';
import { DEFAULT_AVATAR_PATH, resolveAvatarUrl } from '../../data/avatars.js';

export function DashboardLayout() {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);

  // Close mobile sidebar on Escape key
  useEffect(() => {
    if (!sidebarOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSidebarOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [sidebarOpen]);

  const handleResetData = () => {
    resetDemoData();
    toast.success('Demo data restored to initial sample state.');
    setTimeout(() => {
      window.location.href = import.meta.env.BASE_URL;
    }, 400);
  };

  const role = user?.role || 'student';

  // Role Navigation Links
  const studentNav = [
    { label: 'My Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
    { label: 'Registrations', path: '/student/registrations', icon: CalendarCheck },
    { label: 'Saved Events', path: '/student/saved', icon: Bookmark },
    { label: 'Notifications', path: '/student/notifications', icon: Bell, badge: unreadCount },
  ];

  const organizerNav = [
    { label: 'Organizer Overview', path: '/organizer/dashboard', icon: LayoutDashboard },
    { label: 'My Events', path: '/organizer/events', icon: FolderKanban },
    { label: 'Create New Event', path: '/organizer/events/new', icon: PlusCircle },
  ];

  const adminNav = [
    { label: 'Admin Metrics', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Review Queue', path: '/admin/review', icon: CheckSquare },
    { label: 'All Campus Events', path: '/admin/events', icon: FolderKanban },
    { label: 'Categories', path: '/admin/categories', icon: Tags },
  ];

  const navItems = role === 'admin' ? adminNav : role === 'organizer' ? organizerNav : studentNav;

  const isNavItemActive = (itemPath, currentPath) => {
    if (itemPath === '/organizer/events/new') {
      return currentPath === '/organizer/events/new';
    }
    if (itemPath === '/organizer/events') {
      return (
        currentPath === '/organizer/events' ||
        (currentPath.startsWith('/organizer/events/') && currentPath !== '/organizer/events/new')
      );
    }
    return currentPath === itemPath || currentPath.startsWith(`${itemPath}/`);
  };

  return (
    <div className="dashboard-layout flex min-h-screen" style={{ backgroundColor: 'var(--bg-page)' }}>
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 49,
            backgroundColor: 'rgba(15, 23, 42, 0.5)',
            backdropFilter: 'blur(2px)',
          }}
        />
      )}

      {/* Sidebar Component */}
      <aside
        className={`dashboard-sidebar flex flex-col justify-between ${sidebarOpen ? 'is-open' : ''}`}
        style={{
          width: 'var(--sidebar-width)',
          backgroundColor: 'var(--bg-surface)',
          borderRight: '1px solid var(--border-color)',
          padding: '1.5rem 1rem',
          flexShrink: 0,
          transition: 'transform var(--transition-normal)',
        }}
      >
        <div className="flex flex-col gap-6">
          {/* Logo */}
          <div className="flex items-center px-2">
            <Link to="/" className="flex items-center gap-2" style={{ textDecoration: 'none' }}>
              <span className="brand-mark" aria-hidden="true">
                <img src={`${import.meta.env.BASE_URL}uselogo.jpg`} alt="" className="brand-mark__image" />
              </span>
              <div className="flex flex-col">
                <span style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1 }}>
                  Univents
                </span>
                <span className="text-xs text-secondary" style={{ textTransform: 'capitalize', fontWeight: 600 }}>
                  {role} Portal
                </span>
              </div>
            </Link>
          </div>

          {/* User Profile Mini Banner */}
          <div
            style={{
              padding: '0.85rem',
              backgroundColor: 'var(--bg-subtle)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
            }}
          >
            <img
              src={resolveAvatarUrl(user?.avatarUrl)}
              alt={user?.name || 'User avatar'}
              style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }}
              onError={(e) => {
                if (e.currentTarget.src !== DEFAULT_AVATAR_PATH) {
                  e.currentTarget.src = DEFAULT_AVATAR_PATH;
                }
              }}
            />
            <div style={{ overflow: 'hidden' }}>
              <p style={{ fontWeight: 600, fontSize: '0.875rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user?.name}
              </p>
              <p className="text-xs text-secondary" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user?.department}
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isNavItemActive(item.path, location.pathname);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`dashboard-nav-link${active ? ' is-active' : ''}`}
                  aria-current={active ? 'page' : undefined}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge > 0 && (
                    <span
                      style={{
                        backgroundColor: '#ef4444',
                        color: '#fff',
                        fontSize: '0.725rem',
                        fontWeight: 700,
                        padding: '1px 7px',
                        borderRadius: '999px',
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}

            <div style={{ height: '1px', backgroundColor: 'var(--border-color)', margin: '0.75rem 0' }} />

            <Link
              to="/profile"
              onClick={() => setSidebarOpen(false)}
              className="dashboard-nav-link"
            >
              <div className="flex items-center gap-3">
                <User size={18} />
                <span>Edit Profile</span>
              </div>
            </Link>
          </nav>
        </div>

        {/* Sidebar Footer Controls */}
        <div className="flex flex-col gap-2 pt-4" style={{ borderTop: '1px solid var(--border-color)' }}>
          <div className="flex items-center justify-between px-2">
            <button
              onClick={toggleTheme}
              className="btn btn-ghost btn-sm"
              style={{ padding: '0 0.5rem', gap: '0.5rem' }}
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
              <span className="text-xs">{isDark ? 'Light' : 'Dark'} Mode</span>
            </button>

            <button
              onClick={() => setResetDialogOpen(true)}
              className="btn btn-ghost btn-sm"
              title="Reset Demo Data"
              style={{ color: 'var(--error)', padding: '0 0.5rem' }}
            >
              <RotateCcw size={15} />
            </button>
          </div>

          <button
            onClick={() => {
              logout();
              navigate('/login', { replace: true });
              toast.info('Logged out.');
            }}
            className="btn btn-secondary btn-sm w-full"
            style={{ justifyContent: 'flex-start' }}
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="dashboard-header">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setSidebarOpen(true)}
              className="btn btn-ghost btn-sm"
              id="open-sidebar-btn"
              aria-label="Open sidebar"
              aria-expanded={sidebarOpen}
            >
              <Menu size={20} />
            </button>

            <div className="flex items-center gap-2 text-sm text-secondary min-w-0">
              <Link to="/" className="text-secondary hover:text-primary">Home</Link>
              <ChevronRight size={14} className="flex-shrink-0" />
              <span style={{ textTransform: 'capitalize', color: 'var(--text-main)', fontWeight: 600, whiteSpace: 'nowrap' }}>
                {role} Area
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <Link
              to="/events"
              className="dashboard-explore-btn"
              title="Explore all campus events"
              aria-label="Explore campus events"
            >
              <Compass size={15} strokeWidth={2.2} className="dashboard-explore-btn__icon" />
              <span className="dashboard-explore-btn__label">Explore</span>
            </Link>

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                backgroundColor: 'var(--primary-light)',
                color: 'var(--primary)',
                padding: '0.25rem 0.75rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.75rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              {role === 'admin' ? <Shield size={14} /> : role === 'organizer' ? <Layers size={14} /> : <GraduationCap size={14} />}
              <span>{role}</span>
            </div>
          </div>
        </header>

        {/* Dashboard Page View Container */}
        <main className="dashboard-main">
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            <Outlet />
          </div>
        </main>
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

      <MobileBottomNav />
    </div>
  );
}
