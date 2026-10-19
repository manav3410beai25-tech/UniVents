import React from 'react';
import { Calendar, Users, Clock, AlertTriangle, CheckCircle2, DollarSign, LogIn } from 'lucide-react';
import { Button } from '../../../components/ui/Button.jsx';
import { useAuth } from '../../../context/AuthContext.jsx';
import { useEvents } from '../../../context/EventContext.jsx';
import { useToast } from '../../../components/ui/Toast.jsx';
import { formatDateTime, isPast } from '../../../utils/dates.js';
import { useNavigate } from 'react-router-dom';

export function RegistrationPanel({ event }) {
  const { user } = useAuth();
  const { registerForEvent, cancelRegistration, registrations, getEventCapacityStats } = useEvents();
  const toast = useToast();
  const navigate = useNavigate();

  const { count, capacity, remaining, isFull, percentage } = getEventCapacityStats(event);

  // Check if current user is registered
  const userRegistration = registrations.find(
    (r) => r.eventId === event.id && r.userId === user?.id && (r.status === 'confirmed' || r.status === 'attended')
  );

  const eventStarted = event.startAt && isPast(event.startAt);
  const deadlinePassed = event.registrationDeadline && isPast(event.registrationDeadline);

  const handleRegister = () => {
    if (!user) {
      navigate(`/login?redirect=${encodeURIComponent(`/events/${event.id}`)}`);
      return;
    }
    if (user.role !== 'student') {
      toast.warning('Only student accounts can register for campus events. Switch role to Student to register.');
      return;
    }

    try {
      const reg = registerForEvent(event.id);
      toast.success(`Registered! Confirmation Code: ${reg.confirmationCode}`);
    } catch (err) {
      toast.error(err.message || 'Registration failed.');
    }
  };

  const handleCancel = () => {
    if (!userRegistration) return;
    try {
      cancelRegistration(userRegistration.id, event.title);
      toast.info('Registration has been cancelled.');
    } catch (err) {
      toast.error(err.message || 'Cancellation failed.');
    }
  };

  return (
    <div className="card" style={{ position: 'sticky', top: '90px' }}>
      <div className="flex items-center justify-between" style={{ marginBottom: '1.25rem' }}>
        <div>
          <span className="text-xs text-secondary font-medium">Admission</span>
          <div style={{ fontSize: '1.65rem', fontWeight: 800, color: event.fee === 0 ? 'var(--success-text)' : 'var(--text-main)' }}>
            {event.fee === 0 ? 'Free' : `$${Number(event.fee).toFixed(2)}`}
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs text-secondary font-medium">Capacity</span>
          <div style={{ fontSize: '1rem', fontWeight: 700 }}>
            {count} / {capacity}
          </div>
        </div>
      </div>

      {/* Capacity Progress Bar */}
      <div style={{ marginBottom: '1.25rem' }}>
        <div className="flex justify-between text-xs text-secondary" style={{ marginBottom: '0.35rem' }}>
          <span>Seats Reserved</span>
          <span>{percentage}% full</span>
        </div>
        <div
          style={{
            height: '8px',
            backgroundColor: 'var(--border-color)',
            borderRadius: '999px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${percentage}%`,
              height: '100%',
              backgroundColor: isFull ? 'var(--error)' : percentage > 80 ? 'var(--warning)' : 'var(--primary)',
              transition: 'width 0.3s ease',
            }}
          />
        </div>
        <p className="text-xs text-muted" style={{ marginTop: '0.4rem' }}>
          {isFull ? (
            <span style={{ color: 'var(--error)', fontWeight: 600 }}>Event is at maximum capacity.</span>
          ) : (
            <span><strong>{remaining}</strong> spots remaining</span>
          )}
        </p>
      </div>

      {/* Registration Status or Buttons */}
      {userRegistration ? (
        <div
          style={{
            backgroundColor: 'var(--success-light)',
            border: '1px solid var(--success-text)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem',
            marginBottom: '1rem',
          }}
        >
          <div className="flex items-center gap-2" style={{ color: 'var(--success-text)', fontWeight: 700, marginBottom: '0.3rem' }}>
            <CheckCircle2 size={18} />
            <span>You Are Registered!</span>
          </div>
          <p className="text-xs text-secondary" style={{ marginBottom: '0.75rem' }}>
            Confirmation Code: <strong style={{ color: 'var(--text-main)', letterSpacing: '0.05em' }}>{userRegistration.confirmationCode}</strong>
          </p>
          <p className="text-xs text-secondary" style={{ marginBottom: '0.75rem' }}>
            Status: <span style={{ textTransform: 'capitalize', fontWeight: 600 }}>{userRegistration.status}</span>
          </p>

          {!eventStarted && userRegistration.status === 'confirmed' && (
            <Button variant="danger" size="sm" className="w-full" onClick={handleCancel}>
              Cancel Registration
            </Button>
          )}
        </div>
      ) : (
        <div style={{ marginBottom: '1rem' }}>
          {event.status !== 'published' ? (
            <div className="text-center p-3 text-xs text-muted" style={{ backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)' }}>
              Registration is not active for this status.
            </div>
          ) : eventStarted ? (
            <div className="text-center p-3 text-xs text-muted" style={{ backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)' }}>
              This event has already started or ended.
            </div>
          ) : deadlinePassed ? (
            <div className="text-center p-3 text-xs text-error" style={{ backgroundColor: 'var(--error-light)', borderRadius: 'var(--radius-md)' }}>
              Registration deadline has passed.
            </div>
          ) : isFull ? (
            <Button variant="secondary" className="w-full" disabled>
              Event Full
            </Button>
          ) : (
            <Button variant="primary" className="w-full" size="lg" onClick={handleRegister}>
              {user ? 'Register for Event' : 'Sign In to Register'}
            </Button>
          )}
        </div>
      )}

      {/* Registration Terms / Notices */}
      <div className="text-xs text-secondary flex flex-col gap-1.5" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
        <div className="flex items-center gap-2">
          <Clock size={13} />
          <span>Deadline: {formatDateTime(event.registrationDeadline)}</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 size={13} />
          <span>Instant simulated confirmation &amp; digital code</span>
        </div>
      </div>
    </div>
  );
}
