import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { KeyRound, CheckCircle2, ArrowLeft } from 'lucide-react';
import { Input } from '../../components/ui/Input.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { authService } from '../../services/authService.js';
import { validateEmail } from '../../utils/validation.js';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleReset = (e) => {
    e.preventDefault();
    setError('');

    const emailErr = validateEmail(email);
    if (emailErr) {
      setError(emailErr);
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      setError('Please provide a new demo password of at least 6 characters.');
      return;
    }

    try {
      authService.simulateResetPassword(email, newPassword);
      setSubmitted(true);
    } catch (err) {
      setError(err.message || 'Password reset simulation failed.');
    }
  };

  return (
    <div className="container" style={{ padding: '3.5rem 1rem', maxWidth: '520px' }}>
      <div className="card" style={{ padding: '2.5rem' }}>
        <div className="text-center" style={{ marginBottom: '2rem' }}>
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
            <KeyRound size={26} />
          </div>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 800 }}>Reset Password</h1>
          <p className="text-secondary text-sm" style={{ marginTop: '0.35rem' }}>
            Simulate a self-service password reset for your local demo account.
          </p>
        </div>

        {submitted ? (
          <div className="text-center">
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
              <p style={{ fontWeight: 600, fontSize: '1rem' }}>Demo Password Updated!</p>
              <p className="text-xs" style={{ marginTop: '0.25rem' }}>
                Your local credential record for <strong>{email}</strong> has been updated to your new password. You can now sign in immediately.
              </p>
            </div>
            <Link to="/login">
              <Button variant="primary" className="w-full">
                Return to Sign In
              </Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleReset}>
            {error && (
              <div
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
              label="Account Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. alex.rivera@university.edu"
              required
            />

            <Input
              label="New Demo Password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="At least 6 characters"
              required
            />

            <div
              style={{
                padding: '0.75rem',
                backgroundColor: 'var(--bg-subtle)',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.75rem',
                color: 'var(--text-secondary)',
                marginBottom: '1.5rem',
              }}
            >
              <strong>Notice:</strong> This is a browser demonstration. No real emails or SMS are dispatched. The stored demo account credential is updated in your local browser storage.
            </div>

            <Button type="submit" variant="primary" className="w-full">
              Update Demo Password
            </Button>

            <div className="text-center" style={{ marginTop: '1.5rem' }}>
              <Link to="/login" className="flex items-center justify-center gap-2 text-sm text-secondary">
                <ArrowLeft size={16} />
                <span>Back to Sign In</span>
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
