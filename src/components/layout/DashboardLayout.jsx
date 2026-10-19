import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
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
  Sparkles,
  Menu,
  X,
  ChevronRight,
  Shield,
  Layers,
  GraduationCap
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import { useNotifications } from '../../context/NotificationContext.jsx';
import { resetDemoData } from '../../services/storageService.js';
import { ConfirmDialog } from '../ui/ConfirmDialog.jsx';
import { useToast } from '../ui/Toast.jsx';
import { MobileBottomNav } from './MobileBottomNav.jsx';

export function DashboardLayout() {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();
  const toast = useToast();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);

  const handleResetData = () => {
    resetDemoData();
    toast.success('Demo data restored to initial sample state.');
    setTimeout(() => {
      window.location.href = '/';
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
          <div className="flex items-center justify-between px-2">
            <Link to="/" className="flex items-center gap-2" style={{ textDecoration: 'none' }}>
              <span className="brand-mark" aria-hidden="true">
                <img src="/uselogo.jpg" alt="" className="brand-mark__image" />
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

            <button
              onClick={() => setSidebarOpen(false)}
              className="btn btn-ghost btn-sm"
              style={{ display: 'none' }}
              id="close-sidebar-btn"
            >
              <X size={18} />
            </button>
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
              src={user?.avatarUrl}
              alt={user?.name}
              style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }}
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
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center justify-between text-sm font-medium px-3 py-2.5 rounded-md transition-all ${
                      isActive
                        ? 'bg-primary text-white shadow-xs'
                        : 'text-secondary hover:bg-surface-hover'
                    }`
                  }
                  style={({ isActive }) => ({
                    backgroundColor: isActive ? 'var(--primary)' : 'transparent',
                    color: isActive ? '#ffffff' : 'var(--text-secondary)',
                    borderRadius: 'var(--radius-md)',
                  })}
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
                </NavLink>
              );
            })}

            <div style={{ height: '1px', backgroundColor: 'var(--border-color)', margin: '0.75rem 0' }} />

            <Link
              to="/profile"
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-3 text-sm font-medium px-3 py-2.5 text-secondary hover:bg-surface-hover"
              style={{ borderRadius: 'var(--radius-md)', color: 'var(--text-secondary)' }}
            >
              <User size={18} />
              <span>Edit Profile</span>
            </Link>

            <Link
              to="/events"
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-3 text-sm font-medium px-3 py-2.5 text-secondary hover:bg-surface-hover"
              style={{ borderRadius: 'var(--radius-md)', color: 'var(--text-secondary)' }}
            >
              <Sparkles size={18} />
              <span>Public Directory</span>
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
              navigate('/login');
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
        <header
          style={{
            height: 'var(--header-height)',
            backgroundColor: 'var(--bg-surface)',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 1.5rem',
            position: 'sticky',
            top: 0,
            zIndex: 30,
          }}
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="btn btn-ghost btn-sm"
              id="open-sidebar-btn"
              style={{ display: 'none' }}
              aria-label="Open sidebar"
            >
              <Menu size={20} />
            </button>

            <div className="flex items-center gap-2 text-sm text-secondary">
              <Link to="/" className="text-secondary">Home</Link>
              <ChevronRight size={14} />
              <span style={{ textTransform: 'capitalize', color: 'var(--text-main)', fontWeight: 600 }}>
                {role} Area
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/events" className="btn btn-secondary btn-sm">
              Explore Events
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
        <main style={{ padding: '2rem 1.5rem', flex: 1 }}>
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

      <style>{`
        @media (max-width: 768px) {
          #open-sidebar-btn { display: inline-flex !important; }
          #close-sidebar-btn { display: inline-flex !important; }
        }
      `}</style>
    </div>
  );
}
