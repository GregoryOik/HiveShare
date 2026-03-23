import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { 
  Zap, 
  Users, 
  DollarSign, 
  ArrowLeft,
  Search,
  Plus,
  LogOut,
  Lock,
  ChevronRight,
  ShieldAlert,
  CheckCircle,
  MapPin,
  Activity,
  Calendar,
  StickyNote
} from 'lucide-react';
import { useAuth } from '../lib/useAuth';
import { useHiveData, useSiteConfig } from '../lib/useHiveData';
import { useAdminUsers } from '../lib/useAdminUsers';
import Footer from '../components/Footer';

// Modular Sub-Components
import { AdminHiveGrid } from '../components/admin/AdminHiveGrid';
import { AdminUserGrid } from '../components/admin/AdminUserGrid';
import { AdminHiveDetails } from '../components/admin/AdminHiveDetails';
import { AdminUserDetails } from '../components/admin/AdminUserDetails';
import { AdminFinance } from '../components/admin/AdminFinance';

export default function Admin() {
  const { user: authUser, profile, logout } = useAuth();
  const { hives, loading: hivesLoading, addHive, updateHive, removeHive, pushHivePulse, seedHiveHistory, addJournalEntry } = useHiveData();
  const { config, updateConfig } = useSiteConfig();
  const { users, loading: usersLoading, updateUser, assignHiveToUser, removeHiveFromUser, batchUpdateUsers, deleteUser } = useAdminUsers();

  const [activeTab, setActiveTab] = useState<'hives' | 'users' | 'finance'>('hives');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedHiveId, setSelectedHiveId] = useState<string | null>(null);
  const [selectedUserUid, setSelectedUserUid] = useState<string | null>(null);
  const [isAddingHive, setIsAddingHive] = useState(false);

  // Batch Selection State
  const [selectedHiveIds, setSelectedHiveIds] = useState<string[]>([]);
  const [selectedUserUids, setSelectedUserUids] = useState<string[]>([]);

  // Redirect non-admins
  if (!authUser && !hivesLoading) return <Navigate to="/login" />;
  if (profile && profile.role !== 'admin') return <Navigate to="/dashboard" />;

  const filteredHives = hives.filter(h => 
    h.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    h.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    h.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredUsers = users.filter(u => 
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (u.uid.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const selectedHive = hives.find(h => h.id === selectedHiveId);
  const selectedUser = users.find(u => u.uid === selectedUserUid);

  const handleAddHive = async () => {
    setIsAddingHive(true);
    try {
      await addHive();
    } catch (err: any) {
      alert(`Commissioning Failed: ${err.message}`);
    } finally {
      setIsAddingHive(false);
    }
  };

  const handleBatchHiveUpdate = async (data: any) => {
    if (selectedHiveIds.length === 0) return;
    try {
      await Promise.all(selectedHiveIds.map(id => updateHive(id, data)));
      alert(`Successfully synchronized ${selectedHiveIds.length} units.`);
      setSelectedHiveIds([]);
    } catch (err: any) {
      alert(`Batch operation failed: ${err.message}`);
    }
  };

  const handleBatchUserUpdate = async (data: any) => {
    if (selectedUserUids.length === 0) return;
    try {
      await batchUpdateUsers(selectedUserUids, data);
      alert(`Successfully updated profiles for ${selectedUserUids.length} guardians.`);
      setSelectedUserUids([]);
    } catch (err: any) {
      alert(`Batch operation failed: ${err.message}`);
    }
  };

  const handleBatchJournalEntry = async () => {
    if (selectedHiveIds.length === 0) return;
    const entry = prompt('Enter journal entry for selected units:');
    if (!entry) return;
    try {
      await Promise.all(selectedHiveIds.map(id => addJournalEntry(id, entry)));
      alert(`Committed entry to ${selectedHiveIds.length} units.`);
      setSelectedHiveIds([]);
    } catch (err: any) {
      alert(`Batch log failed: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0704] text-white font-sans selection:bg-honey selection:text-black flex flex-col">
      {/* Background Nomadic Grid */}
      <div className="fixed inset-0 pointer-events-none opacity-5">
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#C8860A 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      </div>

      {/* Top Protocol Bar */}
      <div className="border-b border-honey/10 bg-[#0A0704]/80 backdrop-blur-xl sticky top-0 z-[100]">
        <div className="max-w-[1600px] mx-auto px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-8">
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-honey rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(200,134,10,0.4)]">
                  <Zap size={20} className="text-[#0A0704]" fill="currentColor" />
                </div>
                <div>
                  <h1 className="font-display text-2xl tracking-tighter text-white">CENTRAL_STATION</h1>
                  <p className="text-[8px] tracking-[0.4em] font-black text-honey uppercase">Fleet Command & Data Authority</p>
                </div>
             </div>
             <div className="h-10 w-[1px] bg-honey/10 mx-2"></div>
             <div className="flex items-center gap-4">
                <button 
                 onClick={() => {
                   if (config) updateConfig({ maintenanceMode: !config.maintenanceMode });
                 }}
                 className={`px-3 py-1 border text-[8px] font-black uppercase tracking-widest rounded-sm transition-all flex items-center gap-2 ${
                   config?.maintenanceMode 
                   ? 'bg-red-500/20 border-red-500 text-red-400' 
                   : 'bg-green-500/5 border-green-500/30 text-green-500/60 hover:bg-green-500/10'
                 }`}
                >
                  <Lock size={10}/> {config?.maintenanceMode ? 'STATUS: OFFLINE' : 'STATUS: ONLINE'}
                </button>
             </div>
          </div>
          <div className="flex items-center gap-4 text-[9px] font-mono text-white/30 uppercase tracking-tighter">
            <span>{hives.length} UNITS_IN_FIELD</span>
            <span>|</span>
            <span className="text-honey">{authUser?.email}</span>
            <button onClick={logout} className="ml-2 hover:text-red-500 transition-colors"><LogOut size={12}/></button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-[1600px] mx-auto px-8 h-14 flex items-center justify-between">
           <nav className="flex items-center gap-1">
            {[
              { id: 'hives', icon: Zap, label: 'Apiary Fleet' },
              { id: 'users', icon: Users, label: 'Guardians' },
              { id: 'finance', icon: DollarSign, label: 'Revenue' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  setSearchTerm('');
                }}
                className={`flex items-center gap-2 px-6 py-2 rounded-full text-[10px] uppercase tracking-widest font-black transition-all ${
                  activeTab === tab.id 
                    ? 'bg-honey text-[#0A0704] shadow-[0_0_20px_rgba(200,134,10,0.3)]' 
                    : 'text-honey/40 hover:text-honey hover:bg-honey/10'
                }`}
              >
                <tab.icon size={12} /> {tab.label}
              </button>
            ))}
          </nav>
          <Link to="/dashboard" className="flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-white/5 text-[9px] font-black uppercase tracking-widest text-[#F1E9DB]/40 hover:text-honey hover:border-honey/20 transition-all rounded-full">
            <ArrowLeft size={12} /> Return to Grid
          </Link>
        </div>
      </div>

      <main className="flex-1 w-full max-w-[1600px] mx-auto p-8 relative z-10 flex gap-8">
        {/* Left Side Grid (Hives or Users) */}
        {(activeTab === 'hives' || activeTab === 'users') && (
          <aside className="w-80 shrink-0">
            {activeTab === 'hives' ? (
              <AdminHiveGrid 
                hives={hives}
                filteredHives={filteredHives}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                selectedHiveId={selectedHiveId}
                setSelectedHiveId={setSelectedHiveId}
                selectedHiveIds={selectedHiveIds}
                setSelectedHiveIds={setSelectedHiveIds}
                isAddingHive={isAddingHive}
                handleAddHive={handleAddHive}
              />
            ) : (
              <AdminUserGrid 
                users={users}
                filteredUsers={filteredUsers}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                selectedUserUid={selectedUserUid}
                setSelectedUserUid={setSelectedUserUid}
                selectedUserUids={selectedUserUids}
                setSelectedUserUids={setSelectedUserUids}
              />
            )}
          </aside>
        )}

        {/* Main Content Area */}
        <div className="flex-1 space-y-8">
          {activeTab === 'hives' && (
            selectedHive ? (
              <AdminHiveDetails 
                selectedHive={selectedHive}
                updateHive={updateHive}
                pushHivePulse={pushHivePulse}
                seedHiveHistory={seedHiveHistory}
                addJournalEntry={addJournalEntry}
                removeHive={removeHive}
              />
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                <ShieldAlert className="w-16 h-16 text-honey/20" />
                <div className="space-y-1">
                  <h2 className="text-xl font-display text-white">Select a Hive to Command</h2>
                  <p className="text-sm text-honey/40">Choose a unit from the apiary fleet to access biometrics.</p>
                </div>
              </div>
            )
          )}

          {activeTab === 'users' && (
            selectedUser ? (
              <AdminUserDetails 
                selectedUser={selectedUser}
                users={users}
                hives={hives}
                assignHiveToUser={assignHiveToUser}
                removeHiveFromUser={removeHiveFromUser}
                updateUser={updateUser}
                deleteUser={deleteUser}
              />
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                <Users className="w-16 h-16 text-honey/20" />
                <div className="space-y-1">
                  <h2 className="text-xl font-display text-white">Select a Guardian</h2>
                  <p className="text-sm text-honey/40">Select a user profile to manage linkages and metadata.</p>
                </div>
              </div>
            )
          )}


          {activeTab === 'finance' && (
            <AdminFinance users={users} />
          )}
        </div>
      </main>

      {/* Floating Batch Action Bar */}
      {(selectedHiveIds.length > 0 || selectedUserUids.length > 0) && (
        <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-bottom duration-500">
          <div className="bg-[#1A150F] border border-honey shadow-[0_30px_60px_rgba(0,0,0,0.8)] px-8 py-4 rounded-full backdrop-blur-3xl flex items-center gap-8 min-w-[600px] border-animate">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-widest text-honey font-black">BATCH_MODE_ACTIVE</span>
              <span className="text-[8px] font-mono text-white/40">{selectedHiveIds.length || selectedUserUids.length} TARGETS_LOCKED</span>
            </div>
            <div className="h-8 w-[1px] bg-honey/20"></div>
            
            <div className="flex gap-4 items-center">
              {activeTab === 'hives' ? (
                <>
                  <button onClick={() => handleBatchHiveUpdate({ status: 'assigned' })} className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[9px] font-black uppercase tracking-widest text-[#F1E9DB]/60 hover:text-honey hover:border-honey/40 transition-all flex items-center gap-2">
                    <CheckCircle size={12} /> Set_Assigned
                  </button>
                  <button onClick={() => handleBatchHiveUpdate({ status: 'available' })} className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[9px] font-black uppercase tracking-widest text-[#F1E9DB]/60 hover:text-honey hover:border-honey/40 transition-all flex items-center gap-2">
                    <Plus size={12} /> Release_Pool
                  </button>
                  <button onClick={() => {
                    const date = prompt('Enter new harvest date (YYYY-MM-DD):');
                    if (date) handleBatchHiveUpdate({ nextHarvestDate: date });
                  }} className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[9px] font-black uppercase tracking-widest text-[#F1E9DB]/60 hover:text-honey hover:border-honey/40 transition-all flex items-center gap-2">
                    <Calendar size={12} /> Sync_Harvest
                  </button>
                  <button onClick={() => {
                    const loc = prompt('Enter new location/geography:');
                    if (loc) handleBatchHiveUpdate({ location: loc });
                  }} className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[9px] font-black uppercase tracking-widest text-[#F1E9DB]/60 hover:text-honey hover:border-honey/40 transition-all flex items-center gap-2">
                    <MapPin size={12} /> Relocate_Apiary
                  </button>
                  <button onClick={handleBatchJournalEntry} className="px-4 py-2 bg-honey text-black rounded-full text-[9px] font-black uppercase tracking-widest hover:scale-105 transition-all flex items-center gap-2">
                    <StickyNote size={12} /> Collective_Journal
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => handleBatchUserUpdate({ tier: 'premium' })} className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[9px] font-black uppercase tracking-widest text-[#F1E9DB]/60 hover:text-honey hover:border-honey/40 transition-all flex items-center gap-2">
                    <Zap size={12} /> Massive_Upgrade
                  </button>
                  <button onClick={() => {
                    const note = prompt('Enter admin note:');
                    if (note) handleBatchUserUpdate({ adminNotes: note });
                  }} className="px-4 py-2 bg-honey text-black rounded-full text-[9px] font-black uppercase tracking-widest hover:scale-105 transition-all flex items-center gap-2">
                    <StickyNote size={12} /> Attach_Note
                  </button>
                </>
              )}
            </div>

            <div className="h-8 w-[1px] bg-honey/20"></div>
            <button onClick={() => { setSelectedHiveIds([]); setSelectedUserUids([]); }} className="text-[9px] uppercase font-black text-red-500 hover:underline tracking-widest">
              Cancel_Op
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
