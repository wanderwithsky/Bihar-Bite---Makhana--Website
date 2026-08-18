import { useState, useEffect } from 'react';
import { Order } from '../../types';
import { Search, Mail, ShoppingBag, ArrowLeft, MapPin, Trash2, Loader2 } from 'lucide-react';
import { fetchAllOrders, deleteGuestCustomer } from '../../lib/supabase';

interface AdminGuestCustomersTabProps {
  orders: Order[]; // keeping prop for fallback
}

export default function AdminGuestCustomersTab({ orders: initialOrders }: AdminGuestCustomersTabProps) {
  const [search, setSearch] = useState('');
  const [selectedGuest, setSelectedGuest] = useState<any | null>(null);
  const [liveOrders, setLiveOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const loadData = async () => {
      try {
        const orders = await fetchAllOrders();
        if (mounted) {
          setLiveOrders(orders);
        }
      } catch (err: any) {
        console.error(err);
        if (mounted) setErrorMsg(err.message || 'Database query failed.');
      } finally {
        if (mounted) setIsLoading(false);
      }
    };
    loadData();
    return () => { mounted = false; };
  }, []);

  // Group guest orders by email
  const guestOrders = liveOrders.filter(o => !o.customerId);
  const guestCustomersMap = new Map<string, any>();

  guestOrders.forEach(o => {
    const email = o.customerEmail.toLowerCase();
    if (o.customerName === 'Deleted Guest') return; // Ignore anonymized deleted guests

    if (!guestCustomersMap.has(email)) {
      guestCustomersMap.set(email, {
        name: o.customerName,
        email: o.customerEmail,
        mobile: o.customerMobile || 'N/A',
        orders: [],
        totalSpent: 0
      });
    }
    const customer = guestCustomersMap.get(email)!;
    customer.orders.push(o);
    customer.totalSpent += o.total;
  });

  const guestCustomers = Array.from(guestCustomersMap.values());
  
  const filteredGuests = guestCustomers.filter(g =>
    g.name.toLowerCase().includes(search.toLowerCase()) ||
    g.email.toLowerCase().includes(search.toLowerCase()) ||
    g.mobile.includes(search) ||
    g.orders.some((o: Order) => o.id.toLowerCase().includes(search.toLowerCase()))
  );

  const handleDelete = async (guest: any) => {
    if (window.confirm(`Delete this guest customer?\n\nDeleting this guest customer will remove their guest customer record. Historical orders/invoices will be preserved.`)) {
      setIsDeleting(true);
      const success = await deleteGuestCustomer(guest.email);
      if (success) {
        // Optimistically remove the deleted guest from UI by filtering out their orders
        setLiveOrders(prev => prev.filter(o => o.customerEmail.toLowerCase() !== guest.email.toLowerCase()));
        if (selectedGuest?.email === guest.email) setSelectedGuest(null);
      } else {
        alert('Failed to delete guest customer.');
      }
      setIsDeleting(false);
    }
  };

  if (selectedGuest) {
    return (
      <div className="space-y-6 animate-fade-in">
        <button 
          onClick={() => setSelectedGuest(null)}
          className="flex items-center gap-2 text-sm font-bold text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Guest Customers
        </button>

        <div className="bg-white border border-[#E5DFD1] rounded-3xl p-6 lg:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#E5DFD1]/60 pb-6 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-stone-100 text-stone-500 font-serif italic text-2xl flex items-center justify-center shadow-inner shrink-0">
                {selectedGuest.name.charAt(0)}
              </div>
              <div>
                <h2 className="font-serif text-2xl font-bold text-primary">{selectedGuest.name}</h2>
                <span className="px-2.5 py-1 bg-stone-100 text-stone-600 rounded-full text-[10px] font-bold uppercase tracking-wider mt-2 inline-block">Guest Checkout</span>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="grid grid-cols-2 gap-6 bg-[#FAF8F4] p-4 rounded-2xl border border-[#E5DFD1]/40">
                <div>
                  <p className="text-[10px] uppercase font-bold text-on-surface-variant/70">Total Spent</p>
                  <p className="font-bold text-primary text-lg">₹{selectedGuest.totalSpent}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-on-surface-variant/70">Total Orders</p>
                  <p className="font-bold text-primary text-lg">{selectedGuest.orders.length}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <button
                  onClick={() => handleDelete(selectedGuest)}
                  disabled={isDeleting}
                  className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" /> Delete Guest
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#4A4A3A] border-b border-[#E5DFD1] pb-2">Contact Details</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="w-4 h-4 text-on-surface-variant/50" />
                  <span className="text-primary font-medium">{selectedGuest.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-on-surface-variant/50 text-sm pl-0.5">📞</span>
                  <span className="text-primary font-medium">{selectedGuest.mobile}</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#4A4A3A] border-b border-[#E5DFD1] pb-2">Last Delivery Address</h3>
              <div className="flex items-start gap-3 text-sm">
                <MapPin className="w-4 h-4 text-on-surface-variant/50 mt-0.5 shrink-0" />
                <span className="text-primary font-medium leading-relaxed">
                  {selectedGuest.orders[0]?.shippingAddress || 'No address provided'}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#4A4A3A] border-b border-[#E5DFD1] pb-2">Guest Order History</h3>
            {selectedGuest.orders.map((order: Order) => (
              <div key={order.id} className="bg-[#FAF8F4] border border-[#E5DFD1]/60 rounded-2xl p-4 md:p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-primary">{order.id}</span>
                    <span className="text-[10px] font-bold text-on-surface-variant/60">{order.date}</span>
                  </div>
                  <p className="text-xs text-on-surface-variant line-clamp-1">
                    {order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                  </p>
                </div>
                
                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right">
                    <p className="font-bold text-primary">₹{order.total}</p>
                    <p className="text-[10px] uppercase font-bold text-on-surface-variant/70">{order.paymentMethod === 'online' ? 'Online' : 'COD'}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider
                    ${order.status === 'Completed' || order.status === 'Delivered' ? 'bg-green-100 text-green-800' : ''}
                    ${order.status === 'Pending' || order.status === 'Processing' ? 'bg-amber-100 text-amber-800' : ''}
                    ${order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' : ''}
                    ${order.status === 'Cancelled' || order.status === 'Returned' ? 'bg-red-100 text-red-800' : ''}
                  `}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <p className="text-xs text-on-surface-variant/70">Manage orders placed by customers without registered accounts.</p>

      <div className="flex bg-[#FAF8F4] p-4 rounded-2xl border border-[#E5DFD1]/60">
        <div className="relative flex-grow">
          <input type="text" placeholder="Search guest records by name, email, or Order ID..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-white border border-outline-variant/30 rounded-xl py-2.5 pl-10 pr-4 text-xs focus:outline-none focus:border-primary text-on-surface" />
          <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-on-surface-variant/70" />
        </div>
      </div>

      {filteredGuests.length === 0 ? (
        <div className="bg-white border border-[#E5DFD1]/60 rounded-3xl p-12 text-center flex flex-col items-center shadow-sm">
          <ShoppingBag className="w-12 h-12 text-[#E5DFD1] mb-4" />
          {errorMsg ? (
            <>
              <h3 className="text-lg font-serif font-bold text-red-500 mb-1">{errorMsg}</h3>
              <p className="text-sm text-on-surface-variant/70">Failed to load guest orders.</p>
            </>
          ) : (
            <>
              <h3 className="text-lg font-serif font-bold text-primary mb-1">No guest checkout orders yet</h3>
              <p className="text-sm text-on-surface-variant/70">Guest checkout records will automatically appear here when an unregistered user places an order.</p>
            </>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredGuests.map((guest, idx) => (
            <div key={idx} onClick={() => setSelectedGuest(guest)} className="bg-white border border-outline-variant/30 hover:border-[#7C8464]/40 hover:shadow-md rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-5 transition-all cursor-pointer group">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-full bg-stone-100 group-hover:bg-[#FAF8F4] text-stone-500 font-serif italic text-lg flex items-center justify-center shadow-inner shrink-0 transition-colors">{guest.name.charAt(0)}</div>
                  <div>
                    <h4 className="font-serif text-base font-bold text-primary">{guest.name}</h4>
                    <p className="text-xs text-on-surface-variant/70 flex items-center gap-1.5 mt-0.5"><Mail className="w-3.5 h-3.5 text-on-surface-variant/50" />{guest.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 bg-stone-100 text-stone-600 rounded-full text-[9px] font-bold uppercase tracking-wider">Guest</span>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleDelete(guest); }}
                    disabled={isDeleting}
                    className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    title="Delete Guest"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 bg-[#FAF8F4] group-hover:bg-white p-3.5 rounded-2xl border border-[#E5DFD1]/40 transition-colors text-[11px]">
                <div className="space-y-1"><span className="text-on-surface-variant/60 uppercase text-[9px] font-bold">Mobile Cell</span><p className="font-semibold text-primary">{guest.mobile}</p></div>
                <div className="space-y-1"><span className="text-on-surface-variant/60 uppercase text-[9px] font-bold">Total Spent</span><p className="font-semibold text-primary">₹{guest.totalSpent}</p></div>
                <div className="space-y-1 col-span-2 flex justify-between items-center">
                  <div>
                    <span className="text-on-surface-variant/60 uppercase text-[9px] font-bold">Order History</span>
                    <p className="font-semibold text-primary">{guest.orders.length} guest order(s)</p>
                  </div>
                  <div className="text-xs font-bold text-secondary flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    View Details <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
