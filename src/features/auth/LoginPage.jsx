import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Sparkles, User, Shield, Layers, GraduationCap, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { DEMO_ACCOUNTS } from '../../data/demoAccounts.js';
import { Input } from '../../components/ui/Input.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { useToast } from '../../components/ui/Toast.jsx';

export function LoginPage() {
  const { login, loginAsDemo } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const toast = useToast();

  const redirectUrl = searchParams.get('redirect') || '';
  const preselectedRole = searchParams.get('role');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const getDestination = (role) => {
    if (redirectUrl) return redirectUrl;
    if (role === 'admin') return '/admin/dashboard';
    if (role === 'organizer') return '/organizer/dashboard';
    return '/student/dashboard';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    try {
      setLoading(true);
      const user = await login(email, password);
      toast.success(`Welcome back, ${user.name}!`);
      navigate(getDestination(user.role));
    } catch (err) {
      setError(err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = async (role) => {
    setError('');
    try {
      setLoading(true);
      const user = await loginAsDemo(role);
      toast.success(`Logged in as ${user.name} (${user.role.toUpperCase()})`);
      navigate(getDestination(user.role));
    } catch (err) {
      setError(err.message || 'Demo login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '3.5rem 1rem', maxWidth: '540px' }}>
      <div className="card" style={{ padding: '2.5rem' }}>
        {/* Header */}
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
            <Sparkles size={26} />
          </div>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 800 }}>Welcome to Univents</h1>
          <p className="text-secondary text-sm" style={{ marginTop: '0.35rem' }}>
            Sign in to manage registrations, organize events, or moderate campus activity.
          </p>
        </div>

        {/* Quick Demo Switcher Section (Mandatory MVP F02) */}
        <div
          style={{
            backgroundColor: 'var(--bg-subtle)',
            border: '1px dashed var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
            marginBottom: '1.75rem',
          }}
        >
          <div className="flex items-center justify-between" style={{ marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--primary)' }}>
              1-Click Demo Accounts
            </span>
            <span className="text-xs text-muted">Simulated Access</span>
          </div>

          <div className="flex flex-col gap-2">
            {DEMO_ACCOUNTS.map((acc) => {
              const RoleIcon = acc.role === 'admin' ? Shield : acc.role === 'organizer' ? Layers : GraduationCap;
              return (
                <button
                  key={acc.role}
                  type="button"
                  onClick={() => handleQuickDemoLogin(acc.role)}
                  className="btn btn-secondary w-full"
                  style={{
                    justifyContent: 'space-between',
                    padding: '0.65rem 0.95rem',
                    height: 'auto',
                    textAlign: 'left',
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      style={{
                        padding: '0.45rem',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: 'var(--primary-light)',
                        color: 'var(--primary)',
                      }}
                    >
                      <RoleIcon size={16} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                        {acc.name}
                      </div>
                      <div className="text-xs text-secondary">
                        {acc.role.toUpperCase()} • {acc.department}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      style={{
                        position: 'relative',
                        width: 40,
                        height: 40,
                        flex: 'none',
                        overflow: 'hidden',
                        borderRadius: '50%',
                        backgroundColor: 'var(--primary-light)',
                        display: 'grid',
                        placeItems: 'center',
                        color: 'var(--primary)',
                        fontWeight: 700,
                        fontSize: '0.75rem',
                      }}
                    >
                      <span aria-hidden="true">
                        {acc.name.split(/\s+/).map((part) => part[0]).slice(0, 2).join('')}
                      </span>
                      {acc.avatarUrl && (
                        <img
                          src={acc.avatarUrl}
                          alt={`${acc.name} profile photo`}
                          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={(event) => { event.currentTarget.style.display = 'none'; }}
                        />
                      )}
                    </div>
                    <ArrowRight size={15} color="var(--text-muted)" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-3" style={{ margin: '1.5rem 0' }}>
          <div style={{ flex: 1, height: 1, backgroundColor: 'var(--border-color)' }} />
          <span className="text-xs text-muted" style={{ fontWeight: 600 }}>OR ENTER CREDENTIALS</span>
          <div style={{ flex: 1, height: 1, backgroundColor: 'var(--border-color)' }} />
        </div>

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

        <form onSubmit={handleSubmit}>
          <Input
            label="Email address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="manav@gmail.com"
            required
          />

          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />

          <div className="flex items-center justify-between" style={{ marginBottom: '1.5rem' }}>
            <span className="text-xs text-muted">Demo default password: password123</span>
            <Link to="/forgot-password" className="text-xs font-medium text-primary">
              Forgot password?
            </Link>
          </div>

          <Button type="submit" variant="primary" className="w-full" loading={loading}>
            Sign In
          </Button>
        </form>

        <p className="text-center text-sm text-secondary" style={{ marginTop: '1.75rem' }}>
          Don't have an account?{' '}
          <Link to="/signup" className="text-primary font-medium">
            Create a Student profile
          </Link>
        </p>
      </div>
    </div>
  );
}
