import React from 'react';

export function Badge({
  children,
  variant = 'primary', // 'primary' | 'success' | 'warning' | 'error' | 'info' | 'neutral'
  icon: Icon,
  className = '',
}) {
  return (
    <span className={`badge badge-${variant} ${className}`.trim()}>
      {Icon && <Icon size={12} />}
      <span>{children}</span>
    </span>
  );
}

export function EventStatusBadge({ status }) {
  switch (status) {
    case 'published':
      return <Badge variant="success">Published</Badge>;
    case 'pending':
      return <Badge variant="warning">Pending Review</Badge>;
    case 'rejected':
      return <Badge variant="error">Rejected</Badge>;
    case 'draft':
      return <Badge variant="neutral">Draft</Badge>;
    case 'completed':
      return <Badge variant="info">Completed</Badge>;
    case 'cancelled':
      return <Badge variant="error">Cancelled</Badge>;
    default:
      return <Badge variant="neutral">{status}</Badge>;
  }
}
