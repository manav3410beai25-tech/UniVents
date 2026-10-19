import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext.jsx';
import { notificationService } from '../services/notificationService.js';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);

  const refreshNotifications = useCallback(() => {
    if (user?.id) {
      setNotifications(notificationService.getUserNotifications(user.id));
    } else {
      setNotifications([]);
    }
  }, [user?.id]);

  useEffect(() => {
    refreshNotifications();
  }, [refreshNotifications]);

  const markAsRead = (id) => {
    notificationService.markAsRead(id);
    refreshNotifications();
  };

  const markAllAsRead = () => {
    if (user?.id) {
      notificationService.markAllAsRead(user.id);
      refreshNotifications();
    }
  };

  const unreadCount = notifications.filter((n) => !n.readAt).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        refreshNotifications,
        markAsRead,
        markAllAsRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider');
  return ctx;
}
