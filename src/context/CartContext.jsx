import React, { useState, useEffect, useContext, createContext } from "react";

// Global shopping cart context.
// Holds an array of cart items shaped like:
//   { name, slug, price, image, quantity }
// and exposes helpers to add/remove items plus derived counts/subtotals.
const CartContext = createContext();

// localStorage key jahan basket save hota hai. Ye is liye zaroori hai ke React
// state page reload (ya browser band karne) par khali ho jati hai — is ke baghair
// user ka basket har refresh par udd jata tha.
const STORAGE_KEY = "madniSolarCart";

// Page load par saved basket wapis parho. Kharab/purana JSON ho to khali cart.
const loadCart = () => {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) return [];

    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed)) return [];

    // Sirf valid items rakho (data file badal jaye to tooti entries na aayen).
    return parsed.filter(
      (item) => item && item.slug && typeof item.price === "number"
    );
  } catch (error) {
    // Private mode / disabled storage — chup chaap khali cart se shuru karo.
    return [];
  }
};

// Helper to compute the total number of items across the cart.
const computeCartCount = (items) =>
  items.reduce((total, item) => total + item.quantity, 0);

// Helper to compute the combined price (Rs) of every item in the cart.
const computeSubtotal = (items) =>
  items.reduce((total, item) => total + item.price * item.quantity, 0);

export function CartProvider({ children }) {
  // Initial state localStorage se aata hai (lazy initialiser, sirf ek dafa chalta hai).
  const [cartItems, setCartItems] = useState(loadCart);

  // Jab bhi basket badle, localStorage mein likh do.
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
    } catch (error) {
      // Storage full ya blocked — cart phir bhi is session mein kaam karta rahega.
    }
  }, [cartItems]);

  // Adds a product to the cart. If the product (by slug) is already in the
  // cart, its quantity is increased by the given amount; otherwise a new
  // item entry is created.
  const addToBasket = (product, quantity = 1) => {
    const qty = Math.max(1, Number(quantity) || 1);

    setCartItems((prevItems) => {
      const existing = prevItems.find((item) => item.slug === product.slug);

      if (existing) {
        return prevItems.map((item) =>
          item.slug === product.slug
            ? { ...item, quantity: item.quantity + qty }
            : item
        );
      }

      return [
        ...prevItems,
        {
          name: product.name,
          slug: product.slug,
          price: product.price,
          image: product.image,
          quantity: qty,
        },
      ];
    });
  };

  // Removes an item from the cart entirely, matched by its slug.
  const removeFromBasket = (slug) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.slug !== slug));
  };

  // Poora basket khali karo. Order successfully place hone ke baad checkout
  // ye chalata hai — warna items localStorage mein hamesha ke liye pare rehte.
  const clearBasket = () => setCartItems([]);

  const cartCount = computeCartCount(cartItems);
  const subtotal = computeSubtotal(cartItems);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        subtotal,
        addToBasket,
        removeFromBasket,
        clearBasket,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// Convenience hook for consuming the cart context in any component.
export const useCart = () => useContext(CartContext);

export default CartContext;