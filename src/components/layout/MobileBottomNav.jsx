import { NavLink } from 'react-router-dom';
import { Compass, House, LayoutDashboard, LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

export function MobileBottomNav() {
  const { user, isAuthenticated } = useAuth();
  const dashboardPath = user?.role === 'admin'
    ? '/admin/dashboard'
    : user?.role === 'organizer'
      ? '/organizer/dashboard'
      : '/student/dashboard';
  const dashboardLabel = user?.role === 'admin'
    ? 'Admin Dashboard'
    : user?.role === 'organizer'
      ? 'Organizer Dashboard'
      : 'My Dashboard';

  return (
    <nav className="mobile-bottom-nav" aria-label="Primary mobile navigation">
      <NavLink to="/" end className={({ isActive }) => `mobile-bottom-nav__item${isActive ? ' is-active' : ''}`}>
        <House size={20} strokeWidth={2} />
        <span>Home</span>
      </NavLink>
      <NavLink to="/events" className={({ isActive }) => `mobile-bottom-nav__item${isActive ? ' is-active' : ''}`}>
        <Compass size={20} strokeWidth={2} />
        <span>Explore</span>
      </NavLink>
      {isAuthenticated ? (
        <NavLink to={dashboardPath} className={({ isActive }) => `mobile-bottom-nav__item${isActive ? ' is-active' : ''}`}>
          <LayoutDashboard size={20} strokeWidth={2} />
          <span>{dashboardLabel}</span>
        </NavLink>
      ) : (
        <>
          <NavLink to="/login" className={({ isActive }) => `mobile-bottom-nav__item${isActive ? ' is-active' : ''}`}>
            <LogIn size={20} strokeWidth={2} />
            <span>Sign In</span>
          </NavLink>
          <NavLink to="/signup" className={({ isActive }) => `mobile-bottom-nav__item${isActive ? ' is-active' : ''}`}>
            <UserPlus size={20} strokeWidth={2} />
            <span>Get Started</span>
          </NavLink>
        </>
      )}
    </nav>
  );
}
