import React from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import BookCard from '../components/BookCard';
import { getBook } from '../data/books';
import { useWishlist } from '../context/WishlistContext';

export default function WishlistPage() {
  const { ids } = useWishlist();
  const books = ids.map(getBook).filter(Boolean);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-light">My Wishlist</h1>
      {books.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-fg2 text-lg">Your wishlist is empty.</p>
          <p className="text-fg3 text-sm mt-1">Tap the heart on any book to save it for later.</p>
          <Link to="/" className="btn-primary mt-6 px-6 !text-white no-underline">Browse books</Link>
        </div>
      ) : (
        <div className="mt-6 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {books.map((b) => (
              <motion.div
                key={b.id}
                layout
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, x: -30 }}
              >
                <BookCard book={b} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
