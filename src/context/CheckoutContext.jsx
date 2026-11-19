import React, { createContext, useContext, useEffect, useState } from 'react';

// Carries the delivery address from the checkout page to payment, and remembers one saved address.
const CheckoutContext = createContext(null);
const KEY = 'bookworm.savedAddress';

export const EMPTY_ADDRESS = {
  firstName: '', lastName: '', email: '', address: '', city: '', pin: '',
  dial: '+91', phone: '', state: '', country: 'India',
};

export function CheckoutProvider({ children }) {
  const [address, setAddress] = useState(EMPTY_ADDRESS);
  const [saved, setSaved] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(KEY));
    } catch {
      return null;
    }
  });
  // The order shown on the confirmation screen
  const [lastOrder, setLastOrder] = useState(null);

  useEffect(() => {
    if (saved) localStorage.setItem(KEY, JSON.stringify(saved));
  }, [saved]);

  return (
    <CheckoutContext.Provider value={{ address, setAddress, saved, saveAddress: setSaved, lastOrder, setLastOrder }}>
      {children}
    </CheckoutContext.Provider>
  );
}

export const useCheckout = () => useContext(CheckoutContext);
