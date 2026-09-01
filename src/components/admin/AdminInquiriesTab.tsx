import { useState, useEffect } from 'react';
import { fetchInquiriesFromDb, updateInquiryStatusInDb } from '../../lib/supabase';
import { Mail, UserCheck, Layers, Globe, Newspaper, Search, RefreshCw } from 'lucide-react';

interface AdminInquiriesTabProps {
  showToast: (msg: string, type?: 'success' | 'error') => void;
}

export default function AdminInquiriesTab({ showToast }: AdminInquiriesTabProps) {
  const [inquirySubTab, setInquirySubTab] = useState<'contacts' | 'distributors' | 'bulk' | 'export' | 'subscribers'>('contacts');
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [inquiriesLoading, setInquiriesLoading] = useState(false);
  const [inquirySearch, setInquirySearch] = useState('');
  const [inquiryStatusFilter, setInquiryStatusFilter] = useState<string>('All');
  const [editingNotes, setEditingNotes] = useState<Record<string, string>>({});

  useEffect(() => {
    const loadInquiries = async () => {
      setInquiriesLoading(true);
      try {
        const tableName = inquirySubTab === 'subscribers' ? 'newsletter_subscribers' : 'contact_messages';
        const data = await fetchInquiriesFromDb(tableName);
        setInquiries(data || []);
      } catch (err: any) {
        showToast(`Failed to fetch database inquiries: ${err.message || err}`, 'error');
      } finally {
        setInquiriesLoading(false);
      }
    };
    loadInquiries();
  }, [inquirySubTab]);

  const handleUpdateStatus = async (id: string, newStatus: any) => {
    try {
      const tableName = inquirySubTab === 'subscribers' ? 'newsletter_subscribers' : 'contact_messages';
      const currentItem = inquiries.find(item => item.id === id);
      const currentNotes = editingNotes[id] !== undefined ? editingNotes[id] : (currentItem?.admin_notes || '');
      await updateInquiryStatusInDb(tableName, id, newStatus, currentNotes);
      setInquiries(prev => prev.map(item => item.id === id ? { ...item, status: newStatus } : item));
      showToast(`Inquiry status updated to "${newStatus}"`, 'success');
    } catch (err: any) {
      showToast(`Failed to update inquiry status: ${err.message || err}`, 'error');
    }
  };

  const handleSaveAdminNotes = async (id: string) => {
    try {
      const notesToSave = editingNotes[id] !== undefined ? editingNotes[id] : '';
      const tableName = inquirySubTab === 'subscribers' ? 'newsletter_subscribers' : 'contact_messages';
      const currentItem = inquiries.find(item => item.id === id);
      const currentStatus = currentItem?.status || 'Pending';
      await updateInquiryStatusInDb(tableName, id, currentStatus as any, notesToSave);
      setInquiries(prev => prev.map(item => item.id === id ? { ...item, admin_notes: notesToSave } : item));
      showToast('Admin notes updated successfully!', 'success');
    } catch (err: any) {
      showToast(`Failed to save admin notes: ${err.message || err}`, 'error');
    }
  };

  const filteredInquiries = inquiries.filter(item => {
    if (inquirySubTab === 'contacts') {
      const type = item.inquiry_type || '';
      if (['Become a Distributor', 'Bulk Wholesale', 'Export Inquiry'].includes(type)) return false;
    } else if (inquirySubTab === 'distributors') {
      if ((item.inquiry_type || '') !== 'Become a Distributor') return false;
    } else if (inquirySubTab === 'bulk') {
      if ((item.inquiry_type || '') !== 'Bulk Wholesale') return false;
    } else if (inquirySubTab === 'export') {
      if ((item.inquiry_type || '') !== 'Export Inquiry') return false;
    }
    if (inquiryStatusFilter !== 'All' && item.status !== inquiryStatusFilter) return false;
    if (!inquirySearch) return true;
    const q = inquirySearch.toLowerCase().trim();
    const nameVal = (item.full_name || item.name || '').toLowerCase();
    const emailVal = (item.email || '').toLowerCase();
    const phoneVal = (item.phone || '').toLowerCase();
    return nameVal.includes(q) || emailVal.includes(q) || phoneVal.includes(q);
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <p className="text-xs text-on-surface-variant/70">Inspect incoming correspondences, wholesale requirements, distributor requests, and newsletter subscribers in real-time.</p>

      <div className="flex flex-wrap gap-2 border-b border-[#E5DFD1] pb-1.5">
        {[
          { id: 'contacts', name: 'Contact Messages', icon: <Mail className="w-3.5 h-3.5" /> },
          { id: 'distributors', name: 'Distributors', icon: <UserCheck className="w-3.5 h-3.5" /> },
          { id: 'bulk', name: 'Bulk Wholesale', icon: <Layers className="w-3.5 h-3.5" /> },
          { id: 'export', name: 'Export Leads', icon: <Globe className="w-3.5 h-3.5" /> },
          { id: 'subscribers', name: 'Newsletter Subscribers', icon: <Newspaper className="w-3.5 h-3.5" /> }
        ].map(tab => (
          <button key={tab.id} onClick={() => { setInquirySubTab(tab.id as any); setInquirySearch(''); setInquiryStatusFilter('All'); }} className={`flex items-center gap-1.5 px-4 py-2 border-b-2 text-xs font-bold transition-all cursor-pointer ${inquirySubTab === tab.id ? 'border-[#7C8464] text-primary' : 'border-transparent text-on-surface-variant/75 hover:text-primary'}`}>
            {tab.icon}{tab.name}
          </button>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-3 bg-[#FAF8F4] p-4 rounded-2xl border border-[#E5DFD1]/60">
        <div className="relative flex-grow">
          <input type="text" placeholder="Search by name, email, or phone..." value={inquirySearch} onChange={(e) => setInquirySearch(e.target.value)} className="w-full bg-white border border-outline-variant/30 rounded-xl py-2.5 pl-10 pr-4 text-xs focus:outline-none focus:border-primary text-on-surface" />
          <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-on-surface-variant/70" />
        </div>
        <select value={inquiryStatusFilter} onChange={(e) => setInquiryStatusFilter(e.target.value)} className="bg-white border border-[#E5DFD1] text-xs px-3 py-2 rounded-xl text-on-surface focus:outline-none focus:border-primary font-bold shadow-sm cursor-pointer">
          <option value="All">All Statuses</option>
          {inquirySubTab === 'subscribers' ? (<><option value="Active">Active</option><option value="Unsubscribed">Unsubscribed</option></>) : (<><option value="New">New</option><option value="Reviewed">Reviewed</option><option value="Resolved">Resolved</option></>)}
        </select>
      </div>

      {inquiriesLoading ? (
        <div className="text-center py-16">
          <RefreshCw className="w-8 h-8 text-[#7C8464] animate-spin mx-auto mb-2" />
          <p className="text-xs text-on-surface-variant/70">Syncing with Supabase live ledger...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredInquiries.map((item) => (
            <div key={item.id} className="bg-white border border-outline-variant/30 rounded-3xl p-5 hover:border-primary/30 transition-all space-y-4 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-outline-variant/10 pb-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="font-mono text-[10px] font-bold text-[#4A4A3A] uppercase bg-[#FAF8F4] border border-[#E5DFD1] px-2 py-0.5 rounded-md">Lead ID: {typeof item.id === 'string' ? item.id.substring(0, 8) : item.id}</span>
                    <span className="text-xs text-on-surface-variant/70 font-bold">{item.created_at ? new Date(item.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Just Now'}</span>
                    {item.status === 'New' && <span className="animate-pulse bg-red-100 text-red-800 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">New Alert</span>}
                  </div>
                  {inquirySubTab !== 'subscribers' ? (
                    <div className="text-sm"><span className="font-bold text-primary">{item.full_name || item.name}</span> <span className="text-on-surface-variant/60">({item.email})</span></div>
                  ) : (
                    <div className="text-sm font-bold text-primary">{item.email}</div>
                  )}
                </div>
                <div className="flex items-center gap-3 self-start sm:self-auto">
                  <span className="text-xs text-on-surface-variant/60 font-bold">Status:</span>
                  <select value={item.status} onChange={(e) => handleUpdateStatus(item.id, e.target.value)} className={`text-[10px] font-bold uppercase tracking-wider border border-[#E5DFD1] rounded-xl px-3 py-1.5 focus:ring-2 focus:ring-primary/20 cursor-pointer ${item.status === 'New' || item.status === 'Active' ? 'bg-amber-50 text-amber-900 border-amber-200' : item.status === 'Resolved' || item.status === 'Reviewed' ? 'bg-green-50 text-green-800 border-green-200' : 'bg-red-50 text-red-800 border-red-200'}`}>
                    {inquirySubTab === 'subscribers' ? (<><option value="Active">Active</option><option value="Unsubscribed">Unsubscribed</option></>) : (<><option value="New">New</option><option value="Reviewed">Reviewed</option><option value="Resolved">Resolved</option></>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 text-xs">
                <div className="md:col-span-8 space-y-2">
                  <span className="text-[10px] tracking-widest font-bold uppercase text-[#4A4A3A]">Message Details</span>
                  <div className="bg-[#FAF8F4]/50 p-4 rounded-2xl border border-[#E5DFD1]/30 text-on-surface-variant leading-relaxed">
                    {item.message || <span className="italic text-on-surface-variant/50">No additional remarks provided.</span>}
                  </div>
                </div>
                <div className="md:col-span-4 space-y-3 bg-[#FAF8F4] p-4 rounded-2xl border border-[#E5DFD1]/50 self-start">
                  <span className="text-[10px] tracking-widest font-bold uppercase text-[#4A4A3A] block border-b border-[#E5DFD1]/50 pb-1">Lead Parameters</span>
                  <div className="space-y-2 text-[11px]">
                    {inquirySubTab === 'contacts' && (
                      <>
                        <div className="flex justify-between"><span className="text-on-surface-variant/60">Nature:</span><span className="font-bold text-primary">{item.inquiry_type || 'Retail Inquiry'}</span></div>
                        {item.phone && <div className="flex justify-between"><span className="text-on-surface-variant/60">Phone:</span><span className="font-mono font-bold text-primary">{item.phone}</span></div>}
                        {item.business_name && <div className="flex justify-between"><span className="text-on-surface-variant/60">Business:</span><span className="font-bold text-primary truncate max-w-[120px]">{item.business_name}</span></div>}
                        {item.city && <div className="flex justify-between"><span className="text-on-surface-variant/60">City:</span><span className="font-bold text-primary">{item.city}</span></div>}
                        {item.quantity && <div className="flex justify-between"><span className="text-on-surface-variant/60">Quantity:</span><span className="font-bold text-primary">{item.quantity}</span></div>}
                        <div className="flex justify-between"><span className="text-on-surface-variant/60">Newsletter Sub:</span><span className={`font-bold ${item.subscribe_newsletter ? 'text-green-700' : 'text-red-700'}`}>{item.subscribe_newsletter ? 'Accepted' : 'No'}</span></div>
                      </>
                    )}
                    {inquirySubTab === 'distributors' && (
                      <>
                        {item.phone && <div className="flex justify-between"><span className="text-on-surface-variant/60">Phone:</span><span className="font-mono font-bold text-primary">{item.phone}</span></div>}
                        <div className="flex justify-between"><span className="text-on-surface-variant/60">Type:</span><span className="font-bold text-primary">Distributor Inquiry</span></div>
                      </>
                    )}
                    {(inquirySubTab === 'bulk' || inquirySubTab === 'export') && (() => {
                      const getParam = (msg: string, label: string) => { if (!msg) return ''; const match = msg.match(new RegExp(`^${label}:\\s*(.*)$`, 'm')); return match ? match[1].trim() : ''; };
                      const companyVal = item.company || getParam(item.message || '', 'Company');
                      const countryVal = item.country || getParam(item.message || '', 'Country') || 'India';
                      const businessType = item.type || getParam(item.message || '', 'Business Type') || 'Wholesaler';
                      const qtyVal = item.quantity ? `${item.quantity.toLocaleString()} bags` : (getParam(item.message || '', 'Target Volume') || 'Not Specified');
                      return (
                        <>
                          <div className="flex justify-between"><span className="text-on-surface-variant/60">Company:</span><span className="font-bold text-primary truncate max-w-[120px]" title={companyVal}>{companyVal || 'Not Specified'}</span></div>
                          <div className="flex justify-between"><span className="text-on-surface-variant/60">Country:</span><span className="font-bold text-[#7C8464]">{countryVal}</span></div>
                          <div className="flex justify-between"><span className="text-on-surface-variant/60">Business Type:</span><span className="font-bold text-primary capitalize">{businessType}</span></div>
                          <div className="flex justify-between"><span className="text-on-surface-variant/60">Qty Requested:</span><span className="font-mono font-bold text-secondary">{qtyVal}</span></div>
                        </>
                      );
                    })()}
                    {inquirySubTab === 'subscribers' && (
                      <>
                        <div className="flex justify-between"><span className="text-on-surface-variant/60">Channel:</span><span className="font-bold text-primary">Journal Newsletter</span></div>
                        <div className="flex justify-between"><span className="text-on-surface-variant/60">Subscribed Status:</span><span className={`font-bold ${item.status === 'Active' ? 'text-green-700' : 'text-red-700'}`}>{item.status}</span></div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-outline-variant/10 mt-2">
                <span className="text-[10px] tracking-widest font-bold uppercase text-[#4A4A3A] block mb-2">Admin Follow-up Remarks & Notes</span>
                <div className="flex flex-col sm:flex-row gap-3">
                  <textarea rows={1} value={editingNotes[item.id] !== undefined ? editingNotes[item.id] : (item.admin_notes || '')} onChange={(e) => setEditingNotes(prev => ({ ...prev, [item.id]: e.target.value }))} placeholder="Add follow-up logs, contact results, customer notes..." className="flex-grow bg-[#FAF8F4] border border-[#E5DFD1]/50 rounded-xl p-3 text-xs focus:outline-none focus:border-primary text-on-surface" />
                  <button type="button" onClick={() => handleSaveAdminNotes(item.id)} className="px-5 py-2 bg-[#7C8464] text-white hover:bg-primary font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center whitespace-nowrap self-stretch">Save Remarks</button>
                </div>
              </div>
            </div>
          ))}
          {filteredInquiries.length === 0 && (
            <div className="text-center py-12 text-on-surface-variant/70 bg-white border border-dashed border-[#E5DFD1] rounded-3xl">No correspondences or leads found in this state.</div>
          )}
        </div>
      )}
    </div>
  );
}