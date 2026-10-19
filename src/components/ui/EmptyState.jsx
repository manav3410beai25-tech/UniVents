import React from 'react';
import { Button } from './Button.jsx';

export function EmptyState({
  icon: Icon,
  title = 'No items found',
  description = 'There is currently no data to display.',
  actionLabel,
  onAction,
  actionIcon,
  className = '',
}) {
  return (
    <div
      className={`card flex flex-col items-center justify-center text-center ${className}`}
      style={{ padding: '3.5rem 1.5rem', minHeight: '260px' }}
    >
      {Icon && (
        <div
          style={{
            backgroundColor: 'var(--primary-light)',
            color: 'var(--primary)',
            padding: '1rem',
            borderRadius: '50%',
            marginBottom: '1rem',
            display: 'inline-flex',
          }}
        >
          <Icon size={32} />
        </div>
      )}
      <h3 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: '0.4rem' }}>{title}</h3>
      <p style={{ color: 'var(--text-secondary)', maxWidth: '420px', fontSize: '0.9rem', marginBottom: actionLabel ? '1.25rem' : 0 }}>
        {description}
      </p>
      {actionLabel && onAction && (
        <Button variant="primary" icon={actionIcon} onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
