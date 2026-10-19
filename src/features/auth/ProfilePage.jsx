import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { Input } from '../../components/ui/Input.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { useToast } from '../../components/ui/Toast.jsx';
import { User, Mail, Building, Tag, Check, Image as ImageIcon } from 'lucide-react';

const POPULAR_INTERESTS = [
  'Technical',
  'Hackathons',
  'Workshops',
  'Career',
  'Design',
  'Sports',
  'Cultural',
  'Robotics',
  'AI & Data',
  'Entrepreneurship',
];

export function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const toast = useToast();

  const [name, setName] = useState(user?.name || '');
  const [department, setDepartment] = useState(user?.department || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');
  const [interests, setInterests] = useState(user?.interests || []);
  const [saving, setSaving] = useState(false);

  const toggleInterest = (interest) => {
    if (interests.includes(interest)) {
      setInterests(interests.filter((i) => i !== interest));
    } else {
      setInterests([...interests, interest]);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Name cannot be empty.');
      return;
    }

    setSaving(true);
    try {
      updateProfile({
        name: name.trim(),
        department: department.trim(),
        avatarUrl: avatarUrl.trim(),
        interests,
      });
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error('Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: 720, margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Profile Settings</h1>
        <p className="text-secondary text-sm">
          Update your public campus persona, department affiliations and personal event interests.
        </p>
      </div>

      <div className="card">
        {/* Avatar Preview */}
        <div className="flex items-center gap-4" style={{ marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
          <img
            src={avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
            alt={name}
            style={{ width: 72, height: 72, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary)' }}
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';
            }}
          />
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>{user?.name}</h3>
            <p className="text-xs text-secondary" style={{ textTransform: 'capitalize' }}>
              Role: <strong>{user?.role}</strong> • {user?.email}
            </p>
          </div>
        </div>

        <form onSubmit={handleSave}>
          <Input
            label="Display Name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <Input
            label="Department / Affiliation"
            type="text"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            placeholder="e.g. Computer Science & Engineering"
          />

          <Input
            label="Avatar Image URL"
            type="url"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            placeholder="https://..."
            hint="Enter a valid image URL for your avatar"
          />

          {/* Interests Picker */}
          <div className="form-group" style={{ marginTop: '1.25rem' }}>
            <label className="form-label">
              <span>Event Interests & Recommendations</span>
            </label>
            <p className="text-xs text-secondary" style={{ marginBottom: '0.75rem' }}>
              Select tags you enjoy to personalize suggestions on your student dashboard.
            </p>

            <div className="flex flex-wrap gap-2">
              {POPULAR_INTERESTS.map((tag) => {
                const selected = interests.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleInterest(tag)}
                    style={{
                      padding: '0.35rem 0.85rem',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      border: '1px solid',
                      borderColor: selected ? 'var(--primary)' : 'var(--border-color)',
                      backgroundColor: selected ? 'var(--primary-light)' : 'var(--bg-surface)',
                      color: selected ? 'var(--primary)' : 'var(--text-secondary)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {selected && <Check size={13} />}
                    <span>{tag}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end" style={{ marginTop: '2rem' }}>
            <Button type="submit" variant="primary" loading={saving}>
              Save Profile Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
