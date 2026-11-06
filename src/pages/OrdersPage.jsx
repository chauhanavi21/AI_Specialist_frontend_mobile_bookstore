import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, Gift, RotateCcw, XCircle } from 'lucide-react';
import BookCard from '../components/BookCard';
import BookCover from '../components/BookCover';
import Modal from '../components/Modal';
import { getBook } from '../data/books';
import { useCart } from '../context/CartContext';
import { useOrders } from '../context/OrdersContext';
import { useToast } from '../context/ToastContext';
import { fullDate, inr } from '../lib/format';
import { canCancel, cancelTimeLeft } from '../lib/pricing';
import { recommendFromOrders } from '../lib/recommend';
import { riseIn, stagger } from '../lib/motion';

const STATUS = {
  placed: 'bg-link/20 text-link',
  delivered: 'bg-ok/20 text-ok',
  cancelled: 'bg-danger/20 text-danger',
};

function useNow(intervalMs = 30_000) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}

export default function OrdersPage() {
  const { orders, points, cancel } = useOrders();
  const cart = useCart();
  const toast = useToast();
  const now = useNow();
  const [target, setTarget] = useState(null);

  const buyAgain = (order) => {
    order.items.forEach((i) => {
      for (let n = 0; n < i.qty; n++) cart.add(i.id);
    });
    toast('Added the books from that order to your cart');
  };

  const confirmCancel = () => {
    const ok = cancel(target.id);
    toast(ok ? `Order ${target.id} was cancelled` : 'This order can no longer be cancelled', ok ? 'success' : 'error');
    setTarget(null);
  };

  const recs = recommendFromOrders(orders, 3);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h1 className="text-3xl font-light">My Orders</h1>
        <p className="flex items-center gap-2 text-sm bg-layer px-3 py-2">
          <Gift size={16} className="text-warn" aria-hidden="true" /> {points} gift points
        </p>
      </div>

      {orders.length === 0 ? (
        <p className="py-16 text-center text-fg2">
          No orders yet. <Link to="/">Find a book to read</Link>.
        </p>
      ) : (
        <motion.ul variants={stagger(0.08)} initial="hidden" animate="show" className="mt-6 space-y-5">
          {orders.map((o) => {
            const cancellable = canCancel(o, now);
            const left = cancelTimeLeft(o, now);
            return (
              <motion.li key={o.id} variants={riseIn} layout className="card p-4 sm:p-5">
                <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                  <div>
                    <p className="font-semibold">{o.id}</p>
                    <p className="text-fg3">Placed {fullDate(o.placedAt)} · paid by {o.payment}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-1 text-xs font-medium capitalize ${STATUS[o.status]}`}>{o.status}</span>
                    <span className="text-lg font-semibold">{inr(o.total)}</span>
                  </div>
                </div>

                <ul className="mt-4 flex gap-3 overflow-x-auto pb-1">
                  {o.items.map((i) => {
                    const b = getBook(i.id);
                    return b ? (
                      <li key={i.id} className="shrink-0 w-16 h-24 relative shadow-lg" title={`${b.title} × ${i.qty}`}>
                        <BookCover book={b} compact />
                        {i.qty > 1 && <span className="absolute -top-1 -right-1 bg-brand text-white text-[10px] px-1.5 rounded-full">×{i.qty}</span>}
                      </li>
                    ) : null;
                  })}
                </ul>

                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <button type="button" onClick={() => buyAgain(o)} className="btn-secondary">
                    <RotateCcw size={14} aria-hidden="true" /> Buy it again
                  </button>
                  {cancellable && (
                    <button type="button" onClick={() => setTarget(o)} className="btn-ghost text-danger">
                      <XCircle size={14} aria-hidden="true" /> Cancel order
                    </button>
                  )}
                  {cancellable && (
                    <span className="flex items-center gap-1.5 text-xs text-fg3">
                      <Clock size={12} aria-hidden="true" /> {left.hours}h {left.minutes}m left to cancel
                    </span>
                  )}
                </div>
              </motion.li>
            );
          })}
        </motion.ul>
      )}

      {recs.length > 0 && (
        <section aria-labelledby="recs-title" className="mt-14">
          <h2 id="recs-title" className="text-2xl font-light mb-1">Recommended from your order history</h2>
          <p className="text-sm text-fg3 mb-5">Based on the genres you have bought before.</p>
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {recs.map((b) => <BookCard key={b.id} book={b} />)}
          </div>
        </section>
      )}

      <Modal open={!!target} onClose={() => setTarget(null)} title="Cancel this order?" size="max-w-md" variant="sheet">
        <p className="text-sm text-fg2">
          Order <strong className="text-fg">{target?.id}</strong> will be cancelled and any gift points you used are returned.
          Orders can be cancelled up to 48 hours after they are placed.
        </p>
        <div className="mt-5 flex justify-end gap-3">
          <button type="button" onClick={() => setTarget(null)} className="btn-secondary">Keep order</button>
          <button type="button" onClick={confirmCancel} className="btn !bg-danger text-white hover:brightness-110">Yes, cancel it</button>
        </div>
      </Modal>
    </div>
  );
}
