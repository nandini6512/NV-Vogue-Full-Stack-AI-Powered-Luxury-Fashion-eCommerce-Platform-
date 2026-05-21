import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);

  // Sync state with localstorage on load
  useEffect(() => {
    const storedCart = localStorage.getItem('nv_vogue_cart_items');
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  // Persist state to localstorage when modified
  const updateCartState = (newItems) => {
    setCartItems(newItems);
    localStorage.setItem('nv_vogue_cart_items', JSON.stringify(newItems));
  };

  // Add item to cart
  const addToCart = (product, qty, size, color) => {
    const existingIndex = cartItems.findIndex(
      (item) =>
        item.product === product._id &&
        item.size === size &&
        item.color === color
    );

    let newItems = [...cartItems];

    if (existingIndex > -1) {
      // Increment quantities safely
      newItems[existingIndex].qty += qty;
    } else {
      // Append new entry
      newItems.push({
        product: product._id,
        name: product.name,
        image: product.images[0],
        price: product.price,
        discount: product.discount || 0,
        countInStock: product.countInStock,
        size,
        color,
        qty,
      });
    }
    updateCartState(newItems);
  };

  // Remove item from cart
  const removeFromCart = (productId, size, color) => {
    const newItems = cartItems.filter(
      (item) =>
        !(item.product === productId && item.size === size && item.color === color)
    );
    updateCartState(newItems);
  };

  // Adjust item quantity
  const updateQty = (productId, size, color, qty) => {
    const newItems = cartItems.map((item) => {
      if (item.product === productId && item.size === size && item.color === color) {
        return { ...item, qty: Math.min(item.countInStock, Math.max(1, qty)) };
      }
      return item;
    });
    updateCartState(newItems);
  };

  // Clear entire cart
  const clearCart = () => {
    updateCartState([]);
    setPromoCode('');
    setDiscountPercent(0);
  };

  // Apply Coupon code
  const applyPromo = (code) => {
    const cleanCode = code.toUpperCase().trim();
    if (cleanCode === 'NVVOGUE10') {
      setPromoCode('NVVOGUE10');
      setDiscountPercent(10);
      return { success: true, message: '10% coupon applied!' };
    } else if (cleanCode === 'NVSURPRISE20') {
      setPromoCode('NVSURPRISE20');
      setDiscountPercent(20);
      return { success: true, message: '20% special discount applied!' };
    }
    return { success: false, message: 'Invalid promo code' };
  };

  // Financial Calculations
  const subtotal = cartItems.reduce((acc, item) => {
    const itemPrice = item.price * (1 - (item.discount || 0) / 100);
    return acc + itemPrice * item.qty;
  }, 0);

  const discountAmount = subtotal * (discountPercent / 100);
  const shippingPrice = subtotal > 150 || subtotal === 0 ? 0.0 : 15.0; // Free shipping over $150
  const taxPrice = (subtotal - discountAmount) * 0.08; // 8% sales tax
  const totalPrice = subtotal - discountAmount + shippingPrice + taxPrice;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        promoCode,
        discountPercent,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
        applyPromo,
        financials: {
          subtotal,
          discountAmount,
          shippingPrice,
          taxPrice,
          totalPrice,
        },
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
