import React, { useState } from 'react';
import { 
  Users, 
  Trash2, 
  UserMinus, 
  Tag, 
  Settings,
  ShieldAlert
} from 'lucide-react';
import { UserProfile } from '../../lib/useAdminUsers';
import { HiveData } from '../../lib/useHiveData';

interface AdminUserDetailsProps {
  selectedUser: UserProfile;
  users: UserProfile[];
  hives: HiveData[];
  assignHiveToUser: (uid: string, hiveId: string) => Promise<void>;
  removeHiveFromUser: (uid: string, hiveId: string) => Promise<void>;
  updateUser: (uid: string, data: Partial<UserProfile>) => Promise<void>;
  deleteUser: (uid: string) => Promise<void>;
}

export function AdminUserDetails({
  selectedUser,
  users,
  hives,
  assignHiveToUser,
  removeHiveFromUser,
  updateUser,
  deleteUser
}: AdminUserDetailsProps) {
  const [customMetaKey, setCustomMetaKey] = useState('');
  const [customMetaValue, setCustomMetaValue] = useState('');

  return (
    <div className="space-y-8 animate-in slide-in-from-right duration-500">
      <div className="bg-[#120D08] border border-honey/10 rounded-lg p-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-honey/10 border border-honey/20 flex items-center justify-center text-honey text-2xl font-display">
              {selectedUser.email[0].toUpperCase()}
            </div>
            <div>
              <h3 className="text-xl font-display text-white">{selectedUser.email}</h3>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-widest text-honey/40">{selectedUser.uid}</span>
                <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${
                  selectedUser.role === 'admin' ? 'bg-red-500/20 text-red-500' : 'bg-honey/20 text-honey'
                }`}>
                  {selectedUser.role}
                </span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-widest text-honey/40 font-black mb-1">Membership_Tier</div>
            <select 
              value={selectedUser.tier || 'starter'}
              onChange={(e) => updateUser(selectedUser.uid, { tier: e.target.value as any })}
              className="bg-black/60 border border-honey/20 rounded-md p-2 text-xs text-honey font-display uppercase outline-none focus:border-honey"
            >
              <option value="starter">Starter Guardian</option>
              <option value="premium">Premium Guardian</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
               <div className="bg-black/40 border border-honey/10 p-4 rounded-md">
                  <div className="text-[9px] uppercase tracking-widest text-honey/40 font-black mb-1">Harvest_Status</div>
                  <select 
                    value={selectedUser.userHarvestStatus || 'PENDING'}
                    onChange={(e) => updateUser(selectedUser.uid, { userHarvestStatus: e.target.value })}
                    className="w-full bg-transparent text-sm font-display text-white outline-none focus:text-honey"
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="PROCESSING">PROCESSING</option>
                    <option value="SHIPPED">SHIPPED</option>
                    <option value="DELIVERED">DELIVERED</option>
                  </select>
               </div>
               <div className="bg-black/40 border border-honey/10 p-4 rounded-md">
                  <div className="text-[9px] uppercase tracking-widest text-honey/40 font-black mb-1">Honey_Label</div>
                  <div 
                    onClick={() => {
                      const lab = prompt('Enter new honey label:', selectedUser.customHoneyName);
                      if (lab !== null) updateUser(selectedUser.uid, { customHoneyName: lab });
                    }}
                    className="text-sm font-display text-white truncate italic cursor-pointer hover:text-honey"
                  >
                    "{selectedUser.customHoneyName || 'Standard'}"
                  </div>
               </div>
               <div className="bg-black/40 border border-honey/10 p-4 rounded-md">
                  <div className="text-[9px] uppercase tracking-widest text-honey/40 font-black mb-1">Subscription_Start</div>
                  <input 
                    type="date"
                    defaultValue={selectedUser.subscriptionStartDate || selectedUser.lastSubscriptionAt?.split('T')[0]}
                    onBlur={(e) => updateUser(selectedUser.uid, { subscriptionStartDate: e.target.value })}
                    className="w-full bg-transparent text-[10px] font-display text-white outline-none focus:text-honey"
                  />
               </div>
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-widest text-[#C8860A] font-black flex items-center gap-2 mb-2">
                <Settings size={14} /> Internal_Admin_Notes
              </label>
              <textarea 
                value={selectedUser.adminNotes || ''}
                onChange={(e) => updateUser(selectedUser.uid, { adminNotes: e.target.value })}
                placeholder="Log internal observations..."
                rows={4}
                className="w-full bg-[#0A0704] border border-honey/20 rounded-md p-4 text-[11px] text-white focus:border-honey outline-none font-sans resize-none italic"
              />
            </div>
            
            {/* User Meta: Advanced Profiling */}
            <div className="space-y-4 pt-4 border-t border-honey/10">
              <label className="text-[10px] uppercase tracking-widest text-[#C8860A] font-black flex items-center gap-2 underline decoration-honey/30 underline-offset-4">
                <Tag size={14} /> Guardian_Metadata_Layer
              </label>
              <div className="bg-honey/5 border border-honey/10 p-4 rounded-md space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <input 
                    type="text"
                    value={customMetaKey}
                    onChange={(e) => setCustomMetaKey(e.target.value)}
                    placeholder="Layer_Key"
                    className="bg-black/60 border border-honey/20 rounded-md p-2 text-[10px] text-white focus:border-honey outline-none font-mono"
                  />
                  <input 
                    type="text"
                    value={customMetaValue}
                    onChange={(e) => setCustomMetaValue(e.target.value)}
                    placeholder="Layer_Value"
                    className="bg-black/60 border border-honey/20 rounded-md p-2 text-[10px] text-white focus:border-honey outline-none font-mono"
                  />
                </div>
                <button 
                  onClick={() => {
                    if (!customMetaKey || !customMetaValue) return;
                    const currentMeta = selectedUser.metadata || [];
                    const updatedMeta = [...currentMeta.filter(m => m.key !== customMetaKey), { key: customMetaKey, value: customMetaValue }];
                    updateUser(selectedUser.uid, { metadata: updatedMeta });
                    setCustomMetaKey(''); setCustomMetaValue('');
                  }}
                  className="w-full py-2 bg-[#C8860A]/10 border border-[#C8860A]/30 text-[#C8860A] text-[9px] font-black uppercase tracking-widest hover:bg-[#C8860A] hover:text-black transition-all rounded-sm"
                >
                  Push_Guardian_Field
                </button>
                <div className="space-y-1 max-h-[150px] overflow-y-auto custom-scrollbar pt-2 border-t border-white/5">
                  {selectedUser.metadata?.map((meta, i) => (
                    <div key={i} className="flex items-center justify-between p-2 bg-white/5 border border-white/5 rounded text-[9px] font-mono group/meta">
                      <span className="text-honey/60">{meta.key}:</span>
                      <span className="text-white/60 truncate max-w-[120px]">{meta.value}</span>
                      <button 
                        onClick={() => {
                          const updatedMeta = selectedUser.metadata?.filter(m => m.key !== meta.key) || [];
                          updateUser(selectedUser.uid, { metadata: updatedMeta });
                        }} 
                        className="text-red-500/40 hover:text-red-500 opacity-0 group-hover/meta:opacity-100 transition-opacity"
                      >
                        <Trash2 size={10} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-black/40 border border-honey/10 p-6 rounded-md">
              <h4 className="text-[10px] uppercase tracking-widest text-honey font-black mb-4 flex items-center justify-between">
                Linked Apiary Fleet
                <span className="text-xs font-mono">{selectedUser.subscribedHives?.length || 0}</span>
              </h4>
              <div className="space-y-2">
                {!selectedUser.subscribedHives || selectedUser.subscribedHives.length === 0 ? (
                  <div className="text-center py-8 bg-honey/5 border border-dashed border-honey/20 rounded">
                    <ShieldAlert size={24} className="mx-auto text-honey/20 mb-2" />
                    <p className="text-[9px] text-honey/40 uppercase">No Hives Linked to Profile</p>
                  </div>
                ) : (
                  selectedUser.subscribedHives.map(hiveId => (
                    <div key={hiveId} className="flex items-center justify-between p-3 bg-white/5 border border-white/5 rounded group">
                       <span className="text-[11px] font-mono text-white">UNIT_ID: #{hiveId}</span>
                       <button 
                         onClick={async () => {
                           if (window.confirm("TERMINAL_LINK: Sever connection between guardian and unit?")) {
                             try {
                               await removeHiveFromUser(selectedUser.uid, hiveId);
                             } catch (err: any) {
                               alert(`Link termination failed: ${err.message}`);
                             }
                           }
                         }} 
                         className="text-red-500/40 hover:text-red-500 transition-all"
                       >
                         <UserMinus size={14}/>
                       </button>
                    </div>
                  ))
                )}
              </div>
              <div className="pt-4">
                 <label className="text-[9px] uppercase tracking-widest text-honey/40 block mb-2 font-black">Manual Linkage</label>
                 <select 
                   value=""
                   onChange={async (e) => {
                     const val = e.target.value;
                     if (val) {
                       try {
                         await assignHiveToUser(selectedUser.uid, val);
                         alert(`Unit #${val} successfully linked to guardian ${selectedUser.email}.`);
                       } catch (err: any) {
                         alert(`Uplink failed: ${err.message}`);
                       }
                     }
                   }}
                   className="w-full bg-black/60 border border-honey/20 rounded-md p-2 text-[10px] text-white outline-none"
                 >
                   <option value="">Assign New Hive...</option>
                   {hives.filter(h => !selectedUser.subscribedHives?.includes(h.id)).map(h => (
                     <option key={h.id} value={h.id}>Hive #{h.id} ({h.location})</option>
                   ))}
                 </select>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-red-500/5 border border-red-500/20 p-6 rounded-md space-y-4">
              <h4 className="text-[10px] uppercase tracking-widest text-red-500 font-black flex items-center gap-2">
                <ShieldAlert size={14} /> Danger_Zone
              </h4>
              <div className="flex flex-col gap-3">
                <button 
                  onClick={async () => {
                    if (window.confirm("CRITICAL_ACTION: Cancel guardian subscription and release all linked units?")) {
                      try {
                        await updateUser(selectedUser.uid, { tier: 'starter', subscribedHives: [] });
                        alert("Subscription terminated. Units released.");
                      } catch (err: any) {
                        alert(`Operation failed: ${err.message}`);
                      }
                    }
                  }}
                  className="w-full py-3 bg-red-500/10 border border-red-500/20 text-red-500 text-[9px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all rounded-sm"
                >
                  Cancel_Subscription
                </button>
                <button 
                  onClick={async () => {
                    if (window.confirm("NUCLEAR_COMMAND: Permanent deletion of guardian profile from registry? This cannot be undone.")) {
                      try {
                        await deleteUser(selectedUser.uid);
                        alert("Profile purged from registry.");
                        window.location.reload(); // Refresh to clear selection
                      } catch (err: any) {
                        alert(`Purge failed: ${err.message}`);
                      }
                    }
                  }}
                  className="w-full py-3 border border-red-500 text-red-500 text-[9px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all rounded-sm shadow-[0_0_15px_rgba(239,68,68,0.2)]"
                >
                  Purge_Guardian_Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
