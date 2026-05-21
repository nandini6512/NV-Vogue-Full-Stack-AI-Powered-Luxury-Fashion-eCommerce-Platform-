import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, Plus, Minus, ArrowRight, Ticket } from 'lucide-react';
import { CartContext } from '../context/CartContext.jsx';

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, updateQty, removeFromCart, promoCode, discountPercent, applyPromo, financials } = useContext(CartContext);
  
  const [coupon, setCoupon] = useState('');
  const [couponMsg, setCouponMsg] = useState('');
  const [couponSuccess, setCouponSuccess] = useState(false);

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (!coupon.trim()) return;
    
    const res = applyPromo(coupon);
    setCouponMsg(res.message);
    setCouponSuccess(res.success);
    if (res.success) {
      setCoupon('');
    }
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  return (
    <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 min-h-screen">
      
      <h1 class="font-display text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white uppercase tracking-tight mb-8">
        Your Shopping Bag
      </h1>

      {cartItems.length === 0 ? (
        <div class="flex flex-col items-center justify-center py-20 text-center space-y-4">
          <span class="text-4xl">🛍️</span>
          <h2 class="font-display text-lg font-bold text-gray-800 dark:text-white uppercase">Your cart is currently empty</h2>
          <p class="text-xs text-gray-400 max-w-xs">
            Indulge in premium couture fabrics. Explore NV Vogue departments and add styling elements to your checkout!
          </p>
          <Link to="/shop" class="btn-gold text-xs">Explore Shop</Link>
        </div>
      ) : (
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* A. Left Column: Cart Items Grid */}
          <div class="lg:col-span-2 space-y-4">
            {cartItems.map((item) => {
              const discountedPrice = item.price * (1 - (item.discount || 0) / 100);
              
              return (
                <div
                  key={`${item.product}-${item.size}-${item.color}`}
                  class="rounded-2xl border border-gray-200/50 bg-white/75 p-4 dark:border-gray-800/40 dark:bg-brand-indigo/60 shadow-sm flex flex-col sm:flex-row items-center gap-4"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    class="h-20 w-16 object-cover rounded-xl bg-gray-100 flex-shrink-0"
                  />
                  
                  {/* Item Description */}
                  <div class="flex-grow text-center sm:text-left space-y-1">
                    <h3 class="font-display text-sm font-bold text-gray-800 dark:text-white leading-tight">
                      {item.name}
                    </h3>
                    <div class="flex flex-wrap justify-center sm:justify-start gap-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      <span>Size: <strong class="text-brand-gold">{item.size}</strong></span>
                      <span>Color: <strong class="text-brand-gold">{item.color}</strong></span>
                    </div>
                  </div>

                  {/* Quantity Spinner */}
                  <div class="flex items-center border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-brand-dark/20 h-9">
                    <button
                      onClick={() => updateQty(item.product, item.size, item.color, item.qty - 1)}
                      class="px-2.5 text-gray-500 hover:bg-gray-50"
                    >
                      <Minus class="h-3 w-3" />
                    </button>
                    <span class="px-3 font-display font-bold text-xs text-gray-800 dark:text-white">
                      {item.qty}
                    </span>
                    <button
                      onClick={() => updateQty(item.product, item.size, item.color, item.qty + 1)}
                      class="px-2.5 text-gray-500 hover:bg-gray-50"
                    >
                      <Plus class="h-3 w-3" />
                    </button>
                  </div>

                  {/* Pricing Info */}
                  <div class="text-center sm:text-right flex-shrink-0">
                    <span class="font-display text-sm font-bold text-gray-800 dark:text-white block">
                      ${(discountedPrice * item.qty).toFixed(0)}
                    </span>
                    {item.discount > 0 && (
                      <span class="text-[9px] font-bold text-brand-rose block uppercase tracking-wider">
                        ({item.discount}% Off Applied)
                      </span>
                    )}
                  </div>

                  {/* Delete Item */}
                  <button
                    onClick={() => removeFromCart(item.product, item.size, item.color)}
                    class="rounded-full p-2 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                    aria-label="Remove Item"
                  >
                    <Trash2 class="h-4.5 w-4.5" />
                  </button>

                </div>
              );
            })}
          </div>

          {/* B. Right Column: Promo Code & Financial Summary */}
          <div class="space-y-6">
            
            {/* Promo Code Form */}
            <div class="rounded-2xl border border-gray-200/50 bg-white/75 p-6 dark:border-gray-800/40 dark:bg-brand-indigo/60 shadow-sm">
              <h3 class="font-display text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Ticket class="h-4 w-4 text-brand-gold" /> Have a Promo Code?
              </h3>
              
              <form onSubmit={handleApplyPromo} class="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. NVVOGUE10"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  class="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-xs focus:border-brand-gold focus:outline-none dark:border-gray-800 dark:bg-brand-dark uppercase"
                />
                <button
                  type="submit"
                  class="btn-gold px-4 py-2 text-xs uppercase"
                >
                  Apply
                </button>
              </form>

              {couponMsg && (
                <span class={`text-[10px] font-bold block mt-2 uppercase ${couponSuccess ? 'text-green-500' : 'text-brand-rose'}`}>
                  {couponMsg}
                </span>
              )}

              {promoCode && (
                <div class="mt-3.5 bg-green-500/10 border border-green-500/20 rounded-xl p-2 text-center text-xs font-bold text-green-500 uppercase tracking-wide">
                  Active Promo: {promoCode} ({discountPercent}% Discount)
                </div>
              )}
            </div>

            {/* Financial Summary */}
            <div class="rounded-2xl border border-gray-200/50 bg-white/75 p-6 dark:border-gray-800/40 dark:bg-brand-indigo/60 shadow-sm space-y-4">
              <h3 class="font-display text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider border-b pb-2 dark:border-gray-800">
                Order Summary
              </h3>

              <div class="space-y-2 text-xs">
                <div class="flex justify-between">
                  <span class="text-gray-500 dark:text-gray-400">Bag Subtotal:</span>
                  <span class="font-semibold">${financials.subtotal.toFixed(0)}</span>
                </div>

                {financials.discountAmount > 0 && (
                  <div class="flex justify-between text-brand-rose font-semibold">
                    <span>Discount Applied ({discountPercent}%):</span>
                    <span>-${financials.discountAmount.toFixed(0)}</span>
                  </div>
                )}

                <div class="flex justify-between">
                  <span class="text-gray-500 dark:text-gray-400">Shipping (Free over $150):</span>
                  <span class="font-semibold">
                    {financials.shippingPrice === 0 ? 'FREE' : `$${financials.shippingPrice}`}
                  </span>
                </div>

                <div class="flex justify-between">
                  <span class="text-gray-500 dark:text-gray-400">Estimated Sales Tax (8%):</span>
                  <span class="font-semibold">${financials.taxPrice.toFixed(0)}</span>
                </div>

                <hr class="border-gray-100 dark:border-gray-800 my-2" />

                <div class="flex justify-between text-sm font-black text-gray-900 dark:text-white uppercase">
                  <span>Checkout Total:</span>
                  <span class="text-brand-gold font-display">${financials.totalPrice.toFixed(0)}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                class="w-full btn-gold h-11 flex items-center justify-center gap-2 text-xs sm:text-sm uppercase tracking-widest mt-2"
              >
                Proceed to checkout
                <ArrowRight class="h-4 w-4" />
              </button>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default Cart;
