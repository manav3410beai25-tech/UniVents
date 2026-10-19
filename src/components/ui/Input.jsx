import React from 'react';

export function Input({
  label,
  error,
  hint,
  id,
  type = 'text',
  className = '',
  required = false,
  ...props
}) {
  const inputId = id || props.name || Math.random().toString(36).substring(7);

  return (
    <div className={`form-group ${className}`}>
      {label && (
        <label htmlFor={inputId} className="form-label">
          <span>{label} {required && <span style={{ color: 'var(--error)' }}>*</span>}</span>
        </label>
      )}
      <input
        id={inputId}
        type={type}
        className={`form-input ${error ? 'has-error' : ''}`}
        required={required}
        {...props}
      />
      {error && <span className="form-error">{error}</span>}
      {hint && !error && <span className="form-hint">{hint}</span>}
    </div>
  );
}

export function Select({
  label,
  error,
  hint,
  id,
  options = [],
  className = '',
  required = false,
  placeholder,
  ...props
}) {
  const selectId = id || props.name || Math.random().toString(36).substring(7);

  return (
    <div className={`form-group ${className}`}>
      {label && (
        <label htmlFor={selectId} className="form-label">
          <span>{label} {required && <span style={{ color: 'var(--error)' }}>*</span>}</span>
        </label>
      )}
      <select
        id={selectId}
        className={`form-select ${error ? 'has-error' : ''}`}
        required={required}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value ?? opt.id} value={opt.value ?? opt.id}>
            {opt.label ?? opt.name}
          </option>
        ))}
      </select>
      {error && <span className="form-error">{error}</span>}
      {hint && !error && <span className="form-hint">{hint}</span>}
    </div>
  );
}
