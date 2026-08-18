import { ReactNode } from 'react';
import { Product, User, Order } from '../../types';
import { ShoppingBag, IndianRupee, Users, Layers, AlertTriangle, Star, Receipt } from 'lucide-react';
import type { AdminSection } from './AdminLayout';

interface AdminOverviewTabProps {
  products: Product[];
  users: User[];
  orders: Order[];
  onNavigate: (section: AdminSection) => void;
}

export default function AdminOverviewTab({ products, users, orders, onNavigate }: AdminOverviewTabProps) {
  const totalRevenue = orders.filter(o => o.status === 'Completed').reduce((sum, o) => sum + o.total, 0);
  const totalSalesCount = orders.filter(o => o.status === 'Completed').length;
  const pendingOrdersCount = orders.filter(o => o.status === 'Pending').length;
  const lowStockThreshold = 15;
  const lowStockProducts = products.filter(p => (p.stock !== undefined ? p.stock : 45) <= lowStockThreshold);
  const bestSellers = products.filter(p => p.isBestseller);

  const salesHistory = [
    { label: 'Jan', revenue: 45000 },
    { label: 'Feb', revenue: 52000 },
    { label: 'Mar', revenue: 61000 },
    { label: 'Apr', revenue: 78000 },
    { label: 'May', revenue: 95000 },
    { label: 'Jun', revenue: 112000 },
    { label: 'Jul', revenue: totalRevenue > 0 ? totalRevenue : 145000 }
  ];
  const maxRevenue = Math.max(...salesHistory.map(d => d.revenue));

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Total Sales Count" value={`${totalSalesCount} Completed`} sub={`Pending orders: ${pendingOrdersCount} awaiting dispatch`} icon={<ShoppingBag className="w-4 h-4" />} onClick={() => onNavigate('orders')} />
        <StatCard label="Gross Revenue" value={`₹${totalRevenue.toLocaleString()}`} sub="From completed transactions" icon={<IndianRupee className="w-4 h-4" />} accent="green" onClick={() => onNavigate('invoices')} />
        <StatCard label="Total Customers" value={`${users.length} Users`} sub="Active snacking accounts registered" icon={<Users className="w-4 h-4" />} onClick={() => onNavigate('customers')} />
        <StatCard label="Makhana Catalog" value={`${products.length} Selections`} sub={`Bestseller tags: ${bestSellers.length} flavors`} icon={<Layers className="w-4 h-4" />} onClick={() => onNavigate('products')} />
      </div>

      {lowStockProducts.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-[24px] p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-amber-800 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-amber-900">Low Stock Warning ({lowStockProducts.length})</h4>
              <p className="text-xs text-amber-800/90 leading-relaxed mt-0.5">The following batches are running below critical reserves.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {lowStockProducts.map(p => (
              <span key={p.id} onClick={() => onNavigate('products')} className="bg-white hover:bg-amber-100 transition-colors border border-amber-200 px-3 py-1.5 rounded-full text-[10px] font-mono font-bold text-amber-900 flex items-center gap-1.5 cursor-pointer">
                {p.name}: <span className="text-red-600">{p.stock ?? 12} left</span>
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-white border border-outline-variant/30 rounded-[32px] p-6 md:p-8 space-y-6 shadow-sm">
          <div>
            <h3 className="font-serif text-lg font-bold text-primary">Monthly Revenue Growth</h3>
            <p className="text-xs text-on-surface-variant/70">Historical earnings</p>
          </div>
          <svg className="w-full h-64 overflow-visible" viewBox="0 0 700 240" preserveAspectRatio="none">
            <line x1="0" y1="40" x2="700" y2="40" stroke="#E5DFD1" strokeDasharray="3" strokeWidth="0.5" />
            <line x1="0" y1="100" x2="700" y2="100" stroke="#E5DFD1" strokeDasharray="3" strokeWidth="0.5" />
            <line x1="0" y1="160" x2="700" y2="160" stroke="#E5DFD1" strokeDasharray="3" strokeWidth="0.5" />
            <line x1="0" y1="220" x2="700" y2="220" stroke="#E5DFD1" strokeWidth="1" />
            {salesHistory.map((item, index) => {
              const barWidth = 45;
              const x = index * 95 + 30;
              const barHeight = (item.revenue / maxRevenue) * 160;
              const y = 220 - barHeight;
              return (
                <g key={index} className="group cursor-pointer">
                  <rect x={x} y={y} width={barWidth} height={barHeight} fill={index === salesHistory.length - 1 ? '#4A4A3A' : '#7C8464'} rx="8" className="transition-all duration-300 hover:fill-secondary" />
                  <text x={x + barWidth / 2} y={y - 8} textAnchor="middle" className="font-mono text-[9px] font-bold fill-primary opacity-0 group-hover:opacity-100 transition-opacity">₹{(item.revenue / 1000).toFixed(0)}k</text>
                  <text x={x + barWidth / 2} y="235" textAnchor="middle" className="font-sans text-[10px] font-bold fill-[#4A4A3A]/70">{item.label}</text>
                </g>
              );
            })}
          </svg>
        </div>

        <div className="lg:col-span-4 bg-[#FAF8F4] border border-[#E5DFD1] rounded-[32px] p-6 md:p-8 space-y-6">
          <div className="border-b border-[#E5DFD1] pb-3">
            <h3 className="font-serif text-lg font-bold text-primary">Best Selling Flavors</h3>
            <p className="text-xs text-on-surface-variant/70">Top-voted kernels</p>
          </div>
          <div className="space-y-4">
            {bestSellers.map((p, idx) => (
              <div key={p.id} className="flex items-center gap-3.5 bg-white p-3 rounded-2xl border border-[#E5DFD1]/50">
                <span className="w-6 h-6 rounded-full bg-[#E5DFD1] text-xs font-mono font-bold text-primary flex items-center justify-center shrink-0">#{idx + 1}</span>
                <img src={p.image} alt={p.name} referrerPolicy="no-referrer" className="w-10 h-10 object-cover rounded-xl" />
                <div className="min-w-0 flex-grow">
                  <h4 className="font-serif text-xs font-bold text-primary truncate">{p.name}</h4>
                  <p className="text-[10px] font-mono text-on-surface-variant/75 mt-0.5">★{p.rating} ({p.reviewCount} reviews)</p>
                </div>
              </div>
            ))}
            {bestSellers.length === 0 && (
              <p className="text-xs text-on-surface-variant/60 text-center py-4">No bestsellers tagged yet.</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white border border-outline-variant/30 rounded-3xl p-6 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#E5DFD1]/50 rounded-xl flex items-center justify-center text-primary">
            <Receipt className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-serif text-sm font-bold text-primary">Need to view billing records?</h4>
            <p className="text-xs text-on-surface-variant/70">Generate and print invoices from the Invoices & Billing section.</p>
          </div>
        </div>
        <button onClick={() => onNavigate('invoices')} className="px-4 py-2 bg-[#7C8464] text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#6A7155] transition-colors cursor-pointer whitespace-nowrap">
          Go to Invoices
        </button>
      </div>
    </div>
  );
}

function StatCard({ label, value, sub, icon, accent, onClick }: { label: string; value: string; sub: string; icon: ReactNode; accent?: 'green'; onClick?: () => void }) {
  return (
    <div onClick={onClick} className="bg-[#FAF8F4] border border-[#E5DFD1] p-6 rounded-[28px] space-y-4 cursor-pointer hover:border-primary/30 transition-colors">
      <div className="flex justify-between items-center">
        <span className="text-[10px] tracking-widest font-bold text-[#4A4A3A] uppercase">{label}</span>
        <div className={`w-9 h-9 rounded-full flex items-center justify-center ${accent === 'green' ? 'bg-green-100 text-green-700' : 'bg-[#E5DFD1]/50 text-primary'}`}>
          {icon}
        </div>
      </div>
      <div>
        <p className={`text-3xl font-mono font-bold ${accent === 'green' ? 'text-green-800' : 'text-primary'}`}>{value}</p>
        <p className="text-[11px] text-on-surface-variant/75 mt-1">{sub}</p>
      </div>
    </div>
  );
}