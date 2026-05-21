import React, { useState, useEffect, useRef, useContext } from 'react';
import { Sparkles, MessageSquare, X, Send, ShoppingBag, ArrowRight } from 'lucide-react';
import { CartContext } from '../context/CartContext.jsx';
import API from '../utils/api.js';

const ChatBot = () => {
  const { addToCart } = useContext(CartContext);
  
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'ai',
      text: "Hello! I'm **NV Stylist**, your premium AI Fashion Consultant. ✨\n\nWhat kind of wardrobe updates are you looking for today? Tell me your preferred styles, colors, occasions, or ask me for matching outfit ideas!",
      products: [],
    },
  ]);

  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of chat window
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessageText = input.trim();
    setInput('');
    
    // 1. Append user message
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        sender: 'user',
        text: userMessageText,
      },
    ]);

    setLoading(true);

    try {
      // 2. Fetch AI answers
      const { data } = await API.post('/api/ai/chat', { message: userMessageText });
      
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: data.reply || 'Apologies, I encountered an issue matching clothing items. Let me try again!',
          products: data.products || [],
        },
      ]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: 'Deepest apologies! The NV Stylist servers are currently busy updating autumn collections. Please try your request again shortly.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAdd = (product) => {
    const size = product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'One-Size';
    const color = product.colors && product.colors.length > 0 ? product.colors[0] : 'Standard';
    addToCart(product, 1, size, color);
    alert(`${product.name} added to cart straight from chat! 🛍️`);
  };

  return (
    <div class="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      
      {/* Floating Animated Widget Capsule */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          class="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-brand-gold via-brand-goldlight to-brand-gold text-brand-dark shadow-2xl hover:scale-110 transition-all duration-300 glow-animation hover:brightness-105"
          aria-label="Chat with AI Stylist"
        >
          <Sparkles class="h-6 w-6" />
        </button>
      )}

      {/* Expanded Glassmorphic Chat Widget Screen */}
      {isOpen && (
        <div class="glass-card flex h-[500px] w-[350px] sm:w-[380px] flex-col overflow-hidden rounded-2xl border border-brand-gold/20 shadow-2xl transition-all duration-300">
          
          {/* Header */}
          <div class="flex items-center justify-between bg-gradient-to-r from-brand-indigo to-brand-dark px-4 py-3.5 text-white">
            <div class="flex items-center gap-2">
              <div class="flex h-8 w-8 items-center justify-center rounded-full bg-brand-gold text-brand-dark">
                <Sparkles class="h-4.5 w-4.5" />
              </div>
              <div>
                <h3 class="font-display text-sm font-semibold tracking-wider">
                  NV STYLIST
                </h3>
                <span class="text-[9px] font-bold text-brand-gold uppercase tracking-widest">
                  AI Fashion Consultant
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              class="rounded-full p-1 text-gray-400 hover:bg-gray-800 hover:text-white"
              aria-label="Close Chat"
            >
              <X class="h-5 w-5" />
            </button>
          </div>

          {/* Chat Messages Body */}
          <div class="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50 dark:bg-brand-indigo/10">
            {messages.map((msg) => (
              <div
                key={msg.id}
                class={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div class="flex items-center gap-1.5 mb-1 text-[10px] text-gray-400 font-semibold px-1">
                  {msg.sender === 'ai' ? 'NV STYLIST' : 'YOU'}
                </div>
                
                {/* Bubble Text */}
                <div
                  class={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-brand-gold text-brand-dark font-medium rounded-tr-none shadow-sm'
                      : 'bg-white border border-gray-100 dark:bg-brand-dark dark:border-gray-800/60 dark:text-gray-200 rounded-tl-none shadow-glass-light'
                  }`}
                  style={{ whiteSpace: 'pre-line' }}
                >
                  {msg.text}
                </div>

                {/* Inline Product Cards Rendering */}
                {msg.sender === 'ai' && msg.products && msg.products.length > 0 && (
                  <div class="mt-3 w-full space-y-2">
                    <span class="text-[10px] font-bold text-brand-gold tracking-wider uppercase block">
                      Recommended Outfits:
                    </span>
                    <div class="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none snap-x snap-mandatory">
                      {msg.products.map((prod) => (
                        <div
                          key={prod._id}
                          class="flex-shrink-0 w-[180px] snap-center rounded-xl border border-gray-100 bg-white p-2.5 dark:border-gray-800 dark:bg-brand-dark shadow-sm"
                        >
                          <img
                            src={prod.images[0]}
                            alt={prod.name}
                            class="h-20 w-full object-cover rounded-lg mb-2"
                          />
                          <h4 class="text-[11px] font-bold text-gray-800 dark:text-white line-clamp-1">
                            {prod.name}
                          </h4>
                          <div class="flex items-center justify-between mt-2">
                            <span class="text-[11px] font-bold text-brand-gold">
                              ${prod.price}
                            </span>
                            <button
                              onClick={() => handleQuickAdd(prod)}
                              class="flex items-center gap-1 rounded-full bg-gradient-to-r from-brand-gold to-brand-goldlight px-2 py-1 text-[9px] font-bold text-brand-dark shadow-sm hover:brightness-105"
                            >
                              <ShoppingBag class="h-2.5 w-2.5" />
                              Add
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            ))}

            {/* Typing Indicator */}
            {loading && (
              <div class="flex flex-col items-start">
                <div class="flex items-center gap-1.5 mb-1 text-[10px] text-gray-400 font-semibold px-1">
                  NV STYLIST TYPING...
                </div>
                <div class="flex gap-1.5 rounded-full bg-white dark:bg-brand-dark px-4 py-3 shadow-glass-light border dark:border-gray-800">
                  <div class="h-2 w-2 animate-bounce rounded-full bg-brand-gold"></div>
                  <div class="h-2 w-2 animate-bounce rounded-full bg-brand-gold [animation-delay:0.2s]"></div>
                  <div class="h-2 w-2 animate-bounce rounded-full bg-brand-gold [animation-delay:0.4s]"></div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Inputs */}
          <form onSubmit={handleSend} class="flex items-center border-t border-gray-100 dark:border-gray-800 p-2.5 bg-white dark:bg-brand-dark">
            <input
              type="text"
              placeholder="Ask NV Stylist anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              class="flex-1 rounded-full border border-gray-200 px-4 py-2 text-xs focus:border-brand-gold focus:outline-none dark:border-gray-800 dark:bg-brand-indigo/30 dark:text-white"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              class="ml-2 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-brand-gold to-brand-goldlight text-brand-dark transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              <Send class="h-3.5 w-3.5" />
            </button>
          </form>

        </div>
      )}

    </div>
  );
};

export default ChatBot;
