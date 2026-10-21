// Banner artwork is keyed by the stable event ID, never by list position.
// These existing, topic-matched stock images are also available as explicit editor presets.
const banners = {
  evt_hackathon_2026: {
    label: 'Hackathon collaboration',
    url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&auto=format&fit=crop&q=80',
  },
  evt_ai_summit: {
    label: 'AI and robotics',
    url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1200&auto=format&fit=crop&q=80',
  },
  evt_career_fair: {
    label: 'Career networking',
    url: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=1200&auto=format&fit=crop&q=80',
  },
  evt_design_sprint: {
    label: 'Design workshop',
    url: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=1200&auto=format&fit=crop&q=80',
  },
  evt_cultural_night: {
    label: 'Live music',
    url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1200&auto=format&fit=crop&q=80',
  },
  evt_intramural_soccer: {
    label: 'Soccer tournament',
    url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200&auto=format&fit=crop&q=80',
  },
  evt_past_web3: {
    label: 'Web development',
    url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&auto=format&fit=crop&q=80',
  },
  evt_almost_full: {
    label: 'Cybersecurity',
    url: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1200&auto=format&fit=crop&q=80',
  },
  evt_pending_drone: {
    label: 'Drones and robotics',
    url: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=1200&auto=format&fit=crop&q=80',
  },
  evt_rejected_party: {
    label: 'Concert crowd',
    url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&auto=format&fit=crop&q=80',
  },
  evt_draft_workshop: {
    label: 'Programming workshop',
    url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=80',
  },
};

export const EVENT_IMAGE_FALLBACK = '/images/event-placeholder.svg';
export const EVENT_BANNERS_BY_ID = Object.freeze(banners);
// Used by older event creation code as the default for every event.
export const LEGACY_DEFAULT_EVENT_BANNER = EVENT_BANNERS_BY_ID.evt_hackathon_2026.url;
export const EVENT_BANNER_PRESETS = Object.entries(banners).map(([eventId, banner]) => ({
  id: eventId,
  ...banner,
}));

export function getEventBanner(eventId) {
  return EVENT_BANNERS_BY_ID[eventId]?.url || EVENT_IMAGE_FALLBACK;
}
