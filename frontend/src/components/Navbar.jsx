import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import { CartContext } from '../context/CartContext.jsx';
import { ThemeContext } from '../context/ThemeContext.jsx';
import {
  ShoppingBag,
  Heart,
  User,
  Search,
  Menu,
  X,
  Sun,
  Moon,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  UserCircle,
  ShoppingBagIcon
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);
  const { darkMode, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

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

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?keyword=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <nav class="sticky top-0 z-40 w-full border-b border-gray-200/50 bg-white/80 backdrop-blur-md transition-colors duration-300 dark:border-gray-800/40 dark:bg-brand-dark/80">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="flex h-16 items-center justify-between">
          
          {/* Logo Brand */}
          <div class="flex items-center">
            <Link to="/" class="flex items-center gap-2 font-display text-2xl font-bold tracking-wider text-brand-indigo dark:text-white">
              <img src="/src/assets/logo.svg" alt="NV Vogue Logo" class="h-9 w-9" />
              <span class="bg-gradient-to-r from-brand-gold via-brand-goldlight to-brand-gold bg-clip-text text-transparent">
                NV VOGUE
              </span>
            </Link>
          </div>

          {/* Desktop Categories */}
          <div class="hidden lg:flex lg:space-x-4">
            {categories.slice(0, 6).map((cat) => (
              <Link
                key={cat}
                to={cat === 'All' ? '/shop' : `/shop?category=${cat}`}
                class="rounded-md px-3 py-2 font-display text-sm font-medium text-gray-700 transition-colors hover:text-brand-gold dark:text-gray-300 dark:hover:text-brand-gold"
              >
                {cat}
              </Link>
            ))}
          </div>

          {/* Search bar, theme, wishlist, cart, profiles */}
          <div class="hidden md:flex items-center gap-4">
            
            {/* Search Input */}
            <form onSubmit={handleSearchSubmit} class="relative">
              <input
                type="text"
                placeholder="Search premium collections..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                class="w-48 rounded-full border border-gray-300/60 bg-gray-50/50 px-4 py-1.5 pl-10 text-xs transition-all focus:w-64 focus:border-brand-gold focus:outline-none dark:border-gray-800 dark:bg-brand-indigo/30 dark:text-white"
              />
              <Search class="absolute left-3.5 top-2.5 h-3.5 w-3.5 text-gray-400" />
            </form>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              class="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-brand-gold dark:text-gray-400 dark:hover:bg-brand-indigo/40"
              aria-label="Toggle Theme"
            >
              {darkMode ? <Sun class="h-5 w-5" /> : <Moon class="h-5 w-5" />}
            </button>

            {/* Wishlist */}
            <Link
              to="/wishlist"
              class="relative rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-brand-rose dark:text-gray-400 dark:hover:bg-brand-indigo/40"
              aria-label="Wishlist"
            >
              <Heart class="h-5 w-5" />
              {user && user.wishlist?.length > 0 && (
                <span class="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-rose text-[9px] font-bold text-white">
                  {user.wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart Bubble */}
            <Link
              to="/cart"
              class="relative rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-brand-gold dark:text-gray-400 dark:hover:bg-brand-indigo/40"
              aria-label="Shopping Cart"
            >
              <ShoppingBag class="h-5 w-5" />
              {cartCount > 0 && (
                <span class="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-gold text-[9px] font-bold text-brand-dark">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Account Settings */}
            <div class="relative">
              {user ? (
                <div>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    class="flex items-center gap-1 rounded-full p-1 text-gray-600 hover:text-brand-gold dark:text-gray-300"
                  >
                    <div class="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-brand-gold to-brand-goldlight text-brand-dark font-bold text-xs">
                      {user.name.slice(0, 2).toUpperCase()}
                    </div>
                    <ChevronDown class="h-4 w-4" />
                  </button>
                  
                  {dropdownOpen && (
                    <div class="absolute right-0 mt-2 w-52 rounded-xl border border-gray-100 bg-white p-2 shadow-2xl transition-all dark:border-gray-800 dark:bg-brand-indigo">
                      <div class="border-b border-gray-100 p-2 text-xs font-semibold text-gray-500 dark:border-gray-800 dark:text-gray-400">
                        Hello, {user.name}
                      </div>
                      
                      <Link
                        to="/profile"
                        onClick={() => setDropdownOpen(false)}
                        class="flex items-center gap-2 rounded-lg p-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-brand-gold dark:text-gray-300 dark:hover:bg-brand-dark"
                      >
                        <UserCircle class="h-4 w-4" />
                        My Profile
                      </Link>

                      <Link
                        to="/orders"
                        onClick={() => setDropdownOpen(false)}
                        class="flex items-center gap-2 rounded-lg p-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-brand-gold dark:text-gray-300 dark:hover:bg-brand-dark"
                      >
                        <ShoppingBagIcon class="h-4 w-4" />
                        My Orders
                      </Link>

                      {user.isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setDropdownOpen(false)}
                          class="flex items-center gap-2 rounded-lg p-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-brand-gold dark:text-gray-300 dark:hover:bg-brand-dark"
                        >
                          <LayoutDashboard class="h-4 w-4" />
                          Admin Dashboard
                        </Link>
                      )}

                      <button
                        onClick={() => {
                          logout();
                          setDropdownOpen(false);
                        }}
                        class="flex w-full items-center gap-2 rounded-lg p-2 text-left text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
                      >
                        <LogOut class="h-4 w-4" />
                        Log Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  class="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-brand-gold to-brand-goldlight px-4 py-1.5 text-xs font-semibold text-brand-dark shadow hover:brightness-105"
                >
                  <User class="h-3.5 w-3.5" />
                  Sign In
                </Link>
              )}
            </div>

          </div>

          {/* Mobile responsive hamburger */}
          <div class="flex items-center gap-2 lg:hidden">
            
            {/* Dark mode button for mobile */}
            <button
              onClick={toggleTheme}
              class="rounded-full p-2 text-gray-500 dark:text-gray-400"
              aria-label="Toggle Theme"
            >
              {darkMode ? <Sun class="h-5 w-5" /> : <Moon class="h-5 w-5" />}
            </button>

            {/* Mobile shopping cart icon */}
            <Link to="/cart" class="relative rounded-full p-2 text-gray-500 dark:text-gray-400">
              <ShoppingBag class="h-5 w-5" />
              {cartCount > 0 && (
                <span class="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-gold text-[9px] font-bold text-brand-dark">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Hamburger button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              class="rounded-md p-2 text-gray-600 hover:text-brand-gold dark:text-gray-300"
              aria-label="Open Menu"
            >
              {mobileMenuOpen ? <X class="h-6 w-6" /> : <Menu class="h-6 w-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Panel Drawer */}
      {mobileMenuOpen && (
        <div class="lg:hidden border-t border-gray-100 bg-white/95 py-3 dark:border-gray-800 dark:bg-brand-indigo/95">
          <div class="space-y-1 px-4">
            
            {/* Mobile Search input */}
            <form onSubmit={handleSearchSubmit} class="relative mb-3">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                class="w-full rounded-full border border-gray-300/60 bg-gray-50 px-4 py-1.5 pl-10 text-xs dark:border-gray-800 dark:bg-brand-dark dark:text-white"
              />
              <Search class="absolute left-3.5 top-2.5 h-3.5 w-3.5 text-gray-400" />
            </form>

            {/* Mobile links */}
            {categories.map((cat) => (
              <Link
                key={cat}
                to={cat === 'All' ? '/shop' : `/shop?category=${cat}`}
                onClick={() => setMobileMenuOpen(false)}
                class="block rounded-lg px-3 py-2 text-base font-semibold text-gray-700 hover:bg-gray-50 hover:text-brand-gold dark:text-gray-300 dark:hover:bg-brand-dark"
              >
                {cat}
              </Link>
            ))}

            {/* Profiles & Admin for mobile */}
            <hr class="my-2 border-gray-100 dark:border-gray-800" />
            {user ? (
              <>
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  class="block rounded-lg px-3 py-2 text-base font-semibold text-gray-700 hover:bg-gray-50 hover:text-brand-gold dark:text-gray-300 dark:hover:bg-brand-dark"
                >
                  My Profile
                </Link>
                <Link
                  to="/orders"
                  onClick={() => setMobileMenuOpen(false)}
                  class="block rounded-lg px-3 py-2 text-base font-semibold text-gray-700 hover:bg-gray-50 hover:text-brand-gold dark:text-gray-300 dark:hover:bg-brand-dark"
                >
                  My Orders
                </Link>
                {user.isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    class="block rounded-lg px-3 py-2 text-base font-semibold text-brand-gold hover:bg-gray-50 dark:hover:bg-brand-dark"
                  >
                    Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  class="block w-full rounded-lg px-3 py-2 text-left text-base font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
                >
                  Log Out
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                class="block rounded-lg bg-gradient-to-r from-brand-gold to-brand-goldlight py-2 text-center text-base font-semibold text-brand-dark"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
