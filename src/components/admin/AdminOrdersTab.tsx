import { useState, useEffect } from 'react';
import { Order } from '../../types';
import { Phone, Loader2 } from 'lucide-react';
import { fetchAllOrders, updateOrderStatusInDb } from '../../lib/supabase';

interface AdminOrdersTabProps {
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, status: Order['status']) => void;
  showToast: (msg: string, type?: 'success' | 'error') => void;
}

export default function AdminOrdersTab({ orders: initialOrders, onUpdateOrderStatus, showToast }: AdminOrdersTabProps) {
  const [orderFilter, setOrderFilter] = useState<'All' | Order['status']>('All');
  const [orderSearch, setOrderSearch] = useState('');
  const [liveOrders, setLiveOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const loadOrders = async () => {
      try {
        const data = await fetchAllOrders();
        if (mounted) {
          setLiveOrders(data);
        }
      } catch (err: any) {
        console.error('Failed to load live orders:', err);
        if (mounted) {
          setErrorMsg(err.message || 'Database query failed.');
          showToast('Failed to load latest orders', 'error');
        }
      } finally {
        if (mounted) setIsLoading(false);
      }
    };
    loadOrders();
    return () => { mounted = false; };
  }, [showToast]);

  const handleUpdateLocalStatus = async (orderId: string, newStatus: string) => {
    // Optimistic update
    setLiveOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus as any } : o));
    onUpdateOrderStatus(orderId, newStatus as any); // Sync with global state if needed
    
    // Update DB
    const success = await updateOrderStatusInDb(orderId, newStatus);
    if (success) {
      showToast(`Order #${orderId} status modified!`, 'success');
    } else {
      showToast('Failed to save status change to database.', 'error');
    }
  };

  const filteredOrders = liveOrders.filter(o => {
    const matchesStatus = orderFilter === 'All' || o.status === orderFilter;
    const q = orderSearch.toLowerCase().trim();
    const matchesSearch = !q || o.customerName.toLowerCase().includes(q) || o.customerEmail.toLowerCase().includes(q) || o.id.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <p className="text-xs text-on-surface-variant/70">Modify dispatch states, view recipient addresses, and trace revenues.</p>
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="text"
            placeholder="Search by name, email, or order ID..."
            value={orderSearch}
            onChange={(e) => setOrderSearch(e.target.value)}
            className="bg-white border border-[#E5DFD1] text-xs px-3.5 py-2 rounded-xl text-on-surface focus:outline-none focus:border-primary shadow-sm w-56"
          />
          <select value={orderFilter} onChange={(e) => setOrderFilter(e.target.value as any)} className="bg-white border border-[#E5DFD1] text-xs px-3.5 py-2 rounded-xl text-on-surface focus:outline-none focus:border-primary font-bold shadow-sm">
            <option value="All">All Dispatch States</option>
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
            <option value="Returned">Returned</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-12 text-on-surface-variant/70 text-sm">
            {errorMsg ? (
              <span className="text-red-500 font-bold">{errorMsg}</span>
            ) : orderSearch ? (
              "No orders found matching your search."
            ) : (
              "No orders found."
            )}
          </div>
        ) : (
          filteredOrders.map(order => (
            <div key={order.id} className="bg-white border border-outline-variant/30 rounded-3xl p-5 hover:border-primary/30 transition-all space-y-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-outline-variant/10 pb-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-xs font-bold text-[#4A4A3A] uppercase bg-[#FAF8F4] border border-[#E5DFD1] px-2.5 py-1 rounded-lg">Order #{order.id}</span>
                  <span className="text-xs text-on-surface-variant/70 font-bold">{order.date}</span>
                </div>
                <div className="text-xs">
                  <span className="text-on-surface-variant/60">Placed by:</span> <span className="font-bold text-primary">{order.customerName}</span> <span className="text-on-surface-variant/60">({order.customerEmail})</span>
                </div>
                <div className="text-[10px] space-y-0.5 mt-1">
                  <div className="flex gap-2">
                    <span className="text-on-surface-variant/60">Payment:</span>
                    <span className={`font-bold ${order.paymentStatus === 'Paid' ? 'text-green-600' : 'text-amber-600'}`}>
                      {order.paymentMethod === 'online' ? 'Online' : 'COD'} - {order.paymentStatus || 'Pending'}
                    </span>
                  </div>
                  {order.razorpayOrderId && (
                    <div className="text-on-surface-variant/60">
                      Razorpay Order: <span className="font-mono text-[#4A4A3A] font-bold">{order.razorpayOrderId}</span>
                    </div>
                  )}
                  {order.razorpayPaymentId && (
                    <div className="text-on-surface-variant/60">
                      Razorpay Payment: <span className="font-mono text-[#4A4A3A] font-bold">{order.razorpayPaymentId}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3 self-start sm:self-auto">
                <span className="font-mono text-sm font-bold text-primary mr-1">₹{order.total}</span>
                <select
                  value={order.status}
                  onChange={(e) => handleUpdateLocalStatus(order.id, e.target.value)}
                  className={`text-[10px] font-bold uppercase tracking-wider border-0 rounded-xl px-3 py-1.5 focus:ring-2 focus:ring-primary/20 cursor-pointer ${
                    order.status === 'Completed' || order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                    order.status === 'Cancelled' || order.status === 'Returned' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-900'
                  }`}
                >
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                  <option value="Returned">Returned</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              <div className="md:col-span-6 space-y-2">
                <span className="text-[10px] tracking-widest font-bold uppercase text-[#4A4A3A]">Order items</span>
                <div className="space-y-1.5">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center text-xs text-on-surface-variant bg-[#FAF8F4]/50 px-3 py-2 rounded-xl">
                      <span>{item.name} <span className="font-mono text-[10px] text-on-surface-variant/60">({item.weight})</span></span>
                      <span className="font-bold">{item.quantity}x <span className="font-mono text-on-surface-variant/60 ml-1">₹{item.price}</span></span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="md:col-span-6 space-y-2">
                <span className="text-[10px] tracking-widest font-bold uppercase text-[#4A4A3A]">Shipping recipient destination</span>
                <div className="bg-[#FAF8F4] text-xs p-3.5 rounded-2xl border border-[#E5DFD1]/50 space-y-2 text-on-surface-variant/90 leading-relaxed">
                  <p>{order.shippingAddress}</p>
                  {order.customerMobile && (
                    <p className="text-[10px] font-bold text-[#7C8464] flex items-center gap-1 pt-1.5 border-t border-[#E5DFD1]/30"><Phone className="w-3 h-3" /> Cell Contact: {order.customerMobile}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )))}
      </div>
    </div>
  );
}