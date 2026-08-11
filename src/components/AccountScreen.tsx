import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UserCircle, Package, Heart, LogOut, Edit3, ChevronRight, 
  Camera, MapPin, Plus, Lock, Settings, X, Loader2, 
  Trash2, Mail, Phone, Home as HomeIcon, Shield, Bell, Check
} from 'lucide-react';
import { User, Order, Product, Address } from '../types';
import { AccountService } from '../services/accountService';
import { changeUserPassword } from '../lib/supabase';

interface AccountScreenProps {
  currentUser: User | null;
  onUpdateUser: (user: User) => void;
  onLogout: () => void;
  wishlistProducts: Product[];
  onToggleWishlist: (product: Product) => void;
  onAddToCart: (product: Product, weight: string, price: number) => void;
  orders: Order[];
  onOpenAuthModal: () => void;
}

export default function AccountScreen({ 
  currentUser, 
  onUpdateUser,
  onLogout, 
  wishlistProducts,
  onToggleWishlist,
  onAddToCart,
  orders, 
  onOpenAuthModal 
}: AccountScreenProps) {
  
  if (!currentUser) return null;

  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Modals state
  const [activeModal, setActiveModal] = useState<'editProfile' | 'address' | 'password' | null>(null);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  
  // Loading states
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Forms state
  const [profileForm, setProfileForm] = useState({
    fullName: currentUser.fullName || '',
    mobile: currentUser.mobile || '',
  });
  
  // Image Preview state
  const [previewImage, setPreviewImage] = useState<{ url: string, file: File } | null>(null);
  
  const [addressForm, setAddressForm] = useState<Partial<Address>>({
    fullName: '', mobile: '', streetAddress: '', apartment: '', city: '', state: '', pincode: '', isDefault: false
  });
  
  const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' });
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Wishlist states
  const [showEmptyWishlistMsg, setShowEmptyWishlistMsg] = useState(true);
  const [showWishlistModal, setShowWishlistModal] = useState(false);

  // Watch for wishlist empty state
  React.useEffect(() => {
    if (wishlistProducts.length === 0 && showWishlistModal) {
      setShowWishlistModal(false);
      setShowEmptyWishlistMsg(true);
    }
  }, [wishlistProducts.length, showWishlistModal]);

  const recentOrders = [...orders].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 3);
  const savedAddresses = currentUser.savedAddresses || [];
  const preferences = currentUser.preferences || { orderUpdates: true, emailNotifications: true, marketingOffers: false };

  // Helper for messages
  const showMessage = (msg: string, type: 'success' | 'error') => {
    if (type === 'success') setSuccessMsg(msg);
    else setErrorMsg(msg);
    setTimeout(() => { setSuccessMsg(''); setErrorMsg(''); }, 3000);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      showMessage('Please select a JPG, PNG or WEBP image.', 'error');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      showMessage('Image must be under 2MB', 'error');
      return;
    }

    // Clean up old object URL if exists
    if (previewImage) {
      URL.revokeObjectURL(previewImage.url);
    }
    
    setPreviewImage({
      url: URL.createObjectURL(file),
      file
    });
    
    // Reset file input so selecting the same file again triggers onChange
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleConfirmImage = async () => {
    if (!previewImage) return;

    setIsUploading(true);
    try {
      const avatarUrl = await AccountService.uploadProfileImage(previewImage.file, currentUser.id);
      const success = await AccountService.updateProfile(currentUser.id, { avatarUrl });
      if (success) {
        onUpdateUser({ ...currentUser, avatarUrl });
        showMessage('Profile picture updated', 'success');
      } else {
        showMessage('Failed to save profile picture', 'error');
      }
    } catch (err) {
      showMessage('Upload failed. Please try again.', 'error');
    } finally {
      setIsUploading(false);
      URL.revokeObjectURL(previewImage.url);
      setPreviewImage(null);
    }
  };

  const handleCancelImage = () => {
    if (previewImage) {
      URL.revokeObjectURL(previewImage.url);
    }
    setPreviewImage(null);
  };

  const handleRemoveImage = async () => {
    setIsUploading(true);
    try {
      const success = await AccountService.updateProfile(currentUser.id, { avatarUrl: undefined });
      if (success) {
        const updatedUser = { ...currentUser };
        delete updatedUser.avatarUrl;
        onUpdateUser(updatedUser);
        showMessage('Profile picture removed', 'success');
      }
    } catch (err) {
      showMessage('Failed to remove image', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!profileForm.fullName.trim()) return showMessage('Name cannot be empty', 'error');
    
    setIsSaving(true);
    try {
      const success = await AccountService.updateProfile(currentUser.id, profileForm);
      if (success) {
        onUpdateUser({ ...currentUser, ...profileForm });
        showMessage('Profile updated successfully', 'success');
        setActiveModal(null);
      } else {
        showMessage('Failed to update profile', 'error');
      }
    } catch (err) {
      showMessage('Failed to update profile', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveAddress = async () => {
    if (!addressForm.fullName || !addressForm.streetAddress || !addressForm.city || !addressForm.pincode) {
      return showMessage('Please fill all required fields', 'error');
    }
    
    setIsSaving(true);
    try {
      let updatedAddresses = [...savedAddresses];
      const newAddress = {
        ...addressForm,
        id: editingAddressId || Math.random().toString(36).substring(7),
        isDefault: savedAddresses.length === 0 ? true : !!addressForm.isDefault
      } as Address;

      if (newAddress.isDefault) {
        updatedAddresses = updatedAddresses.map(a => ({ ...a, isDefault: false }));
      }

      if (editingAddressId) {
        updatedAddresses = updatedAddresses.map(a => a.id === editingAddressId ? newAddress : a);
      } else {
        updatedAddresses.push(newAddress);
      }

      const success = await AccountService.updateProfile(currentUser.id, { savedAddresses: updatedAddresses });
      if (success) {
        onUpdateUser({ ...currentUser, savedAddresses: updatedAddresses });
        showMessage(editingAddressId ? 'Address updated' : 'Address added', 'success');
        setActiveModal(null);
      } else {
        showMessage('Failed to save address', 'error');
      }
    } catch (err) {
      showMessage('Failed to save address', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAddress = async (id: string) => {
    const updatedAddresses = savedAddresses.filter(a => a.id !== id);
    if (updatedAddresses.length > 0 && !updatedAddresses.some(a => a.isDefault)) {
      updatedAddresses[0].isDefault = true;
    }
    
    try {
      const success = await AccountService.updateProfile(currentUser.id, { savedAddresses: updatedAddresses });
      if (success) onUpdateUser({ ...currentUser, savedAddresses: updatedAddresses });
    } catch (err) {
      showMessage('Failed to delete address', 'error');
    }
  };

  const handleTogglePreference = async (key: keyof typeof preferences) => {
    const updatedPreferences = { ...preferences, [key]: !preferences[key] };
    try {
      const success = await AccountService.updateProfile(currentUser.id, { preferences: updatedPreferences });
      if (success) onUpdateUser({ ...currentUser, preferences: updatedPreferences });
    } catch (err) {
      showMessage('Failed to update preferences', 'error');
    }
  };

  const handleChangePassword = async () => {
    if (passwordForm.new.length < 6) return showMessage('Password must be at least 6 characters', 'error');
    if (passwordForm.new !== passwordForm.confirm) return showMessage('Passwords do not match', 'error');
    
    setIsSaving(true);
    try {
      await changeUserPassword(passwordForm.new);
      showMessage('Password changed successfully', 'success');
      setActiveModal(null);
    } catch (err) {
      showMessage('Failed to change password. You may need to sign in again.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const openAddressModal = (addr?: Address) => {
    if (addr) {
      setAddressForm(addr);
      setEditingAddressId(addr.id);
    } else {
      setAddressForm({
        fullName: currentUser.fullName, mobile: currentUser.mobile, streetAddress: '', apartment: '', city: '', state: '', pincode: '', isDefault: false
      });
      setEditingAddressId(null);
    }
    setActiveModal('address');
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] pt-28 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-serif text-3xl md:text-4xl text-[#143A2A] mb-2">My Account</h1>
          <p className="text-stone-500 text-sm md:text-base">Manage your profile, orders and account preferences.</p>
        </div>

        <div className="grid lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT COLUMN: Main Info (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Personal Information */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-stone-100"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-lg font-bold text-[#143A2A] flex items-center gap-2">
                  <UserCircle className="w-5 h-5 text-[#7C8464]" />
                  Personal Information
                </h2>
                <button 
                  onClick={() => {
                    setProfileForm({ fullName: currentUser.fullName, mobile: currentUser.mobile });
                    setActiveModal('editProfile');
                  }}
                  className="text-sm font-semibold text-[#7C8464] hover:text-[#5A6342] flex items-center gap-1.5 transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                  <span className="hidden sm:inline">Edit Profile</span>
                </button>
              </div>

              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-10">
                {/* Avatar Section */}
                <div className="relative group shrink-0">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[#7C8464]/10 text-[#7C8464] flex items-center justify-center font-serif text-4xl shadow-inner overflow-hidden relative">
                    {isUploading ? (
                      <Loader2 className="w-8 h-8 animate-spin" />
                    ) : previewImage ? (
                      <img src={previewImage.url} alt="Preview" className="w-full h-full object-cover" />
                    ) : currentUser.avatarUrl ? (
                      <img src={currentUser.avatarUrl} alt={currentUser.fullName} className="w-full h-full object-cover" />
                    ) : (
                      currentUser.fullName.charAt(0).toUpperCase()
                    )}
                    
                    {/* Hover Overlay - only show if not in preview mode */}
                    {!previewImage && (
                      <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                           onClick={() => fileInputRef.current?.click()}>
                        <Camera className="w-6 h-6 text-white mb-1" />
                        <span className="text-[10px] text-white font-medium">Change</span>
                      </div>
                    )}
                  </div>
                  <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept="image/jpeg, image/png, image/webp" className="hidden" />
                  
                  {previewImage ? (
                    <div className="absolute -bottom-3 inset-x-0 mx-auto flex items-center justify-center gap-2">
                      <button 
                        type="button"
                        onClick={handleConfirmImage} 
                        className="w-8 h-8 rounded-full bg-[#143A2A] text-white shadow-md flex items-center justify-center hover:bg-[#1e4a38] transition-colors z-10"
                        title="Confirm"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button 
                        type="button"
                        onClick={handleCancelImage} 
                        className="w-8 h-8 rounded-full bg-white text-stone-500 shadow-md border border-stone-200 flex items-center justify-center hover:text-red-500 transition-colors z-10"
                        title="Cancel"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    currentUser.avatarUrl && !isUploading && (
                      <button onClick={handleRemoveImage} className="absolute -bottom-2 inset-x-0 mx-auto text-[10px] text-stone-500 hover:text-red-500 bg-white border border-stone-200 px-2 py-0.5 rounded-full shadow-sm w-max transition-colors z-10">
                        Remove
                      </button>
                    )
                  )}
                </div>

                {/* Info Fields */}
                <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8 text-center sm:text-left">
                  <div>
                    <p className="text-xs text-stone-400 font-bold uppercase tracking-wider mb-1.5 flex items-center justify-center sm:justify-start gap-1.5">
                      <UserCircle className="w-3.5 h-3.5" /> Full Name
                    </p>
                    <p className="text-stone-800 font-medium text-lg">{currentUser.fullName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-stone-400 font-bold uppercase tracking-wider mb-1.5 flex items-center justify-center sm:justify-start gap-1.5">
                      <Mail className="w-3.5 h-3.5" /> Email Address
                    </p>
                    <p className="text-stone-800 font-medium text-lg truncate">{currentUser.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-stone-400 font-bold uppercase tracking-wider mb-1.5 flex items-center justify-center sm:justify-start gap-1.5">
                      <Phone className="w-3.5 h-3.5" /> Phone Number
                    </p>
                    <p className="text-stone-800 font-medium text-lg">{currentUser.mobile || <span className="text-stone-300 italic">Not provided</span>}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* My Orders */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-stone-100"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-[#143A2A] flex items-center gap-2">
                  <Package className="w-5 h-5 text-[#7C8464]" />
                  Recent Orders
                </h2>
                <button 
                  onClick={() => window.location.href = '/account/orders'}
                  className="text-sm font-semibold text-[#7C8464] hover:text-[#5A6342] flex items-center gap-1 transition-colors"
                >
                  View All <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {recentOrders.length === 0 ? (
                <div className="text-center py-8 bg-stone-50/50 rounded-xl border border-stone-100 border-dashed">
                  <Package className="w-10 h-10 text-stone-300 mx-auto mb-3" />
                  <p className="text-stone-500 font-medium">No orders yet</p>
                  <p className="text-stone-400 text-sm mt-1 mb-4">When you place an order, it will appear here.</p>
                  <a href="/shop" className="text-sm font-bold text-[#143A2A] border-b border-[#143A2A] pb-0.5 hover:text-[#A85344] hover:border-[#A85344] transition-colors">Start Shopping</a>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentOrders.map(order => (
                    <div key={order.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-stone-100 hover:border-[#7C8464]/30 transition-colors gap-4">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 flex-1">
                        <div>
                          <p className="text-[10px] text-stone-400 font-bold uppercase mb-1">Order ID</p>
                          <p className="text-sm font-bold text-[#143A2A]">#{order.id.split('-')[0].toUpperCase()}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-stone-400 font-bold uppercase mb-1">Date</p>
                          <p className="text-sm text-stone-600 font-medium">{new Date(order.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-stone-400 font-bold uppercase mb-1">Total</p>
                          <p className="text-sm text-stone-600 font-medium">₹{order.total}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-stone-400 font-bold uppercase mb-1">Status</p>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${
                            order.status === 'Completed' || order.status === 'Delivered' ? 'bg-[#7C8464]/10 text-[#7C8464]' : 
                            order.status === 'Cancelled' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                      <a 
                        href={`/track-order?id=${order.id}`}
                        className="text-xs font-bold bg-stone-100 hover:bg-stone-200 text-stone-700 py-2 px-4 rounded-lg transition-colors text-center shrink-0"
                      >
                        View Order
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Saved Addresses */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-stone-100"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-[#143A2A] flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#7C8464]" />
                  Saved Addresses
                </h2>
                <button 
                  onClick={() => openAddressModal()}
                  className="text-sm font-semibold text-[#7C8464] hover:text-[#5A6342] flex items-center gap-1 transition-colors"
                >
                  <Plus className="w-4 h-4" /> Add New
                </button>
              </div>

              {savedAddresses.length === 0 ? (
                <div className="text-center py-8 bg-stone-50/50 rounded-xl border border-stone-100 border-dashed">
                  <HomeIcon className="w-10 h-10 text-stone-300 mx-auto mb-3" />
                  <p className="text-stone-500 font-medium mb-4">You haven't added a delivery address yet.</p>
                  <button 
                    onClick={() => openAddressModal()}
                    className="text-sm font-bold bg-[#143A2A] text-white py-2 px-5 rounded-full hover:bg-[#1e4a38] transition-colors"
                  >
                    Add Address
                  </button>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  {savedAddresses.map(addr => (
                    <div key={addr.id} className={`p-4 rounded-xl border ${addr.isDefault ? 'border-[#7C8464] bg-[#7C8464]/5' : 'border-stone-200'} relative group`}>
                      {addr.isDefault && (
                        <span className="absolute top-4 right-4 text-[10px] font-bold uppercase tracking-wider text-[#7C8464] bg-white px-2 py-0.5 rounded border border-[#7C8464]/20 shadow-sm">
                          Default
                        </span>
                      )}
                      <p className="font-bold text-[#143A2A] mb-1">{addr.fullName}</p>
                      <p className="text-sm text-stone-500 leading-relaxed mb-3">
                        {addr.streetAddress}<br/>
                        {addr.apartment && <>{addr.apartment}<br/></>}
                        {addr.city}, {addr.state} {addr.pincode}<br/>
                        Phone: {addr.mobile}
                      </p>
                      <div className="flex items-center gap-3">
                        <button onClick={() => openAddressModal(addr)} className="text-xs font-semibold text-stone-500 hover:text-[#143A2A] transition-colors">Edit</button>
                        <span className="w-1 h-1 rounded-full bg-stone-300"></span>
                        <button onClick={() => handleDeleteAddress(addr.id)} className="text-xs font-semibold text-stone-500 hover:text-red-600 transition-colors">Delete</button>
                        {!addr.isDefault && (
                          <>
                            <span className="w-1 h-1 rounded-full bg-stone-300"></span>
                            <button 
                              onClick={async () => {
                                const updated = savedAddresses.map(a => ({ ...a, isDefault: a.id === addr.id }));
                                const success = await AccountService.updateProfile(currentUser.id, { savedAddresses: updated });
                                if (success) onUpdateUser({ ...currentUser, savedAddresses: updated });
                              }}
                              className="text-xs font-semibold text-[#7C8464] hover:text-[#5A6342] transition-colors"
                            >
                              Set Default
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>

          {/* RIGHT COLUMN: Sidebar (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Wishlist Summary */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100 overflow-hidden relative"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-[#143A2A] flex items-center gap-2">
                  <Heart className="w-4 h-4 text-[#A85344]" /> My Wishlist
                </h3>
                <span className="text-xs font-bold bg-[#A85344]/10 text-[#A85344] px-2 py-0.5 rounded-full">
                  {wishlistProducts.length} Items
                </span>
              </div>
              
              <AnimatePresence mode="wait">
                {wishlistProducts.length === 0 ? (
                  showEmptyWishlistMsg && (
                    <motion.div 
                      key="empty-msg"
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      transition={{ duration: 0.3 }}
                      className="bg-red-50 border border-red-100 rounded-xl p-3 mb-4 flex items-start justify-between gap-3"
                    >
                      <p className="text-sm font-medium text-red-600 leading-snug">
                        Currently, you have no items in your wishlist.
                      </p>
                      <button 
                        onClick={() => setShowEmptyWishlistMsg(false)}
                        className="text-red-400 hover:text-red-600 transition-colors shrink-0 mt-0.5"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </motion.div>
                  )
                ) : (
                  <motion.div 
                    key="thumbnails"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="flex gap-2 mb-5 overflow-hidden"
                  >
                    {wishlistProducts.slice(0, 3).map(p => (
                      <div key={p.id} className="w-14 h-14 rounded-lg bg-stone-100 overflow-hidden shrink-0 border border-stone-200">
                        <img src={(p as any).images?.[0] || p.image || '/images/01.png'} alt={p.name} className="w-full h-full object-cover" />
                      </div>
                    ))}
                    {wishlistProducts.length > 3 && (
                      <div className="w-14 h-14 rounded-lg bg-stone-50 border border-stone-200 flex items-center justify-center text-xs font-bold text-stone-500 shrink-0">
                        +{wishlistProducts.length - 3}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
              
              <button 
                onClick={() => {
                  if (wishlistProducts.length > 0) {
                    setShowWishlistModal(true);
                  } else {
                    setShowEmptyWishlistMsg(true);
                  }
                }}
                className="w-full text-sm font-bold bg-stone-100 hover:bg-stone-200 text-stone-800 py-2.5 rounded-xl transition-colors"
              >
                View Wishlist
              </button>
            </motion.div>

            {/* Quick Actions */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100"
            >
              <h3 className="font-bold text-[#143A2A] mb-4">Quick Actions</h3>
              <div className="space-y-1">
                <a href="/account/orders" className="flex items-center justify-between p-3 rounded-xl hover:bg-stone-50 transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#7C8464]/10 text-[#7C8464] flex items-center justify-center group-hover:bg-[#7C8464] group-hover:text-white transition-colors">
                      <Package className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#143A2A]">My Orders</p>
                      <p className="text-xs text-stone-500">Track & manage</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-[#143A2A] transition-colors" />
                </a>
                
                <button 
                  onClick={() => {
                    if (wishlistProducts.length > 0) {
                      setShowWishlistModal(true);
                    } else {
                      setShowEmptyWishlistMsg(true);
                    }
                  }} 
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-stone-50 transition-colors group text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#A85344]/10 text-[#A85344] flex items-center justify-center group-hover:bg-[#A85344] group-hover:text-white transition-colors">
                      <Heart className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#143A2A]">Saved Items</p>
                      <p className="text-xs text-stone-500">View wishlist</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-[#143A2A] transition-colors" />
                </button>

                <button onClick={() => {
                  window.scrollTo({ top: document.body.scrollHeight / 2, behavior: 'smooth' });
                }} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-stone-50 transition-colors group text-left">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-stone-100 text-stone-600 flex items-center justify-center group-hover:bg-stone-600 group-hover:text-white transition-colors">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#143A2A]">Addresses</p>
                      <p className="text-xs text-stone-500">Manage delivery</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-[#143A2A] transition-colors" />
                </button>
              </div>
            </motion.div>

            {/* Account Preferences */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100"
            >
              <h3 className="font-bold text-[#143A2A] flex items-center gap-2 mb-4">
                <Settings className="w-4 h-4 text-[#7C8464]" /> Preferences
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="pr-4">
                    <p className="text-sm font-bold text-stone-800">Order Updates</p>
                    <p className="text-xs text-stone-500">SMS & Email tracking</p>
                  </div>
                  <button 
                    onClick={() => handleTogglePreference('orderUpdates')}
                    className={`w-10 h-6 rounded-full relative transition-colors ${preferences.orderUpdates ? 'bg-[#7C8464]' : 'bg-stone-200'}`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${preferences.orderUpdates ? 'left-5' : 'left-1'}`} />
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="pr-4">
                    <p className="text-sm font-bold text-stone-800">Email Notifications</p>
                    <p className="text-xs text-stone-500">News & announcements</p>
                  </div>
                  <button 
                    onClick={() => handleTogglePreference('emailNotifications')}
                    className={`w-10 h-6 rounded-full relative transition-colors ${preferences.emailNotifications ? 'bg-[#7C8464]' : 'bg-stone-200'}`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${preferences.emailNotifications ? 'left-5' : 'left-1'}`} />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="pr-4">
                    <p className="text-sm font-bold text-stone-800">Marketing Offers</p>
                    <p className="text-xs text-stone-500">Exclusive discounts</p>
                  </div>
                  <button 
                    onClick={() => handleTogglePreference('marketingOffers')}
                    className={`w-10 h-6 rounded-full relative transition-colors ${preferences.marketingOffers ? 'bg-[#7C8464]' : 'bg-stone-200'}`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${preferences.marketingOffers ? 'left-5' : 'left-1'}`} />
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Security & Logout */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100"
            >
              <h3 className="font-bold text-[#143A2A] flex items-center gap-2 mb-4">
                <Shield className="w-4 h-4 text-[#7C8464]" /> Security
              </h3>
              
              <button 
                onClick={() => setActiveModal('password')}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-stone-100 hover:bg-stone-50 transition-colors mb-4 text-left"
              >
                <div className="flex items-center gap-3">
                  <Lock className="w-4 h-4 text-stone-500" />
                  <span className="text-sm font-bold text-stone-800">Change Password</span>
                </div>
                <ChevronRight className="w-4 h-4 text-stone-400" />
              </button>

              <button 
                onClick={onLogout}
                className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 font-bold text-sm transition-colors"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </motion.div>

          </div>
        </div>
      </div>

      {/* Global Notifications for Account Screen */}
      <AnimatePresence>
        {(errorMsg || successMsg) && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className={`fixed bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full shadow-lg z-50 flex items-center gap-2 font-bold text-sm ${
              errorMsg ? 'bg-red-600 text-white' : 'bg-[#143A2A] text-white'
            }`}
          >
            {errorMsg ? <X className="w-4 h-4" /> : <Check className="w-4 h-4" />}
            {errorMsg || successMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODALS */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setActiveModal(null)}
              className="absolute inset-0 bg-[#143A2A]/40 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md relative z-10 overflow-hidden"
            >
              {/* Modal Header */}
              <div className="px-6 py-5 border-b border-stone-100 flex items-center justify-between bg-[#FDFBF7]">
                <h3 className="font-serif text-xl text-[#143A2A]">
                  {activeModal === 'editProfile' && 'Edit Profile'}
                  {activeModal === 'address' && (editingAddressId ? 'Edit Address' : 'Add New Address')}
                  {activeModal === 'password' && 'Change Password'}
                </h3>
                <button onClick={() => setActiveModal(null)} className="w-8 h-8 rounded-full bg-white border border-stone-200 flex items-center justify-center text-stone-500 hover:bg-stone-50 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 max-h-[70vh] overflow-y-auto">
                
                {/* EDIT PROFILE FORM */}
                {activeModal === 'editProfile' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">Full Name</label>
                      <input 
                        type="text" 
                        value={profileForm.fullName}
                        onChange={e => setProfileForm({...profileForm, fullName: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-[#7C8464] focus:ring-1 focus:ring-[#7C8464] outline-none transition-all"
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">Email Address (Read-only)</label>
                      <input 
                        type="email" 
                        value={currentUser.email}
                        readOnly
                        disabled
                        className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-stone-50 text-stone-500 cursor-not-allowed outline-none"
                      />
                      <p className="text-[10px] text-stone-400 mt-1.5">Email updates must be done by contacting support for security.</p>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">Phone Number</label>
                      <input 
                        type="tel" 
                        value={profileForm.mobile}
                        onChange={e => setProfileForm({...profileForm, mobile: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-[#7C8464] focus:ring-1 focus:ring-[#7C8464] outline-none transition-all"
                        placeholder="Your phone number"
                      />
                    </div>
                  </div>
                )}

                {/* ADDRESS FORM */}
                {activeModal === 'address' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1.5">Receiver Name *</label>
                      <input 
                        type="text" 
                        value={addressForm.fullName}
                        onChange={e => setAddressForm({...addressForm, fullName: e.target.value})}
                        className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-[#7C8464] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1.5">Phone Number *</label>
                      <input 
                        type="tel" 
                        value={addressForm.mobile}
                        onChange={e => setAddressForm({...addressForm, mobile: e.target.value})}
                        className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-[#7C8464] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1.5">Street Address *</label>
                      <input 
                        type="text" 
                        value={addressForm.streetAddress}
                        onChange={e => setAddressForm({...addressForm, streetAddress: e.target.value})}
                        className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-[#7C8464] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1.5">Apartment / Flat (Optional)</label>
                      <input 
                        type="text" 
                        value={addressForm.apartment}
                        onChange={e => setAddressForm({...addressForm, apartment: e.target.value})}
                        className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-[#7C8464] outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1.5">City *</label>
                        <input 
                          type="text" 
                          value={addressForm.city}
                          onChange={e => setAddressForm({...addressForm, city: e.target.value})}
                          className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-[#7C8464] outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1.5">State *</label>
                        <input 
                          type="text" 
                          value={addressForm.state}
                          onChange={e => setAddressForm({...addressForm, state: e.target.value})}
                          className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-[#7C8464] outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1.5">PIN Code *</label>
                      <input 
                        type="text" 
                        value={addressForm.pincode}
                        onChange={e => setAddressForm({...addressForm, pincode: e.target.value})}
                        className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-[#7C8464] outline-none"
                      />
                    </div>
                    <label className="flex items-center gap-3 pt-2 cursor-pointer group">
                      <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${addressForm.isDefault ? 'bg-[#7C8464] border-[#7C8464]' : 'border-stone-300 group-hover:border-[#7C8464]'}`}>
                        {addressForm.isDefault && <Check className="w-3.5 h-3.5 text-white" />}
                      </div>
                      <span className="text-sm text-stone-700 font-medium select-none">Set as default address</span>
                      <input type="checkbox" checked={addressForm.isDefault} onChange={e => setAddressForm({...addressForm, isDefault: e.target.checked})} className="hidden" />
                    </label>
                  </div>
                )}

                {/* PASSWORD FORM */}
                {activeModal === 'password' && (
                  <div className="space-y-4">
                    <p className="text-sm text-stone-500 mb-6">Create a strong password with a mix of letters and numbers.</p>
                    
                    <div>
                      <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">New Password</label>
                      <input 
                        type="password" 
                        value={passwordForm.new}
                        onChange={e => setPasswordForm({...passwordForm, new: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-[#7C8464] focus:ring-1 focus:ring-[#7C8464] outline-none transition-all"
                        placeholder="At least 6 characters"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">Confirm New Password</label>
                      <input 
                        type="password" 
                        value={passwordForm.confirm}
                        onChange={e => setPasswordForm({...passwordForm, confirm: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-[#7C8464] focus:ring-1 focus:ring-[#7C8464] outline-none transition-all"
                        placeholder="Re-type new password"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 border-t border-stone-100 flex items-center justify-end gap-3 bg-[#FDFBF7]">
                <button 
                  onClick={() => setActiveModal(null)}
                  disabled={isSaving}
                  className="px-5 py-2.5 rounded-xl font-bold text-stone-500 hover:bg-stone-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    if (activeModal === 'editProfile') handleSaveProfile();
                    if (activeModal === 'address') handleSaveAddress();
                    if (activeModal === 'password') handleChangePassword();
                  }}
                  disabled={isSaving}
                  className="px-6 py-2.5 rounded-xl font-bold bg-[#143A2A] text-white hover:bg-[#1e4a38] transition-colors flex items-center gap-2 min-w-[120px] justify-center disabled:opacity-70"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Changes'}
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* WISHLIST MODAL */}
      <AnimatePresence>
        {showWishlistModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowWishlistModal(false)}
              className="absolute inset-0 bg-[#143A2A]/40 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#FDFBF7] rounded-2xl shadow-xl w-full max-w-2xl max-h-[85vh] relative z-10 overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="px-6 py-5 border-b border-stone-100 flex items-center justify-between bg-white shrink-0">
                <div>
                  <h3 className="font-serif text-xl text-[#143A2A]">My Wishlist</h3>
                  <p className="text-sm font-medium text-stone-500">{wishlistProducts.length} Saved Products</p>
                </div>
                <button onClick={() => setShowWishlistModal(false)} className="w-8 h-8 rounded-full bg-stone-50 border border-stone-200 flex items-center justify-center text-stone-500 hover:bg-stone-100 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Body */}
              <div className="p-4 sm:p-6 overflow-y-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {wishlistProducts.map(product => {
                    const price = product.discountPrice || product.price;
                    const weight = product.variants?.[0]?.weight || '250g'; // Fallback
                    return (
                      <div key={product.id} className="bg-white border border-stone-200 rounded-xl p-3 flex gap-4 items-center shadow-sm">
                        <div className="w-20 h-20 rounded-lg bg-stone-100 overflow-hidden shrink-0 border border-stone-100">
                          <img src={(product as any).images?.[0] || product.image || '/images/01.png'} alt={product.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-[#143A2A] text-sm truncate">{product.name}</h4>
                          <p className="text-xs text-stone-500 mb-1">{weight}</p>
                          <p className="font-bold text-[#A85344] text-sm mb-2">₹{price}</p>
                          
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => onToggleWishlist(product)}
                              className="w-8 h-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors shrink-0"
                            >
                              <Heart className="w-4 h-4 fill-current" />
                            </button>
                            <button 
                              onClick={() => {
                                onAddToCart(product, weight, price);
                                showMessage('Added to cart', 'success');
                              }}
                              className="flex-1 text-xs font-bold bg-[#143A2A] text-white py-1.5 rounded-lg hover:bg-[#1e4a38] transition-colors"
                            >
                              Add to Cart
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
