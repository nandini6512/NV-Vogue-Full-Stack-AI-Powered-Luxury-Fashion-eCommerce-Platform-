import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, Search, RotateCcw } from 'lucide-react';
import ProductCard from '../components/ProductCard.jsx';
import API from '../utils/api.js';

const ProductList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // States mirroring query params
  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [size, setSize] = useState(searchParams.get('size') || '');
  const [color, setColor] = useState(searchParams.get('color') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const categories = [
    'All',
    'Men',
    'Women',
    'Kids',
    'Jeans',
    'Tops',
    'Beauty',
    'Shoes',
    'Accessories',
  ];

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'One-Size', '6', '7', '8', '9', '10', '11'];
  const colors = ['Black', 'White', 'Blue', 'Crimson', 'Pink', 'Gold', 'Beige', 'Grey', 'Navy', 'Brown'];

  // Sync state with url params on change
  useEffect(() => {
    setKeyword(searchParams.get('keyword') || '');
    setCategory(searchParams.get('category') || 'All');
    setSize(searchParams.get('size') || '');
    setColor(searchParams.get('color') || '');
    setMinPrice(searchParams.get('minPrice') || '');
    setMaxPrice(searchParams.get('maxPrice') || '');
    setSort(searchParams.get('sort') || 'newest');
  }, [searchParams]);

  // Fetch products matching parameters
  useEffect(() => {
    const fetchCatalog = async () => {
      setLoading(true);
      try {
        const query = new URLSearchParams();
        if (keyword) query.append('keyword', keyword);
        if (category && category !== 'All') query.append('category', category);
        if (size) query.append('size', size);
        if (color) query.append('color', color);
        if (minPrice) query.append('minPrice', minPrice);
        if (maxPrice) query.append('maxPrice', maxPrice);
        if (sort) query.append('sort', sort);

        const { data } = await API.get(`/api/products?${query.toString()}`);
        setProducts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCatalog();
  }, [keyword, category, size, color, minPrice, maxPrice, sort]);

  const updateFilters = (newParams) => {
    const current = new URLSearchParams(searchParams);
    Object.entries(newParams).forEach(([key, val]) => {
      if (val === '' || val === null || val === 'All') {
        current.delete(key);
      } else {
        current.set(key, val);
      }
    });
    setSearchParams(current);
  };

  const handleResetFilters = () => {
    setSearchParams(new URLSearchParams());
    setKeyword('');
    setCategory('All');
    setSize('');
    setColor('');
    setMinPrice('');
    setMaxPrice('');
    setSort('newest');
  };

  return (
    <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 min-h-screen">
      
      {/* Page Title & Breadcrumb Header */}
      <div class="mb-6 flex flex-col md:flex-row items-baseline justify-between gap-4 border-b border-gray-200/50 pb-4 dark:border-gray-800/40">
        <div>
          <h1 class="font-display text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white uppercase tracking-tight">
            Shop Premium Catalog
          </h1>
          <p class="text-xs text-gray-400">
            Discover {products.length} luxury active listings in {category} collection.
          </p>
        </div>

        {/* Sort and mobile filter toggle */}
        <div class="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            class="flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-semibold md:hidden dark:border-gray-800"
          >
            <Filter class="h-4 w-4" /> Filters
          </button>
          
          <div class="flex items-center gap-2">
            <span class="text-xs text-gray-400 font-semibold uppercase">Sort By:</span>
            <select
              value={sort}
              onChange={(e) => updateFilters({ sort: e.target.value })}
              class="rounded-lg border border-gray-300 bg-white px-2.5 py-1.5 text-xs focus:border-brand-gold focus:outline-none dark:border-gray-800 dark:bg-brand-indigo dark:text-white"
            >
              <option value="newest">Newest Arrivals</option>
              <option value="priceAsc">Price: Low to High</option>
              <option value="priceDesc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>
      </div>

      <div class="flex flex-col lg:flex-row gap-8">
        
        {/* A. Desktop Left Filters Sidebar */}
        <aside class="hidden md:block w-64 flex-shrink-0 space-y-6">
          
          {/* Active clear triggers */}
          <div class="flex items-center justify-between border-b border-gray-200/50 pb-3 dark:border-gray-800/40">
            <h3 class="font-display text-sm font-bold tracking-wider text-gray-900 dark:text-white uppercase flex items-center gap-1.5">
              <SlidersHorizontal class="h-4 w-4 text-brand-gold" /> Filter Settings
            </h3>
            <button
              onClick={handleResetFilters}
              class="flex items-center gap-1 text-[10px] font-bold text-brand-rose uppercase hover:brightness-110"
            >
              <RotateCcw class="h-3.5 w-3.5" /> Clear All
            </button>
          </div>

          {/* Keyword Search Input */}
          <div class="space-y-2">
            <span class="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide block">Search:</span>
            <div class="relative">
              <input
                type="text"
                placeholder="Product name..."
                value={keyword}
                onChange={(e) => {
                  setKeyword(e.target.value);
                  updateFilters({ keyword: e.target.value });
                }}
                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-1.5 pl-8 text-xs focus:border-brand-gold focus:outline-none dark:border-gray-800 dark:bg-brand-dark dark:text-white"
              />
              <Search class="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-gray-400" />
            </div>
          </div>

          {/* Categories select block */}
          <div class="space-y-2">
            <span class="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide block">Category:</span>
            <div class="flex flex-col gap-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => updateFilters({ category: cat })}
                  class={`text-left text-xs px-3 py-1.5 rounded-lg transition-colors font-medium ${
                    category === cat
                      ? 'bg-brand-gold/15 text-brand-gold font-bold border-l-4 border-brand-gold'
                      : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-brand-indigo/30 dark:hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range inputs */}
          <div class="space-y-2">
            <span class="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide block">Price ($):</span>
            <div class="flex gap-2 items-center">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => {
                  setMinPrice(e.target.value);
                  updateFilters({ minPrice: e.target.value });
                }}
                class="w-full rounded-lg border border-gray-300 px-2.5 py-1.5 text-xs dark:border-gray-800 dark:bg-brand-dark dark:text-white focus:outline-none focus:border-brand-gold"
              />
              <span class="text-gray-400">-</span>
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => {
                  setMaxPrice(e.target.value);
                  updateFilters({ maxPrice: e.target.value });
                }}
                class="w-full rounded-lg border border-gray-300 px-2.5 py-1.5 text-xs dark:border-gray-800 dark:bg-brand-dark dark:text-white focus:outline-none focus:border-brand-gold"
              />
            </div>
          </div>

          {/* Size choices */}
          <div class="space-y-2">
            <span class="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide block">Sizes:</span>
            <div class="flex flex-wrap gap-1.5">
              {sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    const next = size === s ? '' : s;
                    setSize(next);
                    updateFilters({ size: next });
                  }}
                  class={`h-8 min-w-[32px] px-2 text-[10px] font-bold rounded-md border flex items-center justify-center transition-all ${
                    size === s
                      ? 'bg-brand-gold border-brand-gold text-brand-dark font-extrabold'
                      : 'border-gray-200 text-gray-500 hover:border-brand-gold hover:text-brand-gold dark:border-gray-800 dark:text-gray-400'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Color picks */}
          <div class="space-y-2">
            <span class="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide block">Colors:</span>
            <div class="flex flex-wrap gap-1.5">
              {colors.map((c) => (
                <button
                  key={c}
                  onClick={() => {
                    const next = color === c ? '' : c;
                    setColor(next);
                    updateFilters({ color: next });
                  }}
                  class={`text-[10px] font-bold px-2.5 py-1 rounded-full border transition-all ${
                    color === c
                      ? 'bg-gradient-to-r from-brand-gold to-brand-goldlight text-brand-dark font-extrabold border-brand-gold shadow-sm'
                      : 'border-gray-200 text-gray-500 hover:border-brand-gold hover:text-brand-gold dark:border-gray-800 dark:text-gray-400'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

        </aside>

        {/* B. Mobile Slide out Filters Panel */}
        {mobileFilterOpen && (
          <div class="fixed inset-0 z-50 flex bg-brand-dark/40 backdrop-blur-xs md:hidden">
            <div class="w-64 bg-white p-6 dark:bg-brand-indigo overflow-y-auto flex flex-col space-y-6">
              <div class="flex items-center justify-between border-b pb-3 dark:border-gray-800">
                <h3 class="font-display text-sm font-bold text-gray-900 dark:text-white">Filters</h3>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  class="text-xs font-bold text-red-500"
                >
                  Close
                </button>
              </div>

              {/* Duplicate inputs for mobile panel */}
              <div class="space-y-2">
                <span class="text-xs font-bold uppercase block dark:text-gray-300">Category:</span>
                <select
                  value={category}
                  onChange={(e) => {
                    updateFilters({ category: e.target.value });
                    setMobileFilterOpen(false);
                  }}
                  class="w-full rounded-lg border border-gray-300 bg-white px-2.5 py-1.5 text-xs dark:border-gray-800 dark:bg-brand-dark dark:text-white"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div class="space-y-2">
                <span class="text-xs font-bold uppercase block dark:text-gray-300">Price ($):</span>
                <div class="flex gap-2 items-center">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => {
                      setMinPrice(e.target.value);
                      updateFilters({ minPrice: e.target.value });
                    }}
                    class="w-full rounded-lg border border-gray-300 px-2 py-1 text-xs dark:border-gray-800 dark:bg-brand-dark"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => {
                      setMaxPrice(e.target.value);
                      updateFilters({ maxPrice: e.target.value });
                    }}
                    class="w-full rounded-lg border border-gray-300 px-2 py-1 text-xs dark:border-gray-800 dark:bg-brand-dark"
                  />
                </div>
              </div>

              <button
                onClick={() => {
                  handleResetFilters();
                  setMobileFilterOpen(false);
                }}
                class="w-full btn-outline-gold py-2 text-center text-xs"
              >
                Reset All Filters
              </button>
            </div>
            
            <div class="flex-1" onClick={() => setMobileFilterOpen(false)} />
          </div>
        )}

        {/* C. Products Catalog Grid Area */}
        <main class="flex-grow">
          {loading ? (
            <div class="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} class="aspect-[4/5] animate-pulse rounded-2xl bg-gray-200 dark:bg-brand-indigo/40" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div class="flex flex-col items-center justify-center py-20 text-center space-y-4">
              <span class="text-3xl">🏜️</span>
              <h3 class="font-display text-lg font-bold text-gray-800 dark:text-white uppercase">
                No matching fashion pieces found
              </h3>
              <p class="text-xs text-gray-500 dark:text-gray-400 max-w-xs leading-relaxed">
                We couldn't match items to your active queries. Try searching simple categories or click clear below.
              </p>
              <button
                onClick={handleResetFilters}
                class="btn-gold text-xs"
              >
                Reset all parameters
              </button>
            </div>
          ) : (
            <div class="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </main>

      </div>
    </div>
  );
};

export default ProductList;
