import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Modal } from './Modal.jsx';
import { Button } from './Button.jsx';

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger', // 'danger' | 'primary'
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth={440}>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
        <div
          style={{
            backgroundColor: variant === 'danger' ? 'var(--error-light)' : 'var(--primary-light)',
            color: variant === 'danger' ? 'var(--error)' : 'var(--primary)',
            padding: '0.65rem',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <AlertTriangle size={24} />
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', marginTop: '0.2rem' }}>
          {message}
        </p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
        <Button variant="secondary" onClick={onClose}>
          {cancelText}
        </Button>
        <Button
          variant={variant}
          onClick={() => {
            onConfirm();
            onClose();
          }}
        >
          {confirmText}
        </Button>
      </div>
    </Modal>
  );
}
