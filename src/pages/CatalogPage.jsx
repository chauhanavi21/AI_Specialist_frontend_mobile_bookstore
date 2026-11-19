import React, { useMemo, useState } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import BookCard from '../components/BookCard';
import {
  BOOKS, CATEGORIES, LANGUAGES, FORMATS, PRICE_RANGES, SORTS, SECTIONS,
} from '../data/books';

function Select({ label, value, onChange, options }) {
  return (
    <label className="block bg-layer px-3 pt-2 pb-1 text-xs text-fg2">
      {label}
      <span className="relative block">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none bg-transparent text-fg text-sm py-1.5 pr-6 focus:outline-none"
        >
          {options.map((o) => (
            <option key={o} value={o} className="bg-layer">{o}</option>
          ))}
        </select>
        <ChevronDown size={16} className="absolute right-0 top-2 pointer-events-none text-fg" aria-hidden="true" />
      </span>
    </label>
  );
}

export default function CatalogPage() {
  const [category, setCategory] = useState('All');
  const [query, setQuery] = useState('');
  const [language, setLanguage] = useState('All');
  const [format, setFormat] = useState('All');
  const [priceLabel, setPriceLabel] = useState('All');
  const [sort, setSort] = useState('Relevance');

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

  // Sections only make sense in the default ordering; any other sort shows one flat list.
  const grouped = sort === 'Relevance';

  return (
    <div className="lg:flex">
      <aside aria-label="Categories" className="lg:w-64 lg:shrink-0 lg:border-r lg:border-line">
        {/* Mobile: horizontally scrolling chips. Desktop: vertical list. */}
        <ul className="flex lg:block gap-2 overflow-x-auto lg:overflow-visible p-3 lg:p-0 lg:py-2">
          {CATEGORIES.map((c) => (
            <li key={c} className="shrink-0">
              <button
                type="button"
                onClick={() => setCategory(c)}
                aria-pressed={category === c}
                className={`w-full text-left text-sm font-medium px-3 py-2 lg:px-4 lg:py-1.5 rounded-full lg:rounded-none whitespace-nowrap ${
                  category === c ? 'bg-brand lg:bg-layer2 text-white' : 'bg-layer lg:bg-transparent text-fg hover:bg-layer2'
                }`}
              >
                {c}
              </button>
            </li>
          ))}
        </ul>
      </aside>

      <section className="flex-1 min-w-0 p-4">
        <div className="grid gap-px sm:grid-cols-2 lg:grid-cols-5 mb-6">
          <label className="bg-layer px-3 pt-2 pb-1 text-xs text-fg2 sm:col-span-2 lg:col-span-1">
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

        {filtered.length === 0 ? (
          <p role="status" className="text-fg2 py-12 text-center">No books match your filters.</p>
        ) : grouped ? (
          SECTIONS.map((s) => {
            const books = filtered.filter((b) => b.section === s.key);
            if (!books.length) return null;
            return (
              <section key={s.key} aria-labelledby={`sec-${s.key}`} className="mb-10">
                <h2 id={`sec-${s.key}`} className="text-2xl font-light mb-4">{s.title}</h2>
                <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
                  {books.map((b) => <BookCard key={b.id} book={b} />)}
                </div>
              </section>
            );
          })
        ) : (
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((b) => <BookCard key={b.id} book={b} />)}
          </div>
        )}
      </section>
    </div>
  );
}
