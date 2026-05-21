import React, { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MapPin, CreditCard, ShoppingBag, ShieldCheck, CheckCircle, Plus } from 'lucide-react';
import { AuthContext } from '../context/AuthContext.jsx';
import { CartContext } from '../context/CartContext.jsx';
import API from '../utils/api.js';

const Checkout = () => {
  const navigate = useNavigate();
  const { user, addAddress } = useContext(AuthContext);
  const { cartItems, clearCart, financials } = useContext(CartContext);

  const [step, setStep] = useState(1); // Step 1: Address, Step 2: Payment, Step 3: Success
  
  // Selection states
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(
    user?.addresses?.findIndex((addr) => addr.isDefault) ?? 0
  );
  const [newAddressForm, setNewAddressForm] = useState(false);
  
  // Address form states
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('USA');

  // Credit Card Form states
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);

  const handleAddNewAddress = async (e) => {
    e.preventDefault();
    if (!street || !city || !state || !postalCode) return;
    
    const res = await addAddress({ street, city, state, postalCode, country, isDefault: false });
    if (res.success) {
      setNewAddressForm(false);
      setStreet('');
      setCity('');
      setState('');
      setPostalCode('');
      // Auto select the newly created address
      setSelectedAddressIndex(user.addresses.length);
    } else {
      alert('Failed to register new address');
    }
  };

  const handlePlaceOrder = async () => {
    if (selectedAddressIndex < 0 || !user.addresses[selectedAddressIndex]) {
      alert('Please select or register a valid delivery address!');
      return;
    }

    setPaymentLoading(true);

    try {
      const shippingAddress = user.addresses[selectedAddressIndex];
      const orderData = {
        orderItems: cartItems,
        shippingAddress: {
          street: shippingAddress.street,
          city: shippingAddress.city,
          state: shippingAddress.state,
          postalCode: shippingAddress.postalCode,
          country: shippingAddress.country,
        },
        paymentMethod: 'Card',
        itemsPrice: financials.subtotal - financials.discountAmount,
        shippingPrice: financials.shippingPrice,
        taxPrice: financials.taxPrice,
        totalPrice: financials.totalPrice,
      };

      const { data } = await API.post('/api/orders', orderData);
      setCreatedOrder(data);
      clearCart();
      setStep(3); // Route to success step
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to register order transaction');
    } finally {
      setPaymentLoading(false);
    }
  };

  if (!user) {
    return (
      <div class="flex min-h-screen flex-col items-center justify-center gap-4 text-center">
        <span class="text-3xl">🔒</span>
        <h2 class="text-lg font-bold text-gray-800 dark:text-white uppercase font-display">Protected Checkout</h2>
        <p class="text-xs text-gray-400">Please sign in to proceed with your transaction.</p>
        <Link to="/login" class="btn-gold text-xs">Sign In</Link>
      </div>
    );
  }

  if (cartItems.length === 0 && step !== 3) {
    return (
      <div class="flex min-h-screen flex-col items-center justify-center gap-4 text-center">
        <span class="text-3xl">🛒</span>
        <h2 class="text-lg font-bold text-gray-800 dark:text-white uppercase font-display">Checkout is Empty</h2>
        <Link to="/shop" class="btn-gold text-xs">Explore products</Link>
      </div>
    );
  }

  return (
    <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 min-h-screen">
      
      {/* 1. Header Stepper Progress bar */}
      <div class="mx-auto max-w-3xl mb-12 flex justify-between items-center relative">
        <div class="absolute h-0.5 bg-gray-200 dark:bg-gray-800 left-8 right-8 top-5 z-0" />
        <div class={`absolute h-0.5 bg-brand-gold left-8 top-5 z-0 transition-all duration-500`} style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }} />

        {/* Step 1 indicator */}
        <button
          onClick={() => step > 1 && step < 3 && setStep(1)}
          class={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 font-display text-xs font-bold transition-all ${
            step >= 1
              ? 'bg-brand-gold border-brand-gold text-brand-dark'
              : 'bg-white border-gray-200 text-gray-400 dark:bg-brand-dark dark:border-gray-800'
          }`}
        >
          1
        </button>

        {/* Step 2 indicator */}
        <button
          onClick={() => step > 2 && step < 3 && setStep(2)}
          class={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 font-display text-xs font-bold transition-all ${
            step >= 2
              ? 'bg-brand-gold border-brand-gold text-brand-dark'
              : 'bg-white border-gray-200 text-gray-400 dark:bg-brand-dark dark:border-gray-800'
          }`}
        >
          2
        </button>

        {/* Step 3 indicator */}
        <div
          class={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 font-display text-xs font-bold transition-all ${
            step === 3
              ? 'bg-brand-gold border-brand-gold text-brand-dark'
              : 'bg-white border-gray-200 text-gray-400 dark:bg-brand-dark dark:border-gray-800'
          }`}
        >
          3
        </div>
      </div>

      {/* 2. Stepper Contents Switcher */}
      {step === 1 && (
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Step 1: Address Manager selection */}
          <div class="lg:col-span-2 space-y-6">
            <h2 class="font-display text-xl font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <MapPin class="h-5 w-5 text-brand-gold" /> Select Shipping Address
            </h2>

            {user.addresses?.length === 0 && !newAddressForm && (
              <div class="text-center p-6 border-2 border-dashed rounded-xl dark:border-gray-800">
                <p class="text-xs text-gray-500 mb-3">No shipping addresses registered on profile.</p>
                <button onClick={() => setNewAddressForm(true)} class="btn-gold text-xs">Add new address</button>
              </div>
            )}

            {/* Address cards list */}
            {user.addresses?.length > 0 && (
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {user.addresses.map((addr, idx) => (
                  <div
                    key={addr._id}
                    onClick={() => setSelectedAddressIndex(idx)}
                    class={`p-4 rounded-xl border cursor-pointer transition-all ${
                      selectedAddressIndex === idx
                        ? 'border-brand-gold bg-brand-gold/10 scale-102 shadow-sm'
                        : 'border-gray-200 hover:border-brand-gold/50 bg-white dark:border-gray-800 dark:bg-brand-indigo/30'
                    }`}
                  >
                    <div class="flex items-center justify-between mb-2">
                      <span class="text-[10px] font-bold bg-brand-gold/20 text-brand-gold px-2 py-0.5 rounded-full">
                        ADDRESS #{idx + 1}
                      </span>
                      {addr.isDefault && (
                        <span class="text-[9px] font-bold text-gray-400 uppercase">Default</span>
                      )}
                    </div>
                    <p class="text-xs text-gray-700 dark:text-gray-300 leading-normal font-semibold">
                      {addr.street}
                    </p>
                    <p class="text-[11px] text-gray-500 dark:text-gray-400">
                      {addr.city}, {addr.state} - {addr.postalCode}
                    </p>
                    <p class="text-[10px] text-gray-400 font-bold uppercase mt-1">{addr.country}</p>
                  </div>
                ))}

                {/* Add inline address card */}
                {!newAddressForm && (
                  <button
                    onClick={() => setNewAddressForm(true)}
                    class="border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center p-6 text-gray-400 hover:text-brand-gold hover:border-brand-gold transition-colors dark:border-gray-800"
                  >
                    <Plus class="h-6 w-6 mb-2" />
                    <span class="text-xs font-semibold uppercase">Add New Address</span>
                  </button>
                )}
              </div>
            )}

            {/* Inline Address Creation Form */}
            {newAddressForm && (
              <form onSubmit={handleAddNewAddress} class="rounded-2xl border border-gray-200 bg-white/70 p-6 dark:border-gray-800 dark:bg-brand-indigo/40 space-y-4">
                <h3 class="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">New Shipping Registry</h3>
                
                <div class="space-y-1">
                  <label class="text-[10px] font-bold text-gray-400 uppercase">Street Address:</label>
                  <input
                    type="text"
                    placeholder="e.g. 42 Fashion Ave"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    required
                    class="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-xs dark:border-gray-800 dark:bg-brand-dark"
                  />
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div class="space-y-1">
                    <label class="text-[10px] font-bold text-gray-400 uppercase">City:</label>
                    <input
                      type="text"
                      placeholder="e.g. Los Angeles"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      required
                      class="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-xs dark:border-gray-800 dark:bg-brand-dark"
                    />
                  </div>
                  <div class="space-y-1">
                    <label class="text-[10px] font-bold text-gray-400 uppercase">State / Region:</label>
                    <input
                      type="text"
                      placeholder="e.g. CA"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      required
                      class="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-xs dark:border-gray-800 dark:bg-brand-dark"
                    />
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div class="space-y-1">
                    <label class="text-[10px] font-bold text-gray-400 uppercase">Postal Code:</label>
                    <input
                      type="text"
                      placeholder="e.g. 90001"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      required
                      class="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-xs dark:border-gray-800 dark:bg-brand-dark"
                    />
                  </div>
                  <div class="space-y-1">
                    <label class="text-[10px] font-bold text-gray-400 uppercase">Country:</label>
                    <input
                      type="text"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      required
                      class="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-xs dark:border-gray-800 dark:bg-brand-dark"
                    />
                  </div>
                </div>

                <div class="flex gap-3 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setNewAddressForm(false)}
                    class="text-xs text-gray-500 hover:text-red-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    class="btn-gold py-1.5 px-4 text-xs font-semibold uppercase"
                  >
                    Register Address
                  </button>
                </div>
              </form>
            )}

            {/* Stepper dispatch button */}
            {user.addresses?.length > 0 && (
              <button
                onClick={() => setStep(2)}
                disabled={selectedAddressIndex < 0 || !user.addresses[selectedAddressIndex]}
                class="btn-gold px-8 text-xs font-bold uppercase tracking-wider"
              >
                Proceed to Payment
              </button>
            )}

          </div>

          {/* Right Summary column */}
          <div class="rounded-2xl border border-gray-200/50 bg-white/75 p-6 dark:border-gray-800/40 dark:bg-brand-indigo/60 shadow-sm h-fit space-y-4">
            <h3 class="font-display text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <ShoppingBag class="h-4.5 w-4.5 text-brand-gold" /> Order Items ({cartItems.length})
            </h3>
            <div class="space-y-2 max-h-[220px] overflow-y-auto pr-1">
              {cartItems.map((item, idx) => (
                <div key={idx} class="flex items-center gap-2 justify-between text-xs py-1 border-b border-gray-50 dark:border-gray-800/60">
                  <span class="font-semibold line-clamp-1">{item.name} (x{item.qty})</span>
                  <span class="font-display font-bold text-gray-500">${item.price * item.qty}</span>
                </div>
              ))}
            </div>
            
            <hr class="border-gray-100 dark:border-gray-800" />
            <div class="flex justify-between text-xs font-black text-gray-900 dark:text-white uppercase">
              <span>Total Invoice:</span>
              <span class="text-brand-gold font-display">${financials.totalPrice.toFixed(0)}</span>
            </div>
          </div>

        </div>
      )}

      {step === 2 && (
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
          
          {/* Step 2: Animated Mock Credit Card panel */}
          <div class="lg:col-span-2 space-y-6">
            <h2 class="font-display text-xl font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <CreditCard class="h-5 w-5 text-brand-gold" /> Credit Card Details
            </h2>

            {/* Styled Gold Monogram Mock Credit Card */}
            <div class="relative mx-auto max-w-[340px] aspect-[1.58/1] rounded-2xl p-6 text-white bg-gradient-to-tr from-brand-indigo via-brand-dark to-brand-gold shadow-2xl overflow-hidden flex flex-col justify-between">
              <div class="absolute h-40 w-40 rounded-full bg-white/5 -right-10 -top-10" />
              
              <div class="flex justify-between items-start">
                <span class="font-display text-base font-extrabold tracking-wider bg-gradient-to-r from-brand-gold to-brand-goldlight bg-clip-text text-transparent">NV VOGUE</span>
                <span class="text-[10px] font-bold tracking-widest text-brand-goldlight">PLATINUM</span>
              </div>

              {/* Card Chip Symbol */}
              <div class="h-7 w-9 rounded-md bg-white/10 border border-white/20" />

              {/* Number display */}
              <div class="font-display text-lg font-bold tracking-widest text-center mt-2">
                {cardNumber || '•••• •••• •••• ••••'}
              </div>

              <div class="flex justify-between text-[9px] font-bold text-gray-300 uppercase tracking-widest">
                <div>
                  <span class="block text-[7px] text-gray-400">Card Holder</span>
                  <span>{cardHolder || 'CARD HOLDER'}</span>
                </div>
                <div class="text-right">
                  <span class="block text-[7px] text-gray-400">Expires</span>
                  <span>{cardExpiry || 'MM/YY'}</span>
                </div>
              </div>
            </div>

            {/* Credit Card inputs */}
            <div class="rounded-2xl border border-gray-200 bg-white/70 p-6 dark:border-gray-800 dark:bg-brand-indigo/40 space-y-4 max-w-md mx-auto">
              
              <div class="space-y-1">
                <label class="text-[10px] font-bold text-gray-400 uppercase">Card Number:</label>
                <input
                  type="text"
                  placeholder="e.g. 4000 1234 5678 9010"
                  maxLength="19"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  required
                  class="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-xs dark:border-gray-800 dark:bg-brand-dark"
                />
              </div>

              <div class="space-y-1">
                <label class="text-[10px] font-bold text-gray-400 uppercase">Card Holder Name:</label>
                <input
                  type="text"
                  placeholder="e.g. ALEX MORGAN"
                  value={cardHolder}
                  onChange={(e) => setCardHolder(e.target.value)}
                  required
                  class="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-xs dark:border-gray-800 dark:bg-brand-dark uppercase"
                />
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-1">
                  <label class="text-[10px] font-bold text-gray-400 uppercase">Expiration Date:</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    maxLength="5"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    required
                    class="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-xs dark:border-gray-800 dark:bg-brand-dark"
                  />
                </div>
                <div class="space-y-1">
                  <label class="text-[10px] font-bold text-gray-400 uppercase">Security CVV:</label>
                  <input
                    type="password"
                    placeholder="•••"
                    maxLength="4"
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                    required
                    class="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-xs dark:border-gray-800 dark:bg-brand-dark"
                  />
                </div>
              </div>
            </div>

            {/* Stepper navigation row */}
            <div class="flex gap-4 justify-between pt-4 max-w-md mx-auto">
              <button
                type="button"
                onClick={() => setStep(1)}
                class="text-xs text-gray-500 hover:text-brand-gold uppercase tracking-wider font-bold"
              >
                Back to Address
              </button>
              
              <button
                onClick={handlePlaceOrder}
                disabled={paymentLoading || !cardNumber || !cardHolder || !cardExpiry || !cardCvv}
                class="btn-gold px-8 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
              >
                {paymentLoading ? (
                  <>
                    <span class="h-3 w-3 animate-spin rounded-full border-2 border-brand-dark border-t-transparent"></span>
                    Authorizing...
                  </>
                ) : (
                  <>
                    <ShieldCheck class="h-4.5 w-4.5" /> Place Order (${financials.totalPrice.toFixed(0)})
                  </>
                )}
              </button>
            </div>

          </div>

          {/* Delivery destination card */}
          <div class="rounded-2xl border border-gray-200/50 bg-white/75 p-6 dark:border-gray-800/40 dark:bg-brand-indigo/60 shadow-sm h-fit space-y-3">
            <h3 class="font-display text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider border-b pb-2 dark:border-gray-800">
              Delivery Address
            </h3>
            {user.addresses[selectedAddressIndex] && (
              <div class="text-xs text-gray-500 leading-normal">
                <span class="font-bold text-gray-800 dark:text-gray-300 block">{user.name}</span>
                <p>{user.addresses[selectedAddressIndex].street}</p>
                <p>{user.addresses[selectedAddressIndex].city}, {user.addresses[selectedAddressIndex].state} - {user.addresses[selectedAddressIndex].postalCode}</p>
                <p class="font-bold uppercase mt-1">{user.addresses[selectedAddressIndex].country}</p>
              </div>
            )}
          </div>

        </div>
      )}

      {step === 3 && createdOrder && (
        <div class="max-w-xl mx-auto text-center space-y-6 py-12 animate-fade-in">
          <div class="inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10 text-green-500 border border-green-500/20 mb-2">
            <CheckCircle class="h-10 w-10" />
          </div>
          
          <h2 class="font-display text-3xl font-extrabold text-gray-900 dark:text-white uppercase tracking-tight">
            Order Successfully Placed!
          </h2>
          
          <p class="text-xs text-gray-400 max-w-sm mx-auto leading-relaxed">
            Your billing payment of <strong>${createdOrder.totalPrice.toFixed(0)}</strong> has been successfully authorized. Your order has been dispatched for delivery processing.
          </p>

          <div class="rounded-2xl border border-gray-100 bg-white p-6 dark:border-gray-800 dark:bg-brand-indigo/40 text-left text-xs space-y-3 shadow-md max-w-md mx-auto">
            <div class="flex justify-between border-b pb-2 dark:border-gray-800">
              <span class="text-gray-400 font-bold uppercase">Order Reference:</span>
              <span class="font-mono font-bold text-brand-gold">{createdOrder._id}</span>
            </div>
            
            <div class="flex justify-between">
              <span class="text-gray-400 font-bold uppercase">Destination Address:</span>
              <span class="font-semibold text-right">
                {createdOrder.shippingAddress.street}, {createdOrder.shippingAddress.city}
              </span>
            </div>

            <div class="flex justify-between">
              <span class="text-gray-400 font-bold uppercase">Transaction Status:</span>
              <span class="inline-flex items-center gap-1 text-green-500 font-bold uppercase tracking-wider text-[10px]">
                Paid & Processing
              </span>
            </div>
          </div>

          <div class="pt-6 flex justify-center gap-4">
            <Link to="/orders" class="btn-gold text-xs uppercase font-semibold">View Order History</Link>
            <Link to="/shop" class="btn-outline-gold text-xs uppercase font-semibold border-gray-300 dark:border-gray-850">Continue Shopping</Link>
          </div>
        </div>
      )}

    </div>
  );
};

export default Checkout;
