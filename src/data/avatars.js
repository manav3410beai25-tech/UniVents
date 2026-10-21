export const DEFAULT_AVATAR_PATH = `${import.meta.env.BASE_URL}images/demo/default.png`;

export const AVAILABLE_AVATARS = [
  {
    id: 'default',
    name: 'Default Avatar',
    filename: 'default.png',
    path: `${import.meta.env.BASE_URL}images/demo/default.png`,
    isDefault: true,
  },
  {
    id: 'harry',
    name: 'Scholar Avatar',
    filename: 'Harry.jpg',
    path: `${import.meta.env.BASE_URL}images/demo/Harry.jpg`,
  },
  {
    id: 'pfp',
    name: 'Student Portrait',
    filename: 'pfp.jpg',
    path: `${import.meta.env.BASE_URL}images/demo/pfp.jpg`,
  },
  {
    id: 'pfp2',
    name: 'Campus Casual',
    filename: 'pfp2.png',
    path: `${import.meta.env.BASE_URL}images/demo/pfp2.png`,
  },
  {
    id: 'pfp3',
    name: 'Creative Avatar',
    filename: 'pfp3.png',
    path: `${import.meta.env.BASE_URL}images/demo/pfp3.png`,
  },
  {
    id: 'ronaldo',
    name: 'Athletic Avatar',
    filename: 'ronaldo.jpg',
    path: `${import.meta.env.BASE_URL}images/demo/ronaldo.jpg`,
  },
  {
    id: 'spd',
    name: 'Leadership Avatar',
    filename: 'spd.jpg',
    path: `${import.meta.env.BASE_URL}images/demo/spd.jpg`,
  },
];

export function resolveAvatarUrl(avatarUrl) {
  if (!avatarUrl || typeof avatarUrl !== 'string' || !avatarUrl.trim()) {
    return DEFAULT_AVATAR_PATH;
  }
  const trimmed = avatarUrl.trim();
  // Remote URLs (e.g. seeded Unsplash URLs)
  if (/^(https?:|\/\/|blob:|data:)/i.test(trimmed)) {
    return trimmed;
  }
  // Match against available demo avatars by path or filename
  const match = AVAILABLE_AVATARS.find(
    (a) => a.path === trimmed || trimmed.endsWith(a.filename)
  );
  if (match) {
    return match.path;
  }
  return trimmed;
}

export function isAvatarSelected(avatarItem, currentAvatarUrl) {
  if (!currentAvatarUrl || !currentAvatarUrl.trim()) {
    return Boolean(avatarItem.isDefault);
  }
  const resolved = resolveAvatarUrl(currentAvatarUrl);
  if (resolved === avatarItem.path || currentAvatarUrl.endsWith(avatarItem.filename)) {
    return true;
  }
  // If current avatar is default or doesn't match any known avatar, mark default as selected
  const matchesAny = AVAILABLE_AVATARS.some(
    (a) => resolved === a.path || currentAvatarUrl.endsWith(a.filename)
  );
  if (avatarItem.isDefault && (!matchesAny || resolved === DEFAULT_AVATAR_PATH)) {
    return true;
  }
  return false;
}
