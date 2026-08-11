import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Order } from '../types';
import { Package, ArrowLeft, ChevronRight, CheckCircle2, Clock, XCircle, Download } from 'lucide-react';
import { motion } from 'motion/react';
import { generateInvoicePDF } from '../utils/pdfGenerator';

interface OrdersScreenProps {
  currentUser: User | null;
  orders: Order[];
  onOpenAuthModal: () => void;
}

export default function OrdersScreen({ currentUser, orders, onOpenAuthModal }: OrdersScreenProps) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      onOpenAuthModal();
      navigate('/');
    }
  }, [currentUser, navigate, onOpenAuthModal]);

  if (!currentUser) return null;

  const sortedOrders = [...orders].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
      case 'Delivered':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'Cancelled':
      case 'Returned':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-[#D4A24A] bg-[#D4A24A]/10 border-[#D4A24A]/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed':
      case 'Delivered':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'Cancelled':
      case 'Returned':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] pt-28 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Back navigation & Header */}
        <div className="mb-8">
          <Link to="/account" className="inline-flex items-center gap-2 text-stone-500 hover:text-[#143A2A] font-medium text-sm transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Account
          </Link>
          <div className="flex items-center justify-between">
            <h1 className="font-serif text-3xl md:text-4xl text-[#143A2A]">Order History</h1>
            <span className="bg-white border border-stone-200 text-stone-600 px-4 py-1.5 rounded-full text-sm font-bold shadow-sm">
              {orders.length} Orders
            </span>
          </div>
        </div>

        {/* Orders List */}
        {sortedOrders.length > 0 ? (
          <div className="space-y-6">
            {sortedOrders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-stone-100 flex flex-col md:flex-row gap-6 md:gap-8 justify-between"
              >
                {/* Left Side: Order Details */}
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <h3 className="text-xl font-bold text-[#143A2A]">Order #{order.id}</h3>
                    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      {order.status}
                    </div>
                  </div>
                  
                  <div className="text-sm text-stone-500 mb-6">
                    <p>
                      Placed on {new Date(order.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                      {order.time ? `, ${order.time}` : ''}
                    </p>
                    {order.deliveryStartDate && order.deliveryEndDate && (
                      <p className="mt-1 font-semibold text-[#143A2A]">
                        Est. Delivery: {new Date(order.deliveryStartDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – {new Date(order.deliveryEndDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </p>
                    )}
                  </div>

                  <div className="space-y-3">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-4 text-sm bg-stone-50 p-3 rounded-xl border border-stone-100/50">
                        <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center border border-stone-200 shrink-0 overflow-hidden">
                          <Package className="w-6 h-6 text-stone-400" />
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-stone-800">{item.name}</p>
                          <p className="text-stone-500 text-xs mt-0.5">Weight: {item.weight} • Qty: {item.quantity}</p>
                        </div>
                        <div className="font-bold text-stone-800">
                          ₹{item.price * item.quantity}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Side: Summary & Actions */}
                <div className="flex flex-col justify-between items-start md:items-end border-t md:border-t-0 md:border-l border-stone-100 pt-6 md:pt-0 md:pl-8 md:min-w-[200px]">
                  <div className="w-full text-left md:text-right mb-6 md:mb-0">
                    <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-1">Total Amount</p>
                    <p className="text-3xl font-bold text-[#7C8464]">₹{order.total}</p>
                    <p className="text-xs text-stone-500 mt-2">{order.paymentStatus || 'Payment Pending'}</p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row md:flex-col gap-3 w-full md:w-auto">
                    <button 
                      onClick={() => navigate('/track-order', { state: { orderId: order.id } })}
                      className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#143A2A] text-white rounded-full font-bold text-sm tracking-wider hover:bg-[#0E281C] transition-colors shadow-md"
                    >
                      View Details
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => generateInvoicePDF(order)}
                      className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-[#143A2A] text-[#143A2A] rounded-full font-bold text-sm tracking-wider hover:bg-stone-50 transition-colors shadow-sm"
                    >
                      <Download className="w-4 h-4" />
                      Invoice
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20 bg-white rounded-3xl border border-stone-100 shadow-sm"
          >
            <div className="w-24 h-24 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="w-10 h-10 text-stone-300" />
            </div>
            <h2 className="text-2xl font-serif text-[#143A2A] mb-3">No orders yet</h2>
            <p className="text-stone-500 max-w-md mx-auto mb-8">
              You haven't placed any orders yet. Discover our premium quality Makhanas and place your first order!
            </p>
            <Link 
              to="/shop"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#143A2A] text-white rounded-full font-bold text-sm tracking-widest uppercase hover:bg-[#0E281C] transition-colors shadow-xl"
            >
              Start Shopping
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}
