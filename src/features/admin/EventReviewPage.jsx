import React, { useState } from 'react';
import { CheckCircle2, XCircle, Clock, CheckSquare, Eye, AlertTriangle } from 'lucide-react';
import { useEvents } from '../../context/EventContext.jsx';
import { formatDateOnly, formatDateTime } from '../../utils/dates.js';
import { Button } from '../../components/ui/Button.jsx';
import { Modal } from '../../components/ui/Modal.jsx';
import { EmptyState } from '../../components/ui/EmptyState.jsx';
import { useToast } from '../../components/ui/Toast.jsx';

export function EventReviewPage() {
  const { events, approveEvent, rejectEvent } = useEvents();
  const toast = useToast();

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [targetRejectEvent, setTargetRejectEvent] = useState(null);

  const pendingEvents = events.filter((e) => e.status === 'pending');

  const handleApprove = (id) => {
    try {
      approveEvent(id);
      toast.success('Event approved and published to public campus directory!');
      if (selectedEvent?.id === id) setSelectedEvent(null);
    } catch (err) {
      toast.error('Failed to approve event.');
    }
  };

  const openRejectModal = (evt) => {
    setTargetRejectEvent(evt);
    setRejectReason('');
    setRejectModalOpen(true);
  };

  const handleConfirmReject = () => {
    if (!rejectReason.trim()) {
      toast.error('Please enter a rejection reason for the organizer.');
      return;
    }
    try {
      rejectEvent(targetRejectEvent.id, rejectReason);
      toast.warning('Event rejected with feedback provided to organizer.');
      setRejectModalOpen(false);
      setTargetRejectEvent(null);
      if (selectedEvent?.id === targetRejectEvent.id) setSelectedEvent(null);
    } catch (err) {
      toast.error('Failed to reject event.');
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Event Moderation Queue</h1>
        <p className="text-secondary text-sm">
          Review organizer event submissions for compliance with campus safety and university policy.
        </p>
      </div>

      {pendingEvents.length > 0 ? (
        <div className="flex flex-col gap-3">
          {pendingEvents.map((evt) => (
            <div
              key={evt.id}
              className="card flex items-center justify-between flex-wrap gap-4"
              style={{ padding: '1.25rem' }}
            >
              <div className="flex items-center gap-4">
                <img
                  src={evt.bannerUrl}
                  alt={evt.title}
                  style={{ width: 100, height: 68, borderRadius: 'var(--radius-md)', objectFit: 'cover' }}
                />
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{evt.title}</h3>
                  <p className="text-xs text-secondary" style={{ marginTop: '0.2rem' }}>
                    Date: {formatDateTime(evt.startAt)} • Venue: {evt.venue} • Seats: {evt.capacity}
                  </p>
                  <p className="text-xs text-secondary" style={{ marginTop: '0.25rem', maxWidth: '600px' }}>
                    {evt.shortDescription || evt.description.slice(0, 100) + '...'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="secondary" size="sm" icon={Eye} onClick={() => setSelectedEvent(evt)}>
                  Inspect
                </Button>
                <Button variant="danger" size="sm" icon={XCircle} onClick={() => openRejectModal(evt)}>
                  Reject
                </Button>
                <Button variant="primary" size="sm" icon={CheckCircle2} onClick={() => handleApprove(evt.id)}>
                  Approve
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={CheckSquare}
          title="Review queue is empty"
          description="There are no pending events waiting for administrative moderation. All submissions are processed!"
        />
      )}

      {/* Detail Inspection Modal */}
      {selectedEvent && (
        <Modal
          isOpen={Boolean(selectedEvent)}
          onClose={() => setSelectedEvent(null)}
          title={`Review: ${selectedEvent.title}`}
          maxWidth={700}
        >
          <div className="flex flex-col gap-4">
            <img
              src={selectedEvent.bannerUrl}
              alt={selectedEvent.title}
              style={{ width: '100%', height: 220, objectFit: 'cover', borderRadius: 'var(--radius-md)' }}
            />

            <div>
              <h4 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.25rem' }}>Description</h4>
              <p className="text-xs text-secondary" style={{ lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                {selectedEvent.description}
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.8rem' }} className="card p-3">
              <div><strong>Start:</strong> {formatDateTime(selectedEvent.startAt)}</div>
              <div><strong>End:</strong> {formatDateTime(selectedEvent.endAt)}</div>
              <div><strong>Venue:</strong> {selectedEvent.venue}</div>
              <div><strong>Capacity:</strong> {selectedEvent.capacity} seats</div>
              <div><strong>Admission:</strong> {selectedEvent.fee === 0 ? 'Free' : `$${selectedEvent.fee}`}</div>
              <div><strong>Deadline:</strong> {formatDateTime(selectedEvent.registrationDeadline)}</div>
            </div>

            {selectedEvent.agenda && selectedEvent.agenda.length > 0 && (
              <div>
                <h4 style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.4rem' }}>Event Agenda</h4>
                <div className="flex flex-col gap-1.5 text-xs">
                  {selectedEvent.agenda.map((a, i) => (
                    <div key={i} className="flex gap-2">
                      <span className="font-semibold text-primary">{a.time}:</span>
                      <span>{a.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-3" style={{ borderTop: '1px solid var(--border-color)' }}>
              <Button variant="danger" icon={XCircle} onClick={() => openRejectModal(selectedEvent)}>
                Reject Submission
              </Button>
              <Button variant="primary" icon={CheckCircle2} onClick={() => handleApprove(selectedEvent.id)}>
                Approve &amp; Publish
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Reject Reason Modal (Requirement F14) */}
      {rejectModalOpen && (
        <Modal
          isOpen={rejectModalOpen}
          onClose={() => setRejectModalOpen(false)}
          title="Reject Event Submission"
          maxWidth={500}
        >
          <div className="flex flex-col gap-4">
            <p className="text-xs text-secondary">
              Provide feedback for <strong>{targetRejectEvent?.title}</strong>. The organizer will receive this note in their dashboard to make required corrections.
            </p>

            <textarea
              className="form-textarea"
              rows={4}
              placeholder="e.g. Please update the venue or schedule to comply with quiet study hours..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              required
            />

            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setRejectModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={handleConfirmReject}>
                Confirm Rejection
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
