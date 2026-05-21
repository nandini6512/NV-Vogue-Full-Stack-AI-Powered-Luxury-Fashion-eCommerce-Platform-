import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { AuthContext } from '../context/AuthContext.jsx';
import { CartContext } from '../context/CartContext.jsx';

const ProductCard = ({ product }) => {
  const { user, toggleWishlistItem } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext);

  const discountedPrice = product.price * (1 - (product.discount || 0) / 100);
  const isWishlisted = user && user.wishlist?.some(item => item === product._id || item._id === product._id);

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      alert('Please log in to save items to your wishlist!');
      return;
    }
    toggleWishlistItem(product._id);
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Auto-select first size/color if available
    const size = product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'One-Size';
    const color = product.colors && product.colors.length > 0 ? product.colors[0] : 'Standard';
    
    addToCart(product, 1, size, color);
    alert(`${product.name} added to shopping cart!`);
  };

  return (
    <div class="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-200/50 bg-white/75 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-brand-gold/30 hover:shadow-glow dark:border-gray-800/40 dark:bg-brand-indigo/60 dark:hover:border-brand-gold/30">
      
      {/* Product Image Frame */}
      <Link to={`/product/${product._id}`} class="relative block overflow-hidden aspect-[4/5] bg-gray-100 dark:bg-brand-dark/20">
        <img
          src={product.images[0]}
          alt={product.name}
          class="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Discount Badge */}
        {product.discount > 0 && (
          <span class="absolute left-3 top-3 rounded-full bg-brand-rose px-2.5 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
            {product.discount}% OFF
          </span>
        )}

        {/* Wishlist Floating Button */}
        <button
          onClick={handleWishlistClick}
          class={`absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border shadow-sm backdrop-blur-md transition-all duration-300 ${
            isWishlisted
              ? 'bg-brand-rose border-brand-rose text-white scale-110'
              : 'bg-white/80 border-gray-200/50 text-gray-500 hover:bg-white hover:text-brand-rose'
          }`}
          aria-label="Add to Wishlist"
        >
          <Heart class={`h-4.5 w-4.5 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>
      </Link>

      {/* Product Info Block */}
      <div class="flex flex-1 flex-col p-4">
        
        {/* Category & Rating */}
        <div class="flex items-center justify-between gap-1 mb-1.5">
          <span class="text-[10px] font-bold tracking-wider text-brand-gold uppercase">
            {product.category}
          </span>
          
          <div class="flex items-center gap-1">
            <Star class="h-3 w-3 fill-amber-400 stroke-none" />
            <span class="text-[11px] font-medium text-gray-500 dark:text-gray-400">
              {product.rating.toFixed(1)}
            </span>
          </div>
        </div>

        {/* Title */}
        <Link to={`/product/${product._id}`} class="block group-hover:text-brand-gold transition-colors">
          <h3 class="font-display text-sm font-semibold leading-tight text-gray-800 dark:text-white line-clamp-1">
            {product.name}
          </h3>
        </Link>

        {/* Description line limit */}
        <p class="mt-1 text-[11px] leading-normal text-gray-400 line-clamp-2">
          {product.description}
        </p>

        {/* Pricing & Add to Cart Action */}
        <div class="mt-auto pt-3.5 flex items-center justify-between gap-2 border-t border-gray-100 dark:border-gray-800/60">
          <div class="flex flex-col leading-none">
            {product.discount > 0 ? (
              <div class="flex items-baseline gap-1.5">
                <span class="font-display text-base font-bold text-brand-rose">
                  ${discountedPrice.toFixed(0)}
                </span>
                <span class="text-xs text-gray-400 line-through">
                  ${product.price}
                </span>
              </div>
            ) : (
              <span class="font-display text-base font-bold text-gray-800 dark:text-white">
                ${product.price}
              </span>
            )}
          </div>

          {/* Quick Cart button */}
          {product.countInStock > 0 ? (
            <button
              onClick={handleAddToCart}
              class="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-brand-gold to-brand-goldlight text-brand-dark transition-all hover:scale-105 active:scale-95 shadow-sm"
              title="Add to Cart"
            >
              <ShoppingCart class="h-3.5 w-3.5" />
            </button>
          ) : (
            <span class="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
              SOLD OUT
            </span>
          )}

        </div>

      </div>

    </div>
  );
};

export default ProductCard;
