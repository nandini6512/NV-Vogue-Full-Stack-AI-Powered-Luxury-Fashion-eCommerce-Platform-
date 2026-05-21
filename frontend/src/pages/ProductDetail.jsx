import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Star, Plus, Minus, Heart, Truck, Sparkles, User } from 'lucide-react';
import { AuthContext } from '../context/AuthContext.jsx';
import { CartContext } from '../context/CartContext.jsx';
import ProductCard from '../components/ProductCard.jsx';
import API from '../utils/api.js';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { user, toggleWishlistItem } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext);

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  // Gallery/Selection states
  const [activeImage, setActiveImage] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);

  // Review states
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  const isWishlisted = user && user.wishlist?.some(item => item === id || item._id === id);

  // Fetch product detail and related items
  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      try {
        const { data } = await API.get(`/api/products/${id}`);
        setProduct(data);
        setActiveImage(data.images[0]);
        
        // Auto select first options
        if (data.sizes && data.sizes.length > 0) setSelectedSize(data.sizes[0]);
        if (data.colors && data.colors.length > 0) setSelectedColor(data.colors[0]);

        // Fetch related products
        const relData = await API.get(`/api/products?category=${data.category}`);
        setRelated(relData.data.filter(p => p._id !== id).slice(0, 4));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProductDetails();
  }, [id]);

  const handleWishlistToggle = () => {
    if (!user) {
      alert('Please log in to add items to your wishlist!');
      return;
    }
    toggleWishlistItem(product._id);
  };

  const handleAddCart = () => {
    addToCart(product, quantity, selectedSize, selectedColor);
    alert(`${product.name} successfully added to shopping cart! 🛒`);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedSize, selectedColor);
    navigate('/cart');
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please log in to submit a review!');
      return;
    }

    try {
      await API.post(`/api/products/${id}/reviews`, {
        rating: reviewRating,
        comment: reviewComment,
      });
      alert('Review successfully submitted!');
      setReviewComment('');
      
      // Reload product details to fetch new review
      const { data } = await API.get(`/api/products/${id}`);
      setProduct(data);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit review');
    }
  };

  if (loading) {
    return (
      <div class="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-brand-dark">
        <div class="h-10 w-10 animate-spin rounded-full border-4 border-brand-gold border-t-transparent"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div class="flex min-h-screen flex-col items-center justify-center gap-4 text-center">
        <span class="text-3xl">🧩</span>
        <h2 class="text-lg font-bold text-gray-800 dark:text-white uppercase">Product Not Found</h2>
        <Link to="/shop" class="btn-gold text-xs">Return to shop</Link>
      </div>
    );
  }

  const discountedPrice = product.price * (1 - (product.discount || 0) / 100);

  return (
    <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 min-h-screen">
      
      {/* 1. Main Product Overview Grid */}
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-16">
        
        {/* Left Column: Image Viewer Gallery */}
        <div class="space-y-4">
          <div class="overflow-hidden rounded-2xl border border-gray-200/50 bg-gray-100 dark:border-gray-800/40 dark:bg-brand-indigo/30 aspect-[4/5]">
            <img
              src={activeImage}
              alt={product.name}
              class="h-full w-full object-cover object-center"
            />
          </div>
          
          {/* Thumbnails list */}
          {product.images && product.images.length > 1 && (
            <div class="flex gap-3 overflow-x-auto pb-1.5">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(img)}
                  class={`h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border-2 transition-all ${
                    activeImage === img
                      ? 'border-brand-gold scale-105 shadow-sm'
                      : 'border-transparent hover:border-gray-300 dark:hover:border-gray-700'
                  }`}
                >
                  <img src={img} alt="thumbnail" class="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Descriptions & Selectors */}
        <div class="flex flex-col space-y-5">
          
          {/* Badges & Categories */}
          <div class="flex items-center justify-between gap-4">
            <span class="inline-flex items-center gap-1 text-[10px] font-bold text-brand-gold tracking-widest uppercase bg-brand-gold/10 px-3 py-1 rounded-full border border-brand-gold/20">
              {product.category} COLLECTION
            </span>
            
            <button
              onClick={handleWishlistToggle}
              class={`flex h-9 w-9 items-center justify-center rounded-full border shadow-sm transition-all ${
                isWishlisted
                  ? 'bg-brand-rose border-brand-rose text-white scale-105'
                  : 'bg-white border-gray-200 text-gray-400 hover:text-brand-rose hover:bg-gray-50'
              }`}
              title="Add to Wishlist"
            >
              <Heart class={`h-4.5 w-4.5 ${isWishlisted ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Title & Review Counts */}
          <div class="space-y-1.5">
            <h1 class="font-display text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white leading-tight uppercase">
              {product.name}
            </h1>
            
            <div class="flex items-center gap-2">
              <div class="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    class={`h-4 w-4 ${
                      i < Math.floor(product.rating)
                        ? 'fill-amber-400 stroke-none'
                        : 'text-gray-300 dark:text-gray-700'
                    }`}
                  />
                ))}
              </div>
              <span class="text-xs font-semibold text-gray-500 dark:text-gray-400">
                {product.rating.toFixed(1)} / 5 ({product.numReviews} Reviews)
              </span>
            </div>
          </div>

          {/* Pricing Box */}
          <div class="rounded-2xl bg-gray-50 p-4 dark:bg-brand-indigo/40 flex items-center justify-between border dark:border-gray-800">
            <div class="flex flex-col">
              <span class="text-[10px] font-bold tracking-wider text-gray-400 uppercase">Premium Price</span>
              <div class="flex items-baseline gap-2">
                {product.discount > 0 ? (
                  <>
                    <span class="font-display text-2xl font-black text-brand-rose">${discountedPrice.toFixed(0)}</span>
                    <span class="text-sm text-gray-400 line-through">${product.price}</span>
                  </>
                ) : (
                  <span class="font-display text-2xl font-black text-gray-900 dark:text-white">${product.price}</span>
                )}
              </div>
            </div>

            {/* In stock Status */}
            <div class="text-right">
              <span class="text-[10px] font-bold tracking-wider text-gray-400 uppercase block">Availability</span>
              {product.countInStock > 0 ? (
                <span class="inline-flex items-center gap-1 text-[11px] font-bold text-green-500 uppercase">
                  <span class="h-2 w-2 rounded-full bg-green-500 animate-ping"></span> In Stock ({product.countInStock})
                </span>
              ) : (
                <span class="text-[11px] font-bold text-red-500 uppercase">Sold Out</span>
              )}
            </div>
          </div>

          {/* Description */}
          <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
            {product.description}
          </p>

          {/* size selections */}
          {product.sizes && product.sizes.length > 0 && (
            <div class="space-y-2">
              <span class="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide block">Select Size:</span>
              <div class="flex flex-wrap gap-2">
                {product.sizes.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    class={`h-10 min-w-[40px] px-3 text-xs font-bold rounded-lg border flex items-center justify-center transition-all ${
                      selectedSize === sz
                        ? 'bg-brand-gold border-brand-gold text-brand-dark font-extrabold shadow'
                        : 'border-gray-200 text-gray-600 hover:border-brand-gold hover:text-brand-gold dark:border-gray-800 dark:text-gray-300'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* color selections */}
          {product.colors && product.colors.length > 0 && (
            <div class="space-y-2">
              <span class="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide block">Select Color:</span>
              <div class="flex flex-wrap gap-2">
                {product.colors.map((cl) => (
                  <button
                    key={cl}
                    onClick={() => setSelectedColor(cl)}
                    class={`text-xs font-bold px-4 py-2 rounded-lg border transition-all ${
                      selectedColor === cl
                        ? 'bg-gradient-to-r from-brand-gold to-brand-goldlight border-brand-gold text-brand-dark font-extrabold shadow'
                        : 'border-gray-200 text-gray-600 hover:border-brand-gold hover:text-brand-gold dark:border-gray-800 dark:text-gray-300'
                    }`}
                  >
                    {cl}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Qty & Add to Cart row */}
          {product.countInStock > 0 && (
            <div class="space-y-4 pt-3 border-t border-gray-100 dark:border-gray-800/60">
              <div class="flex items-center gap-4 flex-wrap">
                
                {/* Qty count selector */}
                <div class="flex items-center border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden bg-white dark:bg-brand-indigo/30 h-11">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    class="p-3 text-gray-500 hover:bg-gray-50 dark:hover:bg-brand-dark"
                  >
                    <Minus class="h-3.5 w-3.5" />
                  </button>
                  <span class="px-4 font-display font-bold text-sm text-gray-800 dark:text-white">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.countInStock, quantity + 1))}
                    class="p-3 text-gray-500 hover:bg-gray-50 dark:hover:bg-brand-dark"
                  >
                    <Plus class="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Add to Cart button */}
                <button
                  onClick={handleAddCart}
                  class="flex-1 min-w-[150px] btn-gold h-11 flex items-center justify-center gap-2 text-sm uppercase tracking-wider"
                >
                  <ShoppingBag class="h-4.5 w-4.5" /> Add to Cart
                </button>

                {/* Buy Now button */}
                <button
                  onClick={handleBuyNow}
                  class="btn-outline-gold h-11 flex items-center justify-center px-6 text-sm uppercase tracking-wider hover:brightness-105"
                >
                  Buy Now
                </button>

              </div>
            </div>
          )}

          {/* Small guarantees footer */}
          <div class="pt-4 border-t border-gray-100 dark:border-gray-800/60 flex items-center gap-4 text-xs text-gray-400">
            <span class="flex items-center gap-1"><Truck class="h-4 w-4 text-brand-gold" /> Free Worldwide Shipping Over $150</span>
            <span class="flex items-center gap-1"><Sparkles class="h-4 w-4 text-brand-gold" /> 100% Quality Fabric Insured</span>
          </div>

        </div>

      </div>

      {/* 2. Customer Reviews & Add Review Panel */}
      <section class="mb-16 border-t border-gray-200/50 pt-12 dark:border-gray-800/40">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Reviews list */}
          <div class="lg:col-span-2 space-y-6">
            <h3 class="font-display text-lg font-bold text-gray-900 dark:text-white uppercase tracking-wider">
              Customer Reviews ({product.reviews.length})
            </h3>
            
            {product.reviews.length === 0 ? (
              <p class="text-xs text-gray-500 dark:text-gray-400">
                Be the first to review this exquisite fashion piece! Add your rating details below.
              </p>
            ) : (
              <div class="space-y-4">
                {product.reviews.map((rev) => (
                  <div
                    key={rev._id}
                    class="rounded-xl border border-gray-100 bg-white p-4 dark:border-gray-800/60 dark:bg-brand-indigo/30 shadow-sm"
                  >
                    <div class="flex items-center justify-between gap-4 mb-2">
                      <div class="flex items-center gap-2">
                        <div class="flex h-7 w-7 items-center justify-center rounded-full bg-brand-gold/10 text-brand-gold font-bold text-xs">
                          <User class="h-3.5 w-3.5" />
                        </div>
                        <span class="text-xs font-bold text-gray-800 dark:text-gray-200">
                          {rev.name}
                        </span>
                      </div>
                      
                      <div class="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            class={`h-3 w-3 ${
                              i < rev.rating ? 'fill-amber-400 stroke-none' : 'text-gray-300 dark:text-gray-700'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p class="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                      {rev.comment}
                    </p>
                    <span class="text-[9px] text-gray-400 block mt-2 text-right">
                      {new Date(rev.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Form to submit review */}
          <div class="rounded-xl border border-gray-200/50 bg-white/75 p-6 dark:border-gray-800/40 dark:bg-brand-indigo/60 shadow-sm">
            <h3 class="font-display text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              Write A Review
            </h3>

            {user ? (
              <form onSubmit={handleReviewSubmit} class="space-y-4">
                
                <div class="space-y-1">
                  <label class="text-[11px] font-bold text-gray-400 uppercase block">Rating Score:</label>
                  <select
                    value={reviewRating}
                    onChange={(e) => setReviewRating(Number(e.target.value))}
                    class="w-full rounded-lg border border-gray-200 bg-white px-2.5 py-2 text-xs focus:border-brand-gold focus:outline-none dark:border-gray-800 dark:bg-brand-dark"
                  >
                    <option value="5">5 - Excellent (Highly Recommend)</option>
                    <option value="4">4 - Good (Very Satisfied)</option>
                    <option value="3">3 - Average (Fair Choice)</option>
                    <option value="2">2 - Poor (Needs Improvement)</option>
                    <option value="1">1 - Awful (Not Recommended)</option>
                  </select>
                </div>

                <div class="space-y-1">
                  <label class="text-[11px] font-bold text-gray-400 uppercase block">Review Details:</label>
                  <textarea
                    rows="4"
                    placeholder="Provide details about the fabric, sizing fit, color quality..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    required
                    class="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs focus:border-brand-gold focus:outline-none dark:border-gray-800 dark:bg-brand-dark"
                  />
                </div>

                <button
                  type="submit"
                  class="w-full btn-gold py-2 text-xs uppercase font-semibold"
                >
                  Submit review
                </button>

              </form>
            ) : (
              <div class="text-center p-4 border border-dashed rounded-lg">
                <p class="text-xs text-gray-500 dark:text-gray-400 mb-3">Please authorize your account to post reviews.</p>
                <Link to="/login" class="btn-gold py-1.5 px-4 text-[10px]">Log In</Link>
              </div>
            )}
          </div>

        </div>
      </section>

      {/* 3. Related Products Recommendations Section */}
      {related.length > 0 && (
        <section class="border-t border-gray-200/50 pt-12 dark:border-gray-800/40">
          <h3 class="font-display text-lg font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-8">
            Complete The Look
          </h3>
          
          <div class="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {related.map((prod) => (
              <ProductCard key={prod._id} product={prod} />
            ))}
          </div>
        </section>
      )}

    </div>
  );
};

export default ProductDetail;
