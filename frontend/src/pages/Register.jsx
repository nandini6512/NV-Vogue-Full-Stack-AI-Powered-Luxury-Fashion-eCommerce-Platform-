import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, UserPlus } from 'lucide-react';
import { AuthContext } from '../context/AuthContext.jsx';

const Register = () => {
  const navigate = useNavigate();
  const { user, register, loading, error } = useContext(AuthContext);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [authMsg, setAuthMsg] = useState('');

  // Redirect if logged in
  useEffect(() => {
    if (user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) return;

    if (password !== confirmPassword) {
      setAuthMsg("Passwords do not match!");
      return;
    }

    setAuthMsg('');
    const res = await register(name, email, password);
    if (!res.success) {
      setAuthMsg(res.message);
    }
  };

  return (
    <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4 dark:bg-brand-dark transition-colors duration-300">
      
      {/* Premium Glassmorphic Registration Card */}
      <div class="glass-card w-full max-w-md rounded-3xl p-8 border border-brand-gold/15 shadow-2xl relative overflow-hidden space-y-6">
        
        <div class="absolute h-48 w-48 rounded-full bg-brand-gold/5 -right-16 -top-16" />
        
        <div class="text-center space-y-2">
          <Link to="/" class="inline-flex items-center gap-2 font-display text-2xl font-bold tracking-wider text-gray-900 dark:text-white">
            <img src="/src/assets/logo.svg" alt="NV Logo" class="h-8 w-8" />
            <span class="bg-gradient-to-r from-brand-gold via-brand-goldlight to-brand-gold bg-clip-text text-transparent">NV VOGUE</span>
          </Link>
          <h2 class="font-display text-xl font-bold text-gray-800 dark:text-white uppercase tracking-wider">
            Register Account
          </h2>
          <p class="text-xs text-gray-400">Join the NV Vogue inner circle and discover custom-styled couture.</p>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} class="space-y-4">
          
          <div class="space-y-1">
            <label class="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Username Name:</label>
            <div class="relative">
              <input
                type="text"
                placeholder="e.g. Alex Morgan"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                class="w-full rounded-lg border border-gray-200 px-3 py-2 pl-8 text-xs focus:border-brand-gold focus:outline-none dark:border-gray-800 dark:bg-brand-dark"
              />
              <User class="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            </div>
          </div>

          <div class="space-y-1">
            <label class="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Email Address:</label>
            <div class="relative">
              <input
                type="email"
                placeholder="customer@nv.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                class="w-full rounded-lg border border-gray-200 px-3 py-2 pl-8 text-xs focus:border-brand-gold focus:outline-none dark:border-gray-800 dark:bg-brand-dark"
              />
              <Mail class="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            </div>
          </div>

          <div class="space-y-1">
            <label class="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Password:</label>
            <div class="relative">
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                class="w-full rounded-lg border border-gray-200 px-3 py-2 pl-8 text-xs focus:border-brand-gold focus:outline-none dark:border-gray-800 dark:bg-brand-dark"
              />
              <Lock class="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            </div>
          </div>

          <div class="space-y-1">
            <label class="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Confirm Password:</label>
            <div class="relative">
              <input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                class="w-full rounded-lg border border-gray-200 px-3 py-2 pl-8 text-xs focus:border-brand-gold focus:outline-none dark:border-gray-800 dark:bg-brand-dark"
              />
              <Lock class="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            class="w-full btn-gold h-11 flex items-center justify-center gap-1.5 uppercase font-semibold text-xs tracking-wider"
          >
            {loading ? (
              <span class="h-4 w-4 animate-spin rounded-full border-2 border-brand-dark border-t-transparent"></span>
            ) : (
              <>
                <UserPlus class="h-4.5 w-4.5" /> Sign Up
              </>
            )}
          </button>

        </form>

        {/* Display backend error message */}
        {(authMsg || error) && (
          <span class="text-[10px] font-bold block text-center text-brand-rose uppercase tracking-wider">
            {authMsg || error}
          </span>
        )}

        <div class="text-center text-xs text-gray-500">
          Already have an account?{' '}
          <Link to="/login" class="text-brand-gold font-bold hover:underline uppercase tracking-wide">
            Sign In
          </Link>
        </div>

      </div>

    </div>
  );
};

export default Register;
