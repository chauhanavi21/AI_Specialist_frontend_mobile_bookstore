// Mock catalogue taken from the wireframes. The brief only asks for the front end,
// so this module stands in for the backend API; swap it for fetch() calls later.

export const CATEGORIES = [
  'All', 'Romance', 'Mystery', 'Science Fiction', 'Fantasy', 'Historical', 'Biography',
  'Self-help', 'Memoir', 'Travel', 'Cooking', "Children's", 'Young Adult',
  'Comics & Graphic Novels', 'Poetry', 'Drama', 'Science', 'Philosophy', 'Religion',
  'Language Learning',
];

export const LANGUAGES = ['All', 'English', 'Hindi'];
export const FORMATS = ['All', 'Paperback', 'Hard Cover', 'eBook'];
export const PRICE_RANGES = [
  { label: 'All', min: 0, max: Infinity },
  { label: 'Under ₹200', min: 0, max: 199 },
  { label: '₹200 – ₹349', min: 200, max: 349 },
  { label: '₹350 and above', min: 350, max: Infinity },
];
export const SORTS = ['Relevance', 'Price: low to high', 'Price: high to low', 'Title A–Z'];

// Cover palettes echo the wireframe covers: bold colour blocks with a contrasting title.
// Every bg/fg pair keeps contrast above 4.5:1.
const covers = {
  focus: { bg: '#efe9df', fg: '#161616', accent: '#c8372d' },
  learning: { bg: '#c8372d', fg: '#ffffff', accent: '#f1c21b' },
  success: { bg: '#0e6b7a', fg: '#f1c21b', accent: '#f1c21b' },
  midnight: { bg: '#0f2d33', fg: '#e8e3b0', accent: '#e8e3b0' },
  stars: { bg: '#3a1c4a', fg: '#f4d6b0', accent: '#ff832b' },
  frontier: { bg: '#0a2a4a', fg: '#ffffff', accent: '#ff832b' },
  minimalism: { bg: '#fdd017', fg: '#161616', accent: '#161616' },
  vanishing: { bg: '#10262b', fg: '#e8e3b0', accent: '#e8e3b0' },
  kitten: { bg: '#ff832b', fg: '#ffeab6', accent: '#161616' },
};

export const BOOKS = [
  {
    id: 'art-of-focus', title: 'The Art of Focus', author: 'Arjun Patel', section: 'recommended',
    blurb: 'Practical guide to mastering focus & boosting productivity every day.',
    format: 'Paperback', genres: ['Non-fiction', 'Self Help'], categories: ['Self-help'],
    price: 399, language: 'English', rating: 4, sold: 212, deliveryDays: 3, cover: covers.focus,
  },
  {
    id: 'art-of-learning', title: 'The Art of Learning', author: 'Raj Patel', section: 'recommended',
    blurb: 'Master the mindset and methods for effective lifelong learning.',
    format: 'Paperback', genres: ['Non-fiction', 'Self Help'], categories: ['Self-help'],
    price: 259, language: 'English', rating: 5, sold: 168, deliveryDays: 3, cover: covers.learning,
  },
  {
    id: 'path-to-success', title: 'The Path to Success', author: 'James Wright', section: 'recommended',
    blurb: 'A practical guide to achieving goals with clarity and confidence.',
    format: 'Paperback', genres: ['Non-fiction', 'Self Help'], categories: ['Self-help'],
    price: 359, language: 'English', rating: 4, sold: 190, deliveryDays: 3, cover: covers.success,
  },
  {
    id: 'midnight-hour', title: 'The Midnight Hour', author: 'James Adams', section: 'bestsellers',
    blurb: "Haunting tale of a man's journey & the shadows of a forgotten past.",
    format: 'Paperback', genres: ['Fiction', 'Thriller', 'Horror'], categories: ['Mystery'],
    price: 299, language: 'English', rating: 4, sold: 340, deliveryDays: 4, cover: covers.midnight,
  },
  {
    id: 'beneath-the-stars', title: 'Beneath the Stars', author: 'Jessica Martin', section: 'bestsellers',
    blurb: 'A heartwarming tale, where two souls discover who you are.',
    format: 'Hard Cover', genres: ['Fiction', 'Love', 'Drama'], categories: ['Romance', 'Drama'],
    price: 499, language: 'English', rating: 5, sold: 410, deliveryDays: 4, cover: covers.stars,
  },
  {
    id: 'final-frontier', title: 'The Final Frontier', author: 'Laura Mitchell', section: 'bestsellers',
    blurb: 'A mission to space secrets to change humanity forever.',
    format: 'Paperback', genres: ['Fiction', 'Thriller'], categories: ['Science Fiction'],
    price: 359, language: 'English', rating: 4, sold: 275, deliveryDays: 4, cover: covers.frontier,
  },
  {
    id: 'joy-of-minimalism', title: 'Joy of Minimalism', author: 'Daniel Reed', section: 'new',
    blurb: 'Declutter your life to uncover peace, clarity, and joy.',
    format: 'Paperback', genres: ['Non-fiction', 'Self Help'], categories: ['Self-help'],
    price: 149, language: 'English', rating: 5, sold: 145, deliveryDays: 3, cover: covers.minimalism,
    publisher: 'ABC Publishers', tagline: 'Simplify your life for greater clarity and happiness',
    writerBio:
      'Daniel Reed is a writer, minimalist, and productivity coach based in San Francisco. With a passion for intentional living, Daniel has dedicated his career to helping individuals simplify their lives – one habit, one space, and one thought at a time. He is the author of The Joy of Minimalism, an acclaimed guide to decluttering both physically and mentally.',
  },
  {
    id: 'vanishing-house', title: 'The Vanishing House', author: 'Clara Nelson', section: 'new',
    blurb: 'A chilling mystery unfolds within a house that disappears.',
    format: 'eBook', genres: ['Fiction', 'Horror'], categories: ['Mystery'],
    price: 99, language: 'English', rating: 4, sold: 88, deliveryDays: 1, cover: covers.vanishing,
  },
  {
    id: 'lost-kitten', title: 'The Lost Kitten', author: 'Emily Parker', section: 'new',
    blurb: 'A heartwarming tale of courage, friendship, and feline adventure.',
    format: 'Hard Cover', genres: ['Fiction', 'Children'], categories: ["Children's"],
    price: 339, language: 'English', rating: 5, sold: 120, deliveryDays: 4, cover: covers.kitten,
  },
];

export const SECTIONS = [
  { key: 'recommended', title: 'Recommended for You' },
  { key: 'bestsellers', title: 'Bestsellers this Month' },
  { key: 'new', title: 'New Launches' },
];

export const getBook = (id) => BOOKS.find((b) => b.id === id);

/** Books sharing a genre with the given book, used for the "Related Reads" panel. */
export function relatedBooks(book, limit = 3) {
  return BOOKS.filter((b) => b.id !== book.id && b.genres.some((g) => book.genres.includes(g))).slice(0, limit);
}
