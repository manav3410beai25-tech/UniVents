import { useState } from 'react';
import { Mail, Send, AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Input } from '../../components/ui/Input.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { validateEmail } from '../../utils/validation.js';

export function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please provide your name.');
      return;
    }

    const emailErr = validateEmail(email);
    if (emailErr) {
      setError(emailErr);
      return;
    }

    if (!subject.trim()) {
      setError('Please provide a subject.');
      return;
    }

    if (!message.trim() || message.trim().length < 10) {
      setError('Please provide a message of at least 10 characters.');
      return;
    }

    // Set submitted state with truthful disclosure
    setSubmitted(true);
  };

  const handleReset = () => {
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
    setError('');
    setSubmitted(false);
  };

  return (
    <div className="container" style={{ padding: 'clamp(2rem, 5vw, 3.5rem) var(--gutter-mobile)', maxWidth: '680px' }}>
      {/* Header */}
      <div className="text-center" style={{ marginBottom: '2.5rem' }}>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 'var(--radius-lg)',
            backgroundColor: 'var(--primary)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            marginBottom: '1rem',
            boxShadow: 'var(--shadow-md)',
          }}
        >
          <Mail size={24} />
        </div>
        <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.4rem)', fontWeight: 800 }}>Contact UniVents</h1>
        <p className="text-secondary text-sm" style={{ marginTop: '0.5rem', maxWidth: '480px', marginInline: 'auto' }}>
          Have feedback or suggestions regarding the campus event discovery portal?
        </p>
      </div>

      <div className="card" style={{ padding: 'clamp(1.5rem, 4vw, 2.5rem)' }}>
        {/* Transparent Disclosure Notice */}
        <div
          style={{
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--bg-subtle)',
            border: '1px solid var(--border-color)',
            marginBottom: '1.75rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.75rem',
          }}
        >
          <AlertCircle size={18} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
          <p className="text-xs text-secondary" style={{ lineHeight: 1.55 }}>
            <strong>Demonstration Notice:</strong> UniVents is a client-side prototype. It operates entirely within your local browser without an active mail server or external delivery service. Form submissions are recorded locally for demonstration purposes only and cannot be transmitted over a network.
          </p>
        </div>

        {submitted ? (
          <div className="text-center" style={{ padding: '1rem 0' }}>
            <div
              style={{
                backgroundColor: 'var(--success-light)',
                color: 'var(--success-text)',
                padding: '1.25rem',
                borderRadius: 'var(--radius-md)',
                marginBottom: '1.5rem',
              }}
            >
              <CheckCircle2 size={32} style={{ margin: '0 auto 0.5rem auto' }} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Inquiry Recorded Locally</h3>
              <p className="text-xs" style={{ marginTop: '0.35rem', lineHeight: 1.6 }}>
                Thank you for testing the form, <strong>{name}</strong>. As disclosed above, because this project runs in client-side demonstration mode with no external backend, no email has been transmitted.
              </p>
            </div>

            <Button variant="secondary" onClick={handleReset}>
              Send Another Note
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && (
              <div
                role="alert"
                aria-live="polite"
                style={{
                  padding: '0.85rem',
                  backgroundColor: 'var(--error-light)',
                  color: 'var(--error-text)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.85rem',
                  marginBottom: '1.25rem',
                }}
              >
                {error}
              </div>
            )}

            <Input
              label="Your Name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Manav Arora"
              required
              autoComplete="name"
            />

            <Input
              label="Your Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@university.edu"
              required
              autoComplete="email"
            />

            <Input
              label="Subject"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Event Category Suggestion"
              required
            />

            <div className="form-group">
              <label htmlFor="contact-message" className="form-label">
                <span>Message <span style={{ color: 'var(--error)' }}>*</span></span>
              </label>
              <textarea
                id="contact-message"
                className="form-textarea"
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Share your thoughts, suggestions, or bug reports..."
                required
              />
            </div>

            <Button type="submit" variant="primary" className="w-full" icon={Send}>
              Record Demonstration Message
            </Button>

            <div className="text-center" style={{ marginTop: '1.5rem' }}>
              <Link to="/" className="flex items-center justify-center gap-2 text-sm text-secondary">
                <ArrowLeft size={16} />
                <span>Return to Home</span>
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
