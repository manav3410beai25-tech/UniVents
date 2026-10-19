import React from 'react';
import { ThemeProvider } from '../context/ThemeContext.jsx';
import { ToastProvider } from '../components/ui/Toast.jsx';
import { AuthProvider } from '../context/AuthContext.jsx';
import { NotificationProvider } from '../context/NotificationContext.jsx';
import { EventProvider } from '../context/EventContext.jsx';

export function AppProviders({ children }) {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <NotificationProvider>
            <EventProvider>
              {children}
            </EventProvider>
          </NotificationProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
