import { STORAGE_KEYS, getStoredItem, setStoredItem } from './storageService.js';
import { generateId } from '../utils/formatters.js';
import { notificationService } from './notificationService.js';
import { registrationService } from './registrationService.js';

export const eventService = {
  getEvents() {
    return getStoredItem(STORAGE_KEYS.EVENTS, []);
  },

  getPublishedEvents() {
    return this.getEvents().filter((e) => e.status === 'published' || e.status === 'completed');
  },

  getEventById(id) {
    return this.getEvents().find((e) => e.id === id) || null;
  },

  createEvent(eventData, organizerId) {
    const events = this.getEvents();
    const newEvent = {
      id: generateId('evt'),
      title: eventData.title.trim(),
      shortDescription: eventData.shortDescription?.trim() || '',
      description: eventData.description.trim(),
      categoryId: eventData.categoryId,
      bannerUrl: eventData.bannerUrl || 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&auto=format&fit=crop&q=80',
      startAt: eventData.startAt,
      endAt: eventData.endAt,
      venue: eventData.venue.trim(),
      agenda: eventData.agenda || [],
      organizerId,
      capacity: Number(eventData.capacity) || 100,
      registrationDeadline: eventData.registrationDeadline,
      fee: Number(eventData.fee) || 0,
      tags: Array.isArray(eventData.tags) ? eventData.tags : (eventData.tags || '').split(',').map(t => t.trim()).filter(Boolean),
      status: eventData.status || 'draft', // 'draft' or 'pending'
      rejectionReason: '',
      featured: Boolean(eventData.featured),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    events.push(newEvent);
    setStoredItem(STORAGE_KEYS.EVENTS, events);

    if (newEvent.status === 'pending') {
      notificationService.createNotification({
        recipientId: organizerId,
        title: 'Event Submitted for Review',
        message: `"${newEvent.title}" was submitted to administrators for moderation.`,
        type: 'moderation',
        relatedEventId: newEvent.id,
      });
    }

    return newEvent;
  },

  updateEvent(id, updates, organizerId) {
    const events = this.getEvents();
    const index = events.findIndex((e) => e.id === id);
    if (index === -1) throw new Error('Event not found.');

    const current = events[index];
    if (organizerId && current.organizerId !== organizerId) {
      throw new Error('You do not have permission to edit this event.');
    }

    const updated = {
      ...current,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    // If an organizer resubmits a rejected/draft event to pending
    if (updates.status === 'pending' && current.status !== 'pending') {
      updated.rejectionReason = ''; // Clear prior rejection reason
      notificationService.createNotification({
        recipientId: current.organizerId,
        title: 'Event Resubmitted for Review',
        message: `Your updated submission for "${updated.title}" has been placed in the admin review queue.`,
        type: 'moderation',
        relatedEventId: id,
      });
    }

    events[index] = updated;
    setStoredItem(STORAGE_KEYS.EVENTS, events);
    return updated;
  },

  deleteDraft(id, organizerId) {
    const events = this.getEvents();
    const index = events.findIndex((e) => e.id === id);
    if (index === -1) throw new Error('Event not found.');

    const current = events[index];
    if (organizerId && current.organizerId !== organizerId) {
      throw new Error('Unauthorized.');
    }
    if (current.status !== 'draft') {
      throw new Error('Only draft events can be deleted permanently.');
    }

    events.splice(index, 1);
    setStoredItem(STORAGE_KEYS.EVENTS, events);
  },

  // Admin moderation actions
  approveEvent(id) {
    const events = this.getEvents();
    const index = events.findIndex((e) => e.id === id);
    if (index === -1) throw new Error('Event not found.');

    const current = events[index];
    current.status = 'published';
    current.rejectionReason = '';
    current.updatedAt = new Date().toISOString();

    setStoredItem(STORAGE_KEYS.EVENTS, events);

    // Notify organizer
    notificationService.createNotification({
      recipientId: current.organizerId,
      title: 'Event Approved & Published!',
      message: `Congratulations! "${current.title}" has been approved by campus admins and is now live.`,
      type: 'moderation',
      relatedEventId: id,
    });

    return current;
  },

  rejectEvent(id, reason) {
    if (!reason || !reason.trim()) {
      throw new Error('A rejection reason is required.');
    }

    const events = this.getEvents();
    const index = events.findIndex((e) => e.id === id);
    if (index === -1) throw new Error('Event not found.');

    const current = events[index];
    current.status = 'rejected';
    current.rejectionReason = reason.trim();
    current.updatedAt = new Date().toISOString();

    setStoredItem(STORAGE_KEYS.EVENTS, events);

    // Notify organizer with reason
    notificationService.createNotification({
      recipientId: current.organizerId,
      title: 'Event Submission Needs Revision',
      message: `Your event "${current.title}" was rejected. Reason: ${current.rejectionReason}`,
      type: 'moderation',
      relatedEventId: id,
    });

    return current;
  },

  cancelEventByAdmin(id, reason = 'Cancelled by university administration.') {
    const events = this.getEvents();
    const index = events.findIndex((e) => e.id === id);
    if (index === -1) throw new Error('Event not found.');

    const current = events[index];
    current.status = 'cancelled';
    current.rejectionReason = reason;
    current.updatedAt = new Date().toISOString();

    setStoredItem(STORAGE_KEYS.EVENTS, events);

    // Notify organizer
    notificationService.createNotification({
      recipientId: current.organizerId,
      title: 'Event Cancelled by Administration',
      message: `"${current.title}" has been cancelled by campus administration: ${reason}`,
      type: 'cancellation',
      relatedEventId: id,
    });

    // Notify all registered students!
    const registrations = registrationService.getActiveRegistrationsForEvent(id);
    registrations.forEach((reg) => {
      notificationService.createNotification({
        recipientId: reg.userId,
        title: 'Event Cancelled',
        message: `Notice: "${current.title}" has unfortunately been cancelled. Your registration is refunded/voided.`,
        type: 'cancellation',
        relatedEventId: id,
      });
    });

    return current;
  },
};
