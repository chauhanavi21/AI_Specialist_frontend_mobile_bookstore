import React from 'react';
import { Star } from 'lucide-react';

/** Read-only stars when `onChange` is omitted, otherwise a keyboard-friendly picker. */
export default function StarRating({ value = 0, onChange, size = 16 }) {
  const stars = [1, 2, 3, 4, 5];
  if (!onChange) {
    return (
      <span className="inline-flex gap-0.5" role="img" aria-label={`${value} out of 5 stars`}>
        {stars.map((n) => (
          <Star key={n} size={size} className={n <= value ? 'fill-warn text-warn' : 'text-fg3'} aria-hidden="true" />
        ))}
      </span>
    );
  }
  return (
    <div className="inline-flex gap-1" role="radiogroup" aria-label="Your rating">
      {stars.map((n) => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={value === n}
          aria-label={`${n} star${n > 1 ? 's' : ''}`}
          onClick={() => onChange(n)}
          className="p-1"
        >
          <Star size={size} className={n <= value ? 'fill-warn text-warn' : 'text-fg2'} aria-hidden="true" />
        </button>
      ))}
    </div>
  );
}
