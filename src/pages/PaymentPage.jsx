import React, { useRef, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { CreditCard, Loader2, Lock, Smartphone, Wallet } from 'lucide-react';
import Field from '../components/Field';
import { useCart } from '../context/CartContext';
import { useCheckout } from '../context/CheckoutContext';
import { useOrders } from '../context/OrdersContext';
import { useToast } from '../context/ToastContext';
import { inr } from '../lib/format';
import {
  cardNumber, cvv, expiry, formatCard, formatExpiry, required, upi, validate,
} from '../lib/validators';

const METHODS = [
  { key: 'credit', label: 'Credit Card', icon: CreditCard },
  { key: 'debit', label: 'Debit card', icon: CreditCard },
  { key: 'upi', label: 'UPI', icon: Smartphone },
  { key: 'wallet', label: 'Wallet', icon: Wallet },
];
const WALLETS = ['Paytm', 'PhonePe', 'Amazon Pay', 'Mobikwik'];

const RULES = {
  credit: { number: cardNumber, name: required('Name on card'), cvv, expiry },
  debit: { number: cardNumber, name: required('Name on card'), cvv, expiry },
  upi: { upiId: upi },
  wallet: { wallet: required('Wallet') },
};

/** Visual card that flips to its back while the CVV is focused. */
function CardPreview({ number, name, expiryValue, flipped, debit }) {
  const groups = (number.replace(/\s/g, '').padEnd(16, '•').match(/.{4}/g) ?? []).join(' ');
  return (
    <div className="hidden sm:block [perspective:900px] mb-5" aria-hidden="true">
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ type: 'spring', stiffness: 160, damping: 20 }}
        style={{ transformStyle: 'preserve-3d' }}
        className="relative h-36 w-60"
      >
        <div className="absolute inset-0 rounded-xl p-4 text-white bg-gradient-to-br from-[#0f62fe] via-[#6929c4] to-[#9f1853] shadow-2xl [backface-visibility:hidden]">
          <p className="text-[10px] uppercase tracking-widest opacity-80">{debit ? 'Debit' : 'Credit'}</p>
          <p className="mt-6 font-mono text-base tracking-wider">{groups}</p>
          <div className="mt-4 flex justify-between text-[10px] uppercase tracking-wide">
            <span className="truncate max-w-[9rem]">{name || 'Name on card'}</span>
            <span>{expiryValue || 'MM/YYYY'}</span>
          </div>
        </div>
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#393939] to-[#161616] [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <div className="mt-5 h-8 bg-black" />
          <div className="mx-4 mt-4 h-7 bg-white/90 text-black text-right pr-2 text-sm leading-7 font-mono">•••</div>
        </div>
      </motion.div>
    </div>
  );
}

