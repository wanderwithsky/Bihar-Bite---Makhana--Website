import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Order } from '../types';
import { UserCircle, Package, Heart, LogOut, Edit3, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';

interface AccountScreenProps {
  currentUser: User | null;
  onLogout: () => void;
  wishlistCount: number;
  orders: Order[];
  onOpenAuthModal: () => void;
}

export default function AccountScreen({ currentUser, onLogout, wishlistCount, orders, onOpenAuthModal }: AccountScreenProps) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      onOpenAuthModal();
      navigate('/');
    }
  }, [currentUser, navigate, onOpenAuthModal]);

  if (!currentUser) return null;

  const recentOrders = [...orders].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 2);

  return (
    <div className="min-h-screen bg-[#FDFBF7] pt-28 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="mb-10 text-center md:text-left">
          <h1 className="font-serif text-3xl md:text-4xl text-[#143A2A] mb-3">My Account</h1>
          <p className="text-stone-500 text-sm md:text-base">Manage your profile, orders and account preferences.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          
          {/* Main Content Column */}
          <div className="md:col-span-2 space-y-6">
            
            {/* Personal Information */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-[#143A2A] flex items-center gap-2">
                  <UserCircle className="w-5 h-5 text-[#7C8464]" />
                  Personal Information
                </h2>
                <button className="text-sm font-semibold text-[#7C8464] hover:text-[#5A6342] flex items-center gap-1 transition-colors">
                  <Edit3 className="w-4 h-4" />
                  Edit Profile
                </button>
              </div>

              <div className="flex items-start gap-6">
                <div className="w-16 h-16 rounded-full bg-[#7C8464]/10 text-[#7C8464] flex items-center justify-center font-serif text-2xl shrink-0">
                  {currentUser.fullName.charAt(0).toUpperCase()}
                </div>
                <div className="space-y-3 flex-1">
                  <div>
                    <p className="text-xs text-stone-400 font-bold uppercase tracking-wider mb-1">Full Name</p>
                    <p className="text-stone-800 font-medium">{currentUser.fullName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-stone-400 font-bold uppercase tracking-wider mb-1">Email Address</p>
                    <p className="text-stone-800 font-medium">{currentUser.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-stone-400 font-bold uppercase tracking-wider mb-1">Phone Number</p>
                    <p className="text-stone-800 font-medium">{currentUser.mobile}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* My Orders */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-[#143A2A] flex items-center gap-2">
                  <Package className="w-5 h-5 text-[#7C8464]" />
                  My Orders
                </h2>
                <span className="bg-stone-100 text-stone-600 px-3 py-1 rounded-full text-xs font-bold">
                  {orders.length} Total
                </span>
              </div>

              {recentOrders.length > 0 ? (
                <div className="space-y-4 mb-6">
                  {recentOrders.map(order => (
                    <div key={order.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-stone-50 rounded-xl border border-stone-100 gap-4">
                      <div>
                        <p className="font-bold text-[#143A2A] mb-1">#{order.id}</p>
                        <p className="text-xs text-stone-500">{new Date(order.date).toLocaleDateString()}</p>
                      </div>
                      <div className="flex items-center justify-between w-full sm:w-auto sm:gap-6">
                        <div className="text-left sm:text-right">
                          <p className="font-bold text-stone-800">₹{order.total}</p>
                          <p className={`text-xs font-bold mt-1 ${order.status === 'Completed' || order.status === 'Delivered' ? 'text-green-600' : 'text-[#D4A24A]'}`}>
                            {order.status}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-stone-50 rounded-xl mb-6">
                  <Package className="w-10 h-10 text-stone-300 mx-auto mb-3" />
                  <p className="text-stone-500 text-sm">No orders found.</p>
                </div>
              )}

              <button 
                onClick={() => navigate('/account/orders')}
                className="w-full flex items-center justify-center gap-2 py-3 bg-[#143A2A] text-white rounded-xl font-bold text-sm tracking-wider hover:bg-[#0E281C] transition-colors"
              >
                View All Orders
                <ChevronRight className="w-4 h-4" />
              </button>
            </motion.div>

          </div>

          {/* Sidebar Column */}
          <div className="space-y-6">
            
            {/* Wishlist Summary */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-[#C28E63]/10 flex items-center justify-center">
                  <Heart className="w-5 h-5 text-[#C28E63]" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-[#143A2A]">My Wishlist</h2>
                  <p className="text-sm text-stone-500">{wishlistCount} Saved Products</p>
                </div>
              </div>
              <button 
                onClick={() => {
                  // Wait, how do I open the wishlist from here? 
                  // I should probably navigate to /shop or open the wishlist drawer. 
                  // I don't have setIsWishlistOpen prop here. I can just dispatch a custom event or navigate.
                  // Since I can't open drawer, I'll navigate to shop. But the user said "Navigate to the existing Wishlist page."
                  // There is no /wishlist page, it's a drawer. Let me just simulate a click on the navbar wishlist icon if possible, or add an event.
                  // For now, I'll navigate to shop and let them open it. Oh, let's pass a custom event.
                  const event = new CustomEvent('open-wishlist');
                  window.dispatchEvent(event);
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 border border-stone-200 text-stone-600 rounded-xl font-bold text-sm hover:bg-stone-50 hover:text-stone-900 transition-colors"
              >
                View Wishlist
              </button>
            </motion.div>

            {/* Account Actions */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100"
            >
              <h2 className="text-sm font-bold text-stone-400 uppercase tracking-widest mb-4">Account Actions</h2>
              <button 
                onClick={() => {
                  onLogout();
                  navigate('/');
                }}
                className="w-full flex items-center justify-center gap-2 py-3 bg-red-50 text-red-600 rounded-xl font-bold text-sm hover:bg-red-100 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </motion.div>

          </div>

        </div>
      </div>
    </div>
  );
}
