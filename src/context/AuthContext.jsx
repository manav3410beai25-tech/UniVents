import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService.js';
import { DEMO_ACCOUNTS } from '../data/demoAccounts.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => authService.getCurrentSession());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === 'univents:v1:session') {
        setUser(authService.getCurrentSession());
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const sessionUser = authService.login(email, password);
      setUser(sessionUser);
      return sessionUser;
    } finally {
      setLoading(false);
    }
  };

  const loginAsDemo = async (role) => {
    const account = DEMO_ACCOUNTS.find((a) => a.role === role);
    if (!account) throw new Error(`Demo account for ${role} not found.`);
    return login(account.email, account.password);
  };

  const signup = async (userData) => {
    setLoading(true);
    try {
      const sessionUser = authService.signup(userData);
      setUser(sessionUser);
      return sessionUser;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.clearSession();
    setUser(null);
  };

  const updateProfile = (updates) => {
    if (!user) return;
    const updated = authService.updateProfile(user.id, updates);
    setUser(updated);
    return updated;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        role: user?.role || null,
        login,
        loginAsDemo,
        signup,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
