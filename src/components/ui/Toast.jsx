import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 3500) => {
    const id = Math.random().toString(36).substring(7);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const success = useCallback((msg) => addToast(msg, 'success'), [addToast]);
  const error = useCallback((msg) => addToast(msg, 'error'), [addToast]);
  const info = useCallback((msg) => addToast(msg, 'info'), [addToast]);
  const warning = useCallback((msg) => addToast(msg, 'warning'), [addToast]);

  return (
    <ToastContext.Provider value={{ addToast, success, error, info, warning }}>
      {children}
      <div
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          pointerEvents: 'none',
        }}
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            style={{
              pointerEvents: 'auto',
              minWidth: '280px',
              maxWidth: '420px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px 16px',
              backgroundColor: 'var(--bg-surface)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              boxShadow: 'var(--shadow-lg)',
              color: 'var(--text-main)',
              fontSize: '0.875rem',
              animation: 'slideUp 0.25s ease',
            }}
          >
            {toast.type === 'success' && <CheckCircle2 size={18} color="var(--success)" />}
            {toast.type === 'error' && <AlertCircle size={18} color="var(--error)" />}
            {toast.type === 'warning' && <AlertCircle size={18} color="var(--warning)" />}
            {toast.type === 'info' && <Info size={18} color="var(--primary)" />}
            
            <span style={{ flex: 1 }}>{toast.message}</span>
            
            <button
              onClick={() => removeToast(toast.id)}
              style={{ color: 'var(--text-muted)', display: 'flex' }}
              aria-label="Dismiss toast"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
