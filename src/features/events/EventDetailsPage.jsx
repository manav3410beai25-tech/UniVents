import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  Share2,
  Bookmark,
  BookmarkCheck,
  Tag,
  ArrowLeft,
  Users,
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import { useEvents } from '../../context/EventContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../components/ui/Toast.jsx';
import { formatDateTime, formatDateOnly, formatTimeOnly } from '../../utils/dates.js';
import { EventStatusBadge, Badge } from '../../components/ui/Badge.jsx';
import { RegistrationPanel } from './components/RegistrationPanel.jsx';
import { Button } from '../../components/ui/Button.jsx';

export function EventDetailsPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { events, categories, savedEventIds, toggleSaveEvent } = useEvents();
  const { user } = useAuth();
  const toast = useToast();

  const event = events.find((e) => e.id === eventId);

  // If event not found or is a private draft/pending/rejected (and not admin or owner)
  if (!event) {
    return (
      <div className="container text-center" style={{ padding: '6rem 1rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>Event Not Found</h2>
        <p className="text-secondary text-sm" style={{ marginBottom: '1.5rem' }}>
          This event may have been removed or does not exist.
        </p>
        <Link to="/events">
          <Button variant="primary">Back to Event Directory</Button>
        </Link>
      </div>
    );
  }

  // Role check: unpublished events cannot be opened through public routes unless organizer or admin
  const isOwner = user?.id === event.organizerId;
  const isAdmin = user?.role === 'admin';
  const isPubliclyVisible = event.status === 'published' || event.status === 'completed';

  if (!isPubliclyVisible && !isOwner && !isAdmin) {
    return (
      <div className="container text-center" style={{ padding: '6rem 1rem' }}>
        <div style={{ color: 'var(--warning)', display: 'inline-flex', marginBottom: '1rem' }}>
          <ShieldAlert size={40} />
        </div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>
          Unpublished Event
        </h2>
        <p className="text-secondary text-sm" style={{ marginBottom: '1.5rem', maxWidth: '440px', margin: '0 auto 1.5rem auto' }}>
          This event is currently in <strong>{event.status}</strong> status and is undergoing organizer editing or administrative review.
        </p>
        <Link to="/events">
          <Button variant="primary">Return to Explore Events</Button>
        </Link>
      </div>
    );
  }

  const category = categories.find((c) => c.id === event.categoryId);
  const isSaved = savedEventIds.includes(event.id);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Event link copied to clipboard!');
  };

  const handleToggleSave = () => {
    if (!user) {
      navigate(`/login?redirect=${encodeURIComponent(`/events/${event.id}`)}`);
      return;
    }
    const saved = toggleSaveEvent(event.id);
    if (saved) {
      toast.success('Event bookmarked to your Saved Events!');
    } else {
      toast.info('Removed from saved events.');
    }
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1rem 5rem 1rem' }}>
      {/* Back button link */}
      <div style={{ marginBottom: '1.5rem' }}>
        <Link to="/events" className="flex items-center gap-2 text-sm text-secondary hover:text-primary">
          <ArrowLeft size={16} />
          <span>Back to Explore Events</span>
        </Link>
      </div>

      {/* Hero Banner Header */}
      <div
        className="card"
        style={{
          padding: 0,
          overflow: 'hidden',
          marginBottom: '2.5rem',
          position: 'relative',
        }}
      >
        <div style={{ position: 'relative', height: '360px', backgroundColor: '#0f172a' }}>
          <img
            src={event.bannerUrl}
            alt={event.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.2) 0%, rgba(15, 23, 42, 0.85) 100%)',
            }}
          />

          {/* Banner Overlays */}
          <div
            style={{
              position: 'absolute',
              bottom: '1.75rem',
              left: '2rem',
              right: '2rem',
              color: '#ffffff',
            }}
          >
            <div className="flex items-center gap-2" style={{ marginBottom: '0.75rem' }}>
              {category && (
                <span
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(4px)',
                    padding: '4px 12px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                  }}
                >
                  {category.name}
                </span>
              )}
              <EventStatusBadge status={event.status} />
            </div>

            <h1
              style={{
                fontSize: 'clamp(1.5rem, 3.5vw, 2.5rem)',
                fontWeight: 800,
                lineHeight: 1.2,
                color: '#ffffff',
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.4)',
              }}
            >
              {event.title}
            </h1>
          </div>
        </div>

        {/* Action bar below banner */}
        <div
          className="flex items-center justify-between flex-wrap gap-3"
          style={{ padding: '1rem 2rem', backgroundColor: 'var(--bg-surface)' }}
        >
          <div className="flex items-center gap-6 text-sm text-secondary">
            <div className="flex items-center gap-2">
              <Calendar size={16} color="var(--primary)" />
              <span>{formatDateOnly(event.startAt)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} color="var(--primary)" />
              <span>{formatTimeOnly(event.startAt)} - {formatTimeOnly(event.endAt)}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={16} color="var(--primary)" />
              <span>{event.venue}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              icon={isSaved ? BookmarkCheck : Bookmark}
              onClick={handleToggleSave}
            >
              {isSaved ? 'Saved' : 'Save Event'}
            </Button>
            <Button variant="secondary" size="sm" icon={Share2} onClick={handleCopyLink}>
              Share
            </Button>
          </div>
        </div>
      </div>

      {/* Main 2-Column Content Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) 340px',
          gap: '2.5rem',
          alignItems: 'start',
        }}
      >
        {/* Left Column: Details, Agenda, Tags */}
        <div className="flex flex-col gap-6">
          <div className="card">
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>
              About This Event
            </h2>
            <p
              style={{
                color: 'var(--text-secondary)',
                lineHeight: 1.7,
                fontSize: '0.95rem',
                whiteSpace: 'pre-line',
              }}
            >
              {event.description}
            </p>
          </div>

          {/* Agenda Section */}
          {event.agenda && event.agenda.length > 0 && (
            <div className="card">
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem' }}>
                Schedule &amp; Agenda
              </h2>
              <div className="flex flex-col gap-3">
                {event.agenda.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '1rem',
                      padding: '0.75rem',
                      backgroundColor: 'var(--bg-subtle)',
                      borderRadius: 'var(--radius-md)',
                    }}
                  >
                    <span
                      style={{
                        padding: '0.2rem 0.5rem',
                        backgroundColor: 'var(--primary-light)',
                        color: 'var(--primary)',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {item.time}
                    </span>
                    <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{item.title}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {event.tags && event.tags.length > 0 && (
            <div className="card">
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem' }}>
                Topic Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {event.tags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      padding: '0.25rem 0.75rem',
                      backgroundColor: 'var(--bg-surface-hover)',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.8rem',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Registration & Seat Management Panel */}
        <div>
          <RegistrationPanel event={event} />
        </div>
      </div>
    </div>
  );
}
