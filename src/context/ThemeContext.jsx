import React, { createContext, useContext, useEffect, useState } from 'react';
import { STORAGE_KEYS, getStoredItem, setStoredItem } from '../services/storageService.js';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const prefs = getStoredItem(STORAGE_KEYS.PREFERENCES, { theme: 'light' });
    return prefs?.theme || 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    const prefs = getStoredItem(STORAGE_KEYS.PREFERENCES, {});
    setStoredItem(STORAGE_KEYS.PREFERENCES, { ...prefs, theme });
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDark: theme === 'dark' }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
