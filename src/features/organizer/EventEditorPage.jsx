import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Send, Save, AlertCircle, Image as ImageIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useEvents } from '../../context/EventContext.jsx';
import { useToast } from '../../components/ui/Toast.jsx';
import { Input, Select } from '../../components/ui/Input.jsx';
import { Button } from '../../components/ui/Button.jsx';

const DEMO_BANNERS = [
  { label: 'Coding / Hackathon', url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&auto=format&fit=crop&q=80' },
  { label: 'AI & Robotics Tech', url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1200&auto=format&fit=crop&q=80' },
  { label: 'Career Fair & Networking', url: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=1200&auto=format&fit=crop&q=80' },
  { label: 'Creative Design & Figma', url: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=1200&auto=format&fit=crop&q=80' },
  { label: 'Cultural & Music Fest', url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1200&auto=format&fit=crop&q=80' },
  { label: 'Sports & Athletics', url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200&auto=format&fit=crop&q=80' },
];

export function EventEditorPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { events, categories, createEvent, updateEvent } = useEvents();
  const toast = useToast();

  const isEditing = Boolean(eventId);
  const existingEvent = isEditing ? events.find((e) => e.id === eventId) : null;

  // Form State
  const [title, setTitle] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [bannerUrl, setBannerUrl] = useState(DEMO_BANNERS[0].url);
  const [startAt, setStartAt] = useState('');
  const [endAt, setEndAt] = useState('');
  const [registrationDeadline, setRegistrationDeadline] = useState('');
  const [venue, setVenue] = useState('');
  const [capacity, setCapacity] = useState(100);
  const [fee, setFee] = useState(0);
  const [tags, setTags] = useState('');
  const [agenda, setAgenda] = useState([{ time: '10:00 AM', title: 'Opening' }]);

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (categories.length > 0 && !categoryId) {
      setCategoryId(categories[0].id);
    }
  }, [categories, categoryId]);

  useEffect(() => {
    if (existingEvent) {
      // Security check
      if (existingEvent.organizerId !== user?.id && user?.role !== 'admin') {
        toast.error('You do not have permission to edit this event.');
        navigate('/organizer/events');
        return;
      }
      setTitle(existingEvent.title || '');
      setShortDescription(existingEvent.shortDescription || '');
      setDescription(existingEvent.description || '');
      setCategoryId(existingEvent.categoryId || '');
      setBannerUrl(existingEvent.bannerUrl || DEMO_BANNERS[0].url);
      setStartAt(existingEvent.startAt ? existingEvent.startAt.slice(0, 16) : '');
      setEndAt(existingEvent.endAt ? existingEvent.endAt.slice(0, 16) : '');
      setRegistrationDeadline(existingEvent.registrationDeadline ? existingEvent.registrationDeadline.slice(0, 16) : '');
      setVenue(existingEvent.venue || '');
      setCapacity(existingEvent.capacity || 100);
      setFee(existingEvent.fee || 0);
      setTags((existingEvent.tags || []).join(', '));
      setAgenda(existingEvent.agenda || []);
    }
  }, [existingEvent, user, navigate, toast]);

  // Agenda list manipulation
  const addAgendaItem = () => {
    setAgenda([...agenda, { time: '', title: '' }]);
  };

  const removeAgendaItem = (idx) => {
    setAgenda(agenda.filter((_, i) => i !== idx));
  };

  const updateAgendaItem = (idx, field, value) => {
    const updated = [...agenda];
    updated[idx][field] = value;
    setAgenda(updated);
  };

  // Image Upload handler (with size validation & base64 preview per Phase 4 spec)
  const handleCustomUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload a valid image file (PNG, JPG, WebP).');
      return;
    }

    // Limit to 300KB to prevent localStorage overflow
    if (file.size > 300 * 1024) {
      toast.error('Image is too large for demo storage! Please select an image under 300KB or choose a demo banner.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setBannerUrl(reader.result);
      toast.success('Custom banner uploaded.');
    };
    reader.readAsDataURL(file);
  };

  const validateForm = () => {
    if (!title.trim()) return 'Event title is required.';
    if (!description.trim()) return 'Event description is required.';
    if (!venue.trim()) return 'Venue location is required.';
    if (!startAt) return 'Event start time is required.';
    if (!endAt) return 'Event end time is required.';

    const startTime = new Date(startAt).getTime();
    const endTime = new Date(endAt).getTime();
    if (endTime <= startTime) {
      return 'Event end time must be after the start time.';
    }

    if (registrationDeadline) {
      const deadlineTime = new Date(registrationDeadline).getTime();
      if (deadlineTime > startTime) {
        return 'Registration deadline cannot be after the event start time.';
      }
    }

    if (Number(capacity) < 1) {
      return 'Capacity must be at least 1 seat.';
    }

    return null;
  };

  const handleSave = (status) => {
    setError('');
    const validationErr = validateForm();
    if (validationErr) {
      setError(validationErr);
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        title,
        shortDescription,
        description,
        categoryId,
        bannerUrl,
        startAt: new Date(startAt).toISOString(),
        endAt: new Date(endAt).toISOString(),
        registrationDeadline: registrationDeadline
          ? new Date(registrationDeadline).toISOString()
          : new Date(startAt).toISOString(),
        venue,
        capacity: Number(capacity),
        fee: Number(fee),
        tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
        agenda: agenda.filter((a) => a.title.trim()),
        status, // 'draft' or 'pending'
      };

      if (isEditing) {
        updateEvent(existingEvent.id, payload);
        toast.success(status === 'pending' ? 'Event submitted to admin queue!' : 'Draft updated.');
      } else {
        createEvent(payload);
        toast.success(status === 'pending' ? 'Event created & submitted for review!' : 'Draft event saved.');
      }

      navigate('/organizer/events');
    } catch (err) {
      setError(err.message || 'Failed to save event.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', paddingBottom: '3rem' }}>
      {/* Back button */}
      <div style={{ marginBottom: '1.5rem' }}>
        <Link to="/organizer/events" className="flex items-center gap-2 text-sm text-secondary hover:text-primary">
          <ArrowLeft size={16} />
          <span>Back to Organizer Events</span>
        </Link>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800 }}>
          {isEditing ? 'Edit Campus Event' : 'Create New Campus Event'}
        </h1>
        <p className="text-secondary text-sm">
          Define event agenda, upload banners, and submit for university administrative review.
        </p>
      </div>

      {existingEvent?.status === 'rejected' && (
        <div
          style={{
            backgroundColor: 'var(--error-light)',
            border: '1px solid var(--error-text)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem',
            marginBottom: '1.5rem',
            fontSize: '0.875rem',
          }}
        >
          <strong>Administrator Feedback:</strong> {existingEvent.rejectionReason}
        </div>
      )}

      {error && (
        <div
          style={{
            backgroundColor: 'var(--error-light)',
            color: 'var(--error-text)',
            borderRadius: 'var(--radius-md)',
            padding: '0.85rem',
            marginBottom: '1.5rem',
            fontSize: '0.85rem',
          }}
        >
          {error}
        </div>
      )}

      <div className="card">
        {/* Banner Preview & Preset Picker */}
        <div style={{ marginBottom: '2rem' }}>
          <label className="form-label" style={{ marginBottom: '0.5rem' }}>
            <span>Event Banner</span>
          </label>
          <div
            style={{
              height: 200,
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              backgroundColor: '#0f172a',
              marginBottom: '1rem',
              border: '1px solid var(--border-color)',
            }}
          >
            <img
              src={bannerUrl}
              alt="Banner Preview"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          <p className="text-xs text-secondary" style={{ marginBottom: '0.5rem' }}>
            Choose from high-res demo presets or upload your own:
          </p>
          <div className="flex flex-wrap gap-2" style={{ marginBottom: '1rem' }}>
            {DEMO_BANNERS.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => setBannerUrl(preset.url)}
                className="btn btn-secondary btn-sm text-xs"
                style={{
                  borderColor: bannerUrl === preset.url ? 'var(--primary)' : 'var(--border-color)',
                  color: bannerUrl === preset.url ? 'var(--primary)' : 'var(--text-secondary)',
                }}
              >
                {preset.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <label className="btn btn-secondary btn-sm" style={{ cursor: 'pointer' }}>
              <ImageIcon size={15} />
              <span>Upload Custom Image (&lt;300KB)</span>
              <input type="file" accept="image/*" onChange={handleCustomUpload} style={{ display: 'none' }} />
            </label>
          </div>
        </div>

        {/* Basic Fields */}
        <Input
          label="Event Title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. AI & Full-Stack Innovation Hackathon"
          required
        />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <Select
            label="Category"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            options={categories.filter((c) => c.isActive)}
            required
          />

          <Input
            label="Venue Location"
            type="text"
            value={venue}
            onChange={(e) => setVenue(e.target.value)}
            placeholder="e.g. Science Auditorium 101"
            required
          />
        </div>

        <Input
          label="Short Summary"
          type="text"
          value={shortDescription}
          onChange={(e) => setShortDescription(e.target.value)}
          placeholder="Brief 1-sentence highlight for event card..."
        />

        <div className="form-group">
          <label className="form-label">
            <span>Detailed Event Description *</span>
          </label>
          <textarea
            className="form-textarea"
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Provide a comprehensive breakdown of the event, learning outcomes, rules, and student expectations..."
            required
          />
        </div>

        {/* Dates & Capacity */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          <Input
            label="Start Date & Time"
            type="datetime-local"
            value={startAt}
            onChange={(e) => setStartAt(e.target.value)}
            required
          />

          <Input
            label="End Date & Time"
            type="datetime-local"
            value={endAt}
            onChange={(e) => setEndAt(e.target.value)}
            required
          />

          <Input
            label="Registration Deadline"
            type="datetime-local"
            value={registrationDeadline}
            onChange={(e) => setRegistrationDeadline(e.target.value)}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
          <Input
            label="Maximum Capacity (Seats)"
            type="number"
            min={1}
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            required
          />

          <Input
            label="Ticket Fee ($)"
            type="number"
            min={0}
            step="0.01"
            value={fee}
            onChange={(e) => setFee(e.target.value)}
            hint="Set 0 for Free admission"
          />

          <Input
            label="Tags (Comma separated)"
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="AI, Code, Prizes"
          />
        </div>

        {/* Dynamic Agenda Builder */}
        <div style={{ marginTop: '1.5rem', marginBottom: '2rem' }}>
          <div className="flex items-center justify-between" style={{ marginBottom: '0.75rem' }}>
            <label className="form-label" style={{ margin: 0 }}>
              <span>Event Agenda &amp; Timeline</span>
            </label>
            <Button variant="secondary" size="sm" icon={Plus} onClick={addAgendaItem}>
              Add Session
            </Button>
          </div>

          <div className="flex flex-col gap-2">
            {agenda.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  className="form-input"
                  style={{ width: '160px' }}
                  placeholder="e.g. 10:00 AM"
                  value={item.time}
                  onChange={(e) => updateAgendaItem(idx, 'time', e.target.value)}
                />
                <input
                  type="text"
                  className="form-input flex-1"
                  placeholder="Session title or description"
                  value={item.title}
                  onChange={(e) => updateAgendaItem(idx, 'title', e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => removeAgendaItem(idx)}
                  className="btn btn-ghost btn-sm"
                  style={{ color: 'var(--error)' }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div
          className="flex items-center justify-between pt-4"
          style={{ borderTop: '1px solid var(--border-color)' }}
        >
          <Button
            variant="secondary"
            icon={Save}
            onClick={() => handleSave('draft')}
            loading={submitting}
          >
            Save as Draft
          </Button>

          <Button
            variant="primary"
            icon={Send}
            onClick={() => handleSave('pending')}
            loading={submitting}
          >
            Submit for Admin Review
          </Button>
        </div>
      </div>
    </div>
  );
}
