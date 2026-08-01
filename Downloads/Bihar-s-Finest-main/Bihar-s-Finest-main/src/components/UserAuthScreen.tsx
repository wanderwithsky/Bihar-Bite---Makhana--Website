import { useState, useEffect, FormEvent } from 'react';
import { User, Order } from '../types';
import { 
  Mail, Lock, User as UserIcon, Phone, Shield, ArrowRight, ShoppingBag, 
  Calendar, CheckCircle, Clock, XCircle, LogOut, Key, MapPin, History, 
  Plus, Trash2, ClipboardList, Loader2 
} from 'lucide-react';
import { isSupabaseConfigured, supabase, fetchUserProfile, updateUserProfile, changeUserPassword } from '../lib/supabase';
import { motion, AnimatePresence } from 'motion/react';

interface UserAuthScreenProps {
  currentUser: User | null;
  onLogin: (emailOrUser: any, fullName?: string, mobile?: string) => void;
  onRegister: (fullNameOrUser: any, email?: string, mobile?: string) => void;
  onLogout: () => void;
  setScreen: (screen: any) => void;
  showToast: (msg: string, type?: 'success' | 'error') => void;
}

export default function UserAuthScreen({
  currentUser,
  onLogin,
  onRegister,
  onLogout,
  setScreen,
  showToast
}: UserAuthScreenProps) {
  const [isLogin, setIsLogin] = useState(true);
  
  // Login Form States
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  // Register Form States
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regMobile, setRegMobile] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');

  // Forgot Password state
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');

  // Tab State
  const [activeTab, setActiveTab] = useState<'orders' | 'purchaseHistory' | 'settings'>('orders');

  // Order Status Filter State
  const [orderFilter, setOrderFilter] = useState<string>('All');

  // Address form states
  const [newAddress, setNewAddress] = useState('');
  const [localAddresses, setLocalAddresses] = useState<string[]>([]);

  // Password change states
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  // Component loading indicators
  const [authLoading, setAuthLoading] = useState(false);
  const [addressLoading, setAddressLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Sync addresses with logged-in user profile
  useEffect(() => {
    if (currentUser) {
      setLocalAddresses(currentUser.savedAddresses || []);
    }
  }, [currentUser]);

  const handleLoginSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      showToast('Please enter your email and password.', 'error');
      return;
    }

    if (loginEmail.toLowerCase() === 'admin@biharbite.com') {
      showToast('This email is reserved for admin access.', 'error');
      return;
    }

    if (isSupabaseConfigured && supabase) {
      setAuthLoading(true);
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: loginEmail,
          password: loginPassword,
        });
        if (error) {
          showToast(error.message, 'error');
          setAuthLoading(false);
          return;
        }
        if (data.user) {
          const profile = await fetchUserProfile(data.user.id);
          if (profile) {
            onLogin(profile as any);
          } else {
            showToast('Unable to fetch your user profile database record.', 'error');
          }
        }
      } catch (err: any) {
        showToast(err.message || 'Authentication error occurred.', 'error');
      } finally {
        setAuthLoading(false);
      }
    } else {
      // Local mockup fallback
      onLogin(loginEmail);
    }
  };

  const handleRegisterSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!regFullName || !regEmail || !regMobile || !regPassword || !regConfirmPassword) {
      showToast('All fields are mandatory.', 'error');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      showToast('Passwords do not match.', 'error');
      return;
    }

    if (isSupabaseConfigured && supabase) {
      setAuthLoading(true);
      try {
        const { data, error } = await supabase.auth.signUp({
          email: regEmail,
          password: regPassword,
          options: {
            data: {
              full_name: regFullName,
              mobile: regMobile,
            }
          }
        });
        if (error) {
          showToast(error.message, 'error');
          setAuthLoading(false);
          return;
        }
        if (data.user) {
          const profile = await fetchUserProfile(data.user.id);
          if (profile) {
            onRegister(profile as any);
            showToast('Account registered successfully via Supabase!', 'success');
          } else {
            showToast('Account registered! Please sign in with your credentials.', 'success');
            setIsLogin(true);
          }
        }
      } catch (err: any) {
        showToast(err.message || 'Failed to register account.', 'error');
      } finally {
        setAuthLoading(false);
      }
    } else {
      // Local mockup fallback
      onRegister(regFullName, regEmail, regMobile);
    }
  };

  const handleForgotSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) {
      showToast('Please enter your email.', 'error');
      return;
    }

    if (isSupabaseConfigured && supabase) {
      setAuthLoading(true);
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(forgotEmail, {
          redirectTo: window.location.origin
        });
        if (error) {
          showToast(error.message, 'error');
        } else {
          showToast(`Password reset link securely sent to ${forgotEmail}. Please check your inbox.`, 'success');
          setIsForgotPassword(false);
        }
      } catch (err: any) {
        showToast(err.message || 'Error sending reset email.', 'error');
      } finally {
        setAuthLoading(false);
      }
    } else {
      showToast(`Reset link dispatched to mockup account ${forgotEmail}`, 'success');
      setIsForgotPassword(false);
    }
  };

  const handleAddAddress = async (e: FormEvent) => {
    e.preventDefault();
    if (!newAddress.trim()) return;
    setAddressLoading(true);
    try {
      const updatedAddresses = [...localAddresses, newAddress.trim()];
      if (isSupabaseConfigured && supabase) {
        await updateUserProfile(currentUser!.id, currentUser!.fullName, currentUser!.mobile, updatedAddresses);
      }
      setLocalAddresses(updatedAddresses);
      if (currentUser) {
        currentUser.savedAddresses = updatedAddresses;
      }
      setNewAddress('');
      showToast('New address saved successfully!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to update addresses.', 'error');
    } finally {
      setAddressLoading(false);
    }
  };

  const handleDeleteAddress = async (indexToDelete: number) => {
    setAddressLoading(true);
    try {
      const updatedAddresses = localAddresses.filter((_, idx) => idx !== indexToDelete);
      if (isSupabaseConfigured && supabase) {
        await updateUserProfile(currentUser!.id, currentUser!.fullName, currentUser!.mobile, updatedAddresses);
      }
      setLocalAddresses(updatedAddresses);
      if (currentUser) {
        currentUser.savedAddresses = updatedAddresses;
      }
      showToast('Address deleted successfully.', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to delete address.', 'error');
    } finally {
      setAddressLoading(false);
    }
  };

  const handleChangePassword = async (e: FormEvent) => {
    e.preventDefault();
    if (!newPassword) {
      showToast('Please enter your new password.', 'error');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      showToast('Passwords do not match.', 'error');
      return;
    }
    if (newPassword.length < 6) {
      showToast('Password must be at least 6 characters long.', 'error');
      return;
    }
    setPasswordLoading(true);
    try {
      if (isSupabaseConfigured) {
        await changeUserPassword(newPassword);
        showToast('Password changed securely in database!', 'success');
        setNewPassword('');
        setConfirmNewPassword('');
      } else {
        showToast('Local Mock Session: Password updated successfully.', 'success');
        setNewPassword('');
        setConfirmNewPassword('');
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to update password.', 'error');
    } finally {
      setPasswordLoading(false);
    }
  };

  // Compile full purchased products from overall order history
  const getPurchaseHistory = () => {
    const items: {
      productId: string;
      name: string;
      price: number;
      quantity: number;
      weight: string;
      date: string;
      orderId: string;
      status: string;
    }[] = [];

    if (!currentUser) return items;

    currentUser.orderHistory.forEach(order => {
      order.items.forEach(item => {
        items.push({
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          weight: item.weight,
          date: order.date,
          orderId: order.id,
          status: order.status
        });
      });
    });

    return items;
  };

  // Filter orders by segmented status
  const getFilteredOrders = () => {
    if (!currentUser) return [];
    if (orderFilter === 'All') return currentUser.orderHistory;
    return currentUser.orderHistory.filter(o => o.status === orderFilter);
  };

  // Render User Profile Screen if already logged in
  if (currentUser) {
    const filteredOrders = getFilteredOrders();
    const purchasedItems = getPurchaseHistory();

    return (
      <div className="max-w-7xl mx-auto px-6 pt-8 md:pt-12 pb-20 font-sans">
        <div className="w-16 h-[2px] bg-secondary mx-auto mb-6" />

        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-secondary font-serif italic text-lg md:text-xl block">
            Welcome Back, Snack Enthusiast
          </span>
          <h1 className="font-serif text-3xl md:text-5.5xl font-light tracking-tight text-on-surface-variant">
            {currentUser.fullName}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Profile Sidebar */}
          <div className="lg:col-span-4 bg-[#FAF8F4] border border-[#E5DFD1] rounded-[32px] p-6 md:p-8 space-y-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-[#7C8464] text-white flex items-center justify-center text-3xl font-serif italic shadow-md">
                {currentUser.fullName.charAt(0)}
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-primary">{currentUser.fullName}</h3>
                <p className="text-xs text-on-surface-variant/75">{currentUser.email}</p>
              </div>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                currentUser.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                <Shield className="w-3 h-3" />
                {currentUser.status} Status
              </span>
            </div>

            <div className="border-t border-[#E5DFD1] pt-6 space-y-4">
              <div className="flex justify-between items-center text-xs">
                <span className="text-on-surface-variant/70">Mobile Number:</span>
                <span className="font-semibold text-primary">{currentUser.mobile}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-on-surface-variant/70">Member Since:</span>
                <span className="font-semibold text-primary">{currentUser.dateRegistered}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-on-surface-variant/70">Total Snack Orders:</span>
                <span className="font-semibold text-primary">{currentUser.orderHistory.length}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-on-surface-variant/70">Saved Addresses:</span>
                <span className="font-semibold text-primary">{localAddresses.length}</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={onLogout}
                className="w-full bg-[#A85344] hover:bg-[#914639] text-white py-3 rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer shadow-sm"
              >
                <LogOut className="w-4 h-4" />
                Sign Out Securely
              </button>
            </div>
          </div>

          {/* Main Account Area with Tabs */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Tabs Selector Bar */}
            <div className="flex border-b border-[#E5DFD1] gap-2 overflow-x-auto pb-px scrollbar-none">
              <button
                onClick={() => setActiveTab('orders')}
                className={`px-5 py-3 text-xs uppercase font-bold tracking-wider border-b-2 transition-all whitespace-nowrap flex items-center gap-2 ${
                  activeTab === 'orders' 
                    ? 'border-secondary text-secondary' 
                    : 'border-transparent text-on-surface-variant/70 hover:text-primary'
                }`}
              >
                <ClipboardList className="w-4 h-4" />
                Order Management
              </button>
              
              <button
                onClick={() => setActiveTab('purchaseHistory')}
                className={`px-5 py-3 text-xs uppercase font-bold tracking-wider border-b-2 transition-all whitespace-nowrap flex items-center gap-2 ${
                  activeTab === 'purchaseHistory' 
                    ? 'border-secondary text-secondary' 
                    : 'border-transparent text-on-surface-variant/70 hover:text-primary'
                }`}
              >
                <History className="w-4 h-4" />
                Purchase History
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`px-5 py-3 text-xs uppercase font-bold tracking-wider border-b-2 transition-all whitespace-nowrap flex items-center gap-2 ${
                  activeTab === 'settings' 
                    ? 'border-secondary text-secondary' 
                    : 'border-transparent text-on-surface-variant/70 hover:text-primary'
                }`}
              >
                <MapPin className="w-4 h-4" />
                Addresses & Security
              </button>
            </div>

            {/* TAB CONTENT: ORDER MANAGEMENT */}
            {activeTab === 'orders' && (
              <div className="bg-white border border-outline-variant/30 rounded-[32px] p-6 md:p-8 space-y-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-outline-variant/30 pb-4">
                  <div className="flex items-center gap-3">
                    <ShoppingBag className="w-5 h-5 text-[#7C8464]" />
                    <h2 className="font-serif text-xl font-bold text-primary">Your Snacking Orders</h2>
                  </div>
                </div>

                {/* Status Segment Filters */}
                <div className="flex flex-wrap gap-1.5 pb-2">
                  {['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Returned'].map((status) => {
                    const count = status === 'All' 
                      ? currentUser.orderHistory.length 
                      : currentUser.orderHistory.filter(o => o.status === status).length;
                    
                    return (
                      <button
                        key={status}
                        onClick={() => setOrderFilter(status)}
                        className={`text-[10px] uppercase tracking-wider font-bold px-3 py-1.5 rounded-full transition-colors flex items-center gap-1 ${
                          orderFilter === status
                            ? 'bg-[#7C8464] text-white'
                            : 'bg-[#FAF8F4] text-on-surface-variant/80 hover:bg-surface-container-low border border-[#E5DFD1]/50'
                        }`}
                      >
                        <span>{status}</span>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${
                          orderFilter === status ? 'bg-white/20 text-white' : 'bg-[#E5DFD1] text-primary'
                        }`}>{count}</span>
                      </button>
                    );
                  })}
                </div>

                {filteredOrders.length === 0 ? (
                  <div className="text-center py-12 space-y-4">
                    <div className="w-16 h-16 rounded-full bg-[#FAF8F4] flex items-center justify-center mx-auto text-on-surface-variant/40">
                      <ShoppingBag className="w-8 h-8" />
                    </div>
                    <p className="text-sm text-on-surface-variant/80">No orders found with status "{orderFilter}".</p>
                    {orderFilter === 'All' && (
                      <button
                        onClick={() => setScreen('shop')}
                        className="bg-[#7C8464] text-white px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-[#6A7155] transition-all"
                      >
                        Explore Delicious Menu
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredOrders.map((order) => (
                      <div 
                        key={order.id} 
                        className="border border-[#E5DFD1]/50 rounded-2xl p-5 hover:bg-[#FAF8F4]/30 transition-all space-y-4"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-outline-variant/10 pb-3">
                          <div>
                            <p className="text-xs font-mono text-on-surface-variant/60 uppercase">Order #{order.id}</p>
                            <p className="text-[11px] text-on-surface-variant/80 flex items-center gap-1 mt-0.5">
                              <Calendar className="w-3 h-3" />
                              {order.date}
                            </p>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                              order.status === 'Completed' || order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                              order.status === 'Cancelled' || order.status === 'Returned' ? 'bg-red-100 text-red-800' : 
                              order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {(order.status === 'Completed' || order.status === 'Delivered') && <CheckCircle className="w-3 h-3" />}
                              {(order.status === 'Pending' || order.status === 'Processing') && <Clock className="w-3 h-3" />}
                              {(order.status === 'Cancelled' || order.status === 'Returned') && <XCircle className="w-3 h-3" />}
                              {order.status}
                            </span>
                            <span className="font-mono text-sm font-bold text-[#7C8464]">₹{order.total}</span>
                          </div>
                        </div>

                        {/* Order Items */}
                        <div className="space-y-2">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center text-xs">
                              <span className="text-on-surface-variant/90">
                                {item.name} <span className="text-on-surface-variant/60 font-mono">({item.weight})</span>
                              </span>
                              <span className="font-semibold text-on-surface-variant">
                                {item.quantity}x <span className="font-mono text-on-surface-variant/60 ml-2">₹{item.price}</span>
                              </span>
                            </div>
                          ))}
                        </div>

                        <div className="bg-[#FAF8F4] text-[11px] p-3 rounded-xl border border-[#E5DFD1]/30">
                          <span className="font-bold text-primary uppercase text-[9px] tracking-wider block mb-1">Shipping Details:</span>
                          <p className="text-on-surface-variant/80 font-medium leading-relaxed font-sans mb-1">{order.customerName} | {order.customerMobile}</p>
                          <p className="text-on-surface-variant/85 leading-relaxed font-sans">{order.shippingAddress}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT: PURCHASE HISTORY */}
            {activeTab === 'purchaseHistory' && (
              <div className="bg-white border border-outline-variant/30 rounded-[32px] p-6 md:p-8 space-y-6 shadow-sm">
                <div className="flex items-center gap-3 border-b border-outline-variant/30 pb-4">
                  <History className="w-5 h-5 text-[#7C8464]" />
                  <h2 className="font-serif text-xl font-bold text-primary">Prerecorded Purchased Items</h2>
                </div>

                {purchasedItems.length === 0 ? (
                  <div className="text-center py-12 space-y-4">
                    <p className="text-sm text-on-surface-variant/80">You haven't completed any snack transactions yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {purchasedItems.map((item, idx) => (
                      <div 
                        key={idx}
                        className="border border-[#E5DFD1]/50 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-[#FAF8F4]/20 transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-[#FAF8F4] border border-[#E5DFD1]/30 flex items-center justify-center text-[#7C8464]">
                            <ShoppingBag className="w-6 h-6" />
                          </div>
                          <div>
                            <h4 className="font-serif font-bold text-sm text-primary">{item.name}</h4>
                            <p className="text-[11px] text-on-surface-variant/70 flex items-center gap-1 mt-0.5">
                              <span>Weight: <strong>{item.weight}</strong></span>
                              <span>•</span>
                              <span>Date: <strong>{item.date}</strong></span>
                            </p>
                            <p className="text-[10px] text-on-surface-variant/50 font-mono mt-0.5 uppercase">Invoice ID: INV-{item.orderId.slice(0, 8)}</p>
                          </div>
                        </div>

                        <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2 border-t sm:border-t-0 pt-2 sm:pt-0 border-[#E5DFD1]/30">
                          <span className="text-xs font-mono font-bold text-[#7C8464]">
                            {item.quantity}x • ₹{item.price}
                          </span>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-widest bg-green-100 text-green-800">
                            Payment Paid
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT: ADDRESSES & PASSWORD */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                
                {/* Saved Addresses Section */}
                <div className="bg-white border border-outline-variant/30 rounded-[32px] p-6 md:p-8 space-y-6 shadow-sm">
                  <div className="flex items-center gap-3 border-b border-outline-variant/30 pb-4">
                    <MapPin className="w-5 h-5 text-[#7C8464]" />
                    <h2 className="font-serif text-xl font-bold text-primary">Your Saved Shipping Addresses</h2>
                  </div>

                  {localAddresses.length === 0 ? (
                    <p className="text-xs text-on-surface-variant/80">No saved addresses found. Add an address below for seamless checkout.</p>
                  ) : (
                    <div className="space-y-3">
                      {localAddresses.map((addr, idx) => (
                        <div 
                          key={idx}
                          className="bg-[#FAF8F4] border border-[#E5DFD1]/50 rounded-2xl p-4 flex justify-between items-start gap-4"
                        >
                          <p className="text-xs text-on-surface-variant/95 leading-relaxed font-sans">{addr}</p>
                          <button
                            onClick={() => handleDeleteAddress(idx)}
                            disabled={addressLoading}
                            className="p-1.5 text-on-surface-variant/55 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all"
                            title="Delete Address"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add Address Form */}
                  <form onSubmit={handleAddAddress} className="space-y-3 pt-2">
                    <div className="space-y-1">
                      <label className="text-[10px] tracking-wider uppercase font-bold text-[#4A4A3A]">Add New Address</label>
                      <textarea
                        required
                        rows={3}
                        placeholder="House No, Street, Locality, City, State - PIN"
                        value={newAddress}
                        onChange={(e) => setNewAddress(e.target.value)}
                        className="w-full bg-[#FAF8F4] border border-[#E5DFD1] rounded-2xl p-3.5 text-xs focus:outline-none focus:border-primary transition-colors text-on-surface custom-scrollbar resize-none"
                      />
                    </div>
                    
                    <button
                      type="submit"
                      disabled={addressLoading}
                      className="inline-flex bg-[#7C8464] hover:bg-[#6A7155] text-white px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all items-center gap-1.5"
                    >
                      {addressLoading ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Plus className="w-3.5 h-3.5" />
                      )}
                      Save Secure Address
                    </button>
                  </form>
                </div>

                {/* Change Password Section */}
                <div className="bg-white border border-outline-variant/30 rounded-[32px] p-6 md:p-8 space-y-6 shadow-sm">
                  <div className="flex items-center gap-3 border-b border-outline-variant/30 pb-4">
                    <Key className="w-5 h-5 text-[#7C8464]" />
                    <h2 className="font-serif text-xl font-bold text-primary">Secure Account Password Change</h2>
                  </div>

                  <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
                    <div className="space-y-1.5">
                      <label className="text-[10px] tracking-wider uppercase font-bold text-[#4A4A3A]">New Secure Password</label>
                      <div className="relative">
                        <input
                          type="password"
                          required
                          placeholder="••••••••"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full bg-[#FAF8F4] border border-[#E5DFD1] rounded-2xl py-3 pl-11 pr-4 text-xs focus:outline-none focus:border-primary transition-colors text-on-surface"
                        />
                        <Lock className="absolute left-4 top-3.5 w-4 h-4 text-on-surface-variant/60" />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] tracking-wider uppercase font-bold text-[#4A4A3A]">Confirm New Password</label>
                      <div className="relative">
                        <input
                          type="password"
                          required
                          placeholder="••••••••"
                          value={confirmNewPassword}
                          onChange={(e) => setConfirmNewPassword(e.target.value)}
                          className="w-full bg-[#FAF8F4] border border-[#E5DFD1] rounded-2xl py-3 pl-11 pr-4 text-xs focus:outline-none focus:border-primary transition-colors text-on-surface"
                        />
                        <Lock className="absolute left-4 top-3.5 w-4 h-4 text-on-surface-variant/60" />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={passwordLoading}
                      className="inline-flex bg-[#7C8464] hover:bg-[#6A7155] text-white px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all items-center gap-1.5"
                    >
                      {passwordLoading ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Key className="w-3.5 h-3.5" />
                      )}
                      Change Password Securely
                    </button>
                  </form>
                </div>

              </div>
            )}

          </div>

        </div>
      </div>
    );
  }

  return (
    <div className={`w-full h-full font-sans ${(!isLogin || isForgotPassword || currentUser) ? 'max-w-7xl mx-auto px-6 pt-8 md:pt-12 pb-20' : ''}`}>
      {(!isLogin || isForgotPassword || currentUser) && <div className="w-16 h-[2px] bg-secondary mx-auto mb-6" />}

      {isForgotPassword ? (
        // Forgot Password Screen
        <div className="max-w-md mx-auto bg-[#FAF8F4] border border-[#E5DFD1] rounded-[40px] p-8 md:p-10 shadow-sm space-y-6">
          <div className="text-center space-y-2">
            <h2 className="font-serif text-2xl md:text-3.5xl font-light text-[#4A4A3A]">Forgot Password</h2>
            <p className="text-xs text-on-surface-variant/80">
              Enter your email below to receive a secure password recovery code.
            </p>
          </div>

          <form onSubmit={handleForgotSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] tracking-wider uppercase font-bold text-[#4A4A3A]">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="name@email.com"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="w-full bg-white border border-outline-variant/30 rounded-2xl py-3 pl-11 pr-4 text-xs focus:outline-none focus:border-primary transition-colors text-on-surface"
                />
                <Mail className="absolute left-4 top-3.5 w-4 h-4 text-on-surface-variant/60" />
              </div>
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full bg-[#7C8464] hover:bg-[#6A7155] text-white py-3.5 rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-95 shadow-sm mt-2 cursor-pointer"
            >
              {authLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  Dispatch Code
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <button
            onClick={() => setIsForgotPassword(false)}
            className="w-full text-center text-xs text-secondary font-bold hover:underline"
          >
            Back to Sign In
          </button>
        </div>
      ) : (
        <div className="relative w-full h-[90vh] md:h-[640px] overflow-hidden bg-[#FAF8F4] rounded-[28px] flex flex-col md:flex-row">
          
          {/* Fixed Left Panel Container */}
          <div className="hidden md:flex md:w-[40%] relative h-full bg-[#2A3319] text-white overflow-hidden shrink-0">
            <AnimatePresence initial={false}>
              {isLogin ? (
                <motion.div
                  key="left-login"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35, ease: 'easeInOut' }}
                  className="absolute inset-0 flex flex-col justify-between p-12"
                >
                  <div className="absolute inset-0 bg-[#2A3319]/40 z-10 mix-blend-multiply" />
                  <img 
                    src="/images/login-banner.jpg" 
                    className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-90 z-0" 
                    alt="Login Banner" 
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling?.classList.remove('hidden');
                    }} 
                  />
                  <video 
                    src="/flow.mp4" 
                    autoPlay loop muted playsInline 
                    className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-50 z-0 hidden" 
                  />
                  
                  <div className="relative z-20 space-y-6 mt-4">
                    <h2 className="font-serif text-4xl lg:text-5xl leading-tight font-bold tracking-wide">
                      WELCOME BACK TO THE<br/>BIHAR BITE FAMILY.
                    </h2>
                    <ul className="space-y-4 font-medium text-sm tracking-wide text-white/90 mt-8">
                      <li className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-[#C1A87D]" /> Premium Healthy Snacks
                      </li>
                      <li className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-[#C1A87D]" /> Farm Fresh Products
                      </li>
                      <li className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-[#C1A87D]" /> Exclusive Member Offers
                      </li>
                    </ul>
                  </div>
                  <div className="relative z-20">
                    <p className="font-serif italic text-sm lg:text-base text-white/80">
                      "Experience authentic Bihar Makhana with every order."
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="left-register"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35, ease: 'easeInOut' }}
                  className="absolute inset-0 flex flex-col justify-between p-12"
                >
                  <div className="absolute inset-0 bg-[#0A1A12] z-0" />
                  
                  {/* Layered Composition */}
                  <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                    {/* Background glow / Warm luxury lighting */}
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#D4AF37]/30 rounded-full blur-[100px] mix-blend-screen" />
                    <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#8B5A2B]/40 rounded-full blur-[80px] mix-blend-screen" />

                    {/* Product Layers */}
                    <img src="/images/04.png" alt="Leaves" className="absolute -left-20 -top-10 w-[140%] object-contain opacity-30 blur-[2px] transform -rotate-12" />
                    <img src="/images/hero/03.png" alt="Bowl" className="absolute -right-24 top-1/4 w-80 object-contain opacity-50 blur-[1px] transform rotate-12" />
                    <img src="/images/01.png" alt="Pouch" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-72 object-contain opacity-70" />
                    <img src="/images/hero/02.png" alt="Tin" className="absolute -left-10 bottom-10 w-64 object-contain opacity-60 transform -rotate-6" />
                    <img src="/images/hero/hero-composition.png" alt="Makhana" className="absolute -right-10 -bottom-20 w-96 object-contain opacity-40 blur-[3px]" />

                    {/* Dark Green Overlay */}
                    <div className="absolute inset-0 bg-[#0A1A12]/70 z-10" />
                  </div>

                  <div className="relative z-20 space-y-6 mt-4">
                    <h2 className="font-serif text-4xl lg:text-5xl leading-tight font-bold tracking-wide text-white drop-shadow-lg">
                      JOIN THE<br/>BIHAR BITE<br/>SNACKERS<br/>CLUB.
                    </h2>
                    <ul className="space-y-4 font-sans font-medium text-sm tracking-wide text-white/90 mt-8">
                      <li className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-[#D4AF37]" /> Premium Healthy Snacks
                      </li>
                      <li className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-[#D4AF37]" /> Exclusive Member Benefits
                      </li>
                      <li className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-[#D4AF37]" /> Faster Checkout
                      </li>
                      <li className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-[#D4AF37]" /> Order Tracking
                      </li>
                    </ul>
                  </div>
                  <div className="relative z-20">
                    <p className="font-serif italic text-sm lg:text-base text-white/80">
                      "Healthy snacking starts here."
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Sliding Panel Container */}
          <div className="w-full md:w-[60%] relative h-full overflow-hidden shrink-0 bg-[#FAF8F4]">
            <AnimatePresence initial={false}>
              {isLogin ? (
                <motion.div
                  key="right-login"
                  initial={{ x: '-20%', opacity: 0 }}
                  animate={{ x: '0%', opacity: 1 }}
                  exit={{ x: '-20%', opacity: 0 }}
                  transition={{ duration: 0.35, ease: 'easeInOut' }}
                  className="absolute inset-0 flex flex-col justify-center p-8 md:p-16 lg:p-24 overflow-y-auto custom-scrollbar"
                >
                  <div className="max-w-md w-full mx-auto space-y-8 my-auto">
                    <div className="space-y-2">
                      <h2 className="font-serif text-3xl md:text-4xl font-light text-[#4A4A3A]">Sign In</h2>
                      <p className="text-secondary font-serif italic text-sm md:text-base">Welcome back! Please sign in to continue.</p>
                    </div>

                    <form onSubmit={handleLoginSubmit} className="space-y-5">
                      <div className="space-y-1.5">
                        <label className="text-[10px] tracking-wider uppercase font-bold text-[#4A4A3A]">Email Address</label>
                        <div className="relative">
                          <input
                            type="email"
                            required
                            placeholder="name@email.com"
                            value={loginEmail}
                            onChange={(e) => setLoginEmail(e.target.value)}
                            className="w-full bg-white border border-outline-variant/30 rounded-2xl py-3.5 pl-11 pr-4 text-sm focus:outline-none focus:ring-4 focus:ring-[#7C8464]/20 focus:border-[#7C8464] transition-all duration-300 text-on-surface"
                          />
                          <Mail className="absolute left-4 top-4 w-4 h-4 text-on-surface-variant/60" />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] tracking-wider uppercase font-bold text-[#4A4A3A]">Password</label>
                        <div className="relative">
                          <input
                            type="password"
                            required
                            placeholder="••••••••"
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                            className="w-full bg-white border border-outline-variant/30 rounded-2xl py-3.5 pl-11 pr-4 text-sm focus:outline-none focus:ring-4 focus:ring-[#7C8464]/20 focus:border-[#7C8464] transition-all duration-300 text-on-surface"
                          />
                          <Lock className="absolute left-4 top-4 w-4 h-4 text-on-surface-variant/60" />
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-1 text-xs">
                        <label className="flex items-center gap-2 cursor-pointer select-none text-on-surface-variant/80 font-medium">
                          <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            className="rounded border-[#E5DFD1] text-primary focus:ring-primary/20"
                          />
                          Remember me
                        </label>
                        <button
                          type="button"
                          onClick={() => setIsForgotPassword(true)}
                          className="text-secondary font-bold hover:underline"
                        >
                          Forgot Password?
                        </button>
                      </div>

                      <button
                        type="submit"
                        disabled={authLoading}
                        className="w-full bg-[#143A2A] hover:bg-[#0E281C] text-white h-[54px] rounded-full text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl active:scale-95 shadow-lg mt-6 cursor-pointer"
                      >
                        {authLoading ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <>
                            Sign In
                            <ArrowRight className="w-5 h-5" />
                          </>
                        )}
                      </button>
                    </form>

                    <div className="text-center pt-4 text-sm text-on-surface-variant/80">
                      <span>Don't have an account? </span>
                      <button
                        onClick={() => setIsLogin(false)}
                        className="text-secondary font-bold hover:underline cursor-pointer"
                      >
                        Create Account
                      </button>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="right-register"
                  initial={{ x: '20%', opacity: 0 }}
                  animate={{ x: '0%', opacity: 1 }}
                  exit={{ x: '20%', opacity: 0 }}
                  transition={{ duration: 0.35, ease: 'easeInOut' }}
                  className="absolute inset-0 flex flex-col justify-center p-6 md:p-10 lg:p-12 overflow-y-auto custom-scrollbar"
                >
                  <div className="max-w-md w-full mx-auto space-y-5 my-auto">
                    
                    {/* Title with Gold Accent Line */}
                    <div className="space-y-3">
                      <div className="w-12 h-1 bg-[#D4AF37] rounded-full mb-3"></div>
                      <h2 className="font-serif text-3xl md:text-4xl font-light text-[#2A3319] tracking-tight">Create Account</h2>
                    </div>

                    <form onSubmit={handleRegisterSubmit} className="space-y-4 pt-1">
                      <div className="space-y-1.5">
                        <label className="text-[10px] tracking-widest uppercase font-bold text-[#4A4A3A]/70">Full Name</label>
                        <div className="relative shadow-sm rounded-xl">
                          <input
                            type="text"
                            required
                            placeholder="Mithila Kumar"
                            value={regFullName}
                            onChange={(e) => setRegFullName(e.target.value)}
                            className="w-full bg-[#FFFFFF] border border-[#E5DFD1] rounded-xl py-3 pl-11 pr-4 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-[#2A3319]/20 focus:border-[#2A3319] transition-all duration-300 text-[#2A3319] placeholder:text-[#2A3319]/30"
                          />
                          <UserIcon className="absolute left-4 top-3.5 w-4 h-4 text-[#2A3319]/40" />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] tracking-widest uppercase font-bold text-[#4A4A3A]/70">Email Address</label>
                        <div className="relative shadow-sm rounded-xl">
                          <input
                            type="email"
                            required
                            placeholder="name@email.com"
                            value={regEmail}
                            onChange={(e) => setRegEmail(e.target.value)}
                            className="w-full bg-[#FFFFFF] border border-[#E5DFD1] rounded-xl py-3 pl-11 pr-4 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-[#2A3319]/20 focus:border-[#2A3319] transition-all duration-300 text-[#2A3319] placeholder:text-[#2A3319]/30"
                          />
                          <Mail className="absolute left-4 top-3.5 w-4 h-4 text-[#2A3319]/40" />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] tracking-widest uppercase font-bold text-[#4A4A3A]/70">Phone Number</label>
                        <div className="relative shadow-sm rounded-xl">
                          <input
                            type="tel"
                            required
                            placeholder="+91 XXXXX XXXXX"
                            value={regMobile}
                            onChange={(e) => setRegMobile(e.target.value)}
                            className="w-full bg-[#FFFFFF] border border-[#E5DFD1] rounded-xl py-3 pl-11 pr-4 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-[#2A3319]/20 focus:border-[#2A3319] transition-all duration-300 text-[#2A3319] placeholder:text-[#2A3319]/30"
                          />
                          <Phone className="absolute left-4 top-3.5 w-4 h-4 text-[#2A3319]/40" />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <label className="text-[10px] tracking-widest uppercase font-bold text-[#4A4A3A]/70">Password</label>
                          <div className="relative shadow-sm rounded-xl">
                            <input
                              type="password"
                              required
                              placeholder="••••••••"
                              value={regPassword}
                              onChange={(e) => setRegPassword(e.target.value)}
                              className="w-full bg-[#FFFFFF] border border-[#E5DFD1] rounded-xl py-3 pl-11 pr-4 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-[#2A3319]/20 focus:border-[#2A3319] transition-all duration-300 text-[#2A3319] placeholder:text-[#2A3319]/30"
                            />
                            <Lock className="absolute left-4 top-3.5 w-4 h-4 text-[#2A3319]/40" />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] tracking-widest uppercase font-bold text-[#4A4A3A]/70">Confirm</label>
                          <div className="relative shadow-sm rounded-xl">
                            <input
                              type="password"
                              required
                              placeholder="••••••••"
                              value={regConfirmPassword}
                              onChange={(e) => setRegConfirmPassword(e.target.value)}
                              className="w-full bg-[#FFFFFF] border border-[#E5DFD1] rounded-xl py-3 pl-11 pr-3 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-[#2A3319]/20 focus:border-[#2A3319] transition-all duration-300 text-[#2A3319] placeholder:text-[#2A3319]/30"
                            />
                            <Lock className="absolute left-4 top-3.5 w-4 h-4 text-[#2A3319]/40" />
                          </div>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={authLoading}
                        className="w-full bg-[#143A2A] hover:bg-[#0E281C] text-[#FAF8F4] h-12 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-lg active:scale-[0.98] mt-4 cursor-pointer"
                      >
                        {authLoading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            Create Account
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </form>

                    <div className="text-center pt-2">
                      <span className="text-sm font-sans text-[#4A4A3A]/70">Already have an account? </span>
                      <button
                        onClick={() => setIsLogin(true)}
                        className="text-sm font-sans font-semibold text-[#143A2A] hover:text-[#D4AF37] transition-colors cursor-pointer"
                      >
                        Sign In
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}