import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Clock, CheckCircle, Truck, ShoppingBag, ChevronDown, ChevronUp } from 'lucide-react';
import { AuthContext } from '../context/AuthContext.jsx';
import API from '../utils/api.js';

const Orders = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await API.get('/api/orders/myorders');
        setOrders(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user]);

  const toggleExpand = (id) => {
    setExpandedOrderId(expandedOrderId === id ? null : id);
  };

  if (loading) {
    return (
      <div class="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-brand-dark">
        <div class="h-10 w-10 animate-spin rounded-full border-4 border-brand-gold border-t-transparent"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div class="flex min-h-screen flex-col items-center justify-center gap-4 text-center">
        <span class="text-3xl">🔒</span>
        <h2 class="text-lg font-bold text-gray-800 dark:text-white uppercase font-display">Protected Access</h2>
        <p class="text-xs text-gray-400">Please sign in to track order timelines.</p>
        <Link to="/login" class="btn-gold text-xs">Sign In</Link>
      </div>
    );
  }

  return (
    <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 min-h-screen">
      
      <h1 class="font-display text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white uppercase tracking-tight mb-8">
        Your Order History
      </h1>

      {orders.length === 0 ? (
        <div class="flex flex-col items-center justify-center py-20 text-center space-y-4">
          <span class="text-4xl">📦</span>
          <h2 class="font-display text-lg font-bold text-gray-800 dark:text-white uppercase">No Orders Registered</h2>
          <p class="text-xs text-gray-400 max-w-xs">
            You haven't checked out any couture garments yet. Visit the shop and complete mock transactions!
          </p>
          <Link to="/shop" class="btn-gold text-xs">Shop catalog</Link>
        </div>
      ) : (
        <div class="max-w-4xl mx-auto space-y-6">
          {orders.map((order) => {
            const isExpanded = expandedOrderId === order._id;
            
            // Build progressive timelines details
            const steps = [
              { name: 'Processing', active: true, icon: Clock, color: 'text-brand-gold' },
              { name: 'Shipped', active: order.status === 'Shipped' || order.status === 'Delivered', icon: Truck, color: 'text-blue-500' },
              { name: 'Delivered', active: order.isDelivered, icon: CheckCircle, color: 'text-green-500' }
            ];

            return (
              <div
                key={order._id}
                class="rounded-2xl border border-gray-200/50 bg-white/75 overflow-hidden dark:border-gray-800/40 dark:bg-brand-indigo/60 shadow-sm"
              >
                {/* Header overview row */}
                <div
                  onClick={() => toggleExpand(order._id)}
                  class="p-5 flex flex-col sm:flex-row items-center justify-between gap-4 cursor-pointer hover:bg-gray-50/50 dark:hover:bg-brand-indigo/30 transition-colors"
                >
                  <div class="flex items-center gap-3">
                    <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-gold/10 text-brand-gold">
                      <Package class="h-5 w-5" />
                    </div>
                    <div>
                      <span class="text-[9px] text-gray-400 font-bold block">ORDER REFERENCE:</span>
                      <span class="font-mono text-xs font-bold text-gray-700 dark:text-gray-300">{order._id}</span>
                    </div>
                  </div>

                  <div class="flex gap-6 items-center flex-wrap justify-center text-xs">
                    <div>
                      <span class="text-[9px] text-gray-400 font-bold block text-center">ORDERED ON:</span>
                      <strong class="text-gray-800 dark:text-gray-200">{new Date(order.createdAt).toLocaleDateString()}</strong>
                    </div>
                    <div>
                      <span class="text-[9px] text-gray-400 font-bold block text-center">TOTAL CHARGED:</span>
                      <strong class="text-brand-gold font-display">${order.totalPrice.toFixed(0)}</strong>
                    </div>
                    <div>
                      <span class="text-[9px] text-gray-400 font-bold block text-center">SHIPPING TO:</span>
                      <strong class="text-gray-800 dark:text-gray-200">{order.shippingAddress.city}</strong>
                    </div>
                  </div>

                  <button class="text-gray-400">
                    {isExpanded ? <ChevronUp class="h-5 w-5" /> : <ChevronDown class="h-5 w-5" />}
                  </button>
                </div>

                {/* Progressive timeline bar */}
                <div class="px-5 py-4 bg-gray-50/50 dark:bg-brand-dark/20 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
                  <span class="text-[10px] font-bold text-gray-400 uppercase">TIMELINE STATUS:</span>
                  <div class="flex gap-4 sm:gap-8 items-center text-xs font-bold">
                    {steps.map((st, i) => {
                      const Icon = st.icon;
                      return (
                        <div key={i} class={`flex items-center gap-1.5 ${st.active ? st.color : 'text-gray-300 dark:text-gray-700'}`}>
                          <Icon class="h-4 w-4" />
                          <span class="hidden sm:inline uppercase text-[10px]">{st.name}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Expanded Details line items */}
                {isExpanded && (
                  <div class="p-5 border-t border-gray-100 dark:border-gray-800 space-y-4 animate-fade-in">
                    <h4 class="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">Line Items:</h4>
                    
                    <div class="space-y-3">
                      {order.orderItems.map((item, i) => (
                        <div
                          key={i}
                          class="flex items-center gap-3 justify-between py-2 border-b border-gray-50 dark:border-gray-800 last:border-b-0"
                        >
                          <div class="flex items-center gap-3">
                            <img
                              src={item.image}
                              alt={item.name}
                              class="h-12 w-10 object-cover rounded-lg bg-gray-50 flex-shrink-0"
                            />
                            <div>
                              <h5 class="text-xs font-bold text-gray-800 dark:text-gray-200 line-clamp-1">{item.name}</h5>
                              <span class="text-[9px] text-gray-400 font-bold uppercase tracking-wider">
                                size: {item.size} | color: {item.color} | Qty: {item.qty}
                              </span>
                            </div>
                          </div>

                          <span class="font-display text-xs font-bold text-gray-700 dark:text-gray-300">
                            ${item.price * item.qty}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div class="pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-between items-start text-xs">
                      <div>
                        <span class="text-[9px] text-gray-400 font-bold uppercase block">Delivery Address:</span>
                        <p class="font-semibold text-gray-700 dark:text-gray-300">
                          {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.postalCode}
                        </p>
                      </div>
                      
                      <div class="text-right space-y-1">
                        <span class="text-[9px] text-gray-400 font-bold uppercase block">Financial details:</span>
                        <p class="text-gray-500">Items Subtotal: <strong>${order.itemsPrice.toFixed(0)}</strong></p>
                        <p class="text-gray-500">Shipping Standard: <strong>${order.shippingPrice === 0 ? 'FREE' : `$${order.shippingPrice}`}</strong></p>
                        <p class="text-gray-500">Taxes Estimated: <strong>${order.taxPrice.toFixed(0)}</strong></p>
                        <p class="text-brand-gold font-display font-black text-sm">TOTAL CHARGED: ${order.totalPrice.toFixed(0)}</p>
                      </div>
                    </div>

                  </div>
                )}

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};

export default Orders;
