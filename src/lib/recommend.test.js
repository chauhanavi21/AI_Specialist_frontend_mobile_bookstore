import { describe, expect, it } from 'vitest';
import { recommendFromOrders } from './recommend';

const order = (ids, status = 'delivered') => ({ status, items: ids.map((id) => ({ id, qty: 1 })) });

describe('recommendFromOrders', () => {
  it('never recommends a book already bought', () => {
    const recs = recommendFromOrders([order(['art-of-focus'])], 8);
    expect(recs.map((b) => b.id)).not.toContain('art-of-focus');
  });

  it('ranks books sharing genres with past orders first', () => {
    const recs = recommendFromOrders([order(['art-of-focus'])], 3);
    // art-of-focus is Non-fiction / Self Help, so the other self-help titles come first
    expect(recs[0].genres).toContain('Self Help');
  });

  it('ignores cancelled orders', () => {
    const recs = recommendFromOrders([order(['art-of-focus'], 'cancelled')], 8);
    expect(recs.map((b) => b.id)).toContain('art-of-focus');
  });

  it('respects the limit and the exclude list', () => {
    const recs = recommendFromOrders([], 2, ['midnight-hour']);
    expect(recs).toHaveLength(2);
    expect(recs.map((b) => b.id)).not.toContain('midnight-hour');
  });
});
