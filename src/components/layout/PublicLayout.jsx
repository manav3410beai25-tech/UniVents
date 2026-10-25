import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { PublicNavbar, PublicFooter } from './PublicNavbar.jsx';
import { MobileBottomNav } from './MobileBottomNav.jsx';

export function PublicLayout() {
  const location = useLocation();
  const isAuthPage = ['/login', '/signup', '/forgot-password'].includes(location.pathname);

  useEffect(() => {
    if (isAuthPage) {
      document.body.classList.add('on-auth-page');
      return () => {
        document.body.classList.remove('on-auth-page');
      };
    }
  }, [isAuthPage]);

  return (
    <div className={`flex flex-col min-h-screen${isAuthPage ? ' is-auth-layout' : ''}`}>
      <PublicNavbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <PublicFooter />
      {!isAuthPage && <MobileBottomNav />}
    </div>
  );
}
