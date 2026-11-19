import React, { useId } from 'react';

/** Labelled input with an accessible error message. Pass `as="select"` and children for a dropdown. */
export default function Field({ label, error, as: Tag = 'input', className = '', children, ...props }) {
  const id = useId();
  return (
    <div className={className}>
      <label htmlFor={id} className="field-label">{label}</label>
      <Tag
        id={id}
        className="field"
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-err` : undefined}
        {...props}
      >
        {children}
      </Tag>
      {error && <p id={`${id}-err`} role="alert" className="field-error">{error}</p>}
    </div>
  );
}
