import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const WishlistContext = createContext(null);
const KEY = 'bookworm.wishlist';

function load() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY));
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
}

export function WishlistProvider({ children }) {
  const [ids, setIds] = useState(load);
  useEffect(() => localStorage.setItem(KEY, JSON.stringify(ids)), [ids]);

  /** Returns true when the book was added, false when removed. */
  const toggle = useCallback((id) => {
    let added = false;
    setIds((cur) => {
      added = !cur.includes(id);
      return added ? [...cur, id] : cur.filter((x) => x !== id);
    });
    return added;
  }, []);

  const value = useMemo(() => ({ ids, has: (id) => ids.includes(id), toggle }), [ids, toggle]);
  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export const useWishlist = () => useContext(WishlistContext);
