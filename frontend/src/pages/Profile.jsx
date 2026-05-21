import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Lock, Mail, MapPin, Plus, Trash2, Home } from 'lucide-react';
import { AuthContext } from '../context/AuthContext.jsx';

const Profile = () => {
  const { user, updateProfile, addAddress, removeAddress } = useContext(AuthContext);

  // Profile forms
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profileMsg, setProfileMsg] = useState('');
  const [profileSuccess, setProfileSuccess] = useState(false);

  // Address forms
  const [newAddrOpen, setNewAddrOpen] = useState(false);
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('USA');

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (password && password !== confirmPassword) {
      setProfileMsg("Passwords do not match!");
      setProfileSuccess(false);
      return;
    }

    const res = await updateProfile({ name, email, password });
    setProfileSuccess(res.success);
    setProfileMsg(res.success ? 'Profile successfully updated!' : res.message);
    setPassword('');
    setConfirmPassword('');
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    if (!street || !city || !state || !postalCode) return;

    const res = await addAddress({ street, city, state, postalCode, country });
    if (res.success) {
      setNewAddrOpen(false);
      setStreet('');
      setCity('');
      setState('');
      setPostalCode('');
      alert('Address registered successfully!');
    }
  };

  const handleDeleteAddress = async (id) => {
    if (window.confirm('Delete this shipping address?')) {
      await removeAddress(id);
    }
  };

  if (!user) {
    return (
      <div class="flex min-h-screen flex-col items-center justify-center gap-4 text-center">
        <span class="text-3xl">🔒</span>
        <h2 class="text-lg font-bold text-gray-800 dark:text-white uppercase font-display">Protected Profile</h2>
        <p class="text-xs text-gray-400">Please sign in to manage your profile.</p>
        <Link to="/login" class="btn-gold text-xs">Sign In</Link>
      </div>
    );
  }

  return (
    <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 min-h-screen">
      
      <h1 class="font-display text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white uppercase tracking-tight mb-8">
        Your Account Profile
      </h1>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* A. Left Columns: Profile update Form */}
        <div class="lg:col-span-1 rounded-2xl border border-gray-200/50 bg-white/75 p-6 dark:border-gray-800/40 dark:bg-brand-indigo/60 shadow-sm h-fit space-y-4">
          <h2 class="font-display text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider border-b pb-2 dark:border-gray-800 flex items-center gap-1.5">
            <User class="h-4.5 w-4.5 text-brand-gold" /> Personal Credentials
          </h2>

          <form onSubmit={handleProfileSubmit} class="space-y-4">
            
            <div class="space-y-1">
              <label class="text-[10px] font-bold text-gray-400 uppercase">Username Name:</label>
              <div class="relative">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  class="w-full rounded-lg border border-gray-200 px-3 py-1.5 pl-8 text-xs focus:border-brand-gold focus:outline-none dark:border-gray-800 dark:bg-brand-dark"
                />
                <User class="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-gray-400" />
              </div>
            </div>

            <div class="space-y-1">
              <label class="text-[10px] font-bold text-gray-400 uppercase">Email Address:</label>
              <div class="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  class="w-full rounded-lg border border-gray-200 px-3 py-1.5 pl-8 text-xs focus:border-brand-gold focus:outline-none dark:border-gray-800 dark:bg-brand-dark"
                />
                <Mail class="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-gray-400" />
              </div>
            </div>

            <div class="space-y-1">
              <label class="text-[10px] font-bold text-gray-400 uppercase">Update Password (Optional):</label>
              <div class="relative">
                <input
                  type="password"
                  placeholder="Leave blank to preserve current"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  class="w-full rounded-lg border border-gray-200 px-3 py-1.5 pl-8 text-xs focus:border-brand-gold focus:outline-none dark:border-gray-800 dark:bg-brand-dark"
                />
                <Lock class="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-gray-400" />
              </div>
            </div>

            <div class="space-y-1">
              <label class="text-[10px] font-bold text-gray-400 uppercase">Confirm Password:</label>
              <div class="relative">
                <input
                  type="password"
                  placeholder="Repeat new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  class="w-full rounded-lg border border-gray-200 px-3 py-1.5 pl-8 text-xs focus:border-brand-gold focus:outline-none dark:border-gray-800 dark:bg-brand-dark"
                />
                <Lock class="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-gray-400" />
              </div>
            </div>

            <button
              type="submit"
              class="w-full btn-gold py-2 text-xs uppercase font-semibold"
            >
              Update Credentials
            </button>

          </form>

          {profileMsg && (
            <span class={`text-[10px] font-bold block mt-2 text-center uppercase ${profileSuccess ? 'text-green-500' : 'text-brand-rose'}`}>
              {profileMsg}
            </span>
          )}

        </div>

        {/* B. Right Columns: Address Manager */}
        <div class="lg:col-span-2 space-y-6">
          <div class="flex items-center justify-between border-b pb-3 dark:border-gray-800">
            <h2 class="font-display text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <MapPin class="h-4.5 w-4.5 text-brand-gold" /> Address Registry ({user.addresses?.length})
            </h2>
            
            {!newAddrOpen && (
              <button
                onClick={() => setNewAddrOpen(true)}
                class="flex items-center gap-1 text-xs font-bold text-brand-gold uppercase hover:brightness-105"
              >
                <Plus class="h-4 w-4" /> Add Address
              </button>
            )}
          </div>

          {/* New address form */}
          {newAddrOpen && (
            <form onSubmit={handleAddAddress} class="rounded-2xl border border-gray-200 bg-white/70 p-6 dark:border-gray-800 dark:bg-brand-indigo/40 space-y-4">
              <h3 class="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">Register Shipping Address</h3>
              
              <div class="space-y-1">
                <label class="text-[10px] font-bold text-gray-400 uppercase">Street Address:</label>
                <input
                  type="text"
                  placeholder="e.g. 100 Haute Couture Blvd"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  required
                  class="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-xs dark:border-gray-800 dark:bg-brand-dark"
                />
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-1">
                  <label class="text-[10px] font-bold text-gray-400 uppercase">City:</label>
                  <input
                    type="text"
                    placeholder="e.g. New York"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                    class="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-xs dark:border-gray-800 dark:bg-brand-dark"
                  />
                </div>
                <div class="space-y-1">
                  <label class="text-[10px] font-bold text-gray-400 uppercase">State / Region:</label>
                  <input
                    type="text"
                    placeholder="e.g. NY"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    required
                    class="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-xs dark:border-gray-800 dark:bg-brand-dark"
                  />
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-1">
                  <label class="text-[10px] font-bold text-gray-400 uppercase">Postal Code:</label>
                  <input
                    type="text"
                    placeholder="e.g. 10001"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    required
                    class="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-xs dark:border-gray-800 dark:bg-brand-dark"
                  />
                </div>
                <div class="space-y-1">
                  <label class="text-[10px] font-bold text-gray-400 uppercase">Country:</label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    required
                    class="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-xs dark:border-gray-800 dark:bg-brand-dark"
                  />
                </div>
              </div>

              <div class="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setNewAddrOpen(false)}
                  class="text-xs text-gray-500 hover:text-red-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  class="btn-gold py-1.5 px-4 text-xs font-semibold uppercase"
                >
                  Save Address
                </button>
              </div>
            </form>
          )}

          {/* List existing addresses */}
          {user.addresses?.length === 0 ? (
            <p class="text-xs text-gray-500">No registered address locations found. Add one to expedite checkouts!</p>
          ) : (
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {user.addresses.map((addr) => (
                <div
                  key={addr._id}
                  class="p-4 rounded-xl border border-gray-100 bg-white dark:border-gray-800 dark:bg-brand-indigo/30 shadow-sm flex flex-col justify-between"
                >
                  <div class="space-y-1">
                    <div class="flex items-center justify-between mb-2">
                      <span class="text-[9px] font-bold text-gray-400 uppercase flex items-center gap-1">
                        <Home class="h-3 w-3 text-brand-gold" /> HOME
                      </span>
                      
                      <button
                        onClick={() => handleDeleteAddress(addr._id)}
                        class="text-gray-400 hover:text-red-500 transition-colors"
                        title="Delete Address"
                      >
                        <Trash2 class="h-4 w-4" />
                      </button>
                    </div>
                    
                    <p class="text-xs text-gray-700 dark:text-gray-300 font-semibold">{addr.street}</p>
                    <p class="text-[11px] text-gray-500 dark:text-gray-400">{addr.city}, {addr.state} - {addr.postalCode}</p>
                    <p class="text-[10px] text-gray-400 font-bold uppercase mt-1">{addr.country}</p>
                  </div>

                  {addr.isDefault && (
                    <span class="text-[9px] font-bold text-brand-gold uppercase block mt-2 text-right">Default Address</span>
                  )}
                </div>
              ))}
            </div>
          )}

        </div>

      </div>

    </div>
  );
};

export default Profile;
