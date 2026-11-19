// Pure pricing rules so they can be unit tested without React.

export const TAX_RATE = 0.12;
export const FREE_DELIVERY_FROM = 299;
export const DELIVERY_FEE = 40;

/** Coupon codes: either a flat rupee amount or a percentage of the subtotal. */
export const COUPONS = {
  BOOKWORM100: { flat: 100, label: '₹100 off' },
  WELCOME10: { percent: 10, label: '10% off' },
};

export function couponValue(code, subtotal) {
  const c = COUPONS[code];
  if (!c) return 0;
  return c.flat ?? Math.round((subtotal * c.percent) / 100);
}

/**
 * @param lines   [{ price, qty }]
 * @param coupon  coupon code or null
 * @param redeem  whether the customer redeems gift points (1 point = ₹1)
 * @param points  gift point balance
 */
export function computeTotals({ lines, coupon = null, redeem = false, points = 0 }) {
  const subtotal = lines.reduce((sum, l) => sum + l.price * l.qty, 0);
  const tax = Math.round(subtotal * TAX_RATE);
  const delivery = subtotal === 0 || subtotal >= FREE_DELIVERY_FROM ? 0 : DELIVERY_FEE;
  const gross = subtotal + tax + delivery;
  const couponDiscount = Math.min(couponValue(coupon, subtotal), gross);
  const pointsUsed = redeem ? Math.min(Math.max(0, points), gross - couponDiscount) : 0;
  const total = gross - couponDiscount - pointsUsed;
  return { subtotal, tax, delivery, gross, couponDiscount, pointsUsed, total };
}

/** An order can be cancelled for 48 hours after it was placed. */
export const CANCEL_WINDOW_MS = 48 * 60 * 60 * 1000;

export function canCancel(order, now = Date.now()) {
  return order.status === 'placed' && now - order.placedAt < CANCEL_WINDOW_MS;
}

export function cancelTimeLeft(order, now = Date.now()) {
  const ms = Math.max(0, CANCEL_WINDOW_MS - (now - order.placedAt));
  const hours = Math.floor(ms / 3_600_000);
  const minutes = Math.floor((ms % 3_600_000) / 60_000);
  return { hours, minutes, ms };
}
