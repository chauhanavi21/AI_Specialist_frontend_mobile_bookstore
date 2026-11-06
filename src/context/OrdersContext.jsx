import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { canCancel } from '../lib/pricing';

// Orders and gift points live in local storage (no backend in this project).
// Gift points: customers start with a welcome balance and earn 1 point per ₹10 spent.
const OrdersContext = createContext(null);
const KEY = 'bookworm.orders';
const WELCOME_POINTS = 150;
const HOUR = 3_600_000;

function seed() {
  // A past delivered order makes "Order History" and "Buy it again" demonstrable on first run.
  return {
    points: WELCOME_POINTS,
    orders: [
      {
        id: 'BW-100245',
        placedAt: Date.now() - 9 * 24 * HOUR,
        status: 'delivered',
        items: [{ id: 'art-of-focus', qty: 1, price: 399 }, { id: 'midnight-hour', qty: 1, price: 299 }],
        total: 782,
        pointsUsed: 0,
        pointsEarned: 0,
        payment: 'Credit Card',
      },
    ],
  };
}

function load() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY));
    if (raw && Array.isArray(raw.orders)) return raw;
  } catch {
    /* fall through to seed */
  }
  return seed();
}

export function OrdersProvider({ children }) {
  const [state, setState] = useState(load);
  useEffect(() => localStorage.setItem(KEY, JSON.stringify(state)), [state]);

  const value = useMemo(
    () => ({
      orders: [...state.orders].sort((a, b) => b.placedAt - a.placedAt),
      points: state.points,

      /** Records a paid order, spends redeemed points and earns new ones. Returns the order. */
      place({ lines, total, pointsUsed, payment, address }) {
        const order = {
          id: `BW-${100000 + Math.floor(Math.random() * 899999)}`,
          placedAt: Date.now(),
          status: 'placed',
          items: lines.map((l) => ({ id: l.id, qty: l.qty, price: l.book.price })),
          total,
          pointsUsed,
          pointsEarned: Math.floor(total / 10),
          payment,
          address,
        };
        setState((s) => ({
          points: s.points - pointsUsed + order.pointsEarned,
          orders: [...s.orders, order],
        }));
        return order;
      },

      /** Cancels inside the 48h window and reverses the points. Returns true on success. */
      cancel(id) {
        const order = state.orders.find((o) => o.id === id);
        if (!order || !canCancel(order)) return false;
        setState((s) => ({
          points: s.points + order.pointsUsed - order.pointsEarned,
          orders: s.orders.map((o) => (o.id === id ? { ...o, status: 'cancelled' } : o)),
        }));
        return true;
      },
    }),
    [state],
  );

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>;
}

export const useOrders = () => useContext(OrdersContext);
