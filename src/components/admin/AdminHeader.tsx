import { useState, useMemo, useRef, useEffect, ReactNode } from 'react';
import { Product, User, Order } from '../../types';
import { Bell, Search, LogOut, ExternalLink, ShoppingBag, Users as UsersIcon, Layers, X } from 'lucide-react';
import type { AdminSection } from './AdminLayout';

interface AdminHeaderProps {
  adminName: string;
  adminEmail: string;
  products: Product[];
  orders: Order[];
  users: User[];
  newLeadsCount: number;
  onNavigate: (section: AdminSection) => void;
  onLogout: () => void;
  onOpenSidebar: () => void;
}

export default function AdminHeader({ adminName, adminEmail, products, orders, users, newLeadsCount, onNavigate, onLogout, onOpenSidebar }: AdminHeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const pendingOrdersCount = orders.filter(o => o.status === 'Pending').length;
  const totalNotifications = pendingOrdersCount + newLeadsCount;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setSearchOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return { products: [], orders: [], users: [] };
    return {
      products: products.filter(p => p.name.toLowerCase().includes(q)).slice(0, 4),
      orders: orders.filter(o => o.id.toLowerCase().includes(q) || o.customerName.toLowerCase().includes(q)).slice(0, 4),
      users: users.filter(u => u.fullName.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)).slice(0, 4),
    };
  }, [searchQuery, products, orders, users]);

  const hasResults = searchResults.products.length + searchResults.orders.length + searchResults.users.length > 0;

  return (
    <header className="sticky top-0 z-40 h-16 bg-primary text-white flex items-center justify-between px-4 sm:px-6 shadow-sm shrink-0">
      <div className="flex items-center gap-3">
        <button onClick={onOpenSidebar} className="lg:hidden p-1.5 -ml-1 cursor-pointer">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>
        <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center font-serif italic font-bold text-sm shrink-0">B</div>
        <div className="leading-tight hidden sm:block">
          <p className="font-serif text-sm font-bold">Bihar Bite</p>
          <p className="text-[10px] text-white/60 uppercase tracking-wider">Admin Control</p>
        </div>
      </div>

      {/* Quick search */}
      <div ref={searchRef} className="relative flex-1 max-w-md mx-4 hidden md:block">
        <Search className="absolute left-3 top-2.5 w-4 h-4 text-white/50" />
        <input
          type="text"
          placeholder="Search products, orders, customers..."
          value={searchQuery}
          onChange={(e) => { setSearchQuery(e.target.value); setSearchOpen(true); }}
          onFocus={() => setSearchOpen(true)}
          className="w-full bg-white/10 focus:bg-white/15 border border-white/10 rounded-xl py-2 pl-9 pr-8 text-xs text-white placeholder-white/50 focus:outline-none transition-colors"
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery('')} className="absolute right-2.5 top-2.5 text-white/50 hover:text-white cursor-pointer">
            <X className="w-3.5 h-3.5" />
          </button>
        )}

        {searchOpen && searchQuery && (
          <div className="absolute top-full mt-2 left-0 w-full bg-white rounded-2xl shadow-xl border border-[#E5DFD1] overflow-hidden text-on-surface z-50">
            {!hasResults ? (
              <p className="p-4 text-xs text-on-surface-variant/60 text-center">No matches found.</p>
            ) : (
              <div className="max-h-80 overflow-y-auto divide-y divide-[#E5DFD1]/50">
                {searchResults.products.length > 0 && (
                  <SearchGroup icon={<Layers className="w-3.5 h-3.5" />} label="Products">
                    {searchResults.products.map(p => (
                      <SearchItem key={p.id} title={p.name} subtitle={`₹${p.price} · ${p.category}`} onClick={() => { onNavigate('products'); setSearchOpen(false); setSearchQuery(''); }} />
                    ))}
                  </SearchGroup>
                )}
                {searchResults.orders.length > 0 && (
                  <SearchGroup icon={<ShoppingBag className="w-3.5 h-3.5" />} label="Orders">
                    {searchResults.orders.map(o => (
                      <SearchItem key={o.id} title={`Order #${o.id}`} subtitle={`${o.customerName} · ₹${o.total}`} onClick={() => { onNavigate('orders'); setSearchOpen(false); setSearchQuery(''); }} />
                    ))}
                  </SearchGroup>
                )}
                {searchResults.users.length > 0 && (
                  <SearchGroup icon={<UsersIcon className="w-3.5 h-3.5" />} label="Customers">
                    {searchResults.users.map(u => (
                      <SearchItem key={u.id} title={u.fullName} subtitle={u.email} onClick={() => { onNavigate('customers'); setSearchOpen(false); setSearchQuery(''); }} />
                    ))}
                  </SearchGroup>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Notifications */}
        <div ref={notifRef} className="relative">
          <button onClick={() => setNotifOpen(o => !o)} className="relative p-2 rounded-xl hover:bg-white/10 transition-colors cursor-pointer">
            <Bell className="w-4.5 h-4.5" />
            {totalNotifications > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-[#A85344] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">{totalNotifications > 9 ? '9+' : totalNotifications}</span>
            )}
          </button>
          {notifOpen && (
            <div className="absolute top-full mt-2 right-0 w-72 bg-white rounded-2xl shadow-xl border border-[#E5DFD1] overflow-hidden text-on-surface z-50">
              <div className="p-3 border-b border-[#E5DFD1] text-[10px] uppercase font-bold text-[#4A4A3A] tracking-wider">Notifications</div>
              <button onClick={() => { onNavigate('orders'); setNotifOpen(false); }} className="w-full flex items-center gap-3 p-3 hover:bg-[#FAF8F4] transition-colors text-left cursor-pointer">
                <div className="w-8 h-8 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center shrink-0"><ShoppingBag className="w-4 h-4" /></div>
                <div>
                  <p className="text-xs font-bold text-primary">{pendingOrdersCount} order{pendingOrdersCount === 1 ? '' : 's'} awaiting dispatch</p>
                  <p className="text-[10px] text-on-surface-variant/60">Tap to review orders</p>
                </div>
              </button>
              <button onClick={() => { onNavigate('inquiries'); setNotifOpen(false); }} className="w-full flex items-center gap-3 p-3 hover:bg-[#FAF8F4] transition-colors text-left cursor-pointer">
                <div className="w-8 h-8 bg-red-100 text-red-700 rounded-full flex items-center justify-center shrink-0"><UsersIcon className="w-4 h-4" /></div>
                <div>
                  <p className="text-xs font-bold text-primary">{newLeadsCount} new inquir{newLeadsCount === 1 ? 'y' : 'ies'}</p>
                  <p className="text-[10px] text-on-surface-variant/60">Tap to review leads</p>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* View storefront */}
        <button onClick={() => window.open('/', '_blank')} className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/20 hover:bg-white/10 text-xs font-bold transition-colors cursor-pointer">
          <ExternalLink className="w-3.5 h-3.5" /> View Store
        </button>

        {/* Profile */}
        <div ref={profileRef} className="relative">
          <button onClick={() => setProfileOpen(o => !o)} className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl hover:bg-white/10 transition-colors cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-secondary text-white font-serif italic font-bold flex items-center justify-center text-sm">{adminName.charAt(0).toUpperCase()}</div>
            <span className="text-xs font-bold hidden sm:inline">{adminName}</span>
          </button>
          {profileOpen && (
            <div className="absolute top-full mt-2 right-0 w-56 bg-white rounded-2xl shadow-xl border border-[#E5DFD1] overflow-hidden text-on-surface z-50">
              <div className="p-3 border-b border-[#E5DFD1]">
                <p className="text-xs font-bold text-primary">{adminName}</p>
                <p className="text-[10px] text-on-surface-variant/60">{adminEmail}</p>
              </div>
              <button onClick={onLogout} className="w-full flex items-center gap-2 p-3 text-xs font-bold text-[#A85344] hover:bg-red-50 transition-colors cursor-pointer">
                <LogOut className="w-3.5 h-3.5" /> Exit Terminal
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function SearchGroup({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-1.5 px-4 pt-3 pb-1 text-[9px] uppercase font-bold text-[#4A4A3A]/70 tracking-wider">{icon}{label}</div>
      {children}
    </div>
  );
}

function SearchItem({ title, subtitle, onClick }: { key?: string; title: string; subtitle: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="w-full text-left px-4 py-2 hover:bg-[#FAF8F4] transition-colors cursor-pointer">
      <p className="text-xs font-bold text-primary truncate">{title}</p>
      <p className="text-[10px] text-on-surface-variant/60 truncate">{subtitle}</p>
    </button>
  );
}