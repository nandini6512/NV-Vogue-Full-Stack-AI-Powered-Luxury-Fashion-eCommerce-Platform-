import React, { useState, useEffect } from 'react';
import { LayoutDashboard, ShoppingBag, ClipboardList, DollarSign, Plus, Edit, Trash2, Check, RefreshCw } from 'lucide-react';
import API from '../utils/api.js';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('products'); // 'products' or 'orders'
  
  // Platform Stats
  const [stats, setStats] = useState({ revenue: 0, ordersCount: 0, productsCount: 0 });
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states to add new products
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Women');
  const [countInStock, setCountInStock] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600');
  const [colors, setColors] = useState('Black, White, Blue');
  const [sizes, setSizes] = useState('S, M, L');

  // Fetch product list, orders list, and compile stats
  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const prodRes = await API.get('/api/products');
      const orderRes = await API.get('/api/orders');

      setProducts(prodRes.data);
      setOrders(orderRes.data);

      // Calculations for revenue summaries
      const totalRev = orderRes.data.reduce((acc, order) => acc + order.totalPrice, 0);
      setStats({
        revenue: totalRev,
        ordersCount: orderRes.data.length,
        productsCount: prodRes.data.length,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!name || !price || !countInStock || !description) return;

    try {
      const parsedColors = colors.split(',').map((c) => c.trim());
      const parsedSizes = sizes.split(',').map((s) => s.trim());

      await API.post('/api/products', {
        name,
        price: Number(price),
        category,
        countInStock: Number(countInStock),
        description,
        images: [imageUrl],
        colors: parsedColors,
        sizes: parsedSizes,
      });

      alert('New fashion piece successfully added!');
      setShowAddForm(false);
      
      // Reset fields
      setName('');
      setPrice('');
      setCountInStock('');
      setDescription('');
      
      fetchDashboardData();
    } catch (err) {
      alert('Failed to register product');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Wipe this product from catalog?')) {
      try {
        await API.delete(`/api/products/${id}`);
        alert('Product removed');
        fetchDashboardData();
      } catch (err) {
        alert('Delete action failed');
      }
    }
  };

  const handleUpdateOrderStatus = async (orderId, nextStatus) => {
    try {
      await API.put(`/api/orders/${orderId}/status`, { status: nextStatus });
      alert(`Order status updated to ${nextStatus}!`);
      fetchDashboardData();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  if (loading) {
    return (
      <div class="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-brand-dark">
        <div class="h-10 w-10 animate-spin rounded-full border-4 border-brand-gold border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 min-h-screen space-y-8">
      
      {/* Title */}
      <div class="flex items-center justify-between border-b pb-4 dark:border-gray-800">
        <div>
          <h1 class="font-display text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white uppercase tracking-tight">
            Admin Management Dashboard
          </h1>
          <p class="text-xs text-gray-400">Track platform revenue, inventory items, and order dispatches.</p>
        </div>
        <button
          onClick={fetchDashboardData}
          class="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-brand-gold dark:text-gray-400 dark:hover:bg-brand-indigo/40"
          title="Refresh Data"
        >
          <RefreshCw class="h-4.5 w-4.5" />
        </button>
      </div>

      {/* 1. Dashboard Stats grid */}
      <div class="grid grid-cols-1 gap-5 sm:grid-cols-3">
        
        {/* Revenue Card */}
        <div class="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm flex items-center justify-between dark:border-gray-800 dark:bg-brand-indigo/30">
          <div>
            <span class="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Total Platform Revenue</span>
            <span class="font-display text-2xl font-black text-brand-gold">${stats.revenue.toFixed(0)}</span>
          </div>
          <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-gold/10 text-brand-gold">
            <DollarSign class="h-6 w-6" />
          </div>
        </div>

        {/* Orders Card */}
        <div class="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm flex items-center justify-between dark:border-gray-800 dark:bg-brand-indigo/30">
          <div>
            <span class="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Orders Placed</span>
            <span class="font-display text-2xl font-black text-gray-800 dark:text-white">{stats.ordersCount}</span>
          </div>
          <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
            <ClipboardList class="h-6 w-6" />
          </div>
        </div>

        {/* Products Card */}
        <div class="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm flex items-center justify-between dark:border-gray-800 dark:bg-brand-indigo/30">
          <div>
            <span class="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Catalog Listings</span>
            <span class="font-display text-2xl font-black text-gray-800 dark:text-white">{stats.productsCount}</span>
          </div>
          <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/10 text-green-500">
            <ShoppingBag class="h-6 w-6" />
          </div>
        </div>

      </div>

      {/* 2. Navigation Tabs bar */}
      <div class="flex gap-4 border-b border-gray-200/50 pb-2 dark:border-gray-800/40">
        <button
          onClick={() => setActiveTab('products')}
          class={`font-display text-xs font-bold uppercase tracking-wider pb-2 border-b-2 transition-all ${
            activeTab === 'products'
              ? 'border-brand-gold text-brand-gold'
              : 'border-transparent text-gray-400 hover:text-gray-900'
          }`}
        >
          Manage Catalog
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          class={`font-display text-xs font-bold uppercase tracking-wider pb-2 border-b-2 transition-all ${
            activeTab === 'orders'
              ? 'border-brand-gold text-brand-gold'
              : 'border-transparent text-gray-400 hover:text-gray-900'
          }`}
        >
          Fulfillment Orders ({orders.length})
        </button>
      </div>

      {/* 3. Panel Content switcher */}
      {activeTab === 'products' && (
        <div class="space-y-6">
          <div class="flex justify-between items-center">
            <h3 class="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">Catalog Listings</h3>
            
            {!showAddForm && (
              <button
                onClick={() => setShowAddForm(true)}
                class="flex items-center gap-1 btn-gold py-1.5 px-4 text-[10px] uppercase font-bold"
              >
                <Plus class="h-3.5 w-3.5" /> Add Product
              </button>
            )}
          </div>

          {/* Add product form */}
          {showAddForm && (
            <form onSubmit={handleAddProduct} class="rounded-2xl border border-gray-200 bg-white/70 p-6 dark:border-gray-800 dark:bg-brand-indigo/40 space-y-4 max-w-2xl">
              <h4 class="text-xs font-bold uppercase text-gray-900 dark:text-white">Publish New Design Item</h4>
              
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="space-y-1">
                  <label class="text-[10px] font-bold text-gray-400 uppercase">Item Name:</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    class="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-xs dark:border-gray-800 dark:bg-brand-dark"
                  />
                </div>
                
                <div class="space-y-1">
                  <label class="text-[10px] font-bold text-gray-400 uppercase">Retail Price ($):</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                    class="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-xs dark:border-gray-800 dark:bg-brand-dark"
                  />
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="space-y-1">
                  <label class="text-[10px] font-bold text-gray-400 uppercase">Category Department:</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    class="w-full rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-xs dark:border-gray-800 dark:bg-brand-dark"
                  >
                    <option value="Women">Women</option>
                    <option value="Men">Men</option>
                    <option value="Kids">Kids</option>
                    <option value="Jeans">Jeans</option>
                    <option value="Tops">Tops</option>
                    <option value="Beauty">Beauty</option>
                    <option value="Shoes">Shoes</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>

                <div class="space-y-1">
                  <label class="text-[10px] font-bold text-gray-400 uppercase">Active Inventory Stock:</label>
                  <input
                    type="number"
                    value={countInStock}
                    onChange={(e) => setCountInStock(e.target.value)}
                    required
                    class="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-xs dark:border-gray-800 dark:bg-brand-dark"
                  />
                </div>
              </div>

              <div class="space-y-1">
                <label class="text-[10px] font-bold text-gray-400 uppercase">Image URL:</label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  required
                  class="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-xs dark:border-gray-800 dark:bg-brand-dark"
                />
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-1">
                  <label class="text-[10px] font-bold text-gray-400 uppercase">Sizes (comma-separated):</label>
                  <input
                    type="text"
                    value={sizes}
                    onChange={(e) => setSizes(e.target.value)}
                    class="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-xs dark:border-gray-800 dark:bg-brand-dark"
                  />
                </div>
                <div class="space-y-1">
                  <label class="text-[10px] font-bold text-gray-400 uppercase">Colors (comma-separated):</label>
                  <input
                    type="text"
                    value={colors}
                    onChange={(e) => setColors(e.target.value)}
                    class="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-xs dark:border-gray-800 dark:bg-brand-dark"
                  />
                </div>
              </div>

              <div class="space-y-1">
                <label class="text-[10px] font-bold text-gray-400 uppercase">Item Description:</label>
                <textarea
                  rows="3"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  class="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-xs dark:border-gray-800 dark:bg-brand-dark"
                />
              </div>

              <div class="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  class="text-xs text-gray-500 hover:text-red-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  class="btn-gold py-1.5 px-4 text-xs font-semibold uppercase"
                >
                  Publish Item
                </button>
              </div>
            </form>
          )}

          {/* Product grid table */}
          <div class="overflow-x-auto rounded-2xl border border-gray-200 dark:border-gray-800">
            <table class="w-full border-collapse text-left text-xs bg-white dark:bg-brand-indigo/20">
              <thead class="bg-gray-50 dark:bg-brand-dark text-gray-500 uppercase font-bold tracking-wider text-[10px]">
                <tr>
                  <th class="p-4">Item Name</th>
                  <th class="p-4">Category</th>
                  <th class="p-4">Price</th>
                  <th class="p-4">Inventory</th>
                  <th class="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100 dark:divide-gray-800 text-gray-600 dark:text-gray-300">
                {products.map((prod) => (
                  <tr key={prod._id} class="hover:bg-gray-50/50 dark:hover:bg-brand-indigo/35 transition-colors">
                    <td class="p-4 flex items-center gap-3">
                      <img src={prod.images[0]} alt="prod" class="h-10 w-8 object-cover rounded" />
                      <span class="font-bold line-clamp-1">{prod.name}</span>
                    </td>
                    <td class="p-4 font-semibold">{prod.category}</td>
                    <td class="p-4 font-bold font-display text-gray-800 dark:text-white">${prod.price}</td>
                    <td class="p-4 font-semibold">
                      <span class={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                        prod.countInStock > 0 ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                      }`}>
                        {prod.countInStock} IN STOCK
                      </span>
                    </td>
                    <td class="p-4 text-center">
                      <button
                        onClick={() => handleDeleteProduct(prod._id)}
                        class="rounded p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                        title="Delete Product"
                      >
                        <Trash2 class="h-4.5 w-4.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <div class="space-y-6">
          <h3 class="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">Fulfillment Timeline Orders</h3>
          
          <div class="overflow-x-auto rounded-2xl border border-gray-200 dark:border-gray-800">
            <table class="w-full border-collapse text-left text-xs bg-white dark:bg-brand-indigo/20">
              <thead class="bg-gray-50 dark:bg-brand-dark text-gray-500 uppercase font-bold tracking-wider text-[10px]">
                <tr>
                  <th class="p-4">Reference ID</th>
                  <th class="p-4">Customer</th>
                  <th class="p-4">Destination</th>
                  <th class="p-4">Charged</th>
                  <th class="p-4">Status</th>
                  <th class="p-4 text-center">Fulfill Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100 dark:divide-gray-800 text-gray-600 dark:text-gray-300 font-semibold">
                {orders.map((order) => (
                  <tr key={order._id} class="hover:bg-gray-50/50 dark:hover:bg-brand-indigo/35 transition-colors">
                    <td class="p-4 font-mono font-bold text-brand-gold">{order._id.slice(0, 10)}...</td>
                    <td class="p-4 font-bold text-gray-700 dark:text-gray-200">{order.user?.name || 'Guest User'}</td>
                    <td class="p-4 text-gray-500">{order.shippingAddress.city}, {order.shippingAddress.state}</td>
                    <td class="p-4 font-bold font-display text-gray-800 dark:text-white">${order.totalPrice.toFixed(0)}</td>
                    <td class="p-4">
                      <span class={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                        order.status === 'Delivered'
                          ? 'bg-green-500/10 text-green-500'
                          : order.status === 'Shipped'
                          ? 'bg-blue-500/10 text-blue-500'
                          : 'bg-brand-gold/15 text-brand-gold'
                      }`}>
                        {order.status.toUpperCase()}
                      </span>
                    </td>
                    <td class="p-4 text-center">
                      {order.status !== 'Delivered' ? (
                        <div class="flex justify-center gap-1.5">
                          {order.status === 'Processing' && (
                            <button
                              onClick={() => handleUpdateOrderStatus(order._id, 'Shipped')}
                              class="bg-blue-500 text-white text-[9px] font-bold uppercase px-2 py-1 rounded hover:brightness-105"
                            >
                              Ship Order
                            </button>
                          )}
                          {order.status === 'Shipped' && (
                            <button
                              onClick={() => handleUpdateOrderStatus(order._id, 'Delivered')}
                              class="bg-green-500 text-white text-[9px] font-bold uppercase px-2 py-1 rounded hover:brightness-105"
                            >
                              Deliver Order
                            </button>
                          )}
                        </div>
                      ) : (
                        <span class="text-[9px] font-bold text-gray-400 uppercase flex items-center justify-center gap-1">
                          <Check class="h-3 w-3 text-green-500" /> Completed
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
