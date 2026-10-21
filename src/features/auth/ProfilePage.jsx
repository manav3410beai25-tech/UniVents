import { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { Input } from '../../components/ui/Input.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { useToast } from '../../components/ui/Toast.jsx';
import { Check } from 'lucide-react';
import {
  AVAILABLE_AVATARS,
  DEFAULT_AVATAR_PATH,
  resolveAvatarUrl,
  isAvatarSelected,
} from '../../data/avatars.js';

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
  const [avatarUrl, setAvatarUrl] = useState(() => resolveAvatarUrl(user?.avatarUrl));
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
    if (saving) return;

    if (!name.trim()) {
      toast.error('Name cannot be empty.');
      return;
    }

    setSaving(true);
    try {
      updateProfile({
        name: name.trim(),
        department: department.trim(),
        avatarUrl: resolveAvatarUrl(avatarUrl),
        interests,
      });
      toast.success('Profile updated successfully!');
    } catch {
      toast.error('Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container profile-page">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Profile Settings</h1>
        <p className="text-secondary text-sm">
          Update your public campus persona, department affiliations and personal event interests.
        </p>
      </div>

      <div className="card profile-card">
        {/* Avatar Preview */}
        <div
          className="flex items-center gap-4"
          style={{
            marginBottom: '2rem',
            paddingBottom: '1.5rem',
            borderBottom: '1px solid var(--border-color)',
          }}
        >
          <img
            src={resolveAvatarUrl(avatarUrl)}
            alt={name || user?.name || 'Profile Avatar'}
            style={{
              width: 72,
              height: 72,
              flexShrink: 0,
              borderRadius: '50%',
              objectFit: 'cover',
              border: '2px solid var(--primary)',
            }}
            onError={(e) => {
              if (e.currentTarget.src !== DEFAULT_AVATAR_PATH) {
                e.currentTarget.src = DEFAULT_AVATAR_PATH;
              }
            }}
          />
          <div className="profile-header-meta">
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
            autoComplete="name"
          />

          <Input
            label="Department / Affiliation"
            type="text"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            placeholder="e.g. Computer Science & Engineering"
          />

          {/* Avatar Gallery Picker */}
          <div className="form-group" style={{ marginTop: '1.25rem' }}>
            <label className="form-label" id="avatar-picker-label">
              <span>Choose Profile Avatar</span>
            </label>
            <p className="text-xs text-secondary" style={{ marginBottom: '0.75rem' }}>
              Select an avatar from your campus collection to represent you across UniVents.
            </p>

            <div
              className="avatar-picker-grid"
              role="radiogroup"
              aria-labelledby="avatar-picker-label"
            >
              {AVAILABLE_AVATARS.map((avatar) => {
                const selected = isAvatarSelected(avatar, avatarUrl);
                return (
                  <button
                    key={avatar.id}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    aria-label={`${avatar.name}${avatar.isDefault ? ' (Default)' : ''}${selected ? ', selected' : ''}`}
                    onClick={() => setAvatarUrl(avatar.path)}
                    className={`avatar-option${selected ? ' is-selected' : ''}`}
                  >
                    <img
                      src={avatar.path}
                      alt=""
                      aria-hidden="true"
                      className="avatar-option__img"
                      onError={(e) => {
                        if (e.currentTarget.src !== DEFAULT_AVATAR_PATH) {
                          e.currentTarget.src = DEFAULT_AVATAR_PATH;
                        }
                      }}
                    />
                    {selected && (
                      <span className="avatar-option__check" aria-hidden="true">
                        <Check size={12} strokeWidth={3} />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

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
                    className={`profile-interest-chip${selected ? ' is-selected' : ''}`}
                    aria-pressed={selected}
                    aria-label={`${tag}${selected ? ', selected' : ''}`}
                  >
                    {selected && <Check size={13} />}
                    <span>{tag}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end" style={{ marginTop: '2rem' }}>
            <Button type="submit" variant="primary" loading={saving} aria-busy={saving}>
              Save Profile Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
