import React, { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import { getBook } from '../data/books';
import { COUPONS, computeTotals } from '../lib/pricing';

const CartContext = createContext(null);
const STORAGE_KEY = 'bookworm.cart';

function load() {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (raw && Array.isArray(raw.items)) return { redeem: false, ...raw };
  } catch {
    /* ignore corrupt storage */
  }
  return { items: [], coupon: null, redeem: false };
}

function reducer(state, action) {
  switch (action.type) {
    case 'add': {
      const existing = state.items.find((i) => i.id === action.id);
      const items = existing
        ? state.items.map((i) => (i.id === action.id ? { ...i, qty: Math.min(99, i.qty + 1) } : i))
        : [...state.items, { id: action.id, qty: 1 }];
      return { ...state, items };
    }
    case 'setQty': {
      const qty = Math.max(0, Math.min(99, action.qty));
      return {
        ...state,
        items: state.items.map((i) => (i.id === action.id ? { ...i, qty } : i)).filter((i) => i.qty > 0),
      };
    }
    case 'remove':
      return { ...state, items: state.items.filter((i) => i.id !== action.id) };
    case 'coupon':
      return { ...state, coupon: action.code };
    case 'redeem':
      return { ...state, redeem: action.on };
    case 'clear':
      return { items: [], coupon: null, redeem: false };
    default:
      return state;
  }
}

/** `points` is the gift point balance, supplied by the orders context through the provider. */
export function CartProvider({ children, points = 0 }) {
  const [state, dispatch] = useReducer(reducer, undefined, load);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const value = useMemo(() => {
    const lines = state.items.map((i) => ({ ...i, book: getBook(i.id) })).filter((l) => l.book);
    const count = lines.reduce((n, l) => n + l.qty, 0);
    const totals = computeTotals({
      lines: lines.map((l) => ({ price: l.book.price, qty: l.qty })),
      coupon: state.coupon,
      redeem: state.redeem,
      points,
    });

    return {
      lines, count, ...totals, coupon: state.coupon, redeem: state.redeem,
      add: (id) => dispatch({ type: 'add', id }),
      setQty: (id, qty) => dispatch({ type: 'setQty', id, qty }),
      remove: (id) => dispatch({ type: 'remove', id }),
      clear: () => dispatch({ type: 'clear' }),
      setRedeem: (on) => dispatch({ type: 'redeem', on }),
      removeCoupon: () => dispatch({ type: 'coupon', code: null }),
      /** Returns true when the code is valid. */
      applyCoupon: (code) => {
        const normalised = code.trim().toUpperCase();
        if (!COUPONS[normalised]) return false;
        dispatch({ type: 'coupon', code: normalised });
        return true;
      },
    };
  }, [state, points]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}
