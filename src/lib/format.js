const whole = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
const full = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2, maximumFractionDigits: 2 });

/** Rupees: whole numbers print without decimals (₹399), anything else with two. */
export function inr(value) {
  const n = Number(value ?? 0);
  return Number.isInteger(n) ? whole.format(n) : full.format(n);
}

/** Rupees, always with two decimals (used in the cart summary). */
export function inr2(value) {
  return full.format(Number(value ?? 0));
}

/** Delivery estimate N days from today, shown as "Mon, 21 Jul". */
export function deliveryLabel(days = 3) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
}
