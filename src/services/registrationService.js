import { STORAGE_KEYS, getStoredItem, setStoredItem } from './storageService.js';
import { generateId, generateConfirmationCode } from '../utils/formatters.js';
import { notificationService } from './notificationService.js';

export const registrationService = {
  getRegistrations() {
    return getStoredItem(STORAGE_KEYS.REGISTRATIONS, []);
  },

  getRegistrationsForEvent(eventId) {
    return this.getRegistrations().filter((r) => r.eventId === eventId);
  },

  getActiveRegistrationsForEvent(eventId) {
    return this.getRegistrations().filter(
      (r) => r.eventId === eventId && (r.status === 'confirmed' || r.status === 'attended')
    );
  },

  getUserRegistrations(userId) {
    if (!userId) return [];
    return this.getRegistrations().filter((r) => r.userId === userId);
  },

  register(eventId, user, event) {
    if (!user) throw new Error('You must be logged in to register.');
    if (user.role !== 'student') throw new Error('Only students can register for campus events.');

    if (event.status !== 'published') {
      throw new Error('This event is not currently accepting registrations.');
    }

    if (event.startAt && new Date(event.startAt).getTime() < Date.now()) {
      throw new Error('This event has already started or completed.');
    }

    if (event.registrationDeadline && new Date(event.registrationDeadline).getTime() < Date.now()) {
      throw new Error('The registration deadline for this event has passed.');
    }

    const currentRegistrations = this.getRegistrations();
    const existingActive = currentRegistrations.find(
      (r) => r.eventId === eventId && r.userId === user.id && (r.status === 'confirmed' || r.status === 'attended')
    );
    if (existingActive) {
      throw new Error('You are already registered for this event.');
    }

    const activeCount = currentRegistrations.filter(
      (r) => r.eventId === eventId && (r.status === 'confirmed' || r.status === 'attended')
    ).length;

    if (event.capacity && activeCount >= event.capacity) {
      throw new Error('This event is fully booked. No seats remaining.');
    }

    const confirmationCode = generateConfirmationCode();
    const newReg = {
      id: generateId('reg'),
      eventId,
      userId: user.id,
      registeredAt: new Date().toISOString(),
      confirmationCode,
      status: 'confirmed',
      checkedInAt: null,
    };

    currentRegistrations.push(newReg);
    setStoredItem(STORAGE_KEYS.REGISTRATIONS, currentRegistrations);

    // Create confirmation in-app notification for the student
    notificationService.createNotification({
      recipientId: user.id,
      title: 'Registration Confirmed!',
      message: `You're registered for "${event.title}". Your confirmation code is ${confirmationCode}.`,
      type: 'registration',
      relatedEventId: eventId,
    });

    return newReg;
  },

  cancelRegistration(registrationId, user, eventTitle) {
    const currentRegistrations = this.getRegistrations();
    const index = currentRegistrations.findIndex((r) => r.id === registrationId);
    if (index === -1) throw new Error('Registration record not found.');

    const reg = currentRegistrations[index];
    if (reg.userId !== user.id) {
      throw new Error('You are not authorized to cancel this registration.');
    }

    currentRegistrations[index].status = 'cancelled';
    setStoredItem(STORAGE_KEYS.REGISTRATIONS, currentRegistrations);

    notificationService.createNotification({
      recipientId: user.id,
      title: 'Registration Cancelled',
      message: `Your registration for "${eventTitle || 'the event'}" has been cancelled.`,
      type: 'cancellation',
      relatedEventId: reg.eventId,
    });

    return currentRegistrations[index];
  },

  updateAttendance(registrationId, attended = true) {
    const currentRegistrations = this.getRegistrations();
    const index = currentRegistrations.findIndex((r) => r.id === registrationId);
    if (index === -1) throw new Error('Registration record not found.');

    const reg = currentRegistrations[index];
    if (attended) {
      reg.status = 'attended';
      reg.checkedInAt = new Date().toISOString();

      // Notify attendee that their attendance is verified
      notificationService.createNotification({
        recipientId: reg.userId,
        title: 'Attendance Checked In',
        message: 'Your attendance has been confirmed by the organizer. Certificate is now available!',
        type: 'attendance',
        relatedEventId: reg.eventId,
      });
    } else {
      reg.status = 'confirmed';
      reg.checkedInAt = null;
    }

    setStoredItem(STORAGE_KEYS.REGISTRATIONS, currentRegistrations);
    return reg;
  },

  // Saved Events management
  getSavedEvents() {
    return getStoredItem(STORAGE_KEYS.SAVED_EVENTS, []);
  },

  getUserSavedEventIds(userId) {
    if (!userId) return [];
    return this.getSavedEvents()
      .filter((s) => s.userId === userId)
      .map((s) => s.eventId);
  },

  toggleSaveEvent(userId, eventId) {
    if (!userId) throw new Error('Please login to save events.');
    const saved = this.getSavedEvents();
    const existingIndex = saved.findIndex((s) => s.userId === userId && s.eventId === eventId);

    if (existingIndex !== -1) {
      saved.splice(existingIndex, 1);
      setStoredItem(STORAGE_KEYS.SAVED_EVENTS, saved);
      return false; // Not saved anymore
    } else {
      saved.push({
        id: generateId('save'),
        userId,
        eventId,
        savedAt: new Date().toISOString(),
      });
      setStoredItem(STORAGE_KEYS.SAVED_EVENTS, saved);
      return true; // Now saved
    }
  },
};
