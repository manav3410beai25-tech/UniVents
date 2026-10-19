import React from 'react';
import { Link } from 'react-router-dom';
import {
  FolderKanban,
  PlusCircle,
  Users,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  FileSpreadsheet
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useEvents } from '../../context/EventContext.jsx';
import { EventStatusBadge } from '../../components/ui/Badge.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { formatDateOnly, formatDateTime } from '../../utils/dates.js';

export function OrganizerDashboard() {
  const { user } = useAuth();
  const { events, registrations, getEventCapacityStats } = useEvents();

  // Events owned by current organizer
  const myEvents = events.filter((e) => e.organizerId === user?.id);

  const drafts = myEvents.filter((e) => e.status === 'draft');
  const pending = myEvents.filter((e) => e.status === 'pending');
  const published = myEvents.filter((e) => e.status === 'published');
  const rejected = myEvents.filter((e) => e.status === 'rejected');

  // Total attendees across all published/completed events
  const totalAttendees = myEvents.reduce((acc, evt) => {
    const stats = getEventCapacityStats(evt);
    return acc + stats.count;
  }, 0);

  return (
    <div className="flex flex-col gap-8">
      {/* Header Banner */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, #38a9e8 0%, #125b96 100%)',
          color: '#ffffff',
          padding: '2.25rem',
        }}
      >
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <span
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(4px)',
                padding: '4px 12px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}
            >
              Organizer Studio
            </span>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800, marginTop: '0.65rem' }}>
              Welcome, {user?.name}
            </h1>
            <p style={{ opacity: 0.9, fontSize: '0.9rem', marginTop: '0.25rem' }}>
              {user?.department} • Create campus events, submit for administrative review, and manage participants.
            </p>
          </div>

          <Link to="/organizer/events/new">
            <Button
              variant="secondary"
              style={{ backgroundColor: '#ffffff', color: 'var(--primary)', fontWeight: 600 }}
              icon={PlusCircle}
            >
              Create New Event
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.25rem',
        }}
      >
        <div className="card flex items-center gap-4">
          <div
            style={{
              padding: '0.85rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--primary-light)',
              color: 'var(--primary)',
            }}
          >
            <FolderKanban size={26} />
          </div>
          <div>
            <div style={{ fontSize: '1.65rem', fontWeight: 800 }}>{myEvents.length}</div>
            <div className="text-xs text-secondary font-medium">Total Events Created</div>
          </div>
        </div>

        <div className="card flex items-center gap-4">
          <div
            style={{
              padding: '0.85rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--success-light)',
              color: 'var(--success-text)',
            }}
          >
            <CheckCircle2 size={26} />
          </div>
          <div>
            <div style={{ fontSize: '1.65rem', fontWeight: 800 }}>{published.length}</div>
            <div className="text-xs text-secondary font-medium">Published &amp; Live</div>
          </div>
        </div>

        <div className="card flex items-center gap-4">
          <div
            style={{
              padding: '0.85rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--warning-light)',
              color: 'var(--warning-text)',
            }}
          >
            <Clock size={26} />
          </div>
          <div>
            <div style={{ fontSize: '1.65rem', fontWeight: 800 }}>{pending.length}</div>
            <div className="text-xs text-secondary font-medium">Under Admin Review</div>
          </div>
        </div>

        <div className="card flex items-center gap-4">
          <div
            style={{
              padding: '0.85rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--info-light)',
              color: 'var(--info-text)',
            }}
          >
            <Users size={26} />
          </div>
          <div>
            <div style={{ fontSize: '1.65rem', fontWeight: 800 }}>{totalAttendees}</div>
            <div className="text-xs text-secondary font-medium">Registered Attendees</div>
          </div>
        </div>
      </div>

      {/* Rejected Events Alert Banner (if any) */}
      {rejected.length > 0 && (
        <div
          style={{
            backgroundColor: 'var(--error-light)',
            border: '1px solid var(--error-text)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
          }}
        >
          <div className="flex items-center gap-2" style={{ color: 'var(--error-text)', fontWeight: 700, marginBottom: '0.5rem' }}>
            <AlertTriangle size={20} />
            <span>Action Required: {rejected.length} Event(s) Need Revisions</span>
          </div>
          <div className="flex flex-col gap-2">
            {rejected.map((evt) => (
              <div key={evt.id} className="flex items-center justify-between flex-wrap gap-2 text-xs">
                <div>
                  <strong>{evt.title}</strong>: {evt.rejectionReason}
                </div>
                <Link to={`/organizer/events/${evt.id}/edit`}>
                  <Button variant="danger" size="sm">
                    Edit &amp; Resubmit
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Organizer Events */}
      <div>
        <div className="flex items-center justify-between" style={{ marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>Manage Events</h2>
            <p className="text-xs text-secondary">Your organized events and active attendee rosters</p>
          </div>
          <Link to="/organizer/events" className="text-xs font-semibold text-primary">
            View All Events
          </Link>
        </div>

        <div className="flex flex-col gap-3">
          {myEvents.slice(0, 6).map((evt) => {
            const stats = getEventCapacityStats(evt);

            return (
              <div
                key={evt.id}
                className="card flex items-center justify-between flex-wrap gap-4"
                style={{ padding: '1.25rem' }}
              >
                <div className="flex items-center gap-4">
                  <img
                    src={evt.bannerUrl}
                    alt={evt.title}
                    style={{ width: 84, height: 60, borderRadius: 'var(--radius-md)', objectFit: 'cover' }}
                  />
                  <div>
                    <div className="flex items-center gap-2" style={{ marginBottom: '0.25rem' }}>
                      <EventStatusBadge status={evt.status} />
                      <span className="text-xs text-secondary">
                        {formatDateOnly(evt.startAt)} • {evt.venue}
                      </span>
                    </div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>
                      <Link to={`/organizer/events/${evt.id}/edit`}>{evt.title}</Link>
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right text-xs">
                    <span className="text-secondary block">Attendance</span>
                    <strong>{stats.count} / {stats.capacity} registered</strong>
                  </div>

                  <Link to={`/organizer/events/${evt.id}/attendees`}>
                    <Button variant="secondary" size="sm" icon={Users}>
                      Attendees
                    </Button>
                  </Link>

                  <Link to={`/organizer/events/${evt.id}/edit`}>
                    <Button variant="ghost" size="sm">
                      Edit
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
