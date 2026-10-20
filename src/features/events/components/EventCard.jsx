import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, Bookmark, BookmarkCheck, ArrowRight } from 'lucide-react';
import { formatDateOnly, formatTimeOnly } from '../../../utils/dates.js';
import { formatCurrency } from '../../../utils/formatters.js';
import { EventStatusBadge, Badge } from '../../../components/ui/Badge.jsx';
import { useEvents } from '../../../context/EventContext.jsx';
import { useAuth } from '../../../context/AuthContext.jsx';

export function EventCard({ event, showStatus = false }) {
  const { categories, savedEventIds, toggleSaveEvent, getEventCapacityStats } = useEvents();
  const { user } = useAuth();

  const category = categories.find((c) => c.id === event.categoryId);
  const isSaved = savedEventIds.includes(event.id);
  const { count, capacity, remaining, isFull } = getEventCapacityStats(event);

  const handleBookmark = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      window.location.href = `${import.meta.env.BASE_URL}login?redirect=${encodeURIComponent(`/events/${event.id}`)}`;
      return;
    }
    toggleSaveEvent(event.id);
  };

  return (
    <div
      className="card flex flex-col"
      style={{
        padding: 0,
        overflow: 'hidden',
        height: '100%',
        position: 'relative',
        display: 'flex',
      }}
    >
      {/* Banner with 16:9 ratio */}
      <div style={{ position: 'relative', paddingTop: '56.25%', backgroundColor: '#1e293b' }}>
        <img
          src={event.bannerUrl}
          alt={event.title}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
          loading="lazy"
        />

        {/* Category Badge overlay */}
        <div style={{ position: 'absolute', top: 12, left: 12, zIndex: 2 }}>
          {category && (
            <span
              style={{
                backgroundColor: 'rgba(15, 23, 42, 0.75)',
                backdropFilter: 'blur(4px)',
                color: '#fff',
                padding: '4px 10px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.75rem',
                fontWeight: 600,
              }}
            >
              {category.name}
            </span>
          )}
        </div>

        {/* Save Event bookmark button */}
        <button
          onClick={handleBookmark}
          aria-label={isSaved ? 'Remove from saved' : 'Save event'}
          style={{
            position: 'absolute',
            top: 10,
            right: 10,
            zIndex: 2,
            backgroundColor: isSaved ? 'var(--primary)' : 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            color: '#fff',
            width: 34,
            height: 34,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'transform 0.15s ease',
          }}
        >
          {isSaved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
        </button>

        {/* Free / Paid chip */}
        <div style={{ position: 'absolute', bottom: 10, right: 12, zIndex: 2 }}>
          <span
            style={{
              backgroundColor: event.fee === 0 ? 'var(--success)' : 'var(--primary)',
              color: '#fff',
              fontSize: '0.75rem',
              fontWeight: 700,
              padding: '3px 8px',
              borderRadius: 'var(--radius-sm)',
            }}
          >
            {event.fee === 0 ? 'FREE' : `$${event.fee}`}
          </span>
        </div>
      </div>

      {/* Content Container */}
      <div className="flex flex-col flex-1" style={{ padding: '1.25rem' }}>
        {showStatus && (
          <div style={{ marginBottom: '0.5rem' }}>
            <EventStatusBadge status={event.status} />
          </div>
        )}

        <h3
          style={{
            fontSize: '1.05rem',
            fontWeight: 700,
            lineHeight: 1.35,
            marginBottom: '0.5rem',
            color: 'var(--text-main)',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          <Link to={`/events/${event.id}`} style={{ color: 'inherit' }}>
            {event.title}
          </Link>
        </h3>

        <p
          className="text-xs text-secondary"
          style={{
            marginBottom: '1rem',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            lineHeight: 1.5,
          }}
        >
          {event.shortDescription || event.description}
        </p>

        {/* Meta Info */}
        <div className="flex flex-col gap-1.5 text-xs text-secondary" style={{ marginTop: 'auto', marginBottom: '1.25rem' }}>
          <div className="flex items-center gap-2">
            <Calendar size={14} color="var(--primary)" />
            <span>
              {formatDateOnly(event.startAt)} • {formatTimeOnly(event.startAt)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={14} color="var(--primary)" />
            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {event.venue}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Users size={14} color="var(--primary)" />
            <span>
              {isFull ? (
                <strong style={{ color: 'var(--error)' }}>Full ({capacity} capacity)</strong>
              ) : (
                <span>{remaining} seats left of {capacity}</span>
              )}
            </span>
          </div>
        </div>

        {/* Footer Actions */}
        <div
          className="flex items-center justify-between"
          style={{
            paddingTop: '0.85rem',
            borderTop: '1px solid var(--border-color)',
          }}
        >
          <span className="text-xs text-muted font-medium">
            {event.status === 'completed' ? 'Event Ended' : isFull ? 'Event Full' : 'Open Registration'}
          </span>
          <Link
            to={`/events/${event.id}`}
            className="flex items-center gap-1 text-xs font-semibold text-primary"
          >
            <span>Details</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}

export function EventGrid({ events = [], showStatus = false }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '1.75rem',
      }}
    >
      {events.map((evt) => (
        <EventCard key={evt.id} event={evt} showStatus={showStatus} />
      ))}
    </div>
  );
}
