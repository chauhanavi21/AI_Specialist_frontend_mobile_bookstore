// Form validators. Each returns an error message, or '' when the value is fine.

export const required = (label) => (v) => (String(v ?? '').trim() ? '' : `${label} is required`);

export const email = (v) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(v).trim()) ? '' : 'Enter a valid e-mail address';

export const phone = (v) => (/^\d{10}$/.test(String(v).replace(/\s/g, '')) ? '' : 'Enter a 10 digit phone number');

export const pin = (v) => (/^\d{6}$/.test(String(v).trim()) ? '' : 'Enter a 6 digit PIN code');

/** Luhn checksum, so a mistyped card number is caught before "payment". */
export function luhn(digits) {
  let sum = 0;
  let alt = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let n = Number(digits[i]);
    if (alt) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alt = !alt;
  }
  return sum % 10 === 0;
}

export const cardNumber = (v) => {
  const d = String(v).replace(/\s|-/g, '');
  if (!/^\d{16}$/.test(d)) return 'Enter the 16 digit card number';
  return luhn(d) ? '' : 'This card number is not valid';
};

export const cvv = (v) => (/^\d{3}$/.test(String(v)) ? '' : 'Enter the 3 digit CVV');

export const expiry = (v, now = new Date()) => {
  const m = /^(\d{2})\/(\d{4})$/.exec(String(v));
  if (!m) return 'Use MM/YYYY';
  const month = Number(m[1]);
  const year = Number(m[2]);
  if (month < 1 || month > 12) return 'Month must be 01–12';
  const endOfMonth = new Date(year, month, 0, 23, 59, 59);
  return endOfMonth < now ? 'This card has expired' : '';
};

export const upi = (v) => (/^[\w.-]{2,}@[a-zA-Z]{2,}$/.test(String(v).trim()) ? '' : 'Enter a UPI ID like name@bank');

/** Runs a `{ field: validator }` map over values; returns `{ field: message }` for failures only. */
export function validate(values, rules) {
  const errors = {};
  for (const [field, fn] of Object.entries(rules)) {
    const msg = fn(values[field]);
    if (msg) errors[field] = msg;
  }
  return errors;
}

/** Formats raw input as "1234 5678 9012 3456". */
export const formatCard = (v) =>
  String(v).replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();

/** Formats raw input as "MM/YYYY". */
export function formatExpiry(v) {
  const d = String(v).replace(/\D/g, '').slice(0, 6);
  return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
}
