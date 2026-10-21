import { useState } from 'react';
import { Link, useNavigate, useSearchParams, Navigate } from 'react-router-dom';
import { Sparkles, Shield, Layers, GraduationCap, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { DEMO_ACCOUNTS } from '../../data/demoAccounts.js';
import { Input } from '../../components/ui/Input.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { useToast } from '../../components/ui/Toast.jsx';
import { validateEmail } from '../../utils/validation.js';

export function LoginPage() {
  const { user, isAuthenticated, login, loginAsDemo } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const toast = useToast();

  const redirectUrl = searchParams.get('redirect') || '';
  const preselectedRole = searchParams.get('role');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingDemoRole, setLoadingDemoRole] = useState(null);

  const getDestination = (role) => {
    const roleDashboard = role === 'admin'
      ? '/admin/dashboard'
      : role === 'organizer'
        ? '/organizer/dashboard'
        : '/student/dashboard';
    const requiredRole = redirectUrl.match(/^\/(admin|organizer|student)(?:\/|$)/)?.[1];
    const isLocalPath = redirectUrl.startsWith('/') && !redirectUrl.startsWith('//');

    if (isLocalPath && (!requiredRole || requiredRole === role)) return redirectUrl;
    return roleDashboard;
  };

  if (isAuthenticated && user) {
    return <Navigate to={getDestination(user.role)} replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setError('');

    if (!email.trim() || !password) {
      setError('Please provide both email and password.');
      return;
    }

    const emailErr = validateEmail(email);
    if (emailErr) {
      setError(emailErr);
      return;
    }

    try {
      setLoading(true);
      const loggedInUser = await login(email, password);
      setPassword('');
      toast.success(`Welcome back, ${loggedInUser.name}!`);
      navigate(getDestination(loggedInUser.role), { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed.');
      setPassword('');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = async (role) => {
    if (loading) return;
    setError('');
    setLoadingDemoRole(role);
    try {
      setLoading(true);
      const demoUser = await loginAsDemo(role);
      setPassword('');
      toast.success(`Logged in as ${demoUser.name} (${demoUser.role.toUpperCase()})`);
      navigate(getDestination(demoUser.role), { replace: true });
    } catch (err) {
      setError(err.message || 'Demo login failed.');
      setPassword('');
    } finally {
      setLoadingDemoRole(null);
      setLoading(false);
    }
  };

  return (
    <div className="container auth-page login-page">
      <div className="card auth-card login-card">
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
          <div className="login-demo-heading flex items-center justify-between" style={{ marginBottom: '0.75rem' }}>
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
                  className={`btn btn-secondary w-full login-demo-account${preselectedRole === acc.role ? ' is-preselected' : ''}`}
                  disabled={loading}
                  aria-busy={loading && loadingDemoRole === acc.role}
                  aria-label={`Sign in as ${acc.role}: ${acc.name}${preselectedRole === acc.role ? ', selected role' : ''}`}
                  style={{
                    justifyContent: 'space-between',
                    padding: '0.65rem 0.95rem',
                    height: 'auto',
                    textAlign: 'left',
                  }}
                >
                  <div className="flex items-center gap-3 login-demo-account__identity">
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
                    <div className="login-demo-account__details">
                      <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                        {acc.name}
                      </div>
                      <div className="text-xs text-secondary">
                        {acc.role.toUpperCase()} • {acc.department}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 login-demo-account__trailing">
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
                    {loading && loadingDemoRole === acc.role ? (
                      <span className="spinner" aria-hidden="true" style={{ width: 15, height: 15 }} />
                    ) : (
                      <ArrowRight size={15} color="var(--text-muted)" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="login-divider flex items-center gap-3" style={{ margin: '1.5rem 0' }}>
          <div style={{ flex: 1, height: 1, backgroundColor: 'var(--border-color)' }} />
          <span className="text-xs text-muted" style={{ fontWeight: 600 }}>OR ENTER CREDENTIALS</span>
          <div style={{ flex: 1, height: 1, backgroundColor: 'var(--border-color)' }} />
        </div>

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

        <form className="login-form" onSubmit={handleSubmit}>
          <Input
            label="Email address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="manav@chitkara.edu.in"
            required
          />

          <div className="form-group">
            <label htmlFor="login-password" className="form-label">
              <span>Password <span style={{ color: 'var(--error)' }}>*</span></span>
            </label>
            <div className="input-password-wrap">
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="input-password-toggle"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                aria-pressed={showPassword}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="login-password-helper flex items-center justify-between" style={{ marginBottom: '1.5rem' }}>
            <span className="text-xs text-muted">Demo default password: password123</span>
            <Link to="/forgot-password" className="text-xs font-medium text-primary">
              Forgot password?
            </Link>
          </div>

          <Button type="submit" variant="primary" className="w-full" loading={loading} aria-busy={loading}>
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
