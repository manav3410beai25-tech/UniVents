import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarCheck, Clock, MapPin, Award, FileText } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useEvents } from '../../context/EventContext.jsx';
import { formatDateTime, formatDateOnly } from '../../utils/dates.js';
import { Badge } from '../../components/ui/Badge.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { EmptyState } from '../../components/ui/EmptyState.jsx';
import { CertificateModal } from './CertificateModal.jsx';
import { useToast } from '../../components/ui/Toast.jsx';

export function RegistrationHistoryPage() {
  const { user } = useAuth();
  const { events, registrations, cancelRegistration } = useEvents();
  const toast = useToast();
  const [filter, setFilter] = useState('all'); // 'all' | 'confirmed' | 'attended' | 'cancelled'
  const [selectedCert, setSelectedCert] = useState(null);

  const studentRegs = registrations.filter((r) => r.userId === user?.id);

  const filtered = studentRegs
    .filter((r) => filter === 'all' || r.status === filter)
    .map((reg) => ({
      reg,
      event: events.find((e) => e.id === reg.eventId),
    }))
    .filter((item) => item.event)
    .sort((a, b) => new Date(b.reg.registeredAt).getTime() - new Date(a.reg.registeredAt).getTime());

  const handleCancel = (regId, title) => {
    try {
      cancelRegistration(regId, title);
      toast.info('Registration has been cancelled.');
    } catch (err) {
      toast.error('Failed to cancel registration.');
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Registration History</h1>
          <p className="text-secondary text-sm">
            View all past, current, and cancelled event registrations.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex gap-2">
          {['all', 'confirmed', 'attended', 'cancelled'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className="btn btn-sm"
              style={{
                backgroundColor: filter === tab ? 'var(--primary)' : 'var(--bg-surface)',
                color: filter === tab ? '#ffffff' : 'var(--text-secondary)',
                border: '1px solid var(--border-color)',
                textTransform: 'capitalize',
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="flex flex-col gap-3">
          {filtered.map(({ reg, event }) => {
            const isConfirmed = reg.status === 'confirmed';
            const isAttended = reg.status === 'attended';
            const isCancelled = reg.status === 'cancelled';

            return (
              <div
                key={reg.id}
                className="card flex items-center justify-between flex-wrap gap-4"
                style={{ padding: '1.25rem' }}
              >
                <div className="flex items-center gap-4">
                  <img
                    src={event.bannerUrl}
                    alt={event.title}
                    style={{ width: 84, height: 60, borderRadius: 'var(--radius-md)', objectFit: 'cover' }}
                  />
                  <div>
                    <div className="flex items-center gap-2" style={{ marginBottom: '0.2rem' }}>
                      {isConfirmed && <Badge variant="success">Confirmed</Badge>}
                      {isAttended && <Badge variant="info">Attended</Badge>}
                      {isCancelled && <Badge variant="neutral">Cancelled</Badge>}
                    </div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>
                      <Link to={`/events/${event.id}`}>{event.title}</Link>
                    </h3>
                    <p className="text-xs text-secondary">
                      Date: {formatDateTime(event.startAt)} • Venue: {event.venue}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right text-xs">
                    <span className="text-secondary block">Confirmation Code</span>
                    <strong style={{ letterSpacing: '0.05em', color: 'var(--primary)', fontSize: '0.9rem' }}>
                      {reg.confirmationCode}
                    </strong>
                  </div>

                  {isAttended && (
                    <Button
                      variant="secondary"
                      size="sm"
                      icon={FileText}
                      onClick={() => setSelectedCert({ event, reg })}
                    >
                      Certificate
                    </Button>
                  )}

                  {isConfirmed && (
                    <Button
                      variant="ghost"
                      size="sm"
                      style={{ color: 'var(--error)' }}
                      onClick={() => handleCancel(reg.id, event.title)}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={CalendarCheck}
          title="No registration records"
          description={`You have no records matching the "${filter}" filter.`}
          actionLabel="Explore Events"
          onAction={() => (window.location.href = '/events')}
        />
      )}

      {selectedCert && (
        <CertificateModal
          isOpen={Boolean(selectedCert)}
          onClose={() => setSelectedCert(null)}
          studentName={user?.name}
          eventTitle={selectedCert.event.title}
          eventDate={selectedCert.event.startAt}
          confirmationCode={selectedCert.reg.confirmationCode}
        />
      )}
    </div>
  );
}
