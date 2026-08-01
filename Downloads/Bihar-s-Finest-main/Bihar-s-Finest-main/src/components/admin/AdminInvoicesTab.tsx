import { useState } from 'react';
import { Order } from '../../types';
import { Search, Receipt, Printer, X, IndianRupee, CheckCircle2, Clock } from 'lucide-react';

interface AdminInvoicesTabProps {
  orders: Order[];
}

const invoiceNumberFor = (order: Order) => `INV-${order.id}`.toUpperCase();

export default function AdminInvoicesTab({ orders }: AdminInvoicesTabProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Paid' | 'Unpaid'>('All');
  const [activeInvoiceOrder, setActiveInvoiceOrder] = useState<Order | null>(null);

  const isPaid = (order: Order) => order.status === 'Completed' || order.status === 'Delivered';

  const totalBilled = orders.reduce((sum, o) => sum + o.total, 0);
  const totalPaid = orders.filter(isPaid).reduce((sum, o) => sum + o.total, 0);
  const totalOutstanding = totalBilled - totalPaid;

  const filteredOrders = orders.filter(o => {
    const matchesStatus = statusFilter === 'All' || (statusFilter === 'Paid' ? isPaid(o) : !isPaid(o));
    const q = search.toLowerCase().trim();
    const matchesSearch = !q || o.customerName.toLowerCase().includes(q) || o.customerEmail.toLowerCase().includes(q) || invoiceNumberFor(o).toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <p className="text-xs text-on-surface-variant/70">Generate, view, and print billing invoices for every customer order.</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-[#FAF8F4] border border-[#E5DFD1] p-6 rounded-[28px] space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-[10px] tracking-widest font-bold text-[#4A4A3A] uppercase">Total Billed</span>
            <div className="w-9 h-9 bg-[#E5DFD1]/50 rounded-full flex items-center justify-center text-primary"><Receipt className="w-4 h-4" /></div>
          </div>
          <p className="text-2xl font-mono font-bold text-primary">₹{totalBilled.toLocaleString()}</p>
        </div>
        <div className="bg-[#FAF8F4] border border-[#E5DFD1] p-6 rounded-[28px] space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-[10px] tracking-widest font-bold text-[#4A4A3A] uppercase">Paid Invoices</span>
            <div className="w-9 h-9 bg-green-100 rounded-full flex items-center justify-center text-green-700"><CheckCircle2 className="w-4 h-4" /></div>
          </div>
          <p className="text-2xl font-mono font-bold text-green-800">₹{totalPaid.toLocaleString()}</p>
        </div>
        <div className="bg-[#FAF8F4] border border-[#E5DFD1] p-6 rounded-[28px] space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-[10px] tracking-widest font-bold text-[#4A4A3A] uppercase">Outstanding</span>
            <div className="w-9 h-9 bg-amber-100 rounded-full flex items-center justify-center text-amber-700"><Clock className="w-4 h-4" /></div>
          </div>
          <p className="text-2xl font-mono font-bold text-amber-800">₹{totalOutstanding.toLocaleString()}</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 bg-[#FAF8F4] p-4 rounded-2xl border border-[#E5DFD1]/60">
        <div className="relative flex-grow">
          <input type="text" placeholder="Search by invoice #, name, or email..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-white border border-outline-variant/30 rounded-xl py-2.5 pl-10 pr-4 text-xs focus:outline-none focus:border-primary text-on-surface" />
          <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-on-surface-variant/70" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)} className="bg-white border border-[#E5DFD1] text-xs px-4 py-2.5 rounded-xl text-on-surface focus:outline-none focus:border-primary font-bold">
          <option value="All">All Invoices</option>
          <option value="Paid">Paid</option>
          <option value="Unpaid">Unpaid</option>
        </select>
      </div>

      <div className="bg-white border border-outline-variant/30 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FAF8F4] border-b border-[#E5DFD1] text-[10px] tracking-widest uppercase font-bold text-[#4A4A3A]">
                <th className="py-4 px-6">Invoice #</th>
                <th className="py-4 px-4">Customer</th>
                <th className="py-4 px-4">Date</th>
                <th className="py-4 px-4 font-mono">Amount</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/15 text-xs text-on-surface-variant">
              {filteredOrders.map(order => (
                <tr key={order.id} className="hover:bg-[#FAF8F4]/35 transition-colors">
                  <td className="py-4 px-6 font-mono font-bold text-primary">{invoiceNumberFor(order)}</td>
                  <td className="py-4 px-4">
                    <p className="font-bold text-primary">{order.customerName}</p>
                    <p className="text-[10px] text-on-surface-variant/60">{order.customerEmail}</p>
                  </td>
                  <td className="py-4 px-4">{order.date}</td>
                  <td className="py-4 px-4 font-mono font-bold text-primary">₹{order.total}</td>
                  <td className="py-4 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${isPaid(order) ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-900'}`}>
                      {isPaid(order) ? 'Paid' : 'Unpaid'}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button onClick={() => setActiveInvoiceOrder(order)} className="px-3.5 py-1.5 bg-[#7C8464] hover:bg-[#6A7155] text-white text-[10px] font-bold uppercase tracking-wider rounded-xl transition-colors cursor-pointer">
                      View Invoice
                    </button>
                  </td>
                </tr>
              ))}
              {filteredOrders.length === 0 && (
                <tr><td colSpan={6} className="py-12 text-center text-on-surface-variant/70">No invoices match this query.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {activeInvoiceOrder && (
        <InvoiceModal order={activeInvoiceOrder} onClose={() => setActiveInvoiceOrder(null)} paid={isPaid(activeInvoiceOrder)} />
      )}
    </div>
  );
}

function InvoiceModal({ order, onClose, paid }: { order: Order; onClose: () => void; paid: boolean }) {
  const subtotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal >= 999 ? 0 : 60;
  const grandTotal = subtotal + shipping;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fade-in print:bg-white print:p-0">
      <div className="bg-white rounded-[28px] w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative print:shadow-none print:max-h-full print:rounded-none" id="invoice-print-area">
        <div className="p-8 space-y-8">
          <button onClick={onClose} className="absolute right-6 top-6 p-2 bg-[#FAF8F4] hover:bg-[#A85344]/15 rounded-full text-on-surface-variant hover:text-[#A85344] transition-all cursor-pointer print:hidden">
            <X className="w-4 h-4" />
          </button>

          <div className="flex justify-between items-start border-b border-[#E5DFD1] pb-6">
            <div>
              <h2 className="font-serif text-2xl font-bold text-primary">Bihar Bite</h2>
              <p className="text-[11px] text-on-surface-variant/70 mt-1">Mithila, Bihar, India</p>
              <p className="text-[11px] text-on-surface-variant/70">hello@biharbite.com · +91 98765 43210</p>
            </div>
            <div className="text-right">
              <h3 className="font-serif text-xl font-bold text-secondary">INVOICE</h3>
              <p className="text-[11px] font-mono text-on-surface-variant/80 mt-1">{`INV-${order.id}`.toUpperCase()}</p>
              <span className={`inline-block mt-2 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${paid ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-900'}`}>{paid ? 'Paid' : 'Unpaid'}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#4A4A3A] block mb-1.5">Billed To</span>
              <p className="font-bold text-primary">{order.customerName}</p>
              <p className="text-on-surface-variant/80 mt-0.5">{order.customerEmail}</p>
              {order.customerMobile && <p className="text-on-surface-variant/80">{order.customerMobile}</p>}
              <p className="text-on-surface-variant/80 mt-1 leading-relaxed">{order.shippingAddress}</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-[#4A4A3A] block mb-1.5">Invoice Details</span>
              <p className="text-on-surface-variant/80">Order ID: <span className="font-bold text-primary">#{order.id}</span></p>
              <p className="text-on-surface-variant/80">Order Date: <span className="font-bold text-primary">{order.date}</span></p>
              <p className="text-on-surface-variant/80">Order Status: <span className="font-bold text-primary">{order.status}</span></p>
            </div>
          </div>

          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b-2 border-[#4A4A3A]/20 text-[10px] uppercase font-bold text-[#4A4A3A]">
                <th className="py-2.5">Item</th>
                <th className="py-2.5 text-center">Weight</th>
                <th className="py-2.5 text-center">Qty</th>
                <th className="py-2.5 text-right">Rate</th>
                <th className="py-2.5 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5DFD1]/60">
              {order.items.map((item, idx) => (
                <tr key={idx}>
                  <td className="py-2.5 font-semibold text-primary">{item.name}</td>
                  <td className="py-2.5 text-center font-mono text-on-surface-variant/80">{item.weight}</td>
                  <td className="py-2.5 text-center font-mono text-on-surface-variant/80">{item.quantity}</td>
                  <td className="py-2.5 text-right font-mono text-on-surface-variant/80">₹{item.price}</td>
                  <td className="py-2.5 text-right font-mono font-bold text-primary">₹{item.price * item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-end">
            <div className="w-full max-w-xs space-y-2 text-xs">
              <div className="flex justify-between text-on-surface-variant/80"><span>Subtotal</span><span className="font-mono">₹{subtotal}</span></div>
              <div className="flex justify-between text-on-surface-variant/80"><span>Shipping</span><span className="font-mono">{shipping === 0 ? 'Free' : `₹${shipping}`}</span></div>
              <div className="flex justify-between font-bold text-primary text-base border-t border-[#E5DFD1] pt-2 mt-2">
                <span>Grand Total</span><span className="font-mono flex items-center gap-0.5"><IndianRupee className="w-3.5 h-3.5" />{grandTotal}</span>
              </div>
            </div>
          </div>

          <p className="text-[10px] text-on-surface-variant/50 text-center pt-4 border-t border-[#E5DFD1]/50">Thank you for choosing Bihar Bite. Cultivating Heritage, Delivering Purity.</p>

          <button onClick={() => window.print()} className="w-full bg-[#7C8464] hover:bg-[#6A7155] text-white py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer print:hidden">
            <Printer className="w-4 h-4" /> Print / Download PDF
          </button>
        </div>
      </div>

      <style>{`
        @media print {
          body * { visibility: hidden; }
          #invoice-print-area, #invoice-print-area * { visibility: visible; }
          #invoice-print-area { position: fixed; inset: 0; }
        }
      `}</style>
    </div>
  );
}