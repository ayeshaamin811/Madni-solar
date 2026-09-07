import React, { useState, useContext, createContext } from "react";

// Global shopping cart context.
// Holds an array of cart items shaped like:
//   { name, slug, price, image, quantity }
// and exposes helpers to add/remove items plus derived counts/subtotals.
const CartContext = createContext();

// Helper to compute the total number of items across the cart.
const computeCartCount = (items) =>
  items.reduce((total, item) => total + item.quantity, 0);

// Helper to compute the combined price (Rs) of every item in the cart.
const computeSubtotal = (items) =>
  items.reduce((total, item) => total + item.price * item.quantity, 0);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

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
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// Convenience hook for consuming the cart context in any component.
export const useCart = () => useContext(CartContext);

export default CartContext;