export default function PaymentPage() {
  const cart = useCart();
  const { address, setLastOrder } = useCheckout();
  const orders = useOrders();
  const toast = useToast();
  const navigate = useNavigate();
  const finished = useRef(false);

  const [method, setMethod] = useState('credit');
  const [form, setForm] = useState({ number: '', name: '', cvv: '', expiry: '', upiId: '', wallet: WALLETS[0] });
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [cvvFocus, setCvvFocus] = useState(false);

  // Nothing to pay for, or no address yet: go back. (Skipped once the order has been placed.)
  if (!finished.current && (cart.lines.length === 0 || !address.firstName)) {
    return <Navigate to="/checkout" replace />;
  }

  const set = (field, fmt = (v) => v) => (e) => {
    setForm({ ...form, [field]: fmt(e.target.value) });
    if (errors[field]) setErrors({ ...errors, [field]: '' });
  };

  const submit = (e) => {
    e.preventDefault();
    if (busy) return;
    const found = validate(form, RULES[method]);
    setErrors(found);
    if (Object.keys(found).length) {
      toast('Check your payment details', 'error');
      return;
    }
    setBusy(true);
    // Simulated gateway round trip; a real integration would await the payment API here.
    setTimeout(() => {
      const label = METHODS.find((m) => m.key === method).label;
      const order = orders.place({
        lines: cart.lines, total: cart.total, pointsUsed: cart.pointsUsed, payment: label, address,
      });
      finished.current = true;
      setLastOrder({ ...order, lines: cart.lines });
      cart.clear();
      navigate('/confirmation', { replace: true });
    }, 1700);
  };

  const isCard = method === 'credit' || method === 'debit';

  return (
    <div className="art-bg min-h-[calc(100vh-3rem)] grid place-items-center px-3 py-10 relative overflow-hidden">
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <motion.span
            key={i}
            className="absolute text-5xl sm:text-7xl opacity-20 select-none"
            style={{ left: `${8 + i * 17}%`, top: `${(i % 3) * 30 + 8}%` }}
            animate={{ y: [0, -22, 0], rotate: [0, i % 2 ? 8 : -8, 0] }}
            transition={{ repeat: Infinity, duration: 7 + i, ease: 'easeInOut', delay: i * 0.4 }}
          >
            {['📘', '📙', '📗', '📕', '📖', '📚'][i]}
          </motion.span>
        ))}
      </div>

      <motion.form
        onSubmit={submit}
        noValidate
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 160, damping: 22 }}
        className="relative w-full max-w-3xl bg-layer shadow-2xl"
        aria-labelledby="pay-title"
      >
        <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-4 border-b border-line">
          <h1 id="pay-title" className="text-xl">Complete Payment</h1>
          <p className="text-lg font-semibold">Payable Amount: {inr(cart.total)}</p>
        </div>

        <div className="sm:flex">
          <div role="tablist" aria-label="Payment method" className="flex sm:flex-col sm:w-44 shrink-0 overflow-x-auto bg-layer2/40">
            {METHODS.map((m) => {
              const active = m.key === method;
              return (
                <button
                  key={m.key}
                  type="button"
                  role="tab"
                  id={`tab-${m.key}`}
                  aria-selected={active}
                  aria-controls="pay-panel"
                  onClick={() => { setMethod(m.key); setErrors({}); }}
                  className={`relative text-left px-5 py-4 text-sm whitespace-nowrap flex-1 sm:flex-none transition-colors ${active ? 'font-semibold bg-layer' : 'text-fg2 hover:bg-layer2/60'}`}
                >
                  {active && <motion.span layoutId="pay-tab" className="absolute left-0 top-0 bottom-0 w-1 max-sm:w-full max-sm:h-1 max-sm:top-auto bg-brand" />}
                  {m.label}
                </button>
              );
            })}
          </div>

          <div id="pay-panel" role="tabpanel" aria-labelledby={`tab-${method}`} className="flex-1 p-5 min-h-[18rem]">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={method}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.2 }}
              >
                {isCard && (
                  <>
                    <CardPreview number={form.number} name={form.name} expiryValue={form.expiry} flipped={cvvFocus} debit={method === 'debit'} />
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field label="Card Number" placeholder="XXXX-XXXX-XXXX-XXXX" inputMode="numeric" autoComplete="cc-number" value={form.number} onChange={set('number', formatCard)} error={errors.number} />
                      <Field label="Name on Card" placeholder="Name" autoComplete="cc-name" value={form.name} onChange={set('name')} error={errors.name} />
                      <Field
                        label="CVV" placeholder="XXX" inputMode="numeric" maxLength={3} type="password" autoComplete="cc-csc"
                        value={form.cvv} onChange={set('cvv', (v) => v.replace(/\D/g, ''))} error={errors.cvv}
                        onFocus={() => setCvvFocus(true)} onBlur={() => setCvvFocus(false)}
                      />
                      <Field label="Date of Expiry" placeholder="MM/YYYY" inputMode="numeric" autoComplete="cc-exp" value={form.expiry} onChange={set('expiry', formatExpiry)} error={errors.expiry} />
                    </div>
                    <p className="text-xs text-fg3 mt-3">Demo tip: 4242 4242 4242 4242 passes the card check.</p>
                  </>
                )}
                {method === 'upi' && (
                  <Field label="UPI ID" placeholder="name@bank" autoComplete="off" value={form.upiId} onChange={set('upiId')} error={errors.upiId} />
                )}
                {method === 'wallet' && (
                  <fieldset>
                    <legend className="field-label">Choose a wallet</legend>
                    <div className="grid grid-cols-2 gap-3 mt-2">
                      {WALLETS.map((w) => (
                        <label key={w} className={`cursor-pointer border px-4 py-3 text-sm transition ${form.wallet === w ? 'border-brand bg-brand/15' : 'border-line hover:bg-layer2/60'}`}>
                          <input type="radio" name="wallet" value={w} checked={form.wallet === w} onChange={set('wallet')} className="sr-only" />
                          {w}
                        </label>
                      ))}
                    </div>
                  </fieldset>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="mt-6 flex items-center justify-between gap-3">
              <p className="hidden sm:flex items-center gap-1.5 text-xs text-fg3"><Lock size={12} aria-hidden="true" /> Demo checkout: no real payment is made</p>
              <button type="submit" disabled={busy} className="btn-primary ml-auto px-6 min-w-[8.5rem]">
                {busy ? (<><Loader2 size={16} className="animate-spin" aria-hidden="true" /> Processing…</>) : (<>Pay Now <CreditCard size={16} aria-hidden="true" /></>)}
              </button>
            </div>
          </div>
        </div>
      </motion.form>
    </div>
  );
}
