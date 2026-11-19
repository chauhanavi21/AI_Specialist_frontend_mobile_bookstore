import React, { useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { BookOpen } from 'lucide-react';
import BookCard from '../components/BookCard';
import { useCheckout } from '../context/CheckoutContext';
import { inr } from '../lib/format';
import { stagger, riseIn } from '../lib/motion';

function fireConfetti() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const colors = ['#0f62fe', '#78a9ff', '#f1c21b', '#ff832b', '#42be65', '#be95ff'];
  confetti({ particleCount: 110, spread: 75, origin: { y: 0.55 }, colors });
  setTimeout(() => confetti({ particleCount: 60, angle: 60, spread: 60, origin: { x: 0, y: 0.7 }, colors }), 250);
  setTimeout(() => confetti({ particleCount: 60, angle: 120, spread: 60, origin: { x: 1, y: 0.7 }, colors }), 400);
}

export default function ConfirmationPage() {
  const { lastOrder } = useCheckout();

  useEffect(() => {
    if (lastOrder) fireConfetti();
  }, [lastOrder]);

  if (!lastOrder) return <Navigate to="/" replace />;

  return (
    <div className="art-bg min-h-[calc(100vh-3rem)] grid place-items-center px-3 py-10">
      <motion.section
        variants={stagger(0.12, 0.15)}
        initial="hidden"
        animate="show"
        aria-labelledby="done-title"
        className="w-full max-w-3xl glass border border-line shadow-2xl px-5 sm:px-10 py-10 text-center"
      >
        <motion.div variants={riseIn} className="mx-auto w-20 h-20">
          <svg viewBox="0 0 80 80" className="w-full h-full" role="img" aria-label="Success">
            <motion.circle
              cx="40" cy="40" r="34" fill="none" stroke="#24c55e" strokeWidth="6"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6, ease: 'easeOut' }}
            />
            <motion.circle cx="40" cy="40" r="34" fill="#24c55e" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5, type: 'spring', stiffness: 220, damping: 14 }} style={{ transformOrigin: 'center' }} />
            <motion.path
              d="M24 41 l11 11 l22 -24" fill="none" stroke="#161616" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.7, duration: 0.4 }}
            />
          </svg>
        </motion.div>

        <motion.h1 id="done-title" variants={riseIn} className="mt-6 text-2xl sm:text-3xl font-light">
          Your purchase of the following reads is successful
        </motion.h1>
        <motion.p variants={riseIn} className="mt-2 text-sm text-fg2">
          Order <strong className="text-fg">{lastOrder.id}</strong> · {inr(lastOrder.total)} paid by {lastOrder.payment}.
          {' '}You can cancel it within 48 hours from <Link to="/orders">My Orders</Link>.
        </motion.p>
        {lastOrder.pointsEarned > 0 && (
          <motion.p variants={riseIn} className="mt-1 text-sm text-ok">You earned {lastOrder.pointsEarned} gift points.</motion.p>
        )}

        <motion.ul variants={stagger(0.12)} className="mt-8 grid gap-6 sm:grid-cols-2 text-left">
          {lastOrder.lines.map((l) => (
            <motion.li key={l.id} variants={riseIn}>
              <BookCard book={l.book} compact actions={false} />
            </motion.li>
          ))}
        </motion.ul>

        <motion.div variants={riseIn} className="mt-10">
          <Link to="/" className="btn-primary px-6 !text-white no-underline">
            Continue your Shopping <BookOpen size={16} aria-hidden="true" />
          </Link>
        </motion.div>
      </motion.section>
    </div>
  );
}
