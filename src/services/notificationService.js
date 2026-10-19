import { STORAGE_KEYS, getStoredItem, setStoredItem } from './storageService.js';
import { generateId } from '../utils/formatters.js';

export const notificationService = {
  getNotifications() {
    return getStoredItem(STORAGE_KEYS.NOTIFICATIONS, []);
  },

  getUserNotifications(userId) {
    if (!userId) return [];
    return this.getNotifications()
      .filter((n) => n.recipientId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  createNotification({ recipientId, title, message, type = 'general', relatedEventId = null }) {
    const notifications = this.getNotifications();
    const newNotif = {
      id: generateId('notif'),
      recipientId,
      title,
      message,
      type, // 'registration' | 'attendance' | 'moderation' | 'cancellation' | 'general'
      relatedEventId,
      createdAt: new Date().toISOString(),
      readAt: null,
    };
    notifications.unshift(newNotif);
    setStoredItem(STORAGE_KEYS.NOTIFICATIONS, notifications);
    return newNotif;
  },

  markAsRead(notificationId) {
    const notifications = this.getNotifications();
    const index = notifications.findIndex((n) => n.id === notificationId);
    if (index !== -1) {
      notifications[index].readAt = new Date().toISOString();
      setStoredItem(STORAGE_KEYS.NOTIFICATIONS, notifications);
    }
  },

  markAllAsRead(userId) {
    const notifications = this.getNotifications();
    const now = new Date().toISOString();
    notifications.forEach((n) => {
      if (n.recipientId === userId && !n.readAt) {
        n.readAt = now;
      }
    });
    setStoredItem(STORAGE_KEYS.NOTIFICATIONS, notifications);
  },
};
