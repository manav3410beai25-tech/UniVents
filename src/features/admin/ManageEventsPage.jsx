import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FolderKanban, Users, Eye, AlertOctagon } from 'lucide-react';
import { useEvents } from '../../context/EventContext.jsx';
import { EventStatusBadge } from '../../components/ui/Badge.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { formatDateOnly } from '../../utils/dates.js';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog.jsx';
import { useToast } from '../../components/ui/Toast.jsx';

export function AdminManageEventsPage() {
  const { events, cancelEventByAdmin, getEventCapacityStats } = useEvents();
  const toast = useToast();
  const [filter, setFilter] = useState('all');
  const [cancelTarget, setCancelTarget] = useState(null);

  const filtered = events.filter((e) => filter === 'all' || e.status === filter);

  const handleConfirmCancel = () => {
    if (!cancelTarget) return;
    try {
      cancelEventByAdmin(cancelTarget.id, 'Administrative intervention / Safety regulation.');
      toast.warning(`Event "${cancelTarget.title}" has been cancelled.`);
      setCancelTarget(null);
    } catch (err) {
      toast.error('Failed to cancel event.');
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>All Campus Events</h1>
          <p className="text-secondary text-sm">
            Complete registry of all student, faculty and club events across all statuses.
          </p>
        </div>

        <div className="flex gap-2 flex-wrap">
          {['all', 'published', 'pending', 'rejected', 'completed', 'cancelled', 'draft'].map((tab) => (
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

      <div className="flex flex-col gap-3">
        {filtered.map((evt) => {
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
                  <div className="flex items-center gap-2" style={{ marginBottom: '0.2rem' }}>
                    <EventStatusBadge status={evt.status} />
                    <span className="text-xs text-secondary">{formatDateOnly(evt.startAt)}</span>
                  </div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>{evt.title}</h3>
                  <p className="text-xs text-secondary">{evt.venue} • {stats.count} registered</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Link to={`/events/${evt.id}`}>
                  <Button variant="secondary" size="sm" icon={Eye}>
                    View
                  </Button>
                </Link>

                {evt.status === 'published' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    style={{ color: 'var(--error)' }}
                    onClick={() => setCancelTarget(evt)}
                  >
                    Cancel Event
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <ConfirmDialog
        isOpen={Boolean(cancelTarget)}
        onClose={() => setCancelTarget(null)}
        onConfirm={handleConfirmCancel}
        title="Cancel Campus Event?"
        message={`Are you sure you want to cancel "${cancelTarget?.title}"? Registered students and the organizer will be notified.`}
        confirmText="Cancel Event"
        variant="danger"
      />
    </div>
  );
}
