import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Download, Users, CheckCircle2, XCircle, Search, Mail } from 'lucide-react';
import { useEvents } from '../../context/EventContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { authService } from '../../services/authService.js';
import { Button } from '../../components/ui/Button.jsx';
import { Badge } from '../../components/ui/Badge.jsx';
import { formatDateTime } from '../../utils/dates.js';
import { useToast } from '../../components/ui/Toast.jsx';

export function AttendeeManagementPage() {
  const { eventId } = useParams();
  const { events, registrations, updateAttendance, getEventCapacityStats } = useEvents();
  const { user } = useAuth();
  const toast = useToast();

  const [search, setSearch] = useState('');

  const event = events.find((e) => e.id === eventId);
  const allUsers = authService.getUsers();

  if (!event) {
    return (
      <div className="container text-center" style={{ padding: '4rem 1rem' }}>
        <h2>Event Not Found</h2>
        <Link to="/organizer/events">
          <Button variant="primary" style={{ marginTop: '1rem' }}>Back to My Events</Button>
        </Link>
      </div>
    );
  }

  // Get registrations for this event
  const eventRegs = registrations.filter((r) => r.eventId === event.id);

  // Combine registration with user data
  const attendees = eventRegs.map((reg) => {
    const regUser = allUsers.find((u) => u.id === reg.userId);
    return {
      reg,
      name: regUser?.name || 'Student Participant',
      email: regUser?.email || 'student@university.edu',
      department: regUser?.department || 'Student Body',
    };
  });

  const filteredAttendees = attendees.filter((a) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      a.name.toLowerCase().includes(q) ||
      a.email.toLowerCase().includes(q) ||
      a.reg.confirmationCode.toLowerCase().includes(q)
    );
  });

  const confirmedCount = eventRegs.filter((r) => r.status === 'confirmed').length;
  const attendedCount = eventRegs.filter((r) => r.status === 'attended').length;
  const cancelledCount = eventRegs.filter((r) => r.status === 'cancelled').length;

  const handleToggleAttendance = (regId, currentStatus) => {
    try {
      const isNowAttended = currentStatus !== 'attended';
      updateAttendance(regId, isNowAttended);
      toast.success(isNowAttended ? 'Marked as Attended!' : 'Attendance marked as Confirmed.');
    } catch (err) {
      toast.error('Failed to update attendance.');
    }
  };

  // CSV Export Functionality (Requirement F15)
  const handleExportCSV = () => {
    if (eventRegs.length === 0) {
      toast.info('No attendees to export.');
      return;
    }

    const headers = [
      'Registration ID',
      'Student Name',
      'Email',
      'Department',
      'Confirmation Code',
      'Registration Status',
      'Registered At',
      'Checked In At',
    ];

    const rows = attendees.map((a) => [
      `"${a.reg.id}"`,
      `"${a.name}"`,
      `"${a.email}"`,
      `"${a.department}"`,
      `"${a.reg.confirmationCode}"`,
      `"${a.reg.status}"`,
      `"${a.reg.registeredAt}"`,
      `"${a.reg.checkedInAt || ''}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `${event.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_attendees.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success('Attendee roster exported as CSV.');
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Back link */}
      <div>
        <Link to="/organizer/events" className="flex items-center gap-2 text-sm text-secondary hover:text-primary">
          <ArrowLeft size={16} />
          <span>Back to Organizer Events</span>
        </Link>
      </div>

      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <span className="text-xs font-bold text-primary uppercase tracking-wide">
            Attendee Management
          </span>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0.2rem' }}>
            {event.title}
          </h1>
          <p className="text-secondary text-sm">
            Venue: {event.venue} • Capacity: {event.capacity} seats
          </p>
        </div>

        <Button variant="primary" icon={Download} onClick={handleExportCSV}>
          Export CSV Roster
        </Button>
      </div>

      {/* Roster Metrics */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1rem',
        }}
      >
        <div className="card text-center p-3">
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)' }}>
            {confirmedCount + attendedCount}
          </div>
          <div className="text-xs text-secondary font-medium">Active Registrations</div>
        </div>
        <div className="card text-center p-3">
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--success-text)' }}>
            {attendedCount}
          </div>
          <div className="text-xs text-secondary font-medium">Checked-in Attended</div>
        </div>
        <div className="card text-center p-3">
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-muted)' }}>
            {cancelledCount}
          </div>
          <div className="text-xs text-secondary font-medium">Cancellations</div>
        </div>
      </div>

      {/* Search Filter */}
      <div className="card p-3">
        <input
          type="text"
          className="form-input"
          placeholder="Filter attendees by name, email, or confirmation code..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Attendees Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-subtle)', borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '0.85rem 1.25rem', fontWeight: 700 }}>Participant</th>
                <th style={{ padding: '0.85rem 1.25rem', fontWeight: 700 }}>Department</th>
                <th style={{ padding: '0.85rem 1.25rem', fontWeight: 700 }}>Confirmation Code</th>
                <th style={{ padding: '0.85rem 1.25rem', fontWeight: 700 }}>Registered</th>
                <th style={{ padding: '0.85rem 1.25rem', fontWeight: 700 }}>Status</th>
                <th style={{ padding: '0.85rem 1.25rem', fontWeight: 700, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAttendees.length > 0 ? (
                filteredAttendees.map((a) => (
                  <tr
                    key={a.reg.id}
                    style={{ borderBottom: '1px solid var(--border-color)', transition: 'background-color 0.15s ease' }}
                  >
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <div style={{ fontWeight: 600 }}>{a.name}</div>
                      <div className="text-xs text-secondary">{a.email}</div>
                    </td>
                    <td style={{ padding: '1rem 1.25rem', color: 'var(--text-secondary)' }}>
                      {a.department}
                    </td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.825rem',
                          fontWeight: 700,
                          color: 'var(--primary)',
                          backgroundColor: 'var(--primary-light)',
                          padding: '2px 8px',
                          borderRadius: 'var(--radius-sm)',
                        }}
                      >
                        {a.reg.confirmationCode}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.25rem', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                      {formatDateTime(a.reg.registeredAt)}
                    </td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      {a.reg.status === 'confirmed' && <Badge variant="success">Confirmed</Badge>}
                      {a.reg.status === 'attended' && <Badge variant="info">Attended</Badge>}
                      {a.reg.status === 'cancelled' && <Badge variant="neutral">Cancelled</Badge>}
                    </td>
                    <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                      {a.reg.status !== 'cancelled' ? (
                        <Button
                          variant={a.reg.status === 'attended' ? 'secondary' : 'primary'}
                          size="sm"
                          onClick={() => handleToggleAttendance(a.reg.id, a.reg.status)}
                        >
                          {a.reg.status === 'attended' ? 'Undo Check-in' : 'Mark Attended'}
                        </Button>
                      ) : (
                        <span className="text-xs text-muted">Cancelled</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    No participant registrations found for this event.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
