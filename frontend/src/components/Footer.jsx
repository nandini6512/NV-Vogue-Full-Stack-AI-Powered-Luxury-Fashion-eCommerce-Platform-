import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Instagram, Facebook, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer class="border-t border-gray-200/50 bg-gray-50 text-gray-600 transition-colors duration-300 dark:border-gray-800/40 dark:bg-brand-dark dark:text-gray-400">
      <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 gap-8 md:grid-cols-4">
          
          {/* Column 1: Brand & Logo */}
          <div class="space-y-4">
            <div class="flex items-center gap-2 font-display text-xl font-bold text-gray-900 dark:text-white">
              <img src="/src/assets/logo.svg" alt="NV Logo" class="h-8 w-8" />
              <span class="bg-gradient-to-r from-brand-gold via-brand-goldlight to-brand-gold bg-clip-text text-transparent">
                NV VOGUE
              </span>
            </div>
            <p class="text-xs leading-relaxed text-gray-500 dark:text-gray-400">
              An international premium fashion eCommerce platform powered by conversational AI stylist recommendations. Curating top-tier quality fabric silhouettes for global trendsetters.
            </p>
            <div class="flex gap-4">
              <a href="#" class="text-gray-400 hover:text-brand-gold"><Instagram class="h-4.5 w-4.5" /></a>
              <a href="#" class="text-gray-400 hover:text-brand-gold"><Facebook class="h-4.5 w-4.5" /></a>
              <a href="#" class="text-gray-400 hover:text-brand-gold"><Twitter class="h-4.5 w-4.5" /></a>
            </div>
          </div>

          {/* Column 2: Quick Shop Links */}
          <div>
            <h3 class="font-display text-sm font-semibold tracking-wider text-gray-900 dark:text-white">
              SHOP DEPARTMENTS
            </h3>
            <ul class="mt-4 space-y-2 text-xs">
              <li><Link to="/shop?category=Women" class="hover:text-brand-gold">Women's Wear</Link></li>
              <li><Link to="/shop?category=Men" class="hover:text-brand-gold">Men's Wear</Link></li>
              <li><Link to="/shop?category=Kids" class="hover:text-brand-gold">Kids Wardrobe</Link></li>
              <li><Link to="/shop?category=Jeans" class="hover:text-brand-gold">Designer Denim</Link></li>
              <li><Link to="/shop?category=Shoes" class="hover:text-brand-gold">Footwear Collection</Link></li>
              <li><Link to="/shop?category=Accessories" class="hover:text-brand-gold">Accessories & Watches</Link></li>
            </ul>
          </div>

          {/* Column 3: Corporate Info */}
          <div>
            <h3 class="font-display text-sm font-semibold tracking-wider text-gray-900 dark:text-white">
              CUSTOMER ASSISTANCE
            </h3>
            <ul class="mt-4 space-y-2 text-xs">
              <li><a href="#" class="hover:text-brand-gold">Track Order Status</a></li>
              <li><a href="#" class="hover:text-brand-gold">Returns & Size Exchanges</a></li>
              <li><a href="#" class="hover:text-brand-gold">Shipping Speeds & Rates</a></li>
              <li><a href="#" class="hover:text-brand-gold">Corporate Sustainability</a></li>
              <li><a href="#" class="hover:text-brand-gold">Privacy Policy & Terms</a></li>
            </ul>
          </div>

          {/* Column 4: Contact details */}
          <div>
            <h3 class="font-display text-sm font-semibold tracking-wider text-gray-900 dark:text-white">
              CONTACT NV LUXE
            </h3>
            <ul class="mt-4 space-y-3 text-xs">
              <li class="flex items-center gap-2">
                <MapPin class="h-4 w-4 text-brand-gold" />
                <span>100 Haute Couture Blvd, New York, NY</span>
              </li>
              <li class="flex items-center gap-2">
                <Phone class="h-4 w-4 text-brand-gold" />
                <span>+1 (800) 555-VOGUE</span>
              </li>
              <li class="flex items-center gap-2">
                <Mail class="h-4 w-4 text-brand-gold" />
                <span>concierge@nvvogue.com</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Horizontal dividing line & Payment logs */}
        <hr class="my-8 border-gray-200 dark:border-gray-800" />

        <div class="flex flex-col items-center justify-between gap-4 sm:flex-row text-xs text-gray-400">
          <div>
            &copy; {new Date().getFullYear()} NV Vogue International Inc. All rights reserved. Created with absolute passion.
          </div>
          
          {/* Payment Gateway Mock Symbols */}
          <div class="flex gap-3 items-center opacity-60">
            <span class="rounded bg-white px-2 py-0.5 text-[9px] font-bold text-gray-900 border">VISA</span>
            <span class="rounded bg-white px-2 py-0.5 text-[9px] font-bold text-gray-900 border">MC</span>
            <span class="rounded bg-white px-2 py-0.5 text-[9px] font-bold text-gray-900 border">AMEX</span>
            <span class="rounded bg-white px-2 py-0.5 text-[9px] font-bold text-gray-900 border">PAYPAL</span>
            <span class="rounded bg-white px-2 py-0.5 text-[9px] font-bold text-gray-900 border">APPLE PAY</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
