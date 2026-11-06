import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { CheckoutProvider } from './context/CheckoutContext';
import { OrdersProvider, useOrders } from './context/OrdersContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { WishlistProvider } from './context/WishlistContext';
import './index.css';

// The cart needs the gift point balance, which lives in the orders context.
function CartWithPoints({ children }) {
  const { points } = useOrders();
  return <CartProvider points={points}>{children}</CartProvider>;
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <OrdersProvider>
              <CartWithPoints>
                <WishlistProvider>
                  <CheckoutProvider>
                    <App />
                  </CheckoutProvider>
                </WishlistProvider>
              </CartWithPoints>
            </OrdersProvider>
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
