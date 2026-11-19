import React from 'react';
import { Link } from 'react-router-dom';
import BookCover from './BookCover';
import { inr, deliveryLabel } from '../lib/format';

/** Horizontal book summary: cover left, details right. Reused in catalogue, related reads and confirmation. */
export default function BookCard({ book, compact = false }) {
  return (
    <article className={`flex gap-4 ${compact ? 'items-start' : ''}`}>
      <Link
        to={`/book/${book.id}`}
        aria-label={`View ${book.title}`}
        className={`block shrink-0 ${compact ? 'w-24 h-32' : 'w-28 h-40 sm:w-36 sm:h-52'}`}
      >
        <BookCover book={book} compact={compact} />
      </Link>
      <div className="min-w-0 text-sm">
        <h3 className="text-lg text-fg leading-snug">
          <Link to={`/book/${book.id}`} className="text-fg hover:underline">{book.title}</Link>
        </h3>
        <p className="text-fg2">by <span className="text-link underline">{book.author}</span></p>
        <p className="text-fg3 mt-2 text-xs sm:text-sm">{book.blurb}</p>
        <p className="mt-3 text-fg2">{book.format}</p>
        <p className="mt-1 flex flex-wrap gap-x-2">
          {book.genres.map((g, i) => (
            <span key={g} className="tag-link">{g}{i < book.genres.length - 1 ? ',' : ''}</span>
          ))}
        </p>
        <p className="mt-3 text-2xl font-semibold text-fg">{inr(book.price)}</p>
        <p className="text-xs text-fg2">
          Delivery by <strong className="text-fg">{deliveryLabel(book.deliveryDays)}</strong>
        </p>
      </div>
    </article>
  );
}
