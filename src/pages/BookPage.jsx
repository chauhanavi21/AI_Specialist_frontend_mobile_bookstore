import React, { useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Bookmark, BookmarkCheck, Languages, ShoppingCart, TrendingUp } from 'lucide-react';
import Book3D from '../components/Book3D';
import BookCard from '../components/BookCard';
import Reveal from '../components/Reveal';
import StarRating from '../components/StarRating';
import { getBook, relatedBooks } from '../data/books';
import { deliveryLabel, inr } from '../lib/format';
import { flyToCart } from '../lib/flyToCart';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { stagger, riseIn } from '../lib/motion';

const MAX_REVIEW = 100;
const SEED_REVIEWS = [
  {
    name: 'John Smith', rating: 5,
    text: 'A calm, practical read. The short chapters make it easy to apply one idea a day.',
  },
];

export default function BookPage() {
  const { id } = useParams();
  const book = getBook(id);
  const cart = useCart();
  const wishlist = useWishlist();
  const toast = useToast();
  const { user } = useAuth();
  const stageRef = useRef(null);

  const [reviews, setReviews] = useState(SEED_REVIEWS);
  const [text, setText] = useState('');
  const [rating, setRating] = useState(0);
  const [error, setError] = useState('');

  if (!book) {
    return (
      <div className="p-10 text-center">
        <h1 className="text-2xl font-light">We couldn’t find that book.</h1>
        <Link to="/" className="btn-primary mt-6 !text-white no-underline">Back to the catalogue</Link>
      </div>
    );
  }

  const related = relatedBooks(book);
  const wished = wishlist.has(book.id);
  const inCart = cart.lines.find((l) => l.id === book.id)?.qty ?? 0;

  const add = () => {
    cart.add(book.id);
    flyToCart(stageRef.current, book.cover.bg);
    toast(`${book.title} added to your cart`);
  };
  const wish = () => {
    const added = wishlist.toggle(book.id);
    toast(added ? 'Saved to your wishlist' : 'Removed from your wishlist', 'info');
  };

  const submitReview = (e) => {
    e.preventDefault();
    if (!rating) return setError('Choose a star rating');
    if (!text.trim()) return setError('Write a few words about the book');
    setError('');
    setReviews((r) => [{ name: user?.name ?? 'Guest reader', rating, text: text.trim(), fresh: true }, ...r]);
    setText('');
    setRating(0);
    toast('Thanks! Your review was posted.');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 lg:flex lg:gap-8">
      <div className="flex-1 min-w-0">
        <nav aria-label="Breadcrumb" className="text-sm mb-6">
          <ol className="flex flex-wrap gap-2 text-fg2">
            <li><Link to="/">Home</Link> /</li>
            <li><Link to="/">{book.genres[0]}</Link> /</li>
            <li aria-current="page" className="text-fg">{book.genres[1] ?? book.title}</li>
          </ol>
        </nav>

        <motion.div variants={stagger(0.1)} initial="hidden" animate="show" className="md:flex gap-8">
          <motion.div variants={riseIn} className="relative shrink-0 mx-auto md:mx-0 grid place-items-center py-6 px-4 md:px-8">
            <div aria-hidden="true" className="absolute inset-0 -z-0 bg-gradient-to-br from-brand/20 via-transparent to-[#8a3ffc]/20 blur-2xl" />
            <div ref={stageRef} className="relative">
              <Book3D book={book} width={230} height={330} depth={42} />
            </div>
            <p className="relative text-xs text-fg3 mt-2">Drag to rotate</p>
          </motion.div>

          <motion.div variants={riseIn} className="min-w-0 flex-1">
            <h1 className="text-3xl sm:text-4xl font-light leading-tight">{book.title}</h1>
            <p className="mt-1 text-fg2">by <span className="text-link underline">{book.author}</span></p>
            <p className="mt-3 text-fg3 text-sm">{book.blurb}</p>
            {book.publisher && (
              <p className="mt-4 text-sm">Published by: <span className="text-link underline">{book.publisher}</span></p>
            )}
            <p className="mt-4 text-fg2">{book.format}</p>
            <p className="flex gap-2 mt-1">
              {book.genres.map((g, i) => (
                <span key={g} className="tag-link">{g}{i < book.genres.length - 1 ? ',' : ''}</span>
              ))}
            </p>

            <p className="mt-6 text-4xl font-semibold">{inr(book.price)}</p>
            <p className="text-sm text-fg2">Delivery by <strong className="text-fg">{deliveryLabel(book.deliveryDays)}</strong></p>

            <div className="mt-6 flex flex-wrap gap-3">
              <button type="button" onClick={add} className="btn-primary px-6">
                Add to Cart <ShoppingCart size={16} aria-hidden="true" />
                {inCart > 0 && <span className="ml-1 text-xs bg-white/20 px-1.5 rounded-full">{inCart} in cart</span>}
              </button>
              <button type="button" onClick={wish} aria-pressed={wished} className="btn-secondary px-6">
                {wished ? 'In Wishlist' : 'Add to Wishlist'}
                {wished ? <BookmarkCheck size={16} aria-hidden="true" /> : <Bookmark size={16} aria-hidden="true" />}
              </button>
            </div>

            <dl className="mt-8 grid grid-cols-3 gap-4 text-sm max-w-md">
              <div>
                <dt className="flex items-center gap-1.5 text-fg2"><Languages size={14} aria-hidden="true" /> Language</dt>
                <dd className="text-link underline mt-1">{book.language}</dd>
              </div>
              <div>
                <dt className="text-fg2">Rating</dt>
                <dd className="mt-1"><StarRating value={book.rating} /></dd>
              </div>
              <div>
                <dt className="flex items-center gap-1.5 text-fg2"><TrendingUp size={14} aria-hidden="true" /> Sells</dt>
                <dd className="font-semibold mt-1">{book.sold} copies sold</dd>
              </div>
            </dl>
          </motion.div>
        </motion.div>

        <Reveal className="mt-12">
          <h2 className="text-2xl font-light mb-4">About the writer</h2>
          <div className="flex gap-5 items-start">
            <div
              aria-hidden="true"
              className="w-20 h-20 sm:w-28 sm:h-28 rounded-full shrink-0 grid place-items-center text-3xl font-semibold text-white"
              style={{ background: `linear-gradient(135deg, ${book.cover.bg}, #0f62fe)` }}
            >
              {book.author.split(' ').map((w) => w[0]).join('')}
            </div>
            <div className="text-sm text-fg2">
              <p className="text-lg text-fg">{book.author}</p>
              <p className="mt-2 max-w-3xl">
                {book.writerBio ?? `${book.author} writes ${book.genres.join(', ').toLowerCase()} and is the author of ${book.title}.`}
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal className="mt-12">
          <h2 className="text-2xl font-light mb-4">Reviews</h2>
          <div className="md:flex gap-10">
            <form onSubmit={submitReview} noValidate className="md:w-80 shrink-0">
              <div className="flex justify-between text-xs text-fg2">
                <label htmlFor="review">Leave Your Review</label>
                <span aria-live="polite">{text.length}/{MAX_REVIEW}</span>
              </div>
              <textarea
                id="review"
                rows={6}
                maxLength={MAX_REVIEW}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Placeholder text"
                className="field mt-1 resize-y"
                aria-invalid={!!error}
                aria-describedby={error ? 'review-error' : undefined}
              />
              <div className="flex items-center justify-between mt-3">
                <StarRating value={rating} onChange={setRating} size={22} />
                <button type="submit" className="btn-primary">Submit <ArrowRight size={16} aria-hidden="true" /></button>
              </div>
              {error && <p id="review-error" role="alert" className="field-error">{error}</p>}
            </form>

            <ul className="flex-1 mt-8 md:mt-0 space-y-6">
              <AnimatePresence initial={false}>
                {reviews.map((r, i) => (
                  <motion.li
                    key={`${r.name}-${i}-${r.text}`}
                    layout
                    initial={r.fresh ? { opacity: 0, y: -16, scale: 0.97 } : false}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                  >
                    <p className="font-medium">{r.name}</p>
                    <p className="mt-2 text-sm text-fg2 max-w-2xl">{r.text}</p>
                    <div className="mt-2"><StarRating value={r.rating} /></div>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          </div>
        </Reveal>
      </div>

      <aside aria-label="Related reads" className="lg:w-96 lg:shrink-0 mt-12 lg:mt-0 lg:border-l lg:border-line lg:pl-8">
        <h2 className="text-xl font-light mb-4">Related Reads</h2>
        {related.length === 0 ? (
          <p className="text-fg2 text-sm">No related books yet.</p>
        ) : (
          <div className="space-y-6">
            {related.map((b, i) => (
              <Reveal key={b.id} delay={i * 0.08}><BookCard book={b} compact /></Reveal>
            ))}
          </div>
        )}
      </aside>
    </div>
  );
}
