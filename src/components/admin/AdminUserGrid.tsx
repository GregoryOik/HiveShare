import React from 'react';
import { Search, Users } from 'lucide-react';
import { UserProfile } from '../../lib/useAdminUsers';

interface AdminUserGridProps {
  users: UserProfile[];
  filteredUsers: UserProfile[];
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  selectedUserUid: string | null;
  setSelectedUserUid: (uid: string | null) => void;
  selectedUserUids: string[];
  setSelectedUserUids: React.Dispatch<React.SetStateAction<string[]>>;
  tierFilter: 'all' | 'premium' | 'starter' | 'none';
  setTierFilter: (val: 'all' | 'premium' | 'starter' | 'none') => void;
}

export function AdminUserGrid({
  users,
  filteredUsers,
  searchTerm,
  setSearchTerm,
  selectedUserUid,
  setSelectedUserUid,
  selectedUserUids,
  setSelectedUserUids,
  tierFilter,
  setTierFilter
}: AdminUserGridProps) {
  return (
    <div className="bg-[#120D08] border border-honey/10 rounded-lg p-6 flex flex-col h-[calc(100vh-200px)] sticky top-28">
      <div className="mb-6 space-y-2">
        <div className="relative">
          <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-honey/40" />
          <input 
            type="text" 
            placeholder="Search Guardians..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-black/40 border border-honey/20 rounded-full pl-10 pr-4 py-2 text-[10px] focus:outline-none focus:border-honey transition-all text-white placeholder:text-honey/20 font-sans"
          />
        </div>
        <div className="flex gap-1 overflow-x-auto pb-1 no-scrollbar">
          {[
            { id: 'all', label: 'All' },
            { id: 'premium', label: 'Premium' },
            { id: 'starter', label: 'Starter' },
            { id: 'none', label: 'Free' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setTierFilter(f.id as any)}
              className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${tierFilter === f.id ? 'bg-honey text-black border-honey' : 'bg-white/5 text-white/40 border-white/5 hover:border-honey/20'}`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
        <div className="mb-2 px-4 flex items-center justify-between">
          <button 
            onClick={() => setSelectedUserUids(selectedUserUids.length === filteredUsers.length ? [] : filteredUsers.map(u => u.uid))}
            className="text-[8px] uppercase font-black text-honey/40 hover:text-honey transition-colors"
          >
            {selectedUserUids.length === filteredUsers.length ? 'DESELECT_ALL' : 'SELECT_VISIBLE_GUARDIANS'}
          </button>
          <span className="text-[8px] font-mono text-honey/20">{selectedUserUids.length} SELECTED</span>
        </div>

        {filteredUsers.map(u => (
          <div key={u.uid} className="relative group">
            <div className="absolute left-2 top-1/2 -translate-y-1/2 z-10">
              <input 
                type="checkbox" 
                checked={selectedUserUids.includes(u.uid)}
                onChange={() => setSelectedUserUids(prev => prev.includes(u.uid) ? prev.filter(uid => uid !== u.uid) : [...prev, u.uid])}
                className="w-3 h-3 rounded-sm border-honey/20 bg-black/40 checked:bg-honey transition-all cursor-pointer"
              />
            </div>
            <button
              onClick={() => setSelectedUserUid(u.uid)}
              className={`w-full text-left pl-8 pr-4 py-4 rounded-lg border transition-all ${
                selectedUserUid === u.uid 
                  ? 'bg-honey/10 border-honey/40' 
                  : 'border-white/5 hover:border-honey/20 bg-white/5'
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="text-[11px] font-bold text-white truncate max-w-[120px]">{u.email}</span>
                <span className="text-[8px] uppercase font-black">{u.tier || 'FREE'}</span>
              </div>
              <div className="text-[10px] text-honey/40 uppercase tracking-widest">{u.role}</div>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
