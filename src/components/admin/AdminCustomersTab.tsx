import { useState } from 'react';
import { User } from '../../types';
import { Search, Mail, UserCheck, UserX } from 'lucide-react';

interface AdminCustomersTabProps {
  users: User[];
  onUpdateUserStatus: (userId: string, status: 'Active' | 'Suspended') => void;
  showToast: (msg: string, type?: 'success' | 'error') => void;
}

export default function AdminCustomersTab({ users, onUpdateUserStatus, showToast }: AdminCustomersTabProps) {
  const [userSearch, setUserSearch] = useState('');

  const filteredUsers = users.filter(u =>
    u.fullName.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.mobile.includes(userSearch)
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <p className="text-xs text-on-surface-variant/70">Access profiles, contact numbers, status suspension triggers, and purchase history.</p>

      <div className="flex bg-[#FAF8F4] p-4 rounded-2xl border border-[#E5DFD1]/60">
        <div className="relative flex-grow">
          <input type="text" placeholder="Search registered customers by name, email, or cell..." value={userSearch} onChange={(e) => setUserSearch(e.target.value)} className="w-full bg-white border border-outline-variant/30 rounded-xl py-2.5 pl-10 pr-4 text-xs focus:outline-none focus:border-primary text-on-surface" />
          <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-on-surface-variant/70" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredUsers.map(user => (
          <div key={user.id} className="bg-white border border-outline-variant/30 rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-full bg-[#7C8464] text-white font-serif italic text-lg flex items-center justify-center shadow-inner shrink-0">{user.fullName.charAt(0)}</div>
                <div>
                  <h4 className="font-serif text-base font-bold text-primary">{user.fullName}</h4>
                  <p className="text-xs text-on-surface-variant/70 flex items-center gap-1.5 mt-0.5"><Mail className="w-3.5 h-3.5 text-on-surface-variant/50" />{user.email}</p>
                </div>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider ${user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{user.status}</span>
            </div>

            <div className="grid grid-cols-2 gap-4 bg-[#FAF8F4] p-3.5 rounded-2xl border border-[#E5DFD1]/40 text-[11px]">
              <div className="space-y-1"><span className="text-on-surface-variant/60 uppercase text-[9px] font-bold">Mobile Cell</span><p className="font-semibold text-primary">{user.mobile}</p></div>
              <div className="space-y-1"><span className="text-on-surface-variant/60 uppercase text-[9px] font-bold">Registered Date</span><p className="font-semibold text-primary">{user.dateRegistered}</p></div>
              <div className="space-y-1 col-span-2"><span className="text-on-surface-variant/60 uppercase text-[9px] font-bold">Total Order History</span><p className="font-semibold text-primary">{user.orderHistory.length} orders placed</p></div>
            </div>

            <div className="flex justify-end gap-2 border-t border-[#E5DFD1]/40 pt-4">
              {user.status === 'Active' ? (
                <button onClick={() => { onUpdateUserStatus(user.id, 'Suspended'); showToast(`Account of "${user.fullName}" is suspended.`, 'success'); }} className="px-3.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer">
                  <UserX className="w-3.5 h-3.5" /> Suspend Account
                </button>
              ) : (
                <button onClick={() => { onUpdateUserStatus(user.id, 'Active'); showToast(`Account of "${user.fullName}" is reactivated!`, 'success'); }} className="px-3.5 py-1.5 bg-green-50 hover:bg-green-100 text-green-700 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer">
                  <UserCheck className="w-3.5 h-3.5" /> Reactivate Account
                </button>
              )}
            </div>
          </div>
        ))}
        {filteredUsers.length === 0 && (
          <div className="col-span-2 text-center py-12 text-on-surface-variant/70">No customer profiles match this query.</div>
        )}
      </div>
    </div>
  );
}