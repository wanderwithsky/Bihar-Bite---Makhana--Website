import { useState, ReactNode, useEffect } from 'react';
import { Product, User, Order } from '../../types';
import {
  TrendingUp, Layers, Users, ShoppingBag, Receipt, MessageSquare,
  Settings, X, Edit2
} from 'lucide-react';
import AdminHeader from './AdminHeader';
import AdminOverviewTab from './AdminOverviewTab';
import AdminProductsTab from './AdminProductsTab';
import AdminOrdersTab from './AdminOrdersTab';
import AdminCustomersTab from './AdminCustomersTab';
import AdminInvoicesTab from './AdminInvoicesTab';
import AdminInquiriesTab from './AdminInquiriesTab';
import { fetchInquiriesFromDb } from '../../lib/supabase';

interface AdminLayoutProps {
  products: Product[];
  onAddProduct: (newProduct: Product) => Promise<void>;
  onEditProduct: (updatedProduct: Product) => Promise<void>;
  onDeleteProduct: (productId: string) => Promise<void>;
  users: User[];
  onUpdateUserStatus: (userId: string, status: 'Active' | 'Suspended') => void;
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, status: Order['status']) => void;
  setScreen: (screen: any) => void;
  onLogout: () => void;
  showToast: (msg: string, type?: 'success' | 'error') => void;
  adminName?: string;
  adminEmail?: string;
}

export type AdminSection = 'overview' | 'products' | 'orders' | 'customers' | 'invoices' | 'inquiries' | 'settings';

const NAV_ITEMS: { id: AdminSection; name: string; icon: ReactNode; description: string }[] = [
  { id: 'overview', name: 'Overview', icon: <TrendingUp className="w-4 h-4" />, description: 'Analytics & summary' },
  { id: 'products', name: 'Products', icon: <Layers className="w-4 h-4" />, description: 'Catalog management' },
  { id: 'orders', name: 'Orders', icon: <ShoppingBag className="w-4 h-4" />, description: 'Dispatch & fulfillment' },
  { id: 'customers', name: 'Customers', icon: <Users className="w-4 h-4" />, description: 'User directory' },
  { id: 'invoices', name: 'Invoices & Billing', icon: <Receipt className="w-4 h-4" />, description: 'Billing records' },
  { id: 'inquiries', name: 'Inquiries & Leads', icon: <MessageSquare className="w-4 h-4" />, description: 'Contact & wholesale' },
  { id: 'settings', name: 'Settings', icon: <Settings className="w-4 h-4" />, description: 'Store configuration' },
];

