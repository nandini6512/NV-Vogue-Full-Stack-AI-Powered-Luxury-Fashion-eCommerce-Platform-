import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2, ShoppingCart } from 'lucide-react';
import { AuthContext } from '../context/AuthContext.jsx';
import { CartContext } from '../context/CartContext.jsx';
import API from '../utils/api.js';

const Wishlist = () => {
  const { user, toggleWishlistItem } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch full wishlist product details from populating endpoint
  useEffect(() => {
    const fetchWishlist = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await API.get('/api/auth/profile');
        setWishlistItems(data.wishlist || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, [user]);

  const handleRemove = async (productId) => {
    await toggleWishlistItem(productId);
    setWishlistItems((prev) => prev.filter((item) => item._id !== productId));
    alert('Item removed from wishlist');
  };

  const handleAddToCart = (product) => {
    const size = product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'One-Size';
    const color = product.colors && product.colors.length > 0 ? product.colors[0] : 'Standard';
    addToCart(product, 1, size, color);
    alert(`${product.name} added to cart! 🛍️`);
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
        <h2 class="text-lg font-bold text-gray-800 dark:text-white uppercase">Protected Access</h2>
        <p class="text-xs text-gray-400">Please authorize your account to manage your wishlist.</p>
        <Link to="/login" class="btn-gold text-xs">Sign In</Link>
      </div>
    );
  }

  return (
    <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 min-h-screen">
      
      <h1 class="font-display text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white uppercase tracking-tight mb-8">
        Your Wishlist
      </h1>

      {wishlistItems.length === 0 ? (
        <div class="flex flex-col items-center justify-center py-20 text-center space-y-4">
          <span class="text-4xl">🖤</span>
          <h2 class="font-display text-lg font-bold text-gray-800 dark:text-white uppercase">Your wishlist is empty</h2>
          <p class="text-xs text-gray-400 max-w-xs">
            Start liking boutique collections in NV Vogue shop pages to keep tracking elements here!
          </p>
          <Link to="/shop" class="btn-gold text-xs">Shop catalog</Link>
        </div>
      ) : (
        <div class="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {wishlistItems.map((prod) => (
            <div
              key={prod._id}
              class="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-200/50 bg-white/75 shadow-sm transition-all duration-300 dark:border-gray-800/40 dark:bg-brand-indigo/60"
            >
              {/* Product Image */}
              <Link to={`/product/${prod._id}`} class="relative block overflow-hidden aspect-[4/5] bg-gray-100">
                <img
                  src={prod.images[0]}
                  alt={prod.name}
                  class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                
                {/* Delete button */}
                <button
                  onClick={() => handleRemove(prod._id)}
                  class="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow text-gray-400 hover:text-brand-rose transition-colors"
                  title="Remove from wishlist"
                >
                  <Trash2 class="h-4.5 w-4.5" />
                </button>
              </Link>

              {/* Card info */}
              <div class="flex-grow p-4 space-y-2 flex flex-col justify-between">
                <div>
                  <span class="text-[10px] font-bold text-brand-gold uppercase tracking-wider block">
                    {prod.category}
                  </span>
                  <Link to={`/product/${prod._id}`} class="hover:text-brand-gold transition-colors">
                    <h3 class="font-display text-xs sm:text-sm font-bold text-gray-800 dark:text-white line-clamp-1">
                      {prod.name}
                    </h3>
                  </Link>
                </div>

                <div class="flex items-center justify-between mt-4 pt-3 border-t border-gray-100 dark:border-gray-800">
                  <span class="font-display text-sm font-bold text-gray-800 dark:text-white">
                    ${prod.price}
                  </span>

                  <button
                    onClick={() => handleAddToCart(prod)}
                    class="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-brand-gold to-brand-goldlight text-brand-dark transition-all hover:scale-105 active:scale-95"
                    title="Add to Cart"
                  >
                    <ShoppingCart class="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default Wishlist;
