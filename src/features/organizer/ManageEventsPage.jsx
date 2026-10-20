import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Users, Edit3, Trash2, FolderKanban } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useEvents } from '../../context/EventContext.jsx';
import { EventStatusBadge } from '../../components/ui/Badge.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog.jsx';
import { EmptyState } from '../../components/ui/EmptyState.jsx';
import { formatDateOnly } from '../../utils/dates.js';
import { useToast } from '../../components/ui/Toast.jsx';

export function ManageEventsPage() {
  const { user } = useAuth();
  const { events, deleteDraft, getEventCapacityStats } = useEvents();
  const toast = useToast();

  const [filter, setFilter] = useState('all');
  const [deleteTarget, setDeleteTarget] = useState(null);

  const myEvents = events.filter((e) => e.organizerId === user?.id);

  const filtered = myEvents.filter((e) => filter === 'all' || e.status === filter);

  const handleDeleteDraft = () => {
    if (!deleteTarget) return;
    try {
      deleteDraft(deleteTarget.id);
      toast.success('Draft event deleted permanently.');
    } catch (err) {
      toast.error('Failed to delete draft.');
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>My Organized Events</h1>
          <p className="text-secondary text-sm">
            Manage drafts, submitted events, and active published campus programs.
          </p>
        </div>

        <Link to="/organizer/events/new">
          <Button variant="primary" icon={PlusCircle}>
            Create New Event
          </Button>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap">
        {['all', 'published', 'pending', 'draft', 'rejected'].map((tab) => (
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

      {filtered.length > 0 ? (
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
                    <div className="flex items-center gap-2" style={{ marginBottom: '0.25rem' }}>
                      <EventStatusBadge status={evt.status} />
                      <span className="text-xs text-secondary">
                        {formatDateOnly(evt.startAt)} • {evt.venue}
                      </span>
                    </div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>
                      <Link to={`/organizer/events/${evt.id}/edit`}>{evt.title}</Link>
                    </h3>
                    {evt.status === 'rejected' && (
                      <p className="text-xs" style={{ color: 'var(--error)', marginTop: '0.2rem' }}>
                        Rejection reason: {evt.rejectionReason}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right text-xs">
                    <span className="text-secondary block">Registration</span>
                    <strong>{stats.count} / {stats.capacity} seats</strong>
                  </div>

                  <Link to={`/organizer/events/${evt.id}/attendees`}>
                    <Button variant="secondary" size="sm" icon={Users}>
                      Attendees
                    </Button>
                  </Link>

                  <Link to={`/organizer/events/${evt.id}/edit`}>
                    <Button variant="secondary" size="sm" icon={Edit3}>
                      Edit
                    </Button>
                  </Link>

                  {evt.status === 'draft' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      style={{ color: 'var(--error)' }}
                      onClick={() => setDeleteTarget(evt)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={FolderKanban}
          title="No events found"
          description={`You do not have any events matching the "${filter}" status.`}
          actionLabel="Create an Event"
          onAction={() => (window.location.href = `${import.meta.env.BASE_URL}organizer/events/new`)}
        />
      )}

      {/* Delete Draft Confirm Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteDraft}
        title="Delete Draft Event?"
        message={`Are you sure you want to permanently delete draft "${deleteTarget?.title}"?`}
        confirmText="Delete Draft"
        variant="danger"
      />
    </div>
  );
}
