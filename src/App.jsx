import React, { useEffect } from 'react';
import { Link, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/Navbar';
import CatalogPage from './pages/CatalogPage';
import BookPage from './pages/BookPage';
import CheckoutPage from './pages/CheckoutPage';
import PaymentPage from './pages/PaymentPage';
import ConfirmationPage from './pages/ConfirmationPage';
import OrdersPage from './pages/OrdersPage';
import WishlistPage from './pages/WishlistPage';
import WritersPage from './pages/WritersPage';
import { pageVariants } from './lib/motion';

function NotFound() {
  return (
    <div className="text-center py-24 px-4">
      <p className="text-7xl font-light gradient-text">404</p>
      <h1 className="mt-4 text-2xl font-light">This page isn’t on our shelves.</h1>
      <Link to="/" className="btn-primary mt-6 px-6 !text-white no-underline">Back to the store</Link>
    </div>
  );
}

export default function App() {
  const location = useLocation();

  // New page: scroll to the top and move focus to the main region for screen reader users.
  useEffect(() => {
    window.scrollTo(0, 0);
    document.getElementById('main')?.focus({ preventScroll: true });
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-canvas text-fg">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[90] focus:bg-brand focus:text-white focus:p-3">
        Skip to content
      </a>
      <Navbar />
      <AnimatePresence mode="wait" initial={false}>
        <motion.main
          key={location.pathname}
          id="main"
          tabIndex={-1}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="outline-none"
        >
          <Routes location={location}>
            <Route path="/" element={<CatalogPage />} />
            <Route path="/book/:id" element={<BookPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/confirmation" element={<ConfirmationPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/writers" element={<WritersPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </motion.main>
      </AnimatePresence>
    </div>
  );
}
