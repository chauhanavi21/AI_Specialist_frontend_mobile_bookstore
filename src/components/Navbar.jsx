import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { BookOpen, ShoppingCart, UserCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';

const LINKS = [
  { to: '/orders', label: 'My Orders' },
  { to: '/wishlist', label: 'My Wishlist' },
  { to: '/writers', label: 'My Writers' },
];

export default function Navbar() {
  const { count } = useCart();
  return (
    <header className="bg-nav border-b border-line sticky top-0 z-30">
      <nav aria-label="Main" className="flex items-center gap-4 sm:gap-6 px-4 h-12">
        <Link to="/" className="flex items-center gap-2 text-fg font-semibold text-sm shrink-0">
          <BookOpen size={20} aria-hidden="true" />
          Book Worm
        </Link>
        <span className="hidden sm:block h-6 w-px bg-line" aria-hidden="true" />
        <ul className="hidden sm:flex items-center gap-6 text-sm">
          {LINKS.map((l) => (
            <li key={l.to}>
              <NavLink to={l.to} className={({ isActive }) => (isActive ? 'text-fg' : 'text-fg2 hover:text-fg')}>
                {l.label}
              </NavLink>
            </li>
          ))}
        </ul>
        <div className="ml-auto flex items-center gap-4">
          <Link to="/checkout" aria-label={`Cart, ${count} item${count === 1 ? '' : 's'}`} className="relative text-fg p-1">
            <ShoppingCart size={20} aria-hidden="true" />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[1.1rem] h-[1.1rem] px-1 rounded-full bg-danger text-white text-[10px] leading-[1.1rem] text-center">
                {count}
              </span>
            )}
          </Link>
          <button type="button" aria-label="Account" className="text-fg p-1">
            <UserCircle size={22} aria-hidden="true" />
          </button>
        </div>
      </nav>
    </header>
  );
}
