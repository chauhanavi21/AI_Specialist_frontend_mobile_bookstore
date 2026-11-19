import React, { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { BookOpen, LogOut, Menu, Moon, ShoppingCart, Sun, UserCircle, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';

const LINKS = [
  { to: '/orders', label: 'My Orders' },
  { to: '/wishlist', label: 'My Wishlist' },
  { to: '/writers', label: 'My Writers' },
];

export default function Navbar() {
  const { count } = useCart();
  const { theme, toggle } = useTheme();
  const { user, logout } = useAuth();
  const [menu, setMenu] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [elevated, setElevated] = useState(false);
  const location = useLocation();
  const prevCount = useRef(count);
  const [bump, setBump] = useState(0);

  useEffect(() => setMenu(false), [location.pathname]);

  useEffect(() => {
    const onScroll = () => setElevated(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Re-key the badge whenever the count changes so it pops.
  useEffect(() => {
    if (count !== prevCount.current) setBump((b) => b + 1);
    prevCount.current = count;
  }, [count]);

  const linkClass = ({ isActive }) =>
    `relative py-1 ${isActive ? 'text-fg' : 'text-fg2 hover:text-fg'} transition-colors`;

  return (
    <>
      <header
        className={`bg-nav/90 backdrop-blur-md border-b border-line sticky top-0 z-40 transition-shadow ${
          elevated ? 'shadow-[0_8px_30px_-12px_rgba(0,0,0,0.6)]' : ''
        }`}
      >
        <nav aria-label="Main" className="flex items-center gap-3 sm:gap-6 px-4 h-12">
          <button
            type="button"
            className="sm:hidden p-1 -ml-1"
            aria-label={menu ? 'Close menu' : 'Open menu'}
            aria-expanded={menu}
            onClick={() => setMenu((m) => !m)}
          >
            {menu ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
          </button>
          <Link to="/" className="flex items-center gap-2 !text-fg font-semibold text-sm shrink-0 no-underline">
            <BookOpen size={20} aria-hidden="true" />
            Book Worm
          </Link>
          <span className="hidden sm:block h-6 w-px bg-line" aria-hidden="true" />
          <ul className="hidden sm:flex items-center gap-6 text-sm">
            {LINKS.map((l) => (
              <li key={l.to}>
                <NavLink to={l.to} className={linkClass}>
                  {({ isActive }) => (
                    <>
                      {l.label}
                      {isActive && (
                        <motion.span
                          layoutId="nav-underline"
                          className="absolute left-0 right-0 -bottom-[13px] h-0.5 bg-brand"
                          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                        />
                      )}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="ml-auto flex items-center gap-1 sm:gap-3">
            <button
              type="button"
              onClick={toggle}
              aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
              className="p-2 text-fg hover:bg-layer2 rounded-full transition"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={theme}
                  initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: 90, opacity: 0, scale: 0.6 }}
                  transition={{ duration: 0.18 }}
                  className="block"
                >
                  {theme === 'dark' ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
                </motion.span>
              </AnimatePresence>
            </button>

            <Link
              id="cart-button"
              to="/checkout"
              aria-label={`Cart, ${count} item${count === 1 ? '' : 's'}`}
              className="relative p-2 !text-fg hover:bg-layer2 rounded-full transition"
            >
              <ShoppingCart size={20} aria-hidden="true" />
              {count > 0 && (
                <motion.span
                  key={bump}
                  initial={{ scale: 0.4 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 14 }}
                  className="absolute top-0 right-0 min-w-[1.1rem] h-[1.1rem] px-1 rounded-full bg-danger text-white text-[10px] leading-[1.1rem] text-center"
                >
                  {count}
                </motion.span>
              )}
            </Link>

            {user ? (
              <button
                type="button"
                onClick={logout}
                aria-label={`Signed in as ${user.name}. Sign out`}
                title={`${user.name} (sign out)`}
                className="flex items-center gap-2 p-1.5 hover:bg-layer2 rounded-full transition"
              >
                <span className="w-7 h-7 rounded-full bg-brand text-white text-xs font-semibold grid place-items-center">
                  {user.name[0]}
                </span>
                <LogOut size={16} className="hidden sm:block text-fg2" aria-hidden="true" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setAuthOpen(true)}
                aria-label="Sign in"
                className="p-2 text-fg hover:bg-layer2 rounded-full transition"
              >
                <UserCircle size={22} aria-hidden="true" />
              </button>
            )}
          </div>
        </nav>

        <AnimatePresence>
          {menu && (
            <motion.ul
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="sm:hidden overflow-hidden border-t border-line px-4 text-sm"
            >
              {LINKS.map((l) => (
                <li key={l.to}>
                  <NavLink to={l.to} className={({ isActive }) => `block py-3 ${isActive ? 'text-fg font-medium' : 'text-fg2'}`}>
                    {l.label}
                  </NavLink>
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </header>
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}
