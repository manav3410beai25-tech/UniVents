import { Link } from 'react-router-dom';
import { Sparkles, Calendar, Users, Shield, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '../../components/ui/Button.jsx';

export function AboutPage() {
  const highlights = [
    {
      icon: Calendar,
      title: 'Event Discovery & Registration',
      description: 'Search, filter by category, and discover campus workshops, hackathons, and fairs with instant digital confirmation codes.',
    },
    {
      icon: Users,
      title: 'Student & Organizer Workflows',
      description: 'Track personal registrations, bookmark favorite events, or submit new gatherings for administrative review.',
    },
    {
      icon: Shield,
      title: 'Campus Moderation',
      description: 'Review event submissions, enforce attendance capacity, and maintain high standards across all campus activities.',
    },
  ];

  return (
    <div className="container" style={{ padding: 'clamp(2rem, 5vw, 3.5rem) var(--gutter-mobile)', maxWidth: '960px' }}>
      {/* Header */}
      <div className="text-center" style={{ marginBottom: '3rem' }}>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.35rem 0.85rem',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'var(--primary-light)',
            color: 'var(--primary)',
            fontSize: '0.8rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '1rem',
          }}
        >
          <Sparkles size={14} />
          About UniVents
        </span>
        <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 800, lineHeight: 1.15 }}>
          Connecting Campus Life, One Event at a Time
        </h1>
        <p className="text-secondary" style={{ maxWidth: '640px', margin: '1rem auto 0', fontSize: '1rem', lineHeight: 1.6 }}>
          UniVents is a dedicated campus event management platform built to centralize activity discovery, streamline student registrations, and simplify organizer coordination.
        </p>
      </div>

      {/* Purpose & Mission */}
      <div className="card" style={{ padding: 'clamp(1.5rem, 4vw, 2.5rem)', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.75rem' }}>
          Our Purpose
        </h2>
        <p className="text-secondary" style={{ lineHeight: 1.7, marginBottom: '1rem' }}>
          University campuses are full of energetic gatherings, academic lectures, collegiate hackathons, and cultural festivals. However, announcements often end up scattered across bulletin boards, social feeds, and email inboxes.
        </p>
        <p className="text-secondary" style={{ lineHeight: 1.7 }}>
          UniVents solves this fragmentation by offering a single hub where students can explore verified campus happenings, organizers can publish and manage attendees, and campus administrators can maintain an orderly, high-quality event calendar.
        </p>
      </div>

      {/* Key Highlights */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        {highlights.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.title} className="card" style={{ padding: '1.75rem' }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--primary-light)',
                  color: 'var(--primary)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem',
                }}
              >
                <Icon size={22} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                {item.title}
              </h3>
              <p className="text-secondary text-sm" style={{ lineHeight: 1.6 }}>
                {item.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Demonstration Notice */}
      <div
        style={{
          padding: '1.5rem',
          borderRadius: 'var(--radius-lg)',
          backgroundColor: 'var(--bg-subtle)',
          border: '1px solid var(--border-color)',
          marginBottom: '3rem',
        }}
      >
        <div className="flex items-start gap-3">
          <CheckCircle2 size={20} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.35rem' }}>
              Interactive Client-Side Demonstration
            </h4>
            <p className="text-secondary text-xs" style={{ lineHeight: 1.6 }}>
              This web application is an interactive prototype demonstrating modern user experience and responsive design. State persistence is handled securely within your local browser storage, allowing full exploration of Student, Organizer, and Administrator workflows without requiring external network services.
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-center gap-4 flex-wrap">
        <Link to="/events">
          <Button variant="primary">
            Explore Campus Events <ArrowRight size={16} />
          </Button>
        </Link>
      </div>
    </div>
  );
}
