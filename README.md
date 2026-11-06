# Book Worm: online bookstore front end

A responsive e-commerce front end for a bookstore, built from the wireframes in [`docs/wireframes`](docs/wireframes). It covers the full customer journey: browse, pick a book, add to cart, pay, and get a confirmation. It is front end only; the catalogue, orders and sign-in are simulated in the browser.

## Run it

```bash
npm install
npm run dev      # http://127.0.0.1:5173
npm test         # unit tests (pricing, validation, recommendations)
npm run build    # production build in dist/
```

Requires Node 18 or newer.

## What is in it

| Journey step | Where |
| --- | --- |
| Catalogue by category, search, language, format, price and sort | `src/pages/CatalogPage.jsx` |
| Product page: 3D book, reviews, related reads | `src/pages/BookPage.jsx` |
| Cart, address form, coupon, gift points | `src/pages/CheckoutPage.jsx` |
| Payment: card, debit, UPI, wallet | `src/pages/PaymentPage.jsx` |
| Purchase confirmation | `src/pages/ConfirmationPage.jsx` |
| Order history, buy it again, cancel within 48 hours, recommendations | `src/pages/OrdersPage.jsx` |
| Wishlist and writers | `src/pages/WishlistPage.jsx`, `src/pages/WritersPage.jsx` |

Try these:

- Coupon `BOOKWORM100` takes ₹100 off, `WELCOME10` takes 10%.
- Card `4242 4242 4242 4242` passes the card check (Luhn). Any future expiry and any 3 digit CVV.
- You start with 150 gift points. Redeeming them at checkout lowers the total; you earn 1 point per ₹10 spent.
- Orders can be cancelled for 48 hours after they are placed. A past delivered order is included so "Buy it again" and the recommendations work on first run.

## Design and motion

- **3D:** a WebGL hero (three.js) with floating books that follow the pointer, and a drag-to-rotate CSS 3D book on the product page (arrow keys work too). The hero loads after first paint and falls back to a CSS aurora when WebGL is unavailable or reduced motion is on.
- **Motion:** animated route transitions, shared-layout category pill and nav underline, hover tilt with glare, a fly-to-cart effect, animated totals, a flipping card preview that turns over while you type the CVV, an animated check and confetti on confirmation, skeleton loading.
- **Theme:** dark by default as in the wireframes, with a light theme toggle. Colours are CSS variables.
- **Responsive:** category sidebar becomes scrolling chips on phones, dialogs become bottom sheets, the nav collapses to a menu. Checked at 390, 820, 1440 and 1920 px wide.
- **Accessibility:** keyboard reachable, visible focus, skip link, labelled form fields with announced errors, focus trapped and restored in dialogs, `prefers-reduced-motion` respected.

## Structure

```
src/
  components/   reusable UI (BookCard, BookCover, Book3D, Hero, Modal, Tilt, Field, ...)
  pages/        one file per screen
  context/      cart, orders, wishlist, auth, theme, toasts, checkout
  lib/          pricing, validators, recommendations, formatting, motion presets
  data/         mock catalogue
```

Pricing, validation and recommendation rules are plain functions with unit tests next to them.

## Known limits

- No backend: swap `src/data/books.js` and the contexts for API calls to connect one. Sign-in accepts any valid e-mail and a 6 character password, and payment is simulated.
- Book covers are drawn from the title and author rather than image files.
