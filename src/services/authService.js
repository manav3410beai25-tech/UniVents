import { STORAGE_KEYS, getStoredItem, setStoredItem } from './storageService.js';
import { generateId } from '../utils/formatters.js';
import { DEMO_ACCOUNTS } from '../data/demoAccounts.js';
import { DEFAULT_AVATAR_PATH } from '../data/avatars.js';

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
    const normalizedEmail = email.trim().toLowerCase();
    const demoAccount = DEMO_ACCOUNTS.find((account) => account.email.toLowerCase() === normalizedEmail);

    // Demo accounts are canonical. Reconcile their seeded record when saved browser data is stale.
    if (demoAccount) {
      const accountIndex = users.findIndex((storedUser) =>
        storedUser.id === demoAccount.id || storedUser.email?.toLowerCase() === normalizedEmail
      );
      const existingAccount = accountIndex >= 0 ? users[accountIndex] : null;
      if (password !== demoAccount.password && password !== existingAccount?.password) {
        throw new Error('Invalid email or password. Please check your credentials or pick a demo account.');
      }
      const sessionUser = {
        ...existingAccount,
        id: existingAccount?.id || demoAccount.id,
        name: demoAccount.name,
        email: demoAccount.email,
        password,
        role: demoAccount.role,
        department: demoAccount.department,
        avatarUrl: demoAccount.avatarUrl,
        interests: existingAccount?.interests || demoAccount.interests,
        createdAt: existingAccount?.createdAt || new Date().toISOString(),
      };

      if (accountIndex >= 0) users[accountIndex] = sessionUser;
      else users.push(sessionUser);
      setStoredItem(STORAGE_KEYS.USERS, users);

      const sessionData = {
        id: sessionUser.id,
        name: sessionUser.name,
        email: sessionUser.email,
        role: sessionUser.role,
        department: sessionUser.department,
        avatarUrl: sessionUser.avatarUrl,
        interests: sessionUser.interests,
      };
      this.setCurrentSession(sessionData);
      return sessionData;
    }

    const user = users.find(
      (u) => u.email?.toLowerCase() === normalizedEmail && u.password === password
    );
    if (!user) {
      throw new Error('Invalid email or password. Please check your credentials or pick a demo account.');
    }
    const sessionUser = user;
    const sessionData = {
      id: sessionUser.id,
      name: sessionUser.name,
      email: sessionUser.email,
      role: sessionUser.role,
      department: sessionUser.department,
      avatarUrl: sessionUser.avatarUrl,
      interests: sessionUser.interests || [],
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
      avatarUrl: DEFAULT_AVATAR_PATH,
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
    let index = users.findIndex((u) => u.id === userId);
    if (index === -1) {
      const demoAccount = DEMO_ACCOUNTS.find((a) => a.id === userId);
      if (demoAccount) {
        const seededUser = {
          ...demoAccount,
          ...updates,
          createdAt: new Date().toISOString(),
        };
        users.push(seededUser);
        index = users.length - 1;
      } else {
        throw new Error('User not found');
      }
    } else {
      users[index] = { ...users[index], ...updates };
    }

    setStoredItem(STORAGE_KEYS.USERS, users);
    const updatedUser = users[index];

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
    const index = users.findIndex((u) => u.email?.toLowerCase() === normalizedEmail);
    if (index === -1) {
      const demoAccount = DEMO_ACCOUNTS.find((a) => a.email.toLowerCase() === normalizedEmail);
      if (demoAccount) {
        const newUser = {
          id: demoAccount.id,
          name: demoAccount.name,
          email: demoAccount.email,
          password: newPassword,
          role: demoAccount.role,
          department: demoAccount.department,
          avatarUrl: demoAccount.avatarUrl,
          interests: demoAccount.interests,
          createdAt: new Date().toISOString(),
        };
        users.push(newUser);
        setStoredItem(STORAGE_KEYS.USERS, users);
        return true;
      }
      throw new Error('No account found with this email address.');
    }
    users[index].password = newPassword;
    setStoredItem(STORAGE_KEYS.USERS, users);
    return true;
  },
};
