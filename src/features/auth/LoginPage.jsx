import { useState } from 'react';
import { Link, useNavigate, useSearchParams, Navigate } from 'react-router-dom';
import {
  Sparkles,
  Shield,
  Layers,
  GraduationCap,
  ArrowRight,
  Eye,
  EyeOff,
  Calendar,
  Users,
  Trophy,
} from 'lucide-react';
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

  const [portalMode, setPortalMode] = useState(() => {
    if (preselectedRole === 'organizer' || preselectedRole === 'admin') {
      return 'organizer-admin';
    }
    return 'student';
  });

  const handlePortalSwitch = (mode) => {
    if (mode === portalMode) return;
    setPortalMode(mode);
    setEmail('');
    setPassword('');
    setError('');
  };

  const handleToggleKeyDown = (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault();
      handlePortalSwitch(portalMode === 'student' ? 'organizer-admin' : 'student');
    }
  };

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
      const loggedInUser = await login(email, password, portalMode);
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
      const demoUser = await loginAsDemo(role, portalMode);
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

  const visibleDemoAccounts = DEMO_ACCOUNTS.filter((acc) =>
    portalMode === 'student'
      ? acc.role === 'student'
      : acc.role === 'organizer' || acc.role === 'admin'
  );

  return (
    <div className="login-split-page">
      <div className="login-split-container">
        {/* Left Side — Visual Campus Panel (Desktop Only) */}
        <aside className="login-visual-panel" aria-label="Campus Visual & Highlights">
          <div className="login-visual-panel__bg" />
          <div className="login-visual-panel__overlay" />
          <div className="login-visual-panel__content">
            <div className="login-visual-brand flex items-center gap-3">
              <span className="brand-mark" aria-hidden="true">
                <img src={`${import.meta.env.BASE_URL}uselogo.jpg`} alt="" className="brand-mark__image" />
              </span>
              <div className="flex flex-col">
                <span className="login-visual-brand__title">UniVents</span>
                <span className="login-visual-brand__tagline">One Campus. Every Event.</span>
              </div>
            </div>

            <div className="login-visual-hero">
              <p className="login-visual-eyebrow">
                CAMPUS EVENTS. BRIGHTER TOGETHER.
              </p>
              <h1 className="login-visual-headline">
                Discover.<br />
                Participate.<br />
                Belong.
              </h1>
              <p className="login-visual-subtext">
                Explore events, build skills, and be part of a vibrant campus community.
              </p>
            </div>

            <div className="login-visual-features">
              <div className="login-visual-feature-item">
                <div className="login-visual-feature-icon">
                  <Calendar size={18} />
                </div>
                <div>
                  <div className="login-visual-feature-title">Academic Events</div>
                  <div className="login-visual-feature-desc">Workshops, seminars and more</div>
                </div>
              </div>

              <div className="login-visual-feature-item">
                <div className="login-visual-feature-icon">
                  <Users size={18} />
                </div>
                <div>
                  <div className="login-visual-feature-title">Student Community</div>
                  <div className="login-visual-feature-desc">Connect and grow together</div>
                </div>
              </div>

              <div className="login-visual-feature-item">
                <div className="login-visual-feature-icon">
                  <Trophy size={18} />
                </div>
                <div>
                  <div className="login-visual-feature-title">Meaningful Experiences</div>
                  <div className="login-visual-feature-desc">Certificates, networks and opportunities</div>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Right Side — Login Card Panel */}
        <div className="login-form-panel">
          <div className="card auth-card login-card">
            {/* Header */}
            <div className="text-center" style={{ marginBottom: '1.75rem' }}>
              <div
                className="login-badge"
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  marginBottom: '1rem',
                  boxShadow: '0 4px 14px rgba(22, 119, 200, 0.28)',
                }}
              >
                <Sparkles size={26} />
              </div>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-main)' }}>
                Welcome to UniVents
              </h1>
              <p className="text-secondary text-sm" style={{ marginTop: '0.35rem', maxWidth: '38ch', marginInline: 'auto', lineHeight: 1.5 }}>
                Sign in to manage registrations, organize events, or moderate campus activity.
              </p>
            </div>

            {/* Pill-Style Segmented Toggle */}
            <div
              className="login-portal-toggle"
              role="tablist"
              aria-label="Portal Selection"
              onKeyDown={handleToggleKeyDown}
            >
              <button
                type="button"
                role="tab"
                id="portal-tab-student"
                aria-selected={portalMode === 'student'}
                aria-controls="portal-panel"
                tabIndex={portalMode === 'student' ? 0 : -1}
                onClick={() => handlePortalSwitch('student')}
                className={`login-portal-tab${portalMode === 'student' ? ' is-active' : ''}`}
              >
                <GraduationCap size={18} />
                <span>Student</span>
              </button>
              <button
                type="button"
                role="tab"
                id="portal-tab-organizer-admin"
                aria-selected={portalMode === 'organizer-admin'}
                aria-controls="portal-panel"
                tabIndex={portalMode === 'organizer-admin' ? 0 : -1}
                onClick={() => handlePortalSwitch('organizer-admin')}
                className={`login-portal-tab${portalMode === 'organizer-admin' ? ' is-active' : ''}`}
              >
                <Shield size={17} />
                <span>Organizer / Admin</span>
              </button>
            </div>

            {/* Contextual Mode Info */}
            <div
              id="portal-panel"
              role="tabpanel"
              aria-labelledby={portalMode === 'student' ? 'portal-tab-student' : 'portal-tab-organizer-admin'}
              className="login-portal-context"
            >
              <h2 className="login-portal-title">
                {portalMode === 'student' ? 'Student Sign In' : 'Organizer & Admin Sign In'}
              </h2>
              <p className="login-portal-desc">
                {portalMode === 'student'
                  ? 'Discover events, register for campus activities, and manage your registrations.'
                  : 'Manage campus events, review attendee submissions, and moderate activities.'}
              </p>
            </div>

            {/* Simplified Demo Accounts Section */}
            <div className="login-demo-box">
              <div className="login-demo-header flex items-center justify-between" style={{ marginBottom: '0.65rem' }}>
                <span className="login-demo-title" style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)', letterSpacing: '0.02em' }}>
                  Demo Accounts
                </span>
                <span className="text-xs text-muted" style={{ fontWeight: 500 }}>Optional</span>
              </div>

              <div className="flex flex-col gap-2">
                {visibleDemoAccounts.map((acc) => {
                  const RoleIcon = acc.role === 'admin' ? Shield : acc.role === 'organizer' ? Layers : GraduationCap;
                  const roleLabel = acc.role === 'admin' ? 'Administrator' : acc.role === 'organizer' ? 'Organizer' : 'Student';
                  return (
                    <button
                      key={acc.role}
                      type="button"
                      onClick={() => handleQuickDemoLogin(acc.role)}
                      className={`btn btn-secondary w-full login-demo-account${preselectedRole === acc.role ? ' is-preselected' : ''}`}
                      disabled={loading}
                      aria-busy={loading && loadingDemoRole === acc.role}
                      aria-label={`Sign in as ${roleLabel}: ${acc.name}`}
                    >
                      <div className="flex items-center gap-3 login-demo-account__identity">
                        <div
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: 'var(--radius-sm)',
                            backgroundColor: 'var(--primary-light)',
                            color: 'var(--primary)',
                            display: 'grid',
                            placeItems: 'center',
                            flexShrink: 0,
                          }}
                        >
                          <RoleIcon size={16} />
                        </div>
                        <div className="login-demo-account__details">
                          <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)', lineHeight: 1.25 }}>
                            {acc.name}
                          </div>
                          <div className="text-xs text-secondary" style={{ marginTop: '1px' }}>
                            {roleLabel}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 login-demo-account__trailing">
                        <div
                          style={{
                            position: 'relative',
                            width: 32,
                            height: 32,
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
                          <span className="spinner" aria-hidden="true" style={{ width: 14, height: 14 }} />
                        ) : (
                          <ArrowRight size={14} color="var(--text-muted)" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="login-divider flex items-center gap-3" style={{ margin: '1.5rem 0' }}>
              <div style={{ flex: 1, height: 1, backgroundColor: 'var(--border-color)' }} />
              <span className="text-xs text-muted" style={{ fontWeight: 600, letterSpacing: '0.04em' }}>OR ENTER CREDENTIALS</span>
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

            <form className="login-form" onSubmit={handleSubmit} autoComplete="off">
              <Input
                id="login-email"
                name="univents_login_email"
                label="Email address"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Enter your email address"
                required
                autoComplete="off"
              />

              <div className="form-group">
                <label htmlFor="login-password" className="form-label">
                  <span>Password <span style={{ color: 'var(--error)' }}>*</span></span>
                </label>
                <div className="input-password-wrap">
                  <input
                    id="login-password"
                    name="univents_login_password"
                    type={showPassword ? 'text' : 'password'}
                    className="form-input"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (error) setError('');
                    }}
                    placeholder="Enter your password"
                    required
                    autoComplete="new-password"
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

            {portalMode === 'student' ? (
              <p className="text-center text-sm text-secondary login-footer-note" style={{ marginTop: '1.75rem' }}>
                Don't have an account?{' '}
                <Link to="/signup" className="text-primary font-medium">
                  Create a Student Profile
                </Link>
              </p>
            ) : (
              <p className="text-center text-sm text-secondary login-footer-note login-authorized-note" style={{ marginTop: '1.75rem' }}>
                Organizer and administrator access is restricted to authorized campus accounts.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