export default function AdminLayout(props: AdminLayoutProps) {
  const { products, onAddProduct, onEditProduct, onDeleteProduct, users, onUpdateUserStatus, orders, onUpdateOrderStatus, setScreen, onLogout, showToast, adminName, adminEmail } = props;
  const [activeSection, setActiveSection] = useState<AdminSection>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [newLeadsCount, setNewLeadsCount] = useState(0);

  // Store Configuration State
  const DEFAULT_CONFIG = {
    storeName: 'Bihar Bite',
    supportEmail: 'hello@biharbite.com',
    supportPhone: '+91 98765 43210',
    origin: 'Mithila, Bihar'
  };
  
  const [storeConfig, setStoreConfig] = useState(() => {
    try {
      const saved = localStorage.getItem('biharbite_store_config');
      return saved ? JSON.parse(saved) : DEFAULT_CONFIG;
    } catch {
      return DEFAULT_CONFIG;
    }
  });
  
  const [isEditingConfig, setIsEditingConfig] = useState(false);
  const [configForm, setConfigForm] = useState(storeConfig);
  const [isSavingConfig, setIsSavingConfig] = useState(false);

  const handleSaveConfig = async () => {
    if (!configForm.storeName || !configForm.supportEmail || !configForm.supportPhone || !configForm.origin) {
      showToast('All fields are required', 'error');
      return;
    }

    setIsSavingConfig(true);
    
    // Simulate network delay for persistence
    await new Promise(resolve => setTimeout(resolve, 800));
    
    try {
      localStorage.setItem('biharbite_store_config', JSON.stringify(configForm));
      setStoreConfig(configForm);
      setIsEditingConfig(false);
      showToast('Store configuration saved successfully', 'success');
    } catch (error) {
      showToast('Failed to save configuration', 'error');
    } finally {
      setIsSavingConfig(false);
    }
  };

  const handleCancelConfig = () => {
    setConfigForm(storeConfig);
    setIsEditingConfig(false);
  };

  const activeMeta = NAV_ITEMS.find(n => n.id === activeSection)!;

  // Lightweight fetch just for the notification bell badge count.
  useEffect(() => {
    let cancelled = false;
    const loadLeadCount = async () => {
      try {
        const data = await fetchInquiriesFromDb('contact_messages');
        if (!cancelled && data) {
          setNewLeadsCount(data.filter((item: any) => item.status === 'New').length);
        }
      } catch (err) {
        // Non-critical — the notification badge simply stays at 0 on failure.
      }
    };
    loadLeadCount();
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F4] font-sans">
      <AdminHeader
        adminName={adminName || 'Admin'}
        adminEmail={adminEmail || 'admin@biharbite.com'}
        products={products}
        orders={orders}
        users={users}
        newLeadsCount={newLeadsCount}
        onNavigate={setActiveSection}
        onLogout={onLogout}
        onOpenSidebar={() => setSidebarOpen(true)}
      />

      <div className="flex flex-1 min-h-0">
        {/* Sidebar overlay (mobile) */}
        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 top-16 bg-black/40 z-40" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Sidebar */}
        <aside className={`fixed lg:sticky top-16 lg:top-0 left-0 h-[calc(100vh-64px)] w-72 bg-white border-r border-[#E5DFD1] z-50 lg:z-0 transform transition-transform duration-300 flex flex-col shrink-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}>
          <div className="p-5 border-b border-[#E5DFD1] flex items-center justify-between lg:hidden">
            <span className="text-xs font-bold uppercase tracking-wider text-[#4A4A3A]">Navigation</span>
            <button onClick={() => setSidebarOpen(false)} className="p-1.5 text-on-surface-variant cursor-pointer"><X className="w-5 h-5" /></button>
          </div>

          <nav className="flex-1 overflow-y-auto p-4 space-y-1">
            {NAV_ITEMS.map(item => (
              <button
                key={item.id}
                onClick={() => { setActiveSection(item.id); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-left transition-all cursor-pointer ${
                  activeSection === item.id ? 'bg-[#7C8464] text-white shadow-sm' : 'text-on-surface-variant hover:bg-[#FAF8F4]'
                }`}
              >
                <span className={activeSection === item.id ? 'text-white' : 'text-primary'}>{item.icon}</span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider">{item.name}</p>
                  <p className={`text-[10px] ${activeSection === item.id ? 'text-white/75' : 'text-on-surface-variant/60'}`}>{item.description}</p>
                </div>
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-[#E5DFD1]">
            <button onClick={() => setScreen('home')} className="w-full px-4 py-2.5 border border-[#E5DFD1] rounded-xl text-xs font-bold text-on-surface-variant hover:bg-[#FAF8F4] transition-colors cursor-pointer">
              Storefront Home
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0 px-4 sm:px-8 py-8 pb-20 overflow-y-auto">
          <div className="max-w-7xl mx-auto space-y-1 mb-8 pb-6 border-b border-[#E5DFD1]/60">
            <div className="flex items-center gap-2 text-secondary font-serif">
              <span className="italic text-sm">System Admin Control</span>
              <span className="text-white/30 text-xs bg-secondary/80 text-[#FAF8F4] px-2 py-0.5 rounded-full font-sans font-bold">LIVE</span>
            </div>
            <h1 className="font-serif text-3xl md:text-4xl font-light text-primary tracking-tight">{activeMeta.name}</h1>
          </div>

          <div className="max-w-7xl mx-auto">
            {activeSection === 'overview' && (
              <AdminOverviewTab products={products} users={users} orders={orders} onNavigate={setActiveSection} />
            )}
            {activeSection === 'products' && (
              <AdminProductsTab
                products={products}
                onAddProduct={onAddProduct}
                onEditProduct={onEditProduct}
                onDeleteProduct={onDeleteProduct}
                showToast={showToast}
              />
            )}
            {activeSection === 'orders' && (
              <AdminOrdersTab orders={orders} onUpdateOrderStatus={onUpdateOrderStatus} showToast={showToast} />
            )}
            {activeSection === 'customers' && (
              <AdminCustomersTab users={users} onUpdateUserStatus={onUpdateUserStatus} showToast={showToast} />
            )}
            {activeSection === 'invoices' && (
              <AdminInvoicesTab orders={orders} />
            )}
            {activeSection === 'inquiries' && (
              <AdminInquiriesTab showToast={showToast} />
            )}
            {activeSection === 'settings' && (
              <div className="bg-white border border-[#E5DFD1] rounded-3xl p-8 space-y-6 shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-serif text-xl font-bold text-primary">Store Configuration</h3>
                    <p className="text-xs text-on-surface-variant/70 mt-1">Core storefront details currently in use.</p>
                  </div>
                  {!isEditingConfig && (
                    <button 
                      onClick={() => {
                        setConfigForm(storeConfig);
                        setIsEditingConfig(true);
                      }}
                      className="flex items-center gap-1.5 px-4 py-2 bg-[#FAF8F4] hover:bg-[#E5DFD1] border border-[#E5DFD1] text-[#4A4A3A] rounded-full text-xs font-bold transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      Edit
                    </button>
                  )}
                </div>

                {!isEditingConfig ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="bg-[#FAF8F4] border border-[#E5DFD1]/60 rounded-2xl p-4 space-y-1">
                      <span className="text-[10px] uppercase font-bold text-[#4A4A3A]">Store Name</span>
                      <p className="font-bold text-primary text-sm">{storeConfig.storeName}</p>
                    </div>
                    <div className="bg-[#FAF8F4] border border-[#E5DFD1]/60 rounded-2xl p-4 space-y-1">
                      <span className="text-[10px] uppercase font-bold text-[#4A4A3A]">Support Email</span>
                      <p className="font-bold text-primary text-sm">{storeConfig.supportEmail}</p>
                    </div>
                    <div className="bg-[#FAF8F4] border border-[#E5DFD1]/60 rounded-2xl p-4 space-y-1">
                      <span className="text-[10px] uppercase font-bold text-[#4A4A3A]">Support Phone</span>
                      <p className="font-bold text-primary text-sm">{storeConfig.supportPhone}</p>
                    </div>
                    <div className="bg-[#FAF8F4] border border-[#E5DFD1]/60 rounded-2xl p-4 space-y-1">
                      <span className="text-[10px] uppercase font-bold text-[#4A4A3A]">Origin</span>
                      <p className="font-bold text-primary text-sm">{storeConfig.origin}</p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-[#FAF8F4] p-6 rounded-2xl border border-[#E5DFD1]/60">
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-[#4A4A3A]">Store Name</label>
                      <input 
                        type="text" 
                        value={configForm.storeName}
                        onChange={(e) => setConfigForm({...configForm, storeName: e.target.value})}
                        className="w-full bg-white border border-[#E5DFD1] rounded-xl px-3 py-2 text-sm font-bold text-primary focus:outline-none focus:border-[#7C8464] transition-colors"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-[#4A4A3A]">Support Email</label>
                      <input 
                        type="email" 
                        value={configForm.supportEmail}
                        onChange={(e) => setConfigForm({...configForm, supportEmail: e.target.value})}
                        className="w-full bg-white border border-[#E5DFD1] rounded-xl px-3 py-2 text-sm font-bold text-primary focus:outline-none focus:border-[#7C8464] transition-colors"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-[#4A4A3A]">Support Phone</label>
                      <input 
                        type="tel" 
                        value={configForm.supportPhone}
                        onChange={(e) => setConfigForm({...configForm, supportPhone: e.target.value})}
                        className="w-full bg-white border border-[#E5DFD1] rounded-xl px-3 py-2 text-sm font-bold text-primary focus:outline-none focus:border-[#7C8464] transition-colors"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-[#4A4A3A]">Origin</label>
                      <input 
                        type="text" 
                        value={configForm.origin}
                        onChange={(e) => setConfigForm({...configForm, origin: e.target.value})}
                        className="w-full bg-white border border-[#E5DFD1] rounded-xl px-3 py-2 text-sm font-bold text-primary focus:outline-none focus:border-[#7C8464] transition-colors"
                      />
                    </div>
                    <div className="sm:col-span-2 flex gap-3 justify-end mt-4 pt-4 border-t border-[#E5DFD1]">
                      <button 
                        onClick={handleCancelConfig}
                        disabled={isSavingConfig}
                        className="px-5 py-2.5 rounded-full text-xs font-bold text-on-surface-variant bg-white border border-[#E5DFD1] hover:bg-[#FAF8F4] transition-colors disabled:opacity-50 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={handleSaveConfig}
                        disabled={isSavingConfig}
                        className="flex items-center justify-center min-w-[120px] px-5 py-2.5 rounded-full text-xs font-bold text-white bg-[#143A2A] hover:bg-[#0E281C] transition-colors disabled:opacity-70 cursor-pointer shadow-sm"
                      >
                        {isSavingConfig ? (
                          <span className="flex items-center gap-2">
                            <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                            Saving...
                          </span>
                        ) : (
                          'Save Changes'
                        )}
                      </button>
                    </div>
                  </div>
                )}
                
                <p className="text-[11px] text-on-surface-variant/60 italic">More configuration options (tax rates, shipping rules, payment gateways) coming soon.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}