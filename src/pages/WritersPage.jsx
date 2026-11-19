import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BOOKS } from '../data/books';
import { riseIn, stagger } from '../lib/motion';

export default function WritersPage() {
  // Group the catalogue by author
  const writers = useMemo(() => {
    const map = new Map();
    for (const b of BOOKS) {
      if (!map.has(b.author)) map.set(b.author, { name: b.author, color: b.cover.bg, books: [] });
      map.get(b.author).books.push(b);
    }
    return [...map.values()].sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-light">My Writers</h1>
      <p className="text-fg2 mt-1 text-sm">Authors in our catalogue.</p>
      <motion.ul variants={stagger(0.06)} initial="hidden" animate="show" className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {writers.map((w) => (
          <motion.li key={w.name} variants={riseIn} whileHover={{ y: -4 }} className="card p-4 flex gap-4 items-center">
            <div
              aria-hidden="true"
              className="w-14 h-14 rounded-full shrink-0 grid place-items-center text-lg font-semibold text-white"
              style={{ background: `linear-gradient(135deg, ${w.color}, #0f62fe)` }}
            >
              {w.name.split(' ').map((p) => p[0]).join('')}
            </div>
            <div className="min-w-0">
              <h2 className="text-lg leading-tight">{w.name}</h2>
              <ul className="text-sm mt-1">
                {w.books.map((b) => (
                  <li key={b.id} className="truncate"><Link to={`/book/${b.id}`}>{b.title}</Link></li>
                ))}
              </ul>
            </div>
          </motion.li>
        ))}
      </motion.ul>
    </div>
  );
}
