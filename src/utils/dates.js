// Format date into human readable string: e.g. "Sat, Oct 24, 2026 • 10:00 AM"
export function formatDateTime(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return isoString;

  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

export function formatDateOnly(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return isoString;

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatTimeOnly(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return isoString;

  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

export function isPast(isoString) {
  if (!isoString) return false;
  return new Date(isoString).getTime() < Date.now();
}

export function isFuture(isoString) {
  if (!isoString) return false;
  return new Date(isoString).getTime() > Date.now();
}

// Format relative time (e.g., "2 hours ago", "in 3 days")
export function formatRelativeTime(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffSec = Math.round(diffMs / 1000);
  const diffMin = Math.round(diffSec / 60);
  const diffHr = Math.round(diffMin / 60);
  const diffDay = Math.round(diffHr / 24);

  if (Math.abs(diffSec) < 60) return 'just now';
  if (Math.abs(diffMin) < 60) return diffMin > 0 ? `in ${diffMin}m` : `${Math.abs(diffMin)}m ago`;
  if (Math.abs(diffHr) < 24) return diffHr > 0 ? `in ${diffHr}h` : `${Math.abs(diffHr)}h ago`;
  if (Math.abs(diffDay) < 30) return diffDay > 0 ? `in ${diffDay}d` : `${Math.abs(diffDay)}d ago`;

  return formatDateOnly(isoString);
}
