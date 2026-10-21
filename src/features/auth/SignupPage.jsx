import { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { GraduationCap, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { Input, Select } from '../../components/ui/Input.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { useToast } from '../../components/ui/Toast.jsx';
import { validateEmail, validatePassword } from '../../utils/validation.js';

const DEPARTMENTS = [
  { value: 'Computer Science', label: 'Computer Science & Software' },
  { value: 'Electrical Engineering', label: 'Electrical & Computer Engineering' },
  { value: 'Business Administration', label: 'Business & Management' },
  { value: 'Design & Media', label: 'Art, Design & Digital Media' },
  { value: 'Biological Sciences', label: 'Biological Sciences & Medicine' },
  { value: 'Humanities', label: 'Humanities & Social Sciences' },
];

export function SignupPage() {
  const { user, isAuthenticated, signup } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('Computer Science');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (isAuthenticated && user) {
    return <Navigate to="/student/dashboard" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setError('');

    const emailErr = validateEmail(email);
    if (emailErr) {
      setError(emailErr);
      return;
    }

    const passErr = validatePassword(password);
    if (passErr) {
      setError(passErr);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setLoading(true);
      const createdUser = await signup({
        name,
        email,
        department,
        password,
        interests: ['Technical', 'Workshops'],
      });
      setPassword('');
      setConfirmPassword('');
      toast.success(`Account created! Welcome, ${createdUser.name}`);
      navigate('/student/dashboard', { replace: true });
    } catch (err) {
      setError(err.message || 'Signup failed.');
      setPassword('');
      setConfirmPassword('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container auth-page">
      <div className="card auth-card">
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
            <GraduationCap size={26} />
          </div>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 800 }}>Create Student Account</h1>
          <p className="text-secondary text-sm" style={{ marginTop: '0.35rem' }}>
            Join Univents to register for campus events, save favorites and receive reminders.
          </p>
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

        <form onSubmit={handleSubmit}>
          <Input
            label="Full name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Manav"
            required
            autoComplete="name"
          />

          <Input
            label="University Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="manav@chitkara.edu.in"
            required
            autoComplete="email"
          />

          <Select
            label="Department / Faculty"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            options={DEPARTMENTS}
            required
          />

          <div className="form-group">
            <label htmlFor="signup-password" className="form-label">
              <span>Password <span style={{ color: 'var(--error)' }}>*</span></span>
            </label>
            <div className="input-password-wrap">
              <input
                id="signup-password"
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
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

          <div className="form-group">
            <label htmlFor="signup-confirm-password" className="form-label">
              <span>Confirm Password <span style={{ color: 'var(--error)' }}>*</span></span>
            </label>
            <div className="input-password-wrap">
              <input
                id="signup-confirm-password"
                type={showConfirmPassword ? 'text' : 'password'}
                className="form-input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat password"
                required
                autoComplete="new-password"
              />
              <button
                type="button"
                className="input-password-toggle"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                aria-pressed={showConfirmPassword}
                tabIndex={-1}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

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
            <strong>Note:</strong> Public signup creates a verified Student profile. Organizer and Administrative demo roles can be switched directly via the Sign In screen.
          </div>

          <Button type="submit" variant="primary" className="w-full" loading={loading} aria-busy={loading}>
            Create Account & Enter Portal
          </Button>
        </form>

        <p className="text-center text-sm text-secondary" style={{ marginTop: '1.75rem' }}>
          Already have an account?{' '}
          <Link to="/login" className="text-primary font-medium">
            Sign In here
          </Link>
        </p>
      </div>
    </div>
  );
}
