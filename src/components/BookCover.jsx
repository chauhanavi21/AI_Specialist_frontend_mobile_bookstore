import React from 'react';

/** Typographic book cover drawn from the title, author and palette (no image assets needed). */
export default function BookCover({ book, compact = false, className = '' }) {
  const { bg, fg, accent } = book.cover;
  return (
    <div
      role="img"
      aria-label={`Cover of ${book.title} by ${book.author}`}
      className={`w-full h-full flex flex-col justify-between overflow-hidden ${compact ? 'p-2' : 'p-3 sm:p-5'} ${className}`}
      style={{ background: bg, color: fg }}
    >
      <div
        className={`font-extrabold leading-[1.05] tracking-tight text-center ${
          compact ? 'text-[9px]' : 'text-base sm:text-2xl'
        }`}
        style={{ overflowWrap: 'normal', wordBreak: 'normal' }}
      >
        {book.title.toUpperCase()}
      </div>
      <div className="flex flex-col items-center">
        <div className={`${compact ? 'h-1 w-6 mb-1' : 'h-1.5 w-10 mb-2'}`} style={{ background: accent }} />
        <div className={`font-semibold tracking-wide text-center ${compact ? 'text-[8px]' : 'text-[10px] sm:text-sm'}`}>
          {book.author.toUpperCase()}
        </div>
      </div>
    </div>
  );
}
