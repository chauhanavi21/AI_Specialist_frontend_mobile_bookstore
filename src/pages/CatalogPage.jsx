import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import { Search, ChevronDown } from 'lucide-react';
import BookCard from '../components/BookCard';
import Hero from '../components/Hero';
import Reveal from '../components/Reveal';
import {
  BOOKS, CATEGORIES, LANGUAGES, FORMATS, PRICE_RANGES, SORTS, SECTIONS,
} from '../data/books';

function Select({ label, value, onChange, options }) {
  return (
    <label className="block bg-layer px-3 pt-2 pb-1 text-xs text-fg2 focus-within:ring-2 ring-link transition">
      {label}
      <span className="relative block">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none bg-transparent text-fg text-sm py-1.5 pr-6 focus:outline-none cursor-pointer"
        >
          {options.map((o) => (
            <option key={o} value={o} className="bg-layer text-fg">{o}</option>
          ))}
        </select>
        <ChevronDown size={16} className="absolute right-0 top-2 pointer-events-none text-fg" aria-hidden="true" />
      </span>
    </label>
  );
}

function CardSkeleton() {
  return (
    <div className="flex gap-4" aria-hidden="true">
      <div className="skeleton w-28 h-40 sm:w-36 sm:h-52 shrink-0" />
      <div className="flex-1 space-y-3 pt-1">
        <div className="skeleton h-5 w-3/4" />
        <div className="skeleton h-4 w-1/2" />
        <div className="skeleton h-3 w-full" />
        <div className="skeleton h-3 w-5/6" />
        <div className="skeleton h-7 w-20 mt-6" />
      </div>
    </div>
  );
}

export default function CatalogPage() {
  const [category, setCategory] = useState('All');
  const [query, setQuery] = useState('');
  const [language, setLanguage] = useState('All');
  const [format, setFormat] = useState('All');
  const [priceLabel, setPriceLabel] = useState('All');
  const [sort, setSort] = useState('Relevance');
  const [loading, setLoading] = useState(true);

  // The catalogue is local, so loading is simulated briefly to exercise the skeleton state
  // a real API call would need.
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 650);
    return () => clearTimeout(t);
  }, []);

  const filtered = useMemo(() => {
    const range = PRICE_RANGES.find((p) => p.label === priceLabel) ?? PRICE_RANGES[0];
    const q = query.trim().toLowerCase();
    const list = BOOKS.filter(
      (b) =>
        (category === 'All' || b.categories.includes(category)) &&
        (language === 'All' || b.language === language) &&
        (format === 'All' || b.format === format) &&
        b.price >= range.min && b.price <= range.max &&
        (!q || b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q)),
    );
    const sorted = [...list];
    if (sort === 'Price: low to high') sorted.sort((a, b) => a.price - b.price);
    if (sort === 'Price: high to low') sorted.sort((a, b) => b.price - a.price);
    if (sort === 'Title A–Z') sorted.sort((a, b) => a.title.localeCompare(b.title));
    return sorted;
  }, [category, query, language, format, priceLabel, sort]);

  const grouped = sort === 'Relevance';
  const filtersActive = category !== 'All' || query || language !== 'All' || format !== 'All' || priceLabel !== 'All';

  const reset = () => {
    setCategory('All'); setQuery(''); setLanguage('All'); setFormat('All'); setPriceLabel('All'); setSort('Relevance');
  };

  const grid = 'grid gap-8 md:grid-cols-2 xl:grid-cols-3';
  const item = {
    layout: true,
    initial: { opacity: 0, scale: 0.94, y: 16 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.94 },
    transition: { type: 'spring', stiffness: 260, damping: 28 },
  };

  return (
    <>
      <Hero />
      <div id="catalogue" className="lg:flex scroll-mt-12">
        <aside aria-label="Categories" className="lg:w-64 lg:shrink-0 lg:border-r lg:border-line">
          <div className="lg:sticky lg:top-12 lg:max-h-[calc(100vh-3rem)] lg:overflow-y-auto">
            <LayoutGroup>
              <ul className="flex lg:block gap-2 overflow-x-auto lg:overflow-visible p-3 lg:p-0 lg:py-2">
                {CATEGORIES.map((c) => (
                  <li key={c} className="shrink-0 relative">
                    <button
                      type="button"
                      onClick={() => setCategory(c)}
                      aria-pressed={category === c}
                      className={`relative w-full text-left text-sm font-medium px-3 py-2 lg:px-4 lg:py-1.5 rounded-full lg:rounded-none whitespace-nowrap transition-colors ${
                        category === c ? 'text-white' : 'bg-layer lg:bg-transparent text-fg hover:bg-layer2'
                      }`}
                    >
                      {category === c && (
                        <motion.span
                          layoutId="category-pill"
                          className="absolute inset-0 bg-brand lg:bg-layer2 lg:border-l-4 lg:border-brand rounded-full lg:rounded-none"
                          transition={{ type: 'spring', stiffness: 400, damping: 34 }}
                        />
                      )}
                      <span className="relative lg:text-fg">{c}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </LayoutGroup>
          </div>
        </aside>

        <section className="flex-1 min-w-0 p-4">
          <div className="grid gap-px grid-cols-2 lg:grid-cols-5 mb-6 bg-line/40">
            <label className="bg-layer px-3 pt-2 pb-1 text-xs text-fg2 col-span-2 lg:col-span-1 focus-within:ring-2 ring-link transition">
              Search you want to read here
              <span className="relative block">
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search"
                  className="w-full bg-transparent text-fg text-sm py-1.5 pr-6 placeholder:text-fg3 focus:outline-none"
                />
                <Search size={16} className="absolute right-0 top-2 pointer-events-none" aria-hidden="true" />
              </span>
            </label>
            <Select label="Language" value={language} onChange={setLanguage} options={LANGUAGES} />
            <Select label="Format (Paperback, ebook etc)" value={format} onChange={setFormat} options={FORMATS} />
            <Select label="Price Range" value={priceLabel} onChange={setPriceLabel} options={PRICE_RANGES.map((p) => p.label)} />
            <Select label="Sort by" value={sort} onChange={setSort} options={SORTS} />
          </div>

          {loading ? (
            <div className={grid} role="status" aria-label="Loading books">
              {Array.from({ length: 6 }, (_, i) => <CardSkeleton key={i} />)}
            </div>
          ) : filtered.length === 0 ? (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} role="status" className="py-16 text-center">
              <p className="text-fg2 text-lg">No books match your filters.</p>
              {filtersActive && (
                <button type="button" onClick={reset} className="btn-secondary mt-4">Clear filters</button>
              )}
            </motion.div>
          ) : grouped ? (
            SECTIONS.map((s) => {
              const books = filtered.filter((b) => b.section === s.key);
              if (!books.length) return null;
              return (
                <section key={s.key} aria-labelledby={`sec-${s.key}`} className="mb-10">
                  <Reveal as="h2" className="text-2xl font-light mb-4" >
                    <span id={`sec-${s.key}`}>{s.title}</span>
                  </Reveal>
                  <motion.div layout className={grid}>
                    <AnimatePresence mode="popLayout">
                      {books.map((b) => (
                        <motion.div key={b.id} {...item}><BookCard book={b} /></motion.div>
                      ))}
                    </AnimatePresence>
                  </motion.div>
                </section>
              );
            })
          ) : (
            <motion.div layout className={grid}>
              <AnimatePresence mode="popLayout">
                {filtered.map((b) => (
                  <motion.div key={b.id} {...item}><BookCard book={b} /></motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </section>
      </div>
    </>
  );
}
