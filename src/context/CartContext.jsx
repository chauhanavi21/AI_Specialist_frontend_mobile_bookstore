import React, { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import { getBook } from '../data/books';

const CartContext = createContext(null);
const STORAGE_KEY = 'bookworm.cart';
const TAX_RATE = 0.12;
const COUPONS = { BOOKWORM100: 100 };

function load() {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (raw && typeof raw === 'object') return raw;
  } catch {
    /* ignore corrupt storage */
  }
  return { items: [], coupon: null };
}

function reducer(state, action) {
  switch (action.type) {
    case 'add': {
      const existing = state.items.find((i) => i.id === action.id);
      const items = existing
        ? state.items.map((i) => (i.id === action.id ? { ...i, qty: i.qty + 1 } : i))
        : [...state.items, { id: action.id, qty: 1 }];
      return { ...state, items };
    }
    case 'setQty': {
      const qty = Math.max(0, Math.min(99, action.qty));
      const items = state.items
        .map((i) => (i.id === action.id ? { ...i, qty } : i))
        .filter((i) => i.qty > 0);
      return { ...state, items };
    }
    case 'remove':
      return { ...state, items: state.items.filter((i) => i.id !== action.id) };
    case 'coupon':
      return { ...state, coupon: action.code };
    case 'clear':
      return { items: [], coupon: null };
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, load);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const value = useMemo(() => {
    const lines = state.items
      .map((i) => ({ ...i, book: getBook(i.id) }))
      .filter((l) => l.book);
    const count = lines.reduce((n, l) => n + l.qty, 0);
    const subtotal = lines.reduce((sum, l) => sum + l.book.price * l.qty, 0);
    const tax = Math.round(subtotal * TAX_RATE);
    const delivery = 0; // free delivery, as in the wireframe
    const discount = state.coupon ? Math.min(COUPONS[state.coupon] ?? 0, subtotal + tax) : 0;
    const total = Math.max(0, subtotal + tax + delivery - discount);

    return {
      lines, count, subtotal, tax, delivery, discount, total, coupon: state.coupon,
      add: (id) => dispatch({ type: 'add', id }),
      setQty: (id, qty) => dispatch({ type: 'setQty', id, qty }),
      remove: (id) => dispatch({ type: 'remove', id }),
      clear: () => dispatch({ type: 'clear' }),
      /** Returns true when the code is valid. */
      applyCoupon: (code) => {
        const normalised = code.trim().toUpperCase();
        if (!COUPONS[normalised]) return false;
        dispatch({ type: 'coupon', code: normalised });
        return true;
      },
    };
  }, [state]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}
