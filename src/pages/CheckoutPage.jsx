import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { CreditCard, Gift, Minus, Plus, Tag, Trash2, X } from 'lucide-react';
import BookCover from '../components/BookCover';
import AnimatedNumber from '../components/AnimatedNumber';
import Field from '../components/Field';
import { useCart } from '../context/CartContext';
import { useCheckout } from '../context/CheckoutContext';
import { useOrders } from '../context/OrdersContext';
import { useToast } from '../context/ToastContext';
import { deliveryLabel, inr, inr2 } from '../lib/format';
import { COUPONS } from '../lib/pricing';
import { email, phone, pin, required, validate } from '../lib/validators';

const RULES = {
  firstName: required('First name'),
  lastName: required('Last name'),
  email,
  address: required('Address'),
  city: required('City'),
  pin,
  phone,
  state: required('State'),
};

const Row = ({ label, children, strong = false }) => (
  <div className={`flex justify-between ${strong ? 'text-lg font-semibold' : 'text-sm'}`}>
    <dt className={strong ? '' : 'text-fg2'}>{label}</dt>
    <dd>{children}</dd>
  </div>
);

export default function CheckoutPage() {
  const cart = useCart();
  const { address, setAddress, saved, saveAddress } = useCheckout();
  const { points } = useOrders();
  const toast = useToast();
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [useSaved, setUseSaved] = useState(false);
  const [remember, setRemember] = useState(false);
  const [code, setCode] = useState('');
  const [codeError, setCodeError] = useState('');

  const set = (field) => (e) => {
    setAddress({ ...address, [field]: e.target.value });
    if (errors[field]) setErrors({ ...errors, [field]: '' });
  };

  const toggleSaved = (on) => {
    setUseSaved(on);
    if (on && saved) {
      setAddress(saved);
      setErrors({});
    }
  };

  const applyCoupon = (e) => {
    e.preventDefault();
    if (cart.applyCoupon(code)) {
      toast(`Coupon applied: ${COUPONS[code.trim().toUpperCase()].label}`);
      setCode('');
      setCodeError('');
    } else {
      setCodeError('That coupon code is not valid');
    }
  };

  const pay = (e) => {
    e.preventDefault();
    const found = validate(address, RULES);
    setErrors(found);
    if (Object.keys(found).length) {
      toast('Please fix the highlighted fields', 'error');
      document.querySelector('[aria-invalid="true"]')?.focus();
      return;
    }
    if (remember) saveAddress(address);
    navigate('/payment');
  };

  if (cart.lines.length === 0) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-xl mx-auto text-center py-24 px-4">
        <div aria-hidden="true" className="mx-auto w-24 h-24 rounded-full bg-layer grid place-items-center">
          <motion.span animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 2.4 }} className="text-5xl">📚</motion.span>
        </div>
        <h1 className="mt-6 text-3xl font-light">Your cart is empty</h1>
        <p className="mt-2 text-fg2">Find something to read and it will show up here.</p>
        <Link to="/" className="btn-primary mt-6 px-6 !text-white no-underline">Browse books</Link>
      </motion.div>
    );
  }

  const first = cart.lines[0].book;

  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      <nav aria-label="Breadcrumb" className="text-sm mb-4">
        <ol className="flex flex-wrap gap-2 text-fg2">
          <li><Link to="/">Home</Link> /</li>
          <li><Link to={`/book/${first.id}`}>{first.title}</Link> /</li>
          <li aria-current="page" className="text-fg">Checkout</li>
        </ol>
      </nav>
      <h1 className="text-2xl font-light mb-4">Shopping Cart</h1>

      <section aria-label="Items in your cart" className="card p-4 sm:p-6">
        <ul className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {cart.lines.map((l) => (
              <motion.li
                key={l.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, x: -40, scale: 0.9 }}
                className="flex gap-4"
              >
                <Link to={`/book/${l.id}`} aria-label={`View ${l.book.title}`} className="w-24 h-36 sm:w-32 sm:h-48 shrink-0 shadow-xl">
                  <BookCover book={l.book} compact />
                </Link>
                <div className="min-w-0 text-sm">
                  <h2 className="text-lg leading-snug">{l.book.title}</h2>
                  <p className="text-fg2">by <span className="text-link underline">{l.book.author}</span></p>
                  <p className="mt-2 text-fg2">{l.book.format}</p>
                  <p className="mt-2 text-xl font-semibold">{inr(l.book.price * l.qty)}</p>
                  <p className="text-xs text-fg2">Delivery by <strong className="text-fg">{deliveryLabel(l.book.deliveryDays)}</strong></p>
                  <div className="mt-3 flex items-center gap-1" role="group" aria-label={`Quantity for ${l.book.title}`}>
                    <button type="button" aria-label="Decrease quantity" onClick={() => cart.setQty(l.id, l.qty - 1)} className="btn-secondary !min-h-0 p-2">
                      <Minus size={14} aria-hidden="true" />
                    </button>
                    <output aria-live="polite" className="w-9 text-center tabular-nums">{l.qty}</output>
                    <button type="button" aria-label="Increase quantity" onClick={() => cart.setQty(l.id, l.qty + 1)} className="btn-secondary !min-h-0 p-2">
                      <Plus size={14} aria-hidden="true" />
                    </button>
                    <button type="button" aria-label={`Remove ${l.book.title}`} onClick={() => cart.remove(l.id)} className="ml-2 p-2 text-fg3 hover:text-danger transition">
                      <Trash2 size={16} aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_28rem]">
        <form id="address-form" onSubmit={pay} noValidate className="card p-4 sm:p-6" aria-labelledby="address-title">
          <h2 id="address-title" className="text-xl mb-4">Address</h2>
          <label className={`flex items-center gap-2 text-sm mb-5 ${saved ? '' : 'opacity-50'}`}>
            <input type="checkbox" checked={useSaved} disabled={!saved} onChange={(e) => toggleSaved(e.target.checked)} className="w-4 h-4 accent-[#0f62fe]" />
            Use Saved Address {!saved && <span className="text-fg3">(none saved yet)</span>}
          </label>

          <div className="grid gap-4 sm:grid-cols-6">
            <Field className="sm:col-span-2" label="First Name" placeholder="First Name" autoComplete="given-name" value={address.firstName} onChange={set('firstName')} error={errors.firstName} />
            <Field className="sm:col-span-2" label="Last Name" placeholder="Last Name" autoComplete="family-name" value={address.lastName} onChange={set('lastName')} error={errors.lastName} />
            <Field className="sm:col-span-2" label="Address" placeholder="Address Line 2" autoComplete="street-address" value={address.address} onChange={set('address')} error={errors.address} />
            <Field className="sm:col-span-4" label="e-mail" type="email" placeholder="e-mail" autoComplete="email" value={address.email} onChange={set('email')} error={errors.email} />
            <Field className="sm:col-span-1" label="City" placeholder="City" autoComplete="address-level2" value={address.city} onChange={set('city')} error={errors.city} />
            <Field className="sm:col-span-1" label="Pin" placeholder="000000" inputMode="numeric" maxLength={6} autoComplete="postal-code" value={address.pin} onChange={set('pin')} error={errors.pin} />
            <div className="sm:col-span-4 grid grid-cols-[6rem_1fr] gap-2">
              <Field label="Phone Number" as="select" value={address.dial} onChange={set('dial')} aria-label="Country dial code">
                <option>+91</option><option>+1</option><option>+44</option><option>+61</option>
              </Field>
              <Field label="&nbsp;" placeholder="12345 67890" inputMode="numeric" autoComplete="tel-national" maxLength={10} value={address.phone} onChange={set('phone')} error={errors.phone} aria-label="Phone number" />
            </div>
            <Field className="sm:col-span-1" label="State" placeholder="State" autoComplete="address-level1" value={address.state} onChange={set('state')} error={errors.state} />
            <Field className="sm:col-span-1" label="Country" as="select" value={address.country} onChange={set('country')}>
              <option>India</option><option>United States</option><option>United Kingdom</option><option>Australia</option>
            </Field>
          </div>

          <label className="flex items-center gap-2 text-sm mt-5">
            <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="w-4 h-4 accent-[#0f62fe]" />
            Save this address for next time
          </label>
        </form>

        <aside aria-labelledby="total-title" className="card p-4 sm:p-6 h-fit lg:sticky lg:top-16">
          <div className="flex gap-5">
            <div aria-hidden="true" className="hidden sm:block w-32 shrink-0 art-bg rounded-sm relative overflow-hidden">
              <motion.div animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }} className="absolute inset-0 grid place-items-center text-6xl">📖</motion.div>
            </div>
            <div className="flex-1 min-w-0">
              <h2 id="total-title" className="text-xl mb-3">Grand Total</h2>
              <dl className="space-y-2">
                <Row label={`Price (${cart.count} item${cart.count === 1 ? '' : 's'})`}>{inr2(cart.subtotal)}</Row>
                <Row label="Tax">{inr2(cart.tax)}</Row>
                <Row label="Delivery Charges">{cart.delivery === 0 ? 'Free' : inr2(cart.delivery)}</Row>
              </dl>

              <form onSubmit={applyCoupon} className="mt-4 flex" noValidate>
                <label htmlFor="coupon" className="sr-only">Coupon code</label>
                <input id="coupon" className="field flex-1 min-w-0" placeholder="Apply Coupon" value={code} onChange={(e) => setCode(e.target.value)} aria-invalid={!!codeError} />
                <button type="submit" className="btn-primary px-4">Apply</button>
              </form>
              {codeError && <p role="alert" className="field-error">{codeError}</p>}
              <p className="text-xs text-fg3 mt-1">Try <button type="button" className="text-link underline" onClick={() => setCode('BOOKWORM100')}>BOOKWORM100</button></p>

              <AnimatePresence>
                {cart.coupon && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                    <div className="mt-3 flex items-center justify-between text-sm bg-ok/15 text-ok px-3 py-2">
                      <span className="flex items-center gap-2"><Tag size={14} aria-hidden="true" /> {cart.coupon}</span>
                      <button type="button" onClick={cart.removeCoupon} aria-label="Remove coupon"><X size={14} aria-hidden="true" /></button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <label className="mt-4 flex items-start gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={cart.redeem} disabled={points <= 0} onChange={(e) => cart.setRedeem(e.target.checked)} className="w-4 h-4 mt-0.5 accent-[#0f62fe]" />
                <span>
                  <span className="flex items-center gap-1.5"><Gift size={14} aria-hidden="true" /> Redeem gift points</span>
                  <span className="text-xs text-fg3">You have {points} points (1 point = ₹1)</span>
                </span>
              </label>

              <dl className="mt-4 space-y-2 border-t border-line pt-4">
                {cart.couponDiscount > 0 && <Row label="Discount">−{inr(cart.couponDiscount)}</Row>}
                {cart.pointsUsed > 0 && <Row label="Gift points">−{inr(cart.pointsUsed)}</Row>}
                <Row label="Total Amount" strong>
                  <AnimatedNumber value={cart.total} format={(n) => inr(n)} />
                </Row>
              </dl>

              <button type="submit" form="address-form" className="btn-primary w-full mt-5 text-base">
                Pay Now <CreditCard size={16} aria-hidden="true" />
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
