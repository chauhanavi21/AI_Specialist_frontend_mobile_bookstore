import { describe, expect, it } from 'vitest';
import { canCancel, cancelTimeLeft, computeTotals, couponValue } from './pricing';

const line = (price, qty = 1) => ({ price, qty });

describe('computeTotals', () => {
  it('adds 12% tax and charges delivery under the free threshold', () => {
    const t = computeTotals({ lines: [line(149)] });
    expect(t).toMatchObject({ subtotal: 149, tax: 18, delivery: 40, total: 207 });
  });

  it('gives free delivery at or above the threshold', () => {
    expect(computeTotals({ lines: [line(299)] }).delivery).toBe(0);
    expect(computeTotals({ lines: [line(149), line(359)] }).delivery).toBe(0);
  });

  it('charges nothing for an empty cart', () => {
    expect(computeTotals({ lines: [] }).total).toBe(0);
  });

  it('applies flat and percentage coupons', () => {
    expect(computeTotals({ lines: [line(500)], coupon: 'BOOKWORM100' }).couponDiscount).toBe(100);
    expect(couponValue('WELCOME10', 500)).toBe(50);
    expect(couponValue('NOPE', 500)).toBe(0);
  });

  it('never lets discounts push the total below zero', () => {
    const t = computeTotals({ lines: [line(20)], coupon: 'BOOKWORM100', redeem: true, points: 500 });
    expect(t.total).toBe(0);
  });

  it('redeems gift points only up to what is still owed', () => {
    const t = computeTotals({ lines: [line(500)], redeem: true, points: 150 });
    expect(t.pointsUsed).toBe(150);
    expect(t.total).toBe(t.gross - 150);
    const small = computeTotals({ lines: [line(500)], coupon: 'BOOKWORM100', redeem: true, points: 9999 });
    expect(small.total).toBe(0);
    expect(small.pointsUsed).toBe(small.gross - 100);
  });

  it('ignores points when not redeeming', () => {
    expect(computeTotals({ lines: [line(500)], redeem: false, points: 150 }).pointsUsed).toBe(0);
  });
});

describe('cancellation window', () => {
  const HOUR = 3_600_000;
  const placed = (hoursAgo, status = 'placed') => ({ status, placedAt: Date.now() - hoursAgo * HOUR });

  it('allows cancelling inside 48 hours', () => {
    expect(canCancel(placed(47))).toBe(true);
  });
  it('blocks cancelling after 48 hours', () => {
    expect(canCancel(placed(49))).toBe(false);
  });
  it('blocks cancelling delivered or already cancelled orders', () => {
    expect(canCancel(placed(1, 'delivered'))).toBe(false);
    expect(canCancel(placed(1, 'cancelled'))).toBe(false);
  });
  it('reports time left', () => {
    const now = Date.now();
    const order = { status: 'placed', placedAt: now - 46.5 * HOUR };
    expect(cancelTimeLeft(order, now)).toMatchObject({ hours: 1, minutes: 30 });
    expect(cancelTimeLeft({ ...order, placedAt: now - 60 * HOUR }, now).ms).toBe(0);
  });
});
