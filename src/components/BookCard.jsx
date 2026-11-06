import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart } from 'lucide-react';
import BookCover from './BookCover';
import Tilt from './Tilt';
import { inr, deliveryLabel } from '../lib/format';
import { flyToCart } from '../lib/flyToCart';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';

/**
 * Horizontal book summary: cover left, details right.
 * `compact` is the small variant used in related reads; `actions={false}` hides the buttons (confirmation).
 */
export default function BookCard({ book, compact = false, actions = true }) {
  const cart = useCart();
  const wishlist = useWishlist();
  const toast = useToast();
  const coverRef = useRef(null);
  const wished = wishlist.has(book.id);

  const addToCart = () => {
    cart.add(book.id);
    flyToCart(coverRef.current, book.cover.bg);
    toast(`${book.title} added to your cart`);
  };
  const toggleWish = () => {
    const added = wishlist.toggle(book.id);
    toast(added ? `${book.title} saved to your wishlist` : `${book.title} removed from your wishlist`, 'info');
  };

  return (
    <article className="flex gap-4 group">
      <Tilt className={`shrink-0 ${compact ? 'w-24 h-32' : 'w-28 h-40 sm:w-36 sm:h-52'}`} max={compact ? 6 : 11}>
        <Link
          ref={coverRef}
          to={`/book/${book.id}`}
          aria-label={`View ${book.title}`}
          className="block w-full h-full shadow-[0_14px_30px_-12px_rgba(0,0,0,0.6)]"
        >
          <BookCover book={book} compact={compact} />
        </Link>
      </Tilt>
      <div className="min-w-0 text-sm flex flex-col">
        <h3 className="text-lg text-fg leading-snug">
          <Link to={`/book/${book.id}`} className="text-fg hover:underline underline-offset-4">{book.title}</Link>
        </h3>
        <p className="text-fg2">
          by <span className="text-link underline underline-offset-2">{book.author}</span>
        </p>
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

        {actions && !compact && (
          <div className="mt-3 flex items-center gap-2">
            <button type="button" onClick={addToCart} className="btn-primary !min-h-0 py-2 text-xs">
              <ShoppingCart size={14} aria-hidden="true" /> Add to cart
            </button>
            <button
              type="button"
              onClick={toggleWish}
              aria-pressed={wished}
              aria-label={wished ? `Remove ${book.title} from wishlist` : `Add ${book.title} to wishlist`}
              className="p-2 text-fg2 hover:text-fg active:scale-90 transition"
            >
              <Heart size={18} className={wished ? 'fill-danger text-danger' : ''} aria-hidden="true" />
            </button>
          </div>
        )}
      </div>
    </article>
  );
}
