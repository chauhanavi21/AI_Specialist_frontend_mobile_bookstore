import { BOOKS } from '../data/books';

/**
 * Recommends books the customer has not bought, ranked by how many genres they share
 * with books in their order history. Cancelled orders do not count.
 */
export function recommendFromOrders(orders, limit = 3, exclude = []) {
  const bought = new Set();
  const genreScore = {};
  for (const o of orders) {
    if (o.status === 'cancelled') continue;
    for (const item of o.items) {
      bought.add(item.id);
      const book = BOOKS.find((b) => b.id === item.id);
      book?.genres.forEach((g) => { genreScore[g] = (genreScore[g] ?? 0) + item.qty; });
    }
  }
  return BOOKS
    .filter((b) => !bought.has(b.id) && !exclude.includes(b.id))
    .map((b) => ({ book: b, score: b.genres.reduce((s, g) => s + (genreScore[g] ?? 0), 0) }))
    .sort((a, b) => b.score - a.score || b.book.sold - a.book.sold)
    .slice(0, limit)
    .map((r) => r.book);
}
