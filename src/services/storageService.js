import {
  SEED_USERS,
  SEED_CATEGORIES,
  SEED_EVENTS,
  SEED_REGISTRATIONS,
  SEED_SAVED_EVENTS,
  SEED_NOTIFICATIONS,
} from '../data/seed.js';

export const STORAGE_KEYS = {
  USERS: 'univents:v1:users',
  EVENTS: 'univents:v1:events',
  REGISTRATIONS: 'univents:v1:registrations',
  SAVED_EVENTS: 'univents:v1:savedEvents',
  NOTIFICATIONS: 'univents:v1:notifications',
  CATEGORIES: 'univents:v1:categories',
  SESSION: 'univents:v1:session',
  PREFERENCES: 'univents:v1:preferences',
};

// Safe JSON Parse with fallback
function safeParse(item, fallback) {
  if (!item) return fallback;
  try {
    return JSON.parse(item);
  } catch (err) {
    console.error('Storage parse error for item:', item, err);
    return fallback;
  }
}

// Initialize seed data if not present
export function initStorage() {
  if (typeof window === 'undefined') return;

  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(SEED_USERS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.CATEGORIES)) {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(SEED_CATEGORIES));
  }
  if (!localStorage.getItem(STORAGE_KEYS.EVENTS)) {
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(SEED_EVENTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.REGISTRATIONS)) {
    localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(SEED_REGISTRATIONS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.SAVED_EVENTS)) {
    localStorage.setItem(STORAGE_KEYS.SAVED_EVENTS, JSON.stringify(SEED_SAVED_EVENTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(SEED_NOTIFICATIONS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.PREFERENCES)) {
    localStorage.setItem(
      STORAGE_KEYS.PREFERENCES,
      JSON.stringify({ theme: 'light', compactView: false })
    );
  }
}

// Reset everything back to initial seed dataset & clear active session
export function resetDemoData() {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(SEED_USERS));
  localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(SEED_CATEGORIES));
  localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(SEED_EVENTS));
  localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(SEED_REGISTRATIONS));
  localStorage.setItem(STORAGE_KEYS.SAVED_EVENTS, JSON.stringify(SEED_SAVED_EVENTS));
  localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(SEED_NOTIFICATIONS));
  localStorage.removeItem(STORAGE_KEYS.SESSION);
}

// Generic Storage Get & Set
export function getStoredItem(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return safeParse(raw, fallback);
  } catch (e) {
    console.error(`Error reading ${key} from storage:`, e);
    return fallback;
  }
}

export function setStoredItem(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error writing ${key} to storage:`, e);
  }
}
