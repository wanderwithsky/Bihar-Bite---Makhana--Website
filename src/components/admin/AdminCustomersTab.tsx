import { useState, useEffect } from 'react';
import { User, Order, AppUser } from '../../types';
import { Search, Mail, UserCheck, UserX, ArrowLeft, MapPin, Users, Loader2 } from 'lucide-react';
import { fetchAllProfiles, fetchAllOrders, updateUserProfile } from '../../lib/supabase';

interface AdminCustomersTabProps {
  users: User[]; // keeping prop for fallback/compat
  onUpdateUserStatus: (userId: string, status: 'Active' | 'Suspended') => void;
  showToast: (msg: string, type?: 'success' | 'error') => void;
}

export default function AdminCustomersTab({ showToast }: AdminCustomersTabProps) {
  const [userSearch, setUserSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<AppUser & { orderHistory: Order[] } | null>(null);
  const [liveProfiles, setLiveProfiles] = useState<AppUser[]>([]);
  const [liveOrders, setLiveOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const loadData = async () => {
      try {
        setErrorMsg(null);
        const [profiles, orders] = await Promise.all([
          fetchAllProfiles(),
          fetchAllOrders()
        ]);
        if (mounted) {
          setLiveProfiles(profiles);
          setLiveOrders(orders);
        }
      } catch (err: any) {
        console.error('Failed to fetch customers:', err);
        if (mounted) {
          setErrorMsg(err.message || 'An unexpected error occurred while fetching customers.');
        }
      } finally {
        if (mounted) setIsLoading(false);
      }
    };
    loadData();
    return () => { mounted = false; };
  }, []);

  // Map order history dynamically
  const usersWithOrders = liveProfiles.map(profile => ({
    ...profile,
    fullName: profile.full_name,
    orderHistory: liveOrders.filter(o => o.customerId === profile.id),
    dateRegistered: profile.created_at ? new Date(profile.created_at).toLocaleDateString() : 'N/A',
    savedAddresses: profile.saved_addresses || []
  }));

  const filteredUsers = usersWithOrders.filter(u =>
    (u.full_name || '').toLowerCase().includes(userSearch.toLowerCase()) ||
    (u.email || '').toLowerCase().includes(userSearch.toLowerCase()) ||
    (u.mobile || '').includes(userSearch)
  );

  const handleStatusUpdate = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'Active' ? 'Suspended' : 'Active';
    const success = await updateUserProfile(userId, { status: newStatus });
    if (success) {
      setLiveProfiles(prev => prev.map(p => p.id === userId ? { ...p, status: newStatus } : p));
      if (selectedUser && selectedUser.id === userId) {
        setSelectedUser({ ...selectedUser, status: newStatus });
      }
      showToast(`Account status updated to ${newStatus}.`, 'success');
    } else {
      showToast('Failed to update account status.', 'error');
    }
  };

  if (selectedUser) {
    const totalSpent = selectedUser.orderHistory.reduce((sum, order) => sum + order.total, 0);

    return (
      <div className="space-y-6 animate-fade-in">
        <button 
          onClick={() => setSelectedUser(null)}
          className="flex items-center gap-2 text-sm font-bold text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Registered Customers
        </button>

        <div className="bg-white border border-[#E5DFD1] rounded-3xl p-6 lg:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#E5DFD1]/60 pb-6 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-[#7C8464] text-white font-serif italic text-2xl flex items-center justify-center shadow-inner shrink-0">
                {selectedUser.fullName.charAt(0)}
              </div>
              <div>
                <h2 className="font-serif text-2xl font-bold text-primary">{selectedUser.fullName}</h2>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mt-2 inline-block ${selectedUser.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {selectedUser.status}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6 bg-[#FAF8F4] p-4 rounded-2xl border border-[#E5DFD1]/40">
              <div>
                <p className="text-[10px] uppercase font-bold text-on-surface-variant/70">Total Spent</p>
                <p className="font-bold text-primary text-lg">₹{totalSpent}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-on-surface-variant/70">Total Orders</p>
                <p className="font-bold text-primary text-lg">{selectedUser.orderHistory.length}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#4A4A3A] border-b border-[#E5DFD1] pb-2">Contact Details</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="w-4 h-4 text-on-surface-variant/50" />
                  <span className="text-primary font-medium">{selectedUser.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-on-surface-variant/50 text-sm pl-0.5">📞</span>
                  <span className="text-primary font-medium">{selectedUser.mobile}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-on-surface-variant/50 text-sm pl-0.5">📅</span>
                  <span className="text-primary font-medium">Joined {selectedUser.dateRegistered}</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#4A4A3A] border-b border-[#E5DFD1] pb-2">Saved Addresses</h3>
              {selectedUser.savedAddresses && selectedUser.savedAddresses.length > 0 ? (
                <div className="space-y-3">
                  {selectedUser.savedAddresses.map(addr => (
                    <div key={addr.id} className="flex items-start gap-3 text-sm">
                      <MapPin className="w-4 h-4 text-on-surface-variant/50 mt-0.5 shrink-0" />
                      <div>
                        <span className="text-primary font-medium block">
                          {addr.streetAddress}{addr.apartment ? `, ${addr.apartment}` : ''}
                        </span>
                        <span className="text-on-surface-variant/70 text-xs">{addr.city}, {addr.state} - {addr.pincode}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-on-surface-variant/70">No saved addresses</p>
              )}
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#4A4A3A] border-b border-[#E5DFD1] pb-2">Order History</h3>
            {selectedUser.orderHistory.length === 0 ? (
              <p className="text-sm text-on-surface-variant/70">No orders placed yet.</p>
            ) : (
              selectedUser.orderHistory.map((order: Order) => (
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
              ))
            )}
          </div>

          <div className="border-t border-[#E5DFD1]/60 pt-6 flex justify-end">
            {selectedUser.status === 'Active' ? (
              <button onClick={() => handleStatusUpdate(selectedUser.id, 'Active')} className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer">
                <UserX className="w-4 h-4" /> Suspend Account
              </button>
            ) : (
              <button onClick={() => handleStatusUpdate(selectedUser.id, 'Suspended')} className="px-4 py-2 bg-green-50 hover:bg-green-100 text-green-700 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer">
                <UserCheck className="w-4 h-4" /> Reactivate Account
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <p className="text-xs text-on-surface-variant/70">Access profiles, contact numbers, status suspension triggers, and purchase history of registered users.</p>

      {isLoading ? (
        <div className="bg-white border border-[#E5DFD1]/60 rounded-3xl p-12 text-center flex flex-col items-center shadow-sm">
          <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
          <h3 className="text-lg font-serif font-bold text-primary mb-1">Loading Customers</h3>
          <p className="text-sm text-on-surface-variant/70">Please wait while we fetch registered users from the database...</p>
        </div>
      ) : errorMsg ? (
        <div className="bg-white border border-red-200 rounded-3xl p-12 text-center flex flex-col items-center shadow-sm">
          <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">!</div>
          <h3 className="text-lg font-serif font-bold text-red-700 mb-1">Failed to load customers</h3>
          <p className="text-sm text-red-500/80">{errorMsg}</p>
        </div>
      ) : usersWithOrders.length === 0 ? (
        <div className="bg-white border border-[#E5DFD1]/60 rounded-3xl p-12 text-center flex flex-col items-center shadow-sm">
          <Users className="w-12 h-12 text-[#E5DFD1] mb-4" />
          <h3 className="text-lg font-serif font-bold text-primary mb-1">No registered customers yet</h3>
          <p className="text-sm text-on-surface-variant/70">When users create an account, their profiles will appear here.</p>
        </div>
      ) : (
        <>
          <div className="flex bg-[#FAF8F4] p-4 rounded-2xl border border-[#E5DFD1]/60">
            <div className="relative flex-grow">
              <input type="text" placeholder="Search registered customers by name, email, or cell..." value={userSearch} onChange={(e) => setUserSearch(e.target.value)} className="w-full bg-white border border-outline-variant/30 rounded-xl py-2.5 pl-10 pr-4 text-xs focus:outline-none focus:border-primary text-on-surface" />
              <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-on-surface-variant/70" />
            </div>
          </div>

          {filteredUsers.length === 0 ? (
            <div className="py-12 text-center text-on-surface-variant/70">
              No customers found matching your search.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredUsers.map(user => (
                <div key={user.id} onClick={() => setSelectedUser(user)} className="bg-white border border-outline-variant/30 hover:border-[#7C8464]/40 hover:shadow-md rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-5 transition-all cursor-pointer group">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-full bg-[#7C8464] group-hover:bg-[#687053] transition-colors text-white font-serif italic text-lg flex items-center justify-center shadow-inner shrink-0">{user.fullName.charAt(0)}</div>
                      <div>
                        <h4 className="font-serif text-base font-bold text-primary">{user.fullName}</h4>
                        <p className="text-xs text-on-surface-variant/70 flex items-center gap-1.5 mt-0.5"><Mail className="w-3.5 h-3.5 text-on-surface-variant/50" />{user.email}</p>
                      </div>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider ${user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{user.status}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 bg-[#FAF8F4] group-hover:bg-white p-3.5 rounded-2xl border border-[#E5DFD1]/40 transition-colors text-[11px]">
                    <div className="space-y-1"><span className="text-on-surface-variant/60 uppercase text-[9px] font-bold">Mobile Cell</span><p className="font-semibold text-primary">{user.mobile}</p></div>
                    <div className="space-y-1"><span className="text-on-surface-variant/60 uppercase text-[9px] font-bold">Registered Date</span><p className="font-semibold text-primary">{user.dateRegistered}</p></div>
                    <div className="space-y-1 col-span-2 flex justify-between items-center">
                      <div>
                        <span className="text-on-surface-variant/60 uppercase text-[9px] font-bold">Total Order History</span>
                        <p className="font-semibold text-primary">{user.orderHistory.length} orders placed</p>
                      </div>
                      <div className="text-xs font-bold text-secondary flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        View Profile <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}