import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, GraduationCap } from 'lucide-react';
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
  const { signup } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('Computer Science');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      const user = await signup({
        name,
        email,
        department,
        password,
        interests: ['Technical', 'Workshops'],
      });
      toast.success(`Account created! Welcome, ${user.name}`);
      navigate('/student/dashboard');
    } catch (err) {
      setError(err.message || 'Signup failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '3.5rem 1rem', maxWidth: '540px' }}>
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
            <GraduationCap size={26} />
          </div>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 800 }}>Create Student Account</h1>
          <p className="text-secondary text-sm" style={{ marginTop: '0.35rem' }}>
            Join Univents to register for campus events, save favorites and receive reminders.
          </p>
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
            label="Full name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Sam Taylor"
            required
          />

          <Input
            label="University Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="e.g. sam.taylor@university.edu"
            required
          />

          <Select
            label="Department / Faculty"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            options={DEPARTMENTS}
            required
          />

          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 6 characters"
            required
          />

          <Input
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repeat password"
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
            <strong>Note:</strong> Public signup creates a verified Student profile. Organizer and Administrative demo roles can be switched directly via the Sign In screen.
          </div>

          <Button type="submit" variant="primary" className="w-full" loading={loading}>
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
