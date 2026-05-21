import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Truck, ShieldCheck, HelpCircle } from 'lucide-react';
import ProductCard from '../components/ProductCard.jsx';
import API from '../utils/api.js';

const Home = () => {
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Auto sliding hero banner states
  const [activeSlide, setActiveSlide] = useState(0);
  const heroSlides = [
    {
      title: "PREMIUM COUTURE AUTUMN COLLECTION",
      subtitle: "Elevate your daily presence with hand-tailored boutique fabrics.",
      image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1600&auto=format&fit=crop",
      btnText: "Shop Collection",
      link: "/shop"
    },
    {
      title: "CONVERSATIONAL AI STYLING INCLUDED",
      subtitle: "Chat with NV Stylist right now to find outfits designed specifically for you.",
      image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1600&auto=format&fit=crop",
      btnText: "Consult NV Stylist",
      link: "/shop",
      isAiBtn: true
    },
    {
      title: "EXQUISITE FOOTWEAR & LEATHERS",
      subtitle: "Indulge in Italian leather oxfords and custom block heel suede boots.",
      image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1600&auto=format&fit=crop",
      btnText: "Shop Footwear",
      link: "/shop?category=Shoes"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // Fetch trending products
  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const { data } = await API.get('/api/products?trending=true');
        setTrendingProducts(data.slice(0, 4));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrending();
  }, []);

  const categories = [
    { name: 'Women', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=400' },
    { name: 'Men', image: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?q=80&w=400' },
    { name: 'Jeans', image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=400' },
    { name: 'Tops', image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=400' },
    { name: 'Shoes', image: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?q=80&w=400' },
    { name: 'Accessories', image: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?q=80&w=400' },
  ];

  return (
    <div class="flex flex-col min-h-screen">
      
      {/* 1. Hero Auto-Sliding Banner Section */}
      <section class="relative h-[480px] sm:h-[600px] w-full overflow-hidden bg-brand-dark">
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            class={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === activeSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            <div class="absolute inset-0 bg-gradient-to-r from-brand-dark via-brand-dark/60 to-transparent z-10" />
            <img
              src={slide.image}
              alt={slide.title}
              class="h-full w-full object-cover object-center transform scale-105 transition-transform duration-[6000ms]"
            />
            
            {/* Slide Texts */}
            <div class="absolute inset-0 flex items-center z-20 px-4 sm:px-8 lg:px-16">
              <div class="max-w-xl text-white space-y-4">
                <span class="inline-flex items-center gap-1 text-[10px] sm:text-xs font-bold text-brand-gold tracking-widest uppercase bg-brand-gold/10 px-3 py-1 rounded-full border border-brand-gold/20">
                  <Sparkles class="h-3 w-3" /> NV VOGUE INTERNATIONAL
                </span>
                
                <h1 class="font-display text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight uppercase text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-100 to-brand-goldlight">
                  {slide.title}
                </h1>
                
                <p class="text-xs sm:text-sm text-gray-300 leading-relaxed max-w-lg">
                  {slide.subtitle}
                </p>
                
                <div class="pt-4 flex flex-wrap gap-3">
                  <Link
                    to={slide.link}
                    class="btn-gold flex items-center gap-2 text-xs sm:text-sm font-semibold tracking-wide"
                  >
                    {slide.btnText}
                    <ArrowRight class="h-4 w-4" />
                  </Link>
                  
                  {slide.isAiBtn && (
                    <button
                      onClick={() => {
                        // Triggers ChatBot opening manually
                        const event = new CustomEvent('open-ai-chat');
                        window.dispatchEvent(event);
                      }}
                      class="btn-outline-gold text-xs sm:text-sm font-semibold tracking-wide border-white/40 text-white hover:bg-white/10"
                    >
                      Learn More
                    </button>
                  )}
                </div>
              </div>
            </div>

          </div>
        ))}

        {/* Sliding Dot indicators */}
        <div class="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveSlide(index)}
              class={`h-2.5 rounded-full transition-all duration-300 ${
                index === activeSlide ? 'w-8 bg-brand-gold' : 'w-2.5 bg-white/40'
              }`}
            />
          ))}
        </div>
      </section>

      {/* 2. Premium Grid Categories Hub */}
      <section class="py-16 bg-white dark:bg-brand-indigo/10 transition-colors">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div class="text-center space-y-2 mb-10">
            <h2 class="font-display text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white uppercase">
              Browse Boutique Departments
            </h2>
            <p class="text-xs text-gray-500 dark:text-gray-400 max-w-md mx-auto">
              Curated premium threads structured by product categories for simple checkout discovery.
            </p>
          </div>

          <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                to={`/shop?category=${cat.name}`}
                class="group relative flex flex-col items-center overflow-hidden rounded-xl bg-gray-50 p-4 dark:bg-brand-indigo/40 hover:-translate-y-1.5 transition-all duration-300"
              >
                <div class="h-20 w-20 overflow-hidden rounded-full border-2 border-brand-gold/10 group-hover:border-brand-gold/60 transition-colors">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <span class="mt-3 font-display text-xs font-semibold tracking-wider text-gray-800 dark:text-gray-200 group-hover:text-brand-gold transition-colors">
                  {cat.name.toUpperCase()}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Featured Trending Carousel Grid */}
      <section class="py-16 bg-gray-50 dark:bg-brand-dark transition-colors">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div class="flex flex-col sm:flex-row items-baseline justify-between gap-4 mb-10">
            <div class="space-y-1.5">
              <span class="text-[10px] font-bold text-brand-gold tracking-widest uppercase">
                SEASONAL RECOMMENDATIONS
              </span>
              <h2 class="font-display text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white uppercase">
                Trending Active Collections
              </h2>
            </div>
            
            <Link
              to="/shop"
              class="flex items-center gap-1.5 text-xs font-bold text-brand-gold hover:text-brand-goldlight transition-colors group"
            >
              Explore Full Shop
              <ArrowRight class="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {loading ? (
            <div class="grid grid-cols-2 gap-6 lg:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} class="h-80 animate-pulse rounded-2xl bg-gray-200 dark:bg-brand-indigo/40" />
              ))}
            </div>
          ) : (
            <div class="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
              {trendingProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4. Luxury Promos and Discount Code */}
      <section class="relative py-20 bg-brand-dark overflow-hidden">
        <div class="absolute inset-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200"
            alt="promo background"
            class="h-full w-full object-cover"
          />
        </div>
        <div class="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/90 to-brand-dark z-10" />

        <div class="relative mx-auto max-w-4xl px-4 text-center space-y-6 z-20">
          <span class="inline-flex items-center gap-1.5 text-[10px] font-bold text-brand-gold tracking-widest uppercase bg-brand-gold/10 px-3 py-1 rounded-full border border-brand-gold/20">
            SPECIAL CUSTOMER BONUS
          </span>
          <h2 class="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-white uppercase leading-none">
            Unlock Autumn Discounts
          </h2>
          <p class="text-xs sm:text-sm text-gray-300 leading-relaxed max-w-xl mx-auto">
            Apply the boutique coupon code at checkout to secure immediate discounts across accessories, dresses, and footwear.
          </p>
          
          <div class="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <div class="rounded-xl border-2 border-dashed border-brand-gold/60 bg-brand-indigo/60 px-6 py-2.5 text-center">
              <span class="text-xs text-gray-400 font-bold uppercase tracking-wider block">10% Promo Code:</span>
              <span class="font-display text-base font-extrabold text-brand-gold tracking-widest">NVVOGUE10</span>
            </div>
            <div class="rounded-xl border-2 border-dashed border-brand-gold/60 bg-brand-indigo/60 px-6 py-2.5 text-center">
              <span class="text-xs text-gray-400 font-bold uppercase tracking-wider block">20% Promo Code:</span>
              <span class="font-display text-base font-extrabold text-brand-gold tracking-widest">NVSURPRISE20</span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Benefit Pillars */}
      <section class="py-16 bg-white dark:bg-brand-dark transition-colors">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div class="grid grid-cols-1 gap-8 sm:grid-cols-3">
            
            <div class="flex flex-col items-center text-center p-4 space-y-3">
              <div class="flex h-12 w-12 items-center justify-center rounded-full bg-brand-gold/10 text-brand-gold">
                <Truck class="h-6 w-6" />
              </div>
              <h3 class="font-display text-sm font-semibold tracking-wider text-gray-900 dark:text-white uppercase">
                Complementary Global Express
              </h3>
              <p class="text-xs text-gray-400 leading-relaxed max-w-xs">
                Free standard shipping worldwide on all boutique orders exceeding $150. Fast custom tracking.
              </p>
            </div>

            <div class="flex flex-col items-center text-center p-4 space-y-3">
              <div class="flex h-12 w-12 items-center justify-center rounded-full bg-brand-gold/10 text-brand-gold">
                <Sparkles class="h-6 w-6" />
              </div>
              <h3 class="font-display text-sm font-semibold tracking-wider text-gray-900 dark:text-white uppercase">
                Conversational AI Stylist
              </h3>
              <p class="text-xs text-gray-400 leading-relaxed max-w-xs">
                Interactive real-time fashion recommendations that analyze colors, styles, and events to outfit you perfectly.
              </p>
            </div>

            <div class="flex flex-col items-center text-center p-4 space-y-3">
              <div class="flex h-12 w-12 items-center justify-center rounded-full bg-brand-gold/10 text-brand-gold">
                <ShieldCheck class="h-6 w-6" />
              </div>
              <h3 class="font-display text-sm font-semibold tracking-wider text-gray-900 dark:text-white uppercase">
                Premium Boutique Assembly
              </h3>
              <p class="text-xs text-gray-400 leading-relaxed max-w-xs">
                All garments feature absolute quality checks, elegant brand-stitched tags, and high-quality premium packaging.
              </p>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
