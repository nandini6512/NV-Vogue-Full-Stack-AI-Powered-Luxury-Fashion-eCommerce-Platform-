import React, { createContext, useState, useEffect } from 'react';
import API from '../utils/api.js';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sync state with localstorage on load
  useEffect(() => {
    const storedUser = localStorage.getItem('nv_vogue_user_info');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Login handler
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await API.post('/api/auth/login', { email, password });
      setUser(data);
      localStorage.setItem('nv_vogue_user_info', JSON.stringify(data));
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed, check credentials';
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  // Registration handler
  const register = async (name, email, password) => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await API.post('/api/auth/register', { name, email, password });
      setUser(data);
      localStorage.setItem('nv_vogue_user_info', JSON.stringify(data));
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed';
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  // Profile update handler
  const updateProfile = async (profileData) => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await API.put('/api/auth/profile', profileData);
      
      // Retain token in updated state
      const updatedUser = { ...data, token: user.token };
      setUser(updatedUser);
      localStorage.setItem('nv_vogue_user_info', JSON.stringify(updatedUser));
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update profile';
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  // Add address handler
  const addAddress = async (addressData) => {
    try {
      setError(null);
      const { data } = await API.post('/api/auth/addresses', addressData);
      const updatedUser = { ...user, addresses: data };
      setUser(updatedUser);
      localStorage.setItem('nv_vogue_user_info', JSON.stringify(updatedUser));
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to add address';
      setError(msg);
      return { success: false, message: msg };
    }
  };

  // Delete address handler
  const removeAddress = async (addressId) => {
    try {
      setError(null);
      const { data } = await API.delete(`/api/auth/addresses/${addressId}`);
      const updatedUser = { ...user, addresses: data };
      setUser(updatedUser);
      localStorage.setItem('nv_vogue_user_info', JSON.stringify(updatedUser));
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to remove address';
      setError(msg);
      return { success: false, message: msg };
    }
  };

  // Toggle wishlist handler
  const toggleWishlistItem = async (productId) => {
    try {
      if (!user) return { success: false, message: 'Must be logged in' };
      const { data } = await API.post('/api/auth/wishlist', { productId });
      
      // Update wishlist array in state
      const updatedUser = { ...user, wishlist: data };
      setUser(updatedUser);
      localStorage.setItem('nv_vogue_user_info', JSON.stringify(updatedUser));
      return { success: true };
    } catch (err) {
      console.error(err);
      return { success: false };
    }
  };

  // Logout handler
  const logout = () => {
    setUser(null);
    localStorage.removeItem('nv_vogue_user_info');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        updateProfile,
        addAddress,
        removeAddress,
        toggleWishlistItem,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
