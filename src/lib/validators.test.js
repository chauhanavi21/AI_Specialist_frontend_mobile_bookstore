import { describe, expect, it } from 'vitest';
import {
  caretAfterDigits, cardNumber, cvv, email, expiry, formatCard, formatExpiry, luhn, phone, pin, upi, validate,
} from './validators';

describe('validators', () => {
  it('validates e-mail, phone and pin', () => {
    expect(email('a@b.co')).toBe('');
    expect(email('nope')).not.toBe('');
    expect(phone('1234567890')).toBe('');
    expect(phone('12345')).not.toBe('');
    expect(pin('560001')).toBe('');
    expect(pin('5600')).not.toBe('');
  });

  it('checks card numbers with the Luhn algorithm', () => {
    expect(luhn('4242424242424242')).toBe(true);
    expect(luhn('4242424242424241')).toBe(false);
    expect(cardNumber('4242 4242 4242 4242')).toBe('');
    expect(cardNumber('4242 4242 4242 4241')).not.toBe('');
    expect(cardNumber('1234')).not.toBe('');
  });

  it('checks cvv and upi', () => {
    expect(cvv('123')).toBe('');
    expect(cvv('12')).not.toBe('');
    expect(upi('name@okbank')).toBe('');
    expect(upi('name')).not.toBe('');
  });

  it('rejects expired and malformed expiry dates', () => {
    const now = new Date(2026, 10, 6);
    expect(expiry('10/2026', now)).not.toBe('');
    expect(expiry('11/2026', now)).toBe('');
    expect(expiry('13/2030', now)).not.toBe('');
    expect(expiry('1/30', now)).not.toBe('');
  });

  it('formats card and expiry input as the user types', () => {
    expect(formatCard('4242424242424242')).toBe('4242 4242 4242 4242');
    expect(formatCard('42ab')).toBe('42');
    expect(formatExpiry('112030')).toBe('11/2030');
    expect(formatExpiry('1')).toBe('1');
  });

  it('keeps the caret on the same digit after reformatting', () => {
    expect(caretAfterDigits('4242 4', 5)).toBe(6); // typed a digit that pulled in a space
    expect(caretAfterDigits('4424 2424', 2)).toBe(2); // edit in the middle stays put
    expect(caretAfterDigits('4242 4242', 4)).toBe(4); // just before a space
    expect(caretAfterDigits('4242', 0)).toBe(0);
    expect(caretAfterDigits('42', 9)).toBe(2); // past the end clamps
  });

  it('collects only the failing fields', () => {
    const errors = validate({ a: '', b: 'x@y.com' }, { a: (v) => (v ? '' : 'needed'), b: email });
    expect(errors).toEqual({ a: 'needed' });
  });
});
