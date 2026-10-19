import React, { useState } from 'react';
import { Calendar, CheckSquare, Layers, Users, TrendingUp, AlertTriangle, ArrowRight, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEvents } from '../../context/EventContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { EventStatusBadge } from '../../components/ui/Badge.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { formatDateOnly } from '../../utils/dates.js';
import { useToast } from '../../components/ui/Toast.jsx';

export function AdminDashboard() {
  const { user } = useAuth();
  const { events, registrations, categories } = useEvents();
  const toast = useToast();

  const pendingEvents = events.filter((e) => e.status === 'pending');
  const publishedEvents = events.filter((e) => e.status === 'published');
  const completedEvents = events.filter((e) => e.status === 'completed');
  const activeRegistrations = registrations.filter(
    (r) => r.status === 'confirmed' || r.status === 'attended'
  );

  return (
    <div className="flex flex-col gap-8">
      {/* Admin Banner */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, #1677c8 0%, #125b96 100%)',
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
              Administrative Operations
            </span>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800, marginTop: '0.65rem' }}>
              Campus Moderation &amp; Oversight
            </h1>
            <p style={{ opacity: 0.9, fontSize: '0.9rem', marginTop: '0.25rem' }}>
              Welcome, {user?.name} • Monitor platform-wide metrics, review organizer proposals, and configure campus categories.
            </p>
          </div>

          <div className="flex gap-2">
            <Link to="/admin/review">
              <Button
                variant="secondary"
                style={{ backgroundColor: '#ffffff', color: 'var(--primary)', fontWeight: 600 }}
                icon={CheckSquare}
              >
                Review Queue ({pendingEvents.length})
              </Button>
            </Link>
          </div>
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
              backgroundColor: 'var(--warning-light)',
              color: 'var(--warning-text)',
            }}
          >
            <CheckSquare size={26} />
          </div>
          <div>
            <div style={{ fontSize: '1.65rem', fontWeight: 800 }}>{pendingEvents.length}</div>
            <div className="text-xs text-secondary font-medium">Pending Review</div>
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
            <Calendar size={26} />
          </div>
          <div>
            <div style={{ fontSize: '1.65rem', fontWeight: 800 }}>{publishedEvents.length}</div>
            <div className="text-xs text-secondary font-medium">Active Published</div>
          </div>
        </div>

        <div className="card flex items-center gap-4">
          <div
            style={{
              padding: '0.85rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--primary-light)',
              color: 'var(--primary)',
            }}
          >
            <Users size={26} />
          </div>
          <div>
            <div style={{ fontSize: '1.65rem', fontWeight: 800 }}>{activeRegistrations.length}</div>
            <div className="text-xs text-secondary font-medium">Total Registrations</div>
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
            <Layers size={26} />
          </div>
          <div>
            <div style={{ fontSize: '1.65rem', fontWeight: 800 }}>{categories.length}</div>
            <div className="text-xs text-secondary font-medium">Campus Categories</div>
          </div>
        </div>
      </div>

      {/* Pending Submissions Queue Preview */}
      <div>
        <div className="flex items-center justify-between" style={{ marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>Pending Review Queue</h2>
            <p className="text-xs text-secondary">
              Organizers awaiting university moderation approval before events go live.
            </p>
          </div>
          <Link to="/admin/review" className="text-xs font-semibold text-primary">
            Open Full Queue
          </Link>
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
                    style={{ width: 84, height: 60, borderRadius: 'var(--radius-md)', objectFit: 'cover' }}
                  />
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>{evt.title}</h3>
                    <p className="text-xs text-secondary">
                      Date: {formatDateOnly(evt.startAt)} • Venue: {evt.venue} • Capacity: {evt.capacity}
                    </p>
                  </div>
                </div>

                <Link to="/admin/review">
                  <Button variant="primary" size="sm">
                    Review Submission
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="card text-center p-6 text-sm text-secondary">
            🎉 All submissions reviewed! The administrative moderation queue is clean.
          </div>
        )}
      </div>

      {/* Category Management Quick Link */}
      <div className="card flex items-center justify-between flex-wrap gap-4">
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Category &amp; Tag Taxonomy</h3>
          <p className="text-xs text-secondary">
            Add or deactivate event categories, edit category slugs, and organize campus discovery.
          </p>
        </div>
        <Link to="/admin/categories">
          <Button variant="secondary">Manage Categories</Button>
        </Link>
      </div>
    </div>
  );
}
