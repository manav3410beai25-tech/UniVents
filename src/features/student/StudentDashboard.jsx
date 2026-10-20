import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarCheck,
  Bookmark,
  Award,
  Bell,
  Search,
  Sparkles,
  ArrowRight,
  Clock,
  MapPin,
  XCircle,
  FileText
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useEvents } from '../../context/EventContext.jsx';
import { useNotifications } from '../../context/NotificationContext.jsx';
import { formatDateTime, formatDateOnly, formatTimeOnly } from '../../utils/dates.js';
import { Badge } from '../../components/ui/Badge.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { EmptyState } from '../../components/ui/EmptyState.jsx';
import { CertificateModal } from './CertificateModal.jsx';
import { useToast } from '../../components/ui/Toast.jsx';

export function StudentDashboard() {
  const { user } = useAuth();
  const { events, registrations, savedEventIds, cancelRegistration } = useEvents();
  const { notifications, unreadCount } = useNotifications();
  const toast = useToast();

  const [selectedCertEvent, setSelectedCertEvent] = useState(null);

  // Student specific registrations
  const studentRegs = registrations.filter((r) => r.userId === user?.id);
  const confirmedRegs = studentRegs.filter((r) => r.status === 'confirmed');
  const attendedRegs = studentRegs.filter((r) => r.status === 'attended');

  // Match events
  const upcomingRegisteredEvents = confirmedRegs
    .map((reg) => ({
      reg,
      event: events.find((e) => e.id === reg.eventId),
    }))
    .filter((item) => item.event)
    .sort((a, b) => new Date(a.event.startAt).getTime() - new Date(b.event.startAt).getTime());

  const attendedEvents = attendedRegs
    .map((reg) => ({
      reg,
      event: events.find((e) => e.id === reg.eventId),
    }))
    .filter((item) => item.event);

  // Suggested events based on user interests
  const userInterests = user?.interests || [];
  const suggestedEvents = events
    .filter((e) => e.status === 'published' && new Date(e.startAt).getTime() > Date.now())
    .filter((e) => !studentRegs.some((r) => r.eventId === e.id && r.status === 'confirmed'))
    .slice(0, 3);

  const handleCancelReg = (regId, eventTitle) => {
    try {
      cancelRegistration(regId, eventTitle);
      toast.info('Registration cancelled.');
    } catch (err) {
      toast.error('Failed to cancel registration.');
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Welcome Banner */}
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
              Student Portal
            </span>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800, marginTop: '0.65rem' }}>
              Welcome back, {user?.name}!
            </h1>
            <p style={{ opacity: 0.9, fontSize: '0.9rem', marginTop: '0.25rem' }}>
              {user?.department} • Track your upcoming registrations, attendance verification and saved events.
            </p>
          </div>

          <Link to="/events">
            <Button
              variant="secondary"
              style={{ backgroundColor: '#ffffff', color: 'var(--primary)', fontWeight: 600 }}
              icon={Search}
            >
              Explore Campus Events
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
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
            <CalendarCheck size={26} />
          </div>
          <div>
            <div style={{ fontSize: '1.65rem', fontWeight: 800 }}>{confirmedRegs.length}</div>
            <div className="text-xs text-secondary font-medium">Upcoming Registrations</div>
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
            <Award size={26} />
          </div>
          <div>
            <div style={{ fontSize: '1.65rem', fontWeight: 800 }}>{attendedRegs.length}</div>
            <div className="text-xs text-secondary font-medium">Attended &amp; Verified</div>
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
            <Bookmark size={26} />
          </div>
          <div>
            <div style={{ fontSize: '1.65rem', fontWeight: 800 }}>{savedEventIds.length}</div>
            <div className="text-xs text-secondary font-medium">Saved Bookmarks</div>
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
            <Bell size={26} />
          </div>
          <div>
            <div style={{ fontSize: '1.65rem', fontWeight: 800 }}>{unreadCount}</div>
            <div className="text-xs text-secondary font-medium">Unread Notifications</div>
          </div>
        </div>
      </div>

      {/* Upcoming Registrations List */}
      <div>
        <div className="flex items-center justify-between" style={{ marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>Upcoming Registrations</h2>
            <p className="text-xs text-secondary">Your active reservations with digital confirmation codes</p>
          </div>
          <Link to="/student/registrations" className="text-xs font-semibold text-primary">
            View All History
          </Link>
        </div>

        {upcomingRegisteredEvents.length > 0 ? (
          <div className="flex flex-col gap-3">
            {upcomingRegisteredEvents.map(({ reg, event }) => (
              <div
                key={reg.id}
                className="card flex items-center justify-between flex-wrap gap-4"
                style={{ padding: '1.25rem' }}
              >
                <div className="flex items-center gap-4 min-w-0">
                  <img
                    src={event.bannerUrl}
                    alt={event.title}
                    style={{ width: 84, height: 60, borderRadius: 'var(--radius-md)', objectFit: 'cover' }}
                  />
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                      <Link to={`/events/${event.id}`}>{event.title}</Link>
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-secondary flex-wrap">
                      <span className="flex items-center gap-1">
                        <Clock size={13} />
                        {formatDateTime(event.startAt)}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin size={13} />
                        {event.venue}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-xs text-secondary block">Confirmation Code</span>
                    <strong style={{ letterSpacing: '0.05em', color: 'var(--primary)' }}>
                      {reg.confirmationCode}
                    </strong>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    style={{ color: 'var(--error)' }}
                    onClick={() => handleCancelReg(reg.id, event.title)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={CalendarCheck}
            title="No upcoming registrations"
            description="You haven't registered for any upcoming events yet. Discover student workshops, hackathons, and fairs in the campus directory."
            actionLabel="Browse Events"
            onAction={() => (window.location.href = `${import.meta.env.BASE_URL}events`)}
          />
        )}
      </div>

      {/* Attended Events & Certificates Section */}
      {attendedEvents.length > 0 && (
        <div>
          <div className="flex items-center justify-between" style={{ marginBottom: '1.25rem' }}>
            <div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>Verified Attendance &amp; Certificates</h2>
              <p className="text-xs text-secondary">Download official participation certificates for attended events</p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {attendedEvents.map(({ reg, event }) => (
              <div
                key={reg.id}
                className="card flex items-center justify-between flex-wrap gap-4"
                style={{ padding: '1.25rem' }}
              >
                <div className="flex items-center gap-4">
                  <div
                    style={{
                      padding: '0.75rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--success-light)',
                      color: 'var(--success-text)',
                    }}
                  >
                    <Award size={24} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>{event.title}</h3>
                    <p className="text-xs text-secondary">
                      Attended on {formatDateOnly(event.startAt)} • Checked in: {formatDateTime(reg.checkedInAt)}
                    </p>
                  </div>
                </div>

                <Button
                  variant="secondary"
                  size="sm"
                  icon={FileText}
                  onClick={() => setSelectedCertEvent({ event, reg })}
                >
                  View Certificate
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certificate Modal */}
      {selectedCertEvent && (
        <CertificateModal
          isOpen={Boolean(selectedCertEvent)}
          onClose={() => setSelectedCertEvent(null)}
          studentName={user?.name}
          eventTitle={selectedCertEvent.event.title}
          eventDate={selectedCertEvent.event.startAt}
          confirmationCode={selectedCertEvent.reg.confirmationCode}
        />
      )}
    </div>
  );
}
