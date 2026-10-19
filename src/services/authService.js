import { STORAGE_KEYS, getStoredItem, setStoredItem } from './storageService.js';
import { generateId } from '../utils/formatters.js';

export const authService = {
  getUsers() {
    return getStoredItem(STORAGE_KEYS.USERS, []);
  },

  getCurrentSession() {
    return getStoredItem(STORAGE_KEYS.SESSION, null);
  },

  setCurrentSession(user) {
    setStoredItem(STORAGE_KEYS.SESSION, user);
  },

  clearSession() {
    localStorage.removeItem(STORAGE_KEYS.SESSION);
  },

  login(email, password) {
    const users = this.getUsers();
    const user = users.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
    );
    if (!user) {
      throw new Error('Invalid email or password. Please check your credentials or pick a demo account.');
    }
    const sessionData = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      avatarUrl: user.avatarUrl,
      interests: user.interests || [],
    };
    this.setCurrentSession(sessionData);
    return sessionData;
  },

  signup({ name, email, department, password, interests = [] }) {
    const users = this.getUsers();
    const normalizedEmail = email.trim().toLowerCase();

    if (users.some((u) => u.email.toLowerCase() === normalizedEmail)) {
      throw new Error('An account with this email already exists.');
    }

    const newUser = {
      id: generateId('user_student'),
      name: name.trim(),
      email: normalizedEmail,
      password,
      role: 'student', // Public signup strictly restricted to Student role per spec
      department: department?.trim() || 'General Studies',
      avatarUrl: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
      interests,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    setStoredItem(STORAGE_KEYS.USERS, users);

    const sessionData = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      department: newUser.department,
      avatarUrl: newUser.avatarUrl,
      interests: newUser.interests,
    };
    this.setCurrentSession(sessionData);
    return sessionData;
  },

  updateProfile(userId, updates) {
    const users = this.getUsers();
    const index = users.findIndex((u) => u.id === userId);
    if (index === -1) throw new Error('User not found');

    const updatedUser = { ...users[index], ...updates };
    users[index] = updatedUser;
    setStoredItem(STORAGE_KEYS.USERS, users);

    const currentSession = this.getCurrentSession();
    if (currentSession && currentSession.id === userId) {
      const newSession = {
        ...currentSession,
        name: updatedUser.name,
        department: updatedUser.department,
        avatarUrl: updatedUser.avatarUrl,
        interests: updatedUser.interests,
      };
      this.setCurrentSession(newSession);
      return newSession;
    }
    return updatedUser;
  },

  simulateResetPassword(email, newPassword) {
    const users = this.getUsers();
    const normalizedEmail = email.trim().toLowerCase();
    const index = users.findIndex((u) => u.email.toLowerCase() === normalizedEmail);
    if (index === -1) {
      throw new Error('No account found with this email address.');
    }
    users[index].password = newPassword;
    setStoredItem(STORAGE_KEYS.USERS, users);
    return true;
  },
};
