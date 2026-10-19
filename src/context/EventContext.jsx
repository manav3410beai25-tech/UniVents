import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { eventService } from '../services/eventService.js';
import { categoryService } from '../services/categoryService.js';
import { registrationService } from '../services/registrationService.js';
import { useAuth } from './AuthContext.jsx';
import { useNotifications } from './NotificationContext.jsx';

const EventContext = createContext(null);

export function EventProvider({ children }) {
  const { user } = useAuth();
  const { refreshNotifications } = useNotifications();
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [savedEventIds, setSavedEventIds] = useState([]);

  const refreshAll = useCallback(() => {
    setEvents(eventService.getEvents());
    setCategories(categoryService.getCategories());
    setRegistrations(registrationService.getRegistrations());
    if (user?.id) {
      setSavedEventIds(registrationService.getUserSavedEventIds(user.id));
    } else {
      setSavedEventIds([]);
    }
  }, [user?.id]);

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  // Event Mutations
  const createEvent = (data) => {
    const newEvent = eventService.createEvent(data, user?.id);
    refreshAll();
    refreshNotifications();
    return newEvent;
  };

  const updateEvent = (id, updates) => {
    const updated = eventService.updateEvent(id, updates, user?.role === 'admin' ? undefined : user?.id);
    refreshAll();
    refreshNotifications();
    return updated;
  };

  const deleteDraft = (id) => {
    eventService.deleteDraft(id, user?.id);
    refreshAll();
  };

  const approveEvent = (id) => {
    const res = eventService.approveEvent(id);
    refreshAll();
    refreshNotifications();
    return res;
  };

  const rejectEvent = (id, reason) => {
    const res = eventService.rejectEvent(id, reason);
    refreshAll();
    refreshNotifications();
    return res;
  };

  const cancelEventByAdmin = (id, reason) => {
    const res = eventService.cancelEventByAdmin(id, reason);
    refreshAll();
    refreshNotifications();
    return res;
  };

  // Registration Mutations
  const registerForEvent = (eventId) => {
    const targetEvent = eventService.getEventById(eventId);
    if (!targetEvent) throw new Error('Event not found');
    const reg = registrationService.register(eventId, user, targetEvent);
    refreshAll();
    refreshNotifications();
    return reg;
  };

  const cancelRegistration = (registrationId, eventTitle) => {
    const res = registrationService.cancelRegistration(registrationId, user, eventTitle);
    refreshAll();
    refreshNotifications();
    return res;
  };

  const updateAttendance = (registrationId, attended) => {
    const res = registrationService.updateAttendance(registrationId, attended);
    refreshAll();
    refreshNotifications();
    return res;
  };

  const toggleSaveEvent = (eventId) => {
    const isSaved = registrationService.toggleSaveEvent(user?.id, eventId);
    refreshAll();
    return isSaved;
  };

  // Helper functions
  const getEventRegistrations = (eventId) => {
    return registrations.filter((r) => r.eventId === eventId);
  };

  const getEventCapacityStats = (event) => {
    const active = registrations.filter(
      (r) => r.eventId === event.id && (r.status === 'confirmed' || r.status === 'attended')
    );
    const count = active.length;
    const capacity = event.capacity || 100;
    const remaining = Math.max(0, capacity - count);
    const isFull = remaining === 0;
    const percentage = Math.min(100, Math.round((count / capacity) * 100));

    return { count, capacity, remaining, isFull, percentage };
  };

  return (
    <EventContext.Provider
      value={{
        events,
        categories,
        registrations,
        savedEventIds,
        refreshAll,
        createEvent,
        updateEvent,
        deleteDraft,
        approveEvent,
        rejectEvent,
        cancelEventByAdmin,
        registerForEvent,
        cancelRegistration,
        updateAttendance,
        toggleSaveEvent,
        getEventRegistrations,
        getEventCapacityStats,
      }}
    >
      {children}
    </EventContext.Provider>
  );
}

export function useEvents() {
  const ctx = useContext(EventContext);
  if (!ctx) throw new Error('useEvents must be used within EventProvider');
  return ctx;
}
