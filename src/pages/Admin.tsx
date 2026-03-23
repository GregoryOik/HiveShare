import React, { useState, useEffect } from 'react';
import { useHiveData, useSiteConfig } from '../lib/useHiveData';
import { useAuth } from '../lib/useAuth';
import { useAdminUsers } from '../lib/useAdminUsers';
import { 
  Activity, 
  Thermometer, 
  Droplets, 
  Scale, 
  Calendar, 
  Image as ImageIcon, 
  Video, 
  Plus, 
  Trash2, 
  MapPin, 
  LogOut, 
  Users, 
  UserPlus, 
  UserMinus, 
  Upload, 
  StickyNote,
  Terminal,
  ShieldAlert,
  Zap,
  DollarSign,
  TrendingUp,
  Settings,
  Search,
  ChevronRight,
  Filter,
  Package,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Lock,
  RefreshCw,
  Radio,
  Check,
  Tag,
  Copy
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

export default function Admin() {
  const { hives, loading: hivesLoading, updateHive, pushHivePulse, addJournalEntry, addHive, removeHive } = useHiveData();
  const { users, loading: usersLoading, assignHiveToUser, removeHiveFromUser, updateUser } = useAdminUsers();
  const { config, updateConfig } = useSiteConfig();
  const { user: authUser, profile, logout, forceSyncAdminRole } = useAuth();
  
  const [activeTab, setActiveTab] = useState<'hives' | 'users' | 'system' | 'finance'>('hives');
  const [isSyncing, setIsSyncing] = useState(false);
  const [selectedHiveId, setSelectedHiveId] = useState<string>('');
  const [selectedUserUid, setSelectedUserUid] = useState<string>('');
  
  // Batch Selection States
  const [selectedHiveIds, setSelectedHiveIds] = useState<string[]>([]);
  const [selectedUserUids, setSelectedUserUids] = useState<string[]>([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [isPostingNote, setIsPostingNote] = useState(false);
  const [newJournalEntry, setNewJournalEntry] = useState('');
  
  // Custom Metadata Editor States
  const [customMetaKey, setCustomMetaKey] = useState('');
  const [customMetaValue, setCustomMetaValue] = useState('');

  // IoT Simulation States
  const [iotWeight, setIotWeight] = useState<string>('');
  const [iotTemp, setIotTemp] = useState<string>('');
  const [iotHumidity, setIotHumidity] = useState<string>('');

  const [isAddingHive, setIsAddingHive] = useState(false);

  // Batch Operation Handlers
  const handleBatchHiveUpdate = async (updates: any) => {
    if (selectedHiveIds.length === 0) return;
    const confirmMsg = `Apply updates to ${selectedHiveIds.length} apiaries?`;
    if (!window.confirm(confirmMsg)) return;

    let successCount = 0;
    for (const id of selectedHiveIds) {
      try {
        await updateHive(id, updates);
        successCount++;
      } catch (err: any) {
        console.error(`Batch update failed for Hive #${id}:`, err.message);
      }
    }
    alert(`Batch Operation Complete: ${successCount}/${selectedHiveIds.length} units updated.`);
    setSelectedHiveIds([]);
  };

  const handleBatchUserUpdate = async (updates: any) => {
    if (selectedUserUids.length === 0) return;
    const confirmMsg = `Apply updates to ${selectedUserUids.length} guardians?`;
    if (!window.confirm(confirmMsg)) return;

    let successCount = 0;
    for (const uid of selectedUserUids) {
      try {
        await updateUser(uid, updates);
        successCount++;
      } catch (err: any) {
        console.error(`Batch update failed for User ${uid}:`, err.message);
      }
    }
    alert(`Batch Operation Complete: ${successCount}/${selectedUserUids.length} profiles updated.`);
    setSelectedUserUids([]);
  };

  const handleBatchJournalEntry = async () => {
    const entry = prompt('Enter journal entry for all selected units:');
    if (!entry || selectedHiveIds.length === 0) return;

    let successCount = 0;
    for (const id of selectedHiveIds) {
      try {
        await addJournalEntry(id, entry, 'Maintenance');
        successCount++;
      } catch (err: any) {
        console.error(`Journal append failed for Hive #${id}:`, err.message);
      }
    }
    alert(`Journal Broadcast Complete: ${successCount}/${selectedHiveIds.length} units updated.`);
    setSelectedHiveIds([]);
  };

  // Selection logic for new hives
  useEffect(() => {
    if (hives.length > 0 && !selectedHiveId) {
      setSelectedHiveId(hives[0].id);
    }
  }, [hives, selectedHiveId]);
  const handleAddHive = async () => {
    setIsAddingHive(true);
    try {
      const newId = await addHive();
      if (newId) {
        setSelectedHiveId(newId);
        alert(`Omni-Unit #${newId} Initialized. Biometric link established.`);
      }
    } catch (err: any) {
      alert(`Initialization failed: ${err.message}`);
    } finally {
      setIsAddingHive(false);
    }
  };

  if (hivesLoading || usersLoading) return (
    <div className="min-h-screen bg-[#0A0704] flex items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        <Terminal className="w-12 h-12 text-honey animate-pulse" />
        <span className="text-[10px] uppercase tracking-[0.5em] text-honey font-black">Decrypting Admin Secure Layer...</span>
      </div>
    </div>
  );

  const selectedHive = hives.find(h => h.id === selectedHiveId) || hives[0];
  const selectedUser = users.find(u => u.uid === selectedUserUid);

  const filteredUsers = users.filter(u => 
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.customLabel?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredHives = hives.filter(h => 
    h.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    h.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0A0704] text-[#F1E9DB] font-body selection:bg-honey selection:text-[#0A0704] flex flex-col relative overflow-hidden">
      {/* Background Grid & Vibe */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(200,134,10,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(200,134,10,0.05)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_transparent_0%,_#0A0704_90%)]"></div>
      </div>

      {/* Command Center: Elite Operational Layer */}
      <div className="bg-[#120D08] border-b border-honey/20 sticky top-0 z-[60] backdrop-blur-xl">
        <div className="max-w-[1600px] mx-auto px-8 h-12 flex items-center justify-between border-b border-white/5">
          <div className="flex items-center gap-6">
            <h1 className="font-display text-lg text-white flex items-center gap-3">
              <ShieldAlert className="text-honey" size={18} />
              COMMAND_CENTER <span className="text-[9px] text-honey/40 font-mono tracking-widest uppercase">v2-ELITE</span>
            </h1>
            <div className="flex gap-3">
               <button onClick={handleAddHive} className="px-3 py-1 bg-honey text-black text-[8px] font-black uppercase tracking-widest rounded-sm hover:scale-105 transition-all flex items-center gap-2">
                 <Plus size={10}/> UNIT_DEPLOY
               </button>
               <button 
                onClick={() => {
                  const msg = prompt('Enter Global System Broadcast Message:');
                  if (msg !== null) updateConfig({ systemAnnouncement: msg });
                }}
                className="px-3 py-1 bg-white/5 border border-honey/20 text-honey text-[8px] font-black uppercase tracking-widest rounded-sm hover:bg-honey/10 transition-all flex items-center gap-2"
               >
                 <Zap size={10}/> BROADCAST_NET
               </button>
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

        {/* Navigation Layer */}
        <div className="max-w-[1600px] mx-auto px-8 h-14 flex items-center justify-between">
           <nav className="flex items-center gap-1">
            {[
              { id: 'hives', icon: Zap, label: 'Apiary Fleet' },
              { id: 'users', icon: Users, label: 'Guardians' },
              { id: 'system', icon: Terminal, label: 'System Health' },
              { id: 'finance', icon: DollarSign, label: 'Revenue' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
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
        
        {/* Left Vertical List */}
        <aside className="w-80 shrink-0 space-y-6">
          <div className="bg-[#120D08] border border-honey/10 rounded-lg p-6 flex flex-col h-[calc(100vh-200px)] sticky top-28">
            <div className="mb-6">
              <div className="relative">
                <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-honey/40" />
                <input 
                  type="text" 
                  placeholder={activeTab === 'users' ? "Search Guardians..." : "Filter Hives..."}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-black/40 border border-honey/20 rounded-full pl-10 pr-4 py-2.5 text-[11px] focus:outline-none focus:border-honey transition-all text-white placeholder:text-honey/20 font-sans"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
              {activeTab === 'hives' && (
                <div className="mb-2 px-4 flex items-center justify-between">
                  <button 
                    onClick={() => setSelectedHiveIds(selectedHiveIds.length === hives.length ? [] : hives.map(h => h.id))}
                    className="text-[8px] uppercase font-black text-honey/40 hover:text-honey transition-colors"
                  >
                    {selectedHiveIds.length === hives.length ? 'DESELECT_ALL' : 'SELECT_ALL_UNITS'}
                  </button>
                  <span className="text-[8px] font-mono text-honey/20">{selectedHiveIds.length} SELECTED</span>
                </div>
              )}
              {activeTab === 'hives' && filteredHives.map(hive => (
                <div key={hive.id} className="relative group">
                  <div className="absolute left-2 top-1/2 -translate-y-1/2 z-10">
                    <input 
                      type="checkbox" 
                      checked={selectedHiveIds.includes(hive.id)}
                      onChange={() => setSelectedHiveIds(prev => prev.includes(hive.id) ? prev.filter(id => id !== hive.id) : [...prev, hive.id])}
                      className="w-3 h-3 rounded-sm border-honey/20 bg-black/40 checked:bg-honey transition-all cursor-pointer"
                    />
                  </div>
                  <button
                    onClick={() => setSelectedHiveId(hive.id)}
                    className={`w-full text-left pl-8 pr-4 py-4 rounded-lg border transition-all ${
                      selectedHiveId === hive.id 
                        ? 'bg-honey/10 border-honey/40 shadow-inner' 
                        : 'border-white/5 hover:border-honey/20 bg-white/5'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-black uppercase text-white">Hive #{hive.id}</span>
                      <span className={`text-[8px] uppercase font-black px-1.5 py-0.5 rounded-sm ${
                        hive.status === 'available' ? 'bg-green-500/20 text-green-400' : 'bg-honey/20 text-honey'
                      }`}>
                        {hive.status}
                      </span>
                    </div>
                    <div className="text-[10px] text-honey/40 font-mono tracking-tighter">{hive.location}</div>
                  </button>
                </div>
              ))}

              {activeTab === 'users' && (
                <div className="mb-2 px-4 flex items-center justify-between">
                  <button 
                    onClick={() => setSelectedUserUids(selectedUserUids.length === filteredUsers.length ? [] : filteredUsers.map(u => u.uid))}
                    className="text-[8px] uppercase font-black text-honey/40 hover:text-honey transition-colors"
                  >
                    {selectedUserUids.length === filteredUsers.length ? 'DESELECT_ALL' : 'SELECT_VISIBLE_GUARDIANS'}
                  </button>
                  <span className="text-[8px] font-mono text-honey/20">{selectedUserUids.length} SELECTED</span>
                </div>
              )}
              {activeTab === 'users' && filteredUsers.map(u => (
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

            {activeTab === 'hives' && (
              <button 
                onClick={handleAddHive}
                disabled={isAddingHive}
                className="mt-6 w-full py-4 bg-honey text-[#0A0704] text-[10px] uppercase font-black tracking-[0.2em] rounded-lg hover:bg-white disabled:bg-honey/50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 group"
              >
                <Plus size={14} className={`transition-transform ${isAddingHive ? 'animate-spin' : 'group-hover:rotate-90'}`} /> 
                {isAddingHive ? 'Commissioning Unit...' : 'Initialize New Hive'}
              </button>
            )}
          </div>
        </aside>

        {/* Content Area */}
        <div className="flex-1 space-y-8">
          {activeTab === 'hives' && !selectedHive && (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <ShieldAlert className="w-16 h-16 text-honey/20" />
              <div className="space-y-1">
                <h2 className="text-xl font-display text-white">No Hives Commissioned</h2>
                <p className="text-sm text-honey/40">The fleet is currently offline. Initialize your first unit.</p>
              </div>
              <button 
                onClick={handleAddHive}
                disabled={isAddingHive}
                className="mt-6 px-12 py-4 bg-honey text-[#0A0704] text-[10px] uppercase font-black tracking-[0.2em] rounded-lg hover:bg-white disabled:bg-honey/50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 group"
              >
                <Plus size={14} className={`transition-transform ${isAddingHive ? 'animate-spin' : 'group-hover:rotate-90'}`} /> 
                {isAddingHive ? 'COMMISSIONING...' : 'Initialize Unit #001'}
              </button>
            </div>
          )}

          {activeTab === 'hives' && selectedHive && (
            <div className="space-y-8 animate-in fade-in duration-500">
              {/* Stat Grid */}
              <div className="grid grid-cols-4 gap-6">
                {[
                  { label: 'Live Weight', value: `${selectedHive.weight}kg`, icon: Scale, color: 'text-honey' },
                  { label: 'Ambient Temp', value: `${selectedHive.temp}°C`, icon: Thermometer, color: 'text-blue-400' },
                  { label: 'Internal Humid', value: `${selectedHive.humidity}%`, icon: Droplets, color: 'text-cyan-400' },
                  { label: 'Colony Activity', value: selectedHive.activity, icon: Zap, color: 'text-amber-400' }
                ].map((stat, i) => (
                  <div key={i} className="bg-[#120D08] border border-honey/10 p-6 rounded-lg relative overflow-hidden group hover:border-honey/30 transition-all">
                    <div className="relative z-10">
                      <div className="text-[10px] uppercase tracking-widest text-honey/40 font-black mb-1">{stat.label}</div>
                      <div className={`text-2xl font-display ${stat.color}`}>{stat.value}</div>
                    </div>
                    <stat.icon size={48} className={`absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-all ${stat.color}`} />
                  </div>
                ))}
              </div>

              {/* Control Panel Grid */}
              <div className="grid grid-cols-12 gap-8">
                {/* Physical Controls */}
                <div className="col-span-12 lg:col-span-8 bg-[#120D08] border border-honey/10 rounded-lg p-8">
                  <div className="flex items-center justify-between mb-10">
                    <h3 className="text-xl font-display text-white">Hive Biometrics Override</h3>
                    <div className="flex items-center gap-2 text-[10px] text-green-400 font-black uppercase">
                      <CheckCircle size={12} /> Sync Established
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-8">
                    <div className="space-y-6">
                      <div>
                        <label className="text-[10px] uppercase tracking-widest text-honey font-black block mb-2">Weight Adjustment (kg)</label>
                        <input 
                          type="number" step="0.1"
                          value={selectedHive.weight}
                          onChange={async (e) => {
                            try {
                              await updateHive(selectedHive.id, { weight: Number(e.target.value) });
                            } catch (err: any) {
                              alert(`Sensor Update Failed: ${err.message}`);
                            }
                          }}
                          className="w-full bg-black/40 border border-honey/20 rounded-md p-3 text-white text-sm outline-none focus:border-honey"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase tracking-widest text-honey font-black block mb-2">Internal Temp (°C)</label>
                        <input 
                          type="number" step="0.1"
                          value={selectedHive.temp}
                          onChange={async (e) => {
                            try {
                              await updateHive(selectedHive.id, { temp: Number(e.target.value) });
                            } catch (err: any) {
                              alert(`Sensor Update Failed: ${err.message}`);
                            }
                          }}
                          className="w-full bg-black/40 border border-honey/20 rounded-md p-3 text-white text-sm outline-none focus:border-honey"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase tracking-widest text-honey font-black block mb-2">Relative Humidity (%)</label>
                        <input 
                          type="number" min="0" max="100"
                          value={selectedHive.humidity}
                          onChange={async (e) => {
                            try {
                              await updateHive(selectedHive.id, { humidity: Number(e.target.value) });
                            } catch (err: any) {
                              alert(`Sensor Update Failed: ${err.message}`);
                            }
                          }}
                          className="w-full bg-black/40 border border-honey/20 rounded-md p-3 text-white text-sm outline-none focus:border-honey"
                        />
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <label className="text-[10px] uppercase tracking-widest text-honey font-black block mb-2">Bee Species Management</label>
                        <div className="flex gap-2">
                          <input 
                            type="text"
                            value={selectedHive.beeSpecies || 'Apis mellifera macedonica'}
                            onChange={async (e) => {
                              try {
                                await updateHive(selectedHive.id, { beeSpecies: e.target.value });
                              } catch (err: any) {
                                alert(`Metadata Update Failed: ${err.message}`);
                              }
                            }}
                            className="flex-1 bg-black/40 border border-honey/20 rounded-md p-3 text-white text-xs font-sans outline-none focus:border-honey"
                          />
                          {selectedHive.beeSpecies && (
                            <button 
                              onClick={() => updateHive(selectedHive.id, { beeSpecies: null })}
                              className="px-3 bg-honey/10 border border-honey/20 rounded-md text-honey hover:bg-honey/20 transition-all"
                              title="Reset to Species Default"
                            >
                              <RefreshCw size={14} />
                            </button>
                          )}
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] uppercase tracking-widest text-honey font-black block mb-2">Deployment Zone</label>
                        <div className="flex gap-2">
                          <input 
                            type="text"
                            value={selectedHive.location}
                            onChange={async (e) => {
                              try {
                                await updateHive(selectedHive.id, { location: e.target.value });
                              } catch (err: any) {
                                alert(`Geographic Update Failed: ${err.message}`);
                              }
                            }}
                            className="flex-1 bg-black/40 border border-honey/20 rounded-md p-3 text-white text-xs font-sans outline-none focus:border-honey"
                          />
                          <button 
                            onClick={() => updateHive(selectedHive.id, { location: 'Mani, Greece' })}
                            className="px-3 bg-honey/10 border border-honey/20 rounded-md text-honey hover:bg-honey/20 transition-all"
                            title="Reset to Base Location"
                          >
                            <RefreshCw size={14} />
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] uppercase tracking-widest text-honey font-black block mb-2">Colony Activity Level</label>
                        <select 
                          value={selectedHive.activity}
                          onChange={async (e) => {
                            try {
                              await updateHive(selectedHive.id, { activity: e.target.value });
                            } catch (err: any) {
                              alert(`Biometric Update Failed: ${err.message}`);
                            }
                          }}
                          className="w-full bg-black/40 border border-honey/20 rounded-md p-3 text-white text-sm outline-none focus:border-honey cursor-pointer"
                        >
                          <option value="Low">Low Activity</option>
                          <option value="Medium">Medium Activity</option>
                          <option value="High">High Activity</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <label className="text-[10px] uppercase tracking-widest text-honey font-black block mb-2">Current Harvest Focus</label>
                        <select 
                          value={selectedHive.activeHarvest}
                          onChange={async (e) => {
                            try {
                              await updateHive(selectedHive.id, { activeHarvest: e.target.value });
                            } catch (err: any) {
                              alert(`Timeline Update Failed: ${err.message}`);
                            }
                          }}
                          className="w-full bg-black/40 border border-honey/20 rounded-md p-3 text-white text-sm appearance-none cursor-pointer outline-none focus:border-honey"
                        >
                          <option>Spring Wildflower</option>
                          <option>Summer Thyme</option>
                          <option>Autumn Pine</option>
                          <option>Winter Fir</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] uppercase tracking-widest text-honey font-black block mb-2">Next Predicted Harvest</label>
                        <div className="flex gap-2">
                          <input 
                            type="date"
                            value={selectedHive.nextHarvestDate}
                            onChange={async (e) => {
                              try {
                                await updateHive(selectedHive.id, { nextHarvestDate: e.target.value });
                              } catch (err: any) {
                                alert(`Timeline Update Failed: ${err.message}`);
                              }
                            }}
                            className="flex-1 bg-black/40 border border-honey/20 rounded-md p-3 text-white text-xs outline-none focus:border-honey"
                          />
                          {selectedHive.nextHarvestDate && (
                            <button 
                              onClick={() => updateHive(selectedHive.id, { nextHarvestDate: null })}
                              className="px-3 bg-honey/10 border border-honey/20 rounded-md text-honey hover:bg-honey/20 transition-all"
                              title="Reset to Global Timing"
                            >
                              <RefreshCw size={14} />
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="pt-2">
                        <label className="text-[10px] uppercase tracking-widest text-honey font-black block mb-2">Fleet Status</label>
                        <select 
                          value={selectedHive.status}
                          onChange={async (e) => {
                            try {
                              await updateHive(selectedHive.id, { status: e.target.value });
                            } catch (err: any) {
                              alert(`Status Update Failed: ${err.message}`);
                            }
                          }}
                          className={`w-full border rounded-md p-3 text-[10px] uppercase font-black outline-none transition-all cursor-pointer ${
                            selectedHive.status === 'available' ? 'bg-green-500/10 border-green-500/40 text-green-400' :
                            selectedHive.status === 'assigned' ? 'bg-honey/10 border-honey/40 text-honey' :
                            'bg-blue-500/10 border-blue-500/40 text-blue-400'
                          }`}
                        >
                          <option value="available">Available for Guardianship</option>
                          <option value="assigned">Fully Assigned</option>
                          <option value="shared">Shared Colony</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-8 mt-10 pt-10 border-t border-honey/10">
                    <div className="space-y-4">
                      <label className="text-[10px] uppercase tracking-widest text-honey font-black block">Satellite Video Stream Uplink</label>
                      <div className="flex gap-2">
                        <input 
                          type="text"
                          value={selectedHive.videoUrl || ''}
                          onChange={async (e) => {
                            try {
                              await updateHive(selectedHive.id, { videoUrl: e.target.value });
                            } catch (err: any) {
                              alert(`Comm Link Failed: ${err.message}`);
                            }
                          }}
                          placeholder="Assign RTMP/Stream URL..."
                          className="flex-1 bg-black/40 border border-honey/20 rounded-md p-3 text-white text-[10px] font-mono outline-none focus:border-honey"
                        />
                      </div>
                    </div>
                    <div className="flex items-end">
                      <button 
                        onClick={async () => {
                          if (hives.length <= 1) return;
                          try {
                            if (confirm('CRITICAL: Decommissioning unit. This action is irreversible. Proceed?')) {
                              await removeHive(selectedHive.id);
                              alert(`Unit #${selectedHive.id} successfully decommissioned from apiary grid.`);
                            }
                          } catch (err: any) {
                            alert(`Decommissioning failed: ${err.message}`);
                          }
                        }}
                        className="w-full py-3 border border-red-500/20 text-red-500/60 hover:bg-red-500 hover:text-white transition-all text-[10px] uppercase font-bold rounded-lg"
                      >
                        Decommission Hive
                      </button>
                    </div>
                  </div>

                  {/* Hive Meta: Unlimited Extensibility */}
                  <div className="space-y-4 mt-8 pt-8 border-t border-honey/10">
                    <label className="text-[10px] uppercase tracking-widest text-honey font-black flex items-center gap-2 underline decoration-honey/30 underline-offset-4">
                      <Terminal size={14} /> Universal_Metadata_Core
                    </label>
                    <div className="bg-honey/5 border border-honey/10 p-5 rounded-lg space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <input 
                          type="text"
                          value={customMetaKey}
                          onChange={(e) => setCustomMetaKey(e.target.value)}
                          placeholder="Field_Key"
                          className="bg-black/60 border border-honey/20 rounded-md p-2 text-[10px] text-white focus:border-honey outline-none font-mono"
                        />
                        <input 
                          type="text"
                          value={customMetaValue}
                          onChange={(e) => setCustomMetaValue(e.target.value)}
                          placeholder="Field_Value"
                          className="bg-black/60 border border-honey/20 rounded-md p-2 text-[10px] text-white focus:border-honey outline-none font-mono"
                        />
                      </div>
                      <button 
                        onClick={() => {
                          if (!customMetaKey || !customMetaValue) return;
                          updateHive(selectedHive.id, { [customMetaKey]: customMetaValue });
                          setCustomMetaKey(''); setCustomMetaValue('');
                        }}
                        className="w-full py-2 bg-honey/10 border border-honey/30 text-honey text-[9px] font-black uppercase tracking-widest hover:bg-honey hover:text-black transition-all rounded-sm"
                      >
                        Push_Field_to_Core
                      </button>
                      <div className="space-y-1 max-h-[150px] overflow-y-auto custom-scrollbar pt-2 border-t border-white/5">
                        {Object.entries(selectedHive).filter(([k]) => !['id','history','journal','weight','temp','humidity','activity','location','activeHarvest','nextHarvestDate','photoUrl','beeSpecies','installationDate','status','currentSubscribers','lastDiaryEntryTimestamp','videoUrl','lastAdminNote'].includes(k)).map(([k, v]) => (
                          <div key={k} className="flex items-center justify-between p-2 bg-white/5 border border-white/5 rounded text-[9px] font-mono group/meta">
                            <span className="text-honey/60">{k}:</span>
                            <span className="text-white/60 truncate max-w-[120px]">{String(v)}</span>
                            <button onClick={() => updateHive(selectedHive.id, { [k]: null })} className="text-red-500/40 hover:text-red-500 opacity-0 group-hover/meta:opacity-100 transition-opacity"><Trash2 size={10}/></button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* IoT Pulse Simulator */}
                  <div className="space-y-4 mt-8 pt-8 border-t border-honey/10">
                    <label className="text-[10px] uppercase tracking-widest text-honey font-black flex items-center gap-2 underline decoration-honey/30 underline-offset-4">
                      <Radio size={14} className={selectedHive.iotActive ? "animate-pulse text-green-500" : ""} /> IoT_Pulse_Simulator
                    </label>
                    <div className="bg-honey/5 border border-honey/10 p-5 rounded-lg space-y-4">
                      {/* Hardware Key Section */}
                      <div className="pb-4 border-b border-honey/10">
                        <span className="text-[10px] uppercase tracking-widest text-honey/60 font-bold block mb-2">Hardware_Authentication_Key</span>
                        <div className="flex items-center gap-2">
                          <code className="bg-black/60 border border-honey/20 rounded px-2 py-1.5 text-[10px] text-honey font-mono flex-1 truncate">
                            {selectedHive.iotKey || "KEY_NOT_GEN"}
                          </code>
                          <button 
                            onClick={() => {
                              if (selectedHive.iotKey) {
                                navigator.clipboard.writeText(selectedHive.iotKey);
                                alert("Hardware Key Copied to Clipboard!");
                              }
                            }}
                            className="p-2 bg-honey/10 border border-honey/30 rounded hover:bg-honey hover:text-black transition-all"
                            title="Copy Key"
                          >
                            <Copy size={12} />
                          </button>
                        </div>
                        <div className="mt-2 flex flex-col gap-1">
                           <div className="flex items-center gap-2">
                             <span className="text-[8px] uppercase text-white/20 tracking-widest font-black">Uplink Target (DEV_ONLY):</span>
                             <code className="text-[8px] text-honey font-mono bg-honey/10 px-1 rounded">https://api.hiveshare.io/v1/uplink</code>
                           </div>
                           <p className="text-[7px] text-white/30 uppercase tracking-tighter leading-tight mt-1">
                             * This is a REST endpoint placeholder. For real hardware integration (ESP32/Arduino), 
                             please contact support to activate your dedicated API gateway.
                           </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] uppercase tracking-widest text-honey/60 font-bold">Uplink Status</span>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${selectedHive.iotActive ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" : "bg-red-500"}`}></div>
                          <span className="text-[9px] uppercase tracking-widest text-white/40">{selectedHive.iotActive ? "Synchronized" : "Offline"}</span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-2">
                         <div className="space-y-1">
                            <span className="text-[8px] uppercase text-honey/40">Weight (kg)</span>
                            <input 
                              type="number"
                              value={iotWeight}
                              onChange={(e) => setIotWeight(e.target.value)}
                              placeholder={selectedHive.weight.toString()}
                              className="w-full bg-black/60 border border-honey/20 rounded-md p-2 text-[10px] text-white focus:border-honey outline-none font-mono"
                            />
                         </div>
                         <div className="space-y-1">
                            <span className="text-[8px] uppercase text-honey/40">Temp (°C)</span>
                            <input 
                              type="number"
                              value={iotTemp}
                              onChange={(e) => setIotTemp(e.target.value)}
                              placeholder={selectedHive.temp.toString()}
                              className="w-full bg-black/60 border border-honey/20 rounded-md p-2 text-[10px] text-white focus:border-honey outline-none font-mono"
                            />
                         </div>
                         <div className="space-y-1">
                            <span className="text-[8px] uppercase text-honey/40">Humid (%)</span>
                            <input 
                              type="number"
                              value={iotHumidity}
                              onChange={(e) => setIotHumidity(e.target.value)}
                              placeholder={selectedHive.humidity.toString()}
                              className="w-full bg-black/60 border border-honey/20 rounded-md p-2 text-[10px] text-white focus:border-honey outline-none font-mono"
                            />
                         </div>
                      </div>

                      <button 
                        onClick={async () => {
                          const w = parseFloat(iotWeight) || selectedHive.weight;
                          const t = parseFloat(iotTemp) || selectedHive.temp;
                          const h = parseFloat(iotHumidity) || selectedHive.humidity;
                          
                          try {
                            setIsSyncing(true);
                            await pushHivePulse(selectedHive.id, { weight: w, temp: t, humidity: h });
                            setIotWeight(''); setIotTemp(''); setIotHumidity('');
                            alert(`Success: IoT Pulse Deployed to Unit #${selectedHive.id}. History synchronized.`);
                          } catch (err: any) {
                            alert(`Uplink Failure: ${err.message}`);
                          } finally {
                            setIsSyncing(false);
                          }
                        }}
                        disabled={isSyncing}
                        className="w-full py-2.5 bg-honey text-[#0A0704] text-[9px] font-black uppercase tracking-widest hover:bg-honey/90 transition-all rounded-sm flex items-center justify-center gap-2"
                      >
                        <Activity size={12} className={isSyncing ? "animate-spin" : ""} />
                        Deploy_Pulse_Payload
                      </button>

                      {selectedHive.lastSyncTimestamp && (
                        <div className="text-center pt-2">
                           <span className="text-[9px] text-white/20 uppercase tracking-[0.2em]">Last Sync: {new Date(selectedHive.lastSyncTimestamp).toLocaleTimeString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Journaling Terminal */}
                <div className="col-span-12 lg:col-span-4 bg-[#120D08] border border-honey/10 rounded-lg p-8 flex flex-col">
                  <div className="flex items-center gap-3 text-honey mb-8">
                    <StickyNote size={16} />
                    <h3 className="text-[11px] uppercase tracking-[0.3em] font-black">Nomadic Chronicles</h3>
                  </div>
                  
                  <div className="flex-1 bg-black/40 border border-white/5 rounded-md p-4 mb-4 font-mono text-[11px] overflow-y-auto max-h-64 custom-scrollbar">
                    {selectedHive.journal?.map((entry, i) => (
                      <div key={i} className="mb-4 text-white/40">
                        <div className="text-honey/60 mb-1">{new Date(entry.date).toLocaleDateString()} {" > "} {entry.type}</div>
                        <div className="text-white/80 italic">"{entry.content}"</div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3">
                    <textarea 
                      value={newJournalEntry}
                      onChange={(e) => setNewJournalEntry(e.target.value)}
                      placeholder="Enter beekeeper log..."
                      rows={3}
                      className="w-full bg-[#0A0704] border border-honey/20 rounded-md p-3 text-[11px] text-white focus:border-honey outline-none resize-none font-sans"
                    />
                    <button 
                      onClick={async () => {
                        if (!newJournalEntry.trim()) return;
                        setIsPostingNote(true);
                        try {
                          const success = await addJournalEntry(selectedHive.id, newJournalEntry);
                          if (success) {
                            setNewJournalEntry('');
                          }
                        } catch (err: any) {
                          alert(`Transmission failed: ${err.message}`);
                        } finally {
                          setIsPostingNote(false);
                        }
                      }}
                      disabled={isPostingNote}
                      className="w-full py-3 bg-honey/10 border border-honey/40 text-honey text-[10px] uppercase font-black hover:bg-honey hover:text-[#0A0704] transition-all rounded-md"
                    >
                      {isPostingNote ? 'TRANSMITTING...' : 'Append Log Entry'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Media Hub */}
              <div className="bg-[#120D08] border border-honey/10 rounded-lg p-8">
                <div className="flex items-center gap-3 text-honey mb-8">
                  <ImageIcon size={16} />
                  <h3 className="text-[11px] uppercase tracking-[0.3em] font-black">Satellite Imagery Downlink</h3>
                </div>
                
                <div className="flex flex-col md:flex-row gap-12 items-center">
                  <div className="w-full md:w-96 aspect-video bg-black rounded-lg overflow-hidden border border-honey/20 group relative shadow-2xl">
                    <img 
                      src={selectedHive.photoUrl || '/beekeeper.jpg'} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                      alt="Hive View"
                    />
                    <div className="absolute inset-0 bg-honey/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <label className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                      <Upload className="text-white w-10 h-10" />
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = async () => {
                            try {
                              await updateHive(selectedHive.id, { photoUrl: reader.result as string });
                            } catch (err: any) {
                              alert(`Visual uplink failed: ${err.message}`);
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }} />
                    </label>
                  </div>
                  
                  <div className="flex-1 space-y-6">
                    <div className="space-y-4">
                      <p className="text-xs text-honey/40 font-medium leading-relaxed italic border-l border-honey/20 pl-6">
                        "Manual override for hive visuals. Administrators can direct-upload high-resolution colony snapshots or assign remote stream URLs."
                      </p>
                      <input 
                        type="text"
                        value={selectedHive.photoUrl}
                        onChange={async (e) => {
                          try {
                            await updateHive(selectedHive.id, { photoUrl: e.target.value });
                          } catch (err: any) {
                            alert(`Visual uplink failed: ${err.message}`);
                          }
                        }}
                        placeholder="Assign Manual Image URL..."
                        className="w-full bg-black/40 border border-honey/20 rounded-md p-4 text-[10px] text-honey font-mono focus:border-honey outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && selectedUser && (
            <div className="bg-[#120D08] border border-honey/10 rounded-lg p-8 animate-in slide-in-from-right-4 duration-500 shadow-2xl">
              <div className="flex items-center justify-between mb-12 border-b border-honey/10 pb-8">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center text-[#0A0704] font-bold text-xl ${
                    selectedUser.tier === 'premium' ? 'bg-honey' : 'bg-honey/40'
                  }`}>
                    {selectedUser.email[0].toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-2xl font-display text-white">{selectedUser.email}</h2>
                    <p className="text-[10px] uppercase tracking-[0.3em] font-black text-honey/40">UID: {selectedUser.uid}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] uppercase tracking-widest text-honey/40 font-black mb-1">Status</div>
                  <div className="text-green-400 text-xs font-black uppercase tracking-widest flex items-center justify-end gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></div> Authorized
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-12 gap-12">
                <div className="col-span-12 lg:col-span-8 space-y-10">
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <label className="text-[10px] uppercase tracking-widest text-honey font-black block">Access Hierarchy</label>
                      <select 
                        value={selectedUser.role} 
                        onChange={async (e) => {
                          const newRole = e.target.value as any;
                          try {
                            await updateUser(selectedUser.uid, { role: newRole });
                            alert(`Access hierarchy for ${selectedUser.email} elevated to ${newRole.toUpperCase()}.`);
                          } catch (err: any) {
                            alert(`Access hierarchy failed: ${err.message}`);
                          }
                        }}
                        className="w-full bg-black border border-honey/20 rounded-md p-4 text-sm text-white focus:border-honey outline-none"
                      >
                        <option value="user">Candidate</option>
                        <option value="subscriber">Guardian</option>
                        <option value="admin">Master Administrator</option>
                      </select>
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] uppercase tracking-widest text-honey font-black block">Membership Tier</label>
                      <select 
                        value={selectedUser.tier || 'starter'} 
                        onChange={async (e) => {
                          const newTier = e.target.value as any;
                          try {
                            await updateUser(selectedUser.uid, { tier: newTier });
                            alert(`Resource allocation for ${selectedUser.email} shifted to ${newTier.toUpperCase()}.`);
                          } catch (err: any) {
                            alert(`Tier shift failed: ${err.message}`);
                          }
                        }}
                        className="w-full bg-black border border-honey/20 rounded-md p-4 text-sm text-white focus:border-honey outline-none"
                      >
                        <option value="starter">Starter Adopter</option>
                        <option value="premium">Premium Guardian</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] uppercase tracking-widest text-honey font-black block">Inscribed Name (Certificate)</label>
                    <input 
                      type="text"
                      value={selectedUser.customLabel || ''}
                      onChange={(e) => updateUser(selectedUser.uid, { customLabel: e.target.value })}
                      placeholder="Legal/Certificate Name..."
                      className="w-full bg-black border border-honey/20 rounded-md p-4 text-sm text-white focus:border-honey outline-none font-sans"
                    />
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] uppercase tracking-widest text-honey font-black block underline decoration-honey/30 underline-offset-4">Personalized Branding (User Override)</label>
                    <div className="bg-honey/5 border border-honey/10 p-4 rounded-md space-y-3">
                      <p className="text-[9px] text-white/30 italic">"Override the global honey name for this specific guardian's dashboard."</p>
                      <div className="flex gap-2">
                        <input 
                          type="text"
                          value={selectedUser.customHoneyName || ''}
                          onChange={(e) => updateUser(selectedUser.uid, { customHoneyName: e.target.value })}
                          placeholder="e.g. Gregory's Golden Nectar..."
                          className="flex-1 bg-black/60 border border-honey/20 rounded-md p-3 text-[10px] text-white focus:border-honey outline-none font-sans"
                        />
                        {selectedUser.customHoneyName && (
                          <button 
                            onClick={() => updateUser(selectedUser.uid, { customHoneyName: null })}
                            className="px-3 bg-honey/10 border border-honey/20 rounded-md text-honey hover:bg-honey/20 transition-all title='Reset to Global'"
                          >
                            <RefreshCw size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] uppercase tracking-widest text-[#C8860A] font-black block underline decoration-honey/30 underline-offset-4">Guardian Intelligence (Unique Status)</label>
                    <div className="bg-honey/5 border border-honey/10 p-4 rounded-md space-y-3">
                      <p className="text-[9px] text-white/30 italic">"Define a custom harvest phase or special status for this user."</p>
                      <div className="flex gap-2">
                        <input 
                          type="text"
                          value={selectedUser.userHarvestStatus || ''}
                          onChange={(e) => updateUser(selectedUser.uid, { userHarvestStatus: e.target.value })}
                          placeholder="e.g. Final Maturation Phase..."
                          className="flex-1 bg-black/60 border border-honey/20 rounded-md p-3 text-[10px] text-white focus:border-honey outline-none font-sans"
                        />
                        {selectedUser.userHarvestStatus && (
                          <button 
                            onClick={() => updateUser(selectedUser.uid, { userHarvestStatus: null })}
                            className="px-3 bg-honey/10 border border-honey/20 rounded-md text-honey hover:bg-honey/20 transition-all title='Reset to Global'"
                          >
                            <RefreshCw size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] uppercase tracking-widest text-honey font-black block">Logistical Address</label>
                    <textarea 
                      value={selectedUser.shippingAddress || ''}
                      onChange={(e) => updateUser(selectedUser.uid, { shippingAddress: e.target.value })}
                      placeholder="No delivery coordinates established."
                      rows={3}
                      className="w-full bg-black border border-honey/20 rounded-md p-4 text-sm text-white focus:border-honey outline-none font-sans resize-none"
                    />
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] uppercase tracking-widest text-[#C8860A] font-black block">Internal Dossier (Private Notes)</label>
                    <textarea 
                      value={selectedUser.adminNotes || ''}
                      onChange={(e) => updateUser(selectedUser.uid, { adminNotes: e.target.value })}
                      placeholder="Add private observations for this guardian..."
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
                              <Trash2 size={10}/>
                            </button>
                          </div>
                        ))}
                        {(!selectedUser.metadata || selectedUser.metadata.length === 0) && (
                          <div className="text-[8px] text-white/10 text-center py-2 uppercase tracking-widest">No_Layered_Data</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-span-12 lg:col-span-4 space-y-8">
                  <div className="p-6 bg-black/40 border border-honey/10 rounded-lg space-y-6">
                    <div className="text-[10px] uppercase tracking-[0.2em] text-honey font-black">Subscription Intelligence</div>
                    <div className="space-y-4">
                      <div>
                        <div className="text-[9px] uppercase tracking-widest text-white/30 mb-1">Join Date</div>
                        <div className="text-xs text-white font-mono">
                          {selectedUser.subscriptionStartDate 
                            ? new Date(selectedUser.subscriptionStartDate).toLocaleDateString() 
                            : 'N/A'}
                        </div>
                      </div>
                      <div>
                        <div className="text-[9px] uppercase tracking-widest text-white/30 mb-1">Renewal Cycle</div>
                        <div className="text-xs text-honey font-mono">
                          {selectedUser.subscriptionStartDate 
                            ? new Date(new Date(selectedUser.subscriptionStartDate).setFullYear(new Date(selectedUser.subscriptionStartDate).getFullYear() + 1)).toLocaleDateString()
                            : 'Next Season'}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-black/40 border border-honey/10 rounded-lg space-y-4">
                    <div className="text-[10px] uppercase tracking-[0.2em] text-honey font-black">Apiary Associations</div>
                    <div className="space-y-3">
                      {selectedUser.subscribedHives?.length === 0 ? (
                        <p className="text-[10px] text-white/20 italic">No hives linked to this profile.</p>
                      ) : (
                        selectedUser.subscribedHives?.map(id => (
                          <div key={id} className="flex items-center justify-between p-3 bg-white/5 rounded-md">
                            <span className="text-xs font-bold font-mono">Unit #{id}</span>
                            <button 
                               onClick={async () => {
                                 try {
                                   await removeHiveFromUser(selectedUser.uid, id);
                                 } catch (err: any) {
                                   alert(`Link termination failed: ${err.message}`);
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
                </div>
              </div>
            </div>
          )}

          {activeTab === 'system' && (
            <div className="space-y-8 animate-in zoom-in duration-500">
                {/* Global Site Configuration */}
                {config && (
                  <div className="bg-[#120D08] border border-honey/10 rounded-lg p-8 grid grid-cols-1 md:grid-cols-2 gap-8 border-l-4 border-l-honey">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-honey">
                        <Terminal size={16} />
                        <h3 className="text-[10px] uppercase tracking-widest font-black">Global Site Configuration</h3>
                      </div>
                      <p className="text-[11px] text-white/40 italic">
                        "Define the default reality for all new guardians and unconfigured apiaries. Overrides at the hive or user level will take precedence."
                      </p>
                      <div className="space-y-3 pt-4">
                        <div>
                          <label className="text-[9px] uppercase tracking-widest text-honey/60 font-black block mb-2">Default Harvest Title</label>
                          <input 
                            type="text"
                            value={config.globalHarvestName}
                            onChange={(e) => updateConfig({ globalHarvestName: e.target.value })}
                            className="w-full bg-black/40 border border-honey/20 rounded-md p-3 text-white text-[10px] outline-none focus:border-honey"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] uppercase tracking-widest text-honey/60 font-black block mb-2">Default Harvest Date</label>
                          <input 
                            type="date"
                            value={config.globalHarvestDate}
                            onChange={(e) => updateConfig({ globalHarvestDate: e.target.value })}
                            className="w-full bg-black/40 border border-honey/20 rounded-md p-3 text-white text-[10px] outline-none focus:border-honey"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="text-[9px] uppercase tracking-widest text-honey/60 font-black block mb-2">Regional Deployment Presets</label>
                        <textarea 
                          value={config.availableRegions.join('\n')}
                          onChange={(e) => updateConfig({ availableRegions: e.target.value.split('\n').filter(r => r.trim()) })}
                          placeholder="One region per line..."
                          rows={3}
                          className="w-full bg-black/40 border border-honey/20 rounded-md p-3 text-white text-[10px] outline-none focus:border-honey font-mono resize-none"
                        />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-[#C8860A]">
                        <Settings size={16} />
                        <h3 className="text-[10px] uppercase tracking-widest font-black">Extended Branding Payload</h3>
                      </div>
                      <div className="space-y-4 pt-4">
                         <div>
                           <label className="text-[9px] uppercase tracking-widest text-honey/60 font-black block mb-2">Harvest Season Title</label>
                           <input 
                            type="text"
                            value={config.harvestSeason || ''}
                            onChange={(e) => updateConfig({ harvestSeason: e.target.value })}
                            placeholder="e.g. Spring Bloom"
                            className="w-full bg-black/40 border border-honey/20 rounded-md p-3 text-white text-[10px] outline-none focus:border-honey"
                           />
                         </div>
                         <div>
                           <label className="text-[9px] uppercase tracking-widest text-honey/60 font-black block mb-2">Dashboard Greeting</label>
                           <input 
                            type="text"
                            value={config.dashboardGreeting || ''}
                            onChange={(e) => updateConfig({ dashboardGreeting: e.target.value })}
                            placeholder="e.g. Greetings, Guardian"
                            className="w-full bg-black/40 border border-honey/20 rounded-md p-3 text-white text-[10px] outline-none focus:border-honey"
                           />
                         </div>
                         <div>
                           <label className="text-[9px] uppercase tracking-widest text-honey/60 font-black block mb-2">Site-Wide Harvest Description</label>
                           <textarea 
                            value={config.siteWideHarvestDescription || ''}
                            onChange={(e) => updateConfig({ siteWideHarvestDescription: e.target.value })}
                            placeholder="Global narrative for the harvest timeline..."
                            rows={4}
                            className="w-full bg-black/40 border border-honey/20 rounded-md p-3 text-white text-[10px] outline-none focus:border-honey font-sans resize-none"
                           />
                         </div>
                         <div className="pt-2">
                           <label className="text-[9px] uppercase tracking-widest text-honey/60 font-black block mb-2">Site-Wide Intelligence Broadcast</label>
                           <input 
                             type="text"
                             value={config.systemAnnouncement || ''}
                             onChange={(e) => updateConfig({ systemAnnouncement: e.target.value })}
                             placeholder="Optional global announcement..."
                             className="w-full bg-black/40 border border-honey/20 rounded-md p-3 text-white text-[10px] outline-none focus:border-honey"
                           />
                         </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Permission Diagnostics */}
                <div className="bg-[#120D08] border border-blue-500/20 rounded-lg p-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center border-l-4 border-l-blue-500 mb-8">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-blue-400">
                      <ShieldAlert size={16} />
                      <h3 className="text-[10px] uppercase tracking-widest font-black">Permission Diagnostics</h3>
                    </div>
                    <p className="text-[11px] text-white/40 italic">
                      "System mismatch detected? Manually synchronize your administrative clearance with the secure vault."
                    </p>
                  </div>
                  <div className="flex flex-col gap-4">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-black/40 border border-white/5 p-3 rounded-md">
                        <div className="text-[8px] uppercase text-white/30 mb-1">State Role</div>
                        <div className="text-[10px] text-honey font-bold uppercase">{profile?.role || 'unknown'}</div>
                      </div>
                      <div className="bg-black/40 border border-white/5 p-3 rounded-md">
                        <div className="text-[8px] uppercase text-white/30 mb-1">Auth Entity</div>
                        <div className="text-[10px] text-white truncate">{authUser?.email}</div>
                      </div>
                    </div>
                    <button 
                      onClick={async () => {
                        setIsSyncing(true);
                        try {
                          await forceSyncAdminRole();
                          alert('Master Clearance Synchronized. Re-verify apiary commands.');
                        } catch (err: any) {
                          alert(`Sync Violation: ${err.message}`);
                        }
                        setIsSyncing(false);
                      }}
                      disabled={isSyncing}
                      className="w-full py-2 bg-blue-500/10 border border-blue-500/40 text-blue-400 text-[10px] uppercase font-black hover:bg-blue-500 hover:text-white transition-all rounded-md"
                    >
                      {isSyncing ? 'SYNCHRONIZING...' : 'Force Permission Sync'}
                    </button>
                  </div>
                </div>

                <div className="bg-[#120D08] border border-honey/10 rounded-lg p-8">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                      <Terminal size={20} className="text-honey" />
                      <h3 className="text-xl font-display text-white">Cluster Management & Regional Deployment</h3>
                    </div>
                    <div className="px-4 py-1 bg-honey/10 border border-honey/40 rounded-full text-[8px] uppercase font-black text-honey">
                      Fleet Size: {hives.length} Units
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-honey/10">
                          <th className="py-4 text-[9px] uppercase tracking-widest text-honey/40 font-black">Designation</th>
                          <th className="py-4 text-[9px] uppercase tracking-widest text-honey/40 font-black">Deployment Zone</th>
                          <th className="py-4 text-[9px] uppercase tracking-widest text-honey/40 font-black">Vital Signs</th>
                          <th className="py-4 text-[9px] uppercase tracking-widest text-honey/40 font-black">Status</th>
                          <th className="py-4 text-[9px] uppercase tracking-widest text-honey/40 font-black">Next Cycle</th>
                          <th className="py-4 text-[10px] text-right"></th>
                        </tr>
                      </thead>
                      <tbody className="text-[11px] font-mono">
                        {filteredHives.map(hive => (
                          <tr key={hive.id} className="border-b border-honey/5 hover:bg-white/[0.02] transition-colors group">
                            <td className="py-4 font-bold text-white">#{hive.id}</td>
                            <td className="py-4 text-white/60">{hive.location}</td>
                            <td className="py-4">
                              <span className="text-honey">{hive.weight}kg</span>
                              <span className="mx-2 text-white/10">|</span>
                              <span className="text-blue-400">{hive.temp}°C</span>
                            </td>
                            <td className="py-4">
                              <span className={`px-2 py-0.5 rounded-full text-[8px] uppercase font-black ${
                                hive.status === 'available' ? 'bg-green-500/10 text-green-400' :
                                hive.status === 'assigned' ? 'bg-honey/10 text-honey' : 'bg-blue-500/10 text-blue-400'
                              }`}>
                                {hive.status}
                              </span>
                            </td>
                            <td className="py-4 text-white/40">{hive.nextHarvestDate}</td>
                            <td className="py-4 text-right">
                              <button 
                                onClick={() => {
                                  setSelectedHiveId(hive.id);
                                  setActiveTab('hives');
                                }}
                                className="opacity-0 group-hover:opacity-100 transition-opacity text-honey hover:underline text-[9px] uppercase font-black"
                              >
                                Command Unit
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="bg-[#120D08] border border-honey/10 rounded-lg p-6 space-y-4">
                    <div className="text-[9px] uppercase tracking-widest text-honey font-black">Global Projected Yield</div>
                    <div className="text-3xl font-display text-white">{(hives.reduce((acc, h) => acc + h.weight, 0) * 0.4).toFixed(1)}kg</div>
                    <p className="text-[10px] text-white/40 italic leading-relaxed">Composite data suggests a robust harvest across all active Mani sectors.</p>
                  </div>
                  <div className="bg-[#120D08] border border-honey/10 rounded-lg p-6 space-y-4">
                    <div className="text-[9px] uppercase tracking-widest text-blue-400 font-black">Environmental Equilibrium</div>
                    <div className="text-3xl font-display text-white">{(hives.reduce((acc, h) => acc + h.temp, 0) / hives.length).toFixed(1)}°C</div>
                    <p className="text-[10px] text-white/40 italic leading-relaxed">Median internal cluster temperature across the apiary grid is optimal.</p>
                  </div>
                  <div className="bg-[#120D08] border border-honey/10 rounded-lg p-6 space-y-4 flex flex-col justify-between">
                    <div>
                      <div className="text-[9px] uppercase tracking-widest text-green-500 font-black">System Pulse</div>
                      <div className="text-xs text-white font-mono mt-2 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        CORE_OPERATIONAL
                      </div>
                    </div>
                    <button className="w-full py-2 bg-honey/10 border border-honey/40 text-honey text-[9px] uppercase font-black hover:bg-honey hover:text-black transition-all">Download Audit Report</button>
                  </div>
                </div>
               
               <div className="grid grid-cols-2 gap-8">
                  <div className="bg-[#120D08] border border-honey/10 rounded-lg p-8">
                    <div className="text-[10px] uppercase tracking-widest text-honey font-black mb-6">Omni-Vault Audit Trail</div>
                      <div className="space-y-4 font-mono text-[9px] text-white/30 max-h-[200px] overflow-y-auto custom-scrollbar">
                        <div>{"[23:58:12] > DB_COMMIT :: Updated configuration for Unit #247"}</div>
                        <div>{"[23:55:04] > AUTH_VALIDATION :: Superuser Gregory session refreshed"}</div>
                        <div>{"[23:42:15] > ACCESS_GRANTED :: User system.root@hive.station"}</div>
                        <div>{"[23:41:02] > STRIPE_WEBHOOK :: Subscription cycle verified for 42 nodes"}</div>
                        <div>{"[22:15:55] > SENSOR_TX :: Uplink stable - All 124 units transmitting"}</div>
                        <div>{"[20:10:05] > GEO_TRACKING :: Nomadic migration path updated for Mani apiary"}</div>
                        <div>{"[19:44:12] > BACKUP_SEQ :: Cloud Firestore snapshot completed (342MB)"}</div>
                        <div>{"[18:30:00] > HARVEST_PREDICT :: ML Model suggests high yield for Summer Thyme"}</div>
                      </div>
                  </div>
                  <div className="bg-[#120D08] border border-honey/10 rounded-lg p-8">
                    <div className="text-[10px] uppercase tracking-widest text-honey font-black mb-6">Database Snapshots</div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-white/5 rounded-lg text-center">
                        <div className="text-xl font-display text-honey">{users.length}</div>
                        <div className="text-[8px] uppercase font-black text-white/40">Total Nodes</div>
                      </div>
                      <div className="p-4 bg-white/5 rounded-lg text-center">
                        <div className="text-xl font-display text-honey">{hives.length}</div>
                        <div className="text-[8px] uppercase font-black text-white/40">Apiary Units</div>
                      </div>
                    </div>
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'finance' && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="grid grid-cols-3 gap-6">
                 <div className="bg-[#120D08] border border-honey/10 p-8 rounded-lg">
                    <div className="text-[10px] uppercase tracking-widest text-honey/40 font-black mb-2">Annual Run Rate</div>
                    <div className="text-3xl font-display text-white">€42,800</div>
                    <div className="flex items-center gap-1 text-green-400 text-[10px] font-bold mt-2">
                       <TrendingUp size={12}/> +12.5% this season
                    </div>
                 </div>
                 <div className="bg-[#120D08] border border-honey/10 p-8 rounded-lg">
                    <div className="text-[10px] uppercase tracking-widest text-honey/40 font-black mb-2">Active Subscriptions</div>
                    <div className="text-3xl font-display text-white">{users.filter(u => u.tier).length}</div>
                    <div className="text-[10px] text-honey/40 font-bold mt-2">
                       {Math.round((users.filter(u => u.tier).length / users.length) * 100)}% Conversion Rate
                    </div>
                 </div>
                 <div className="bg-[#120D08] border border-honey/10 p-8 rounded-lg">
                    <div className="text-[10px] uppercase tracking-widest text-honey/40 font-black mb-2">Maintenance Overhead</div>
                    <div className="text-3xl font-display text-red-400/80">€3,200</div>
                    <div className="text-[10px] text-white/20 font-bold mt-2">
                       Incl. hive sensor repairs
                    </div>
                 </div>
              </div>
              
              <div className="bg-[#120D08] border border-honey/10 rounded-lg p-10 flex flex-col items-center justify-center text-center space-y-6">
                <DollarSign size={48} className="text-honey" />
                <div className="space-y-2">
                  <h2 className="text-3xl font-display text-white">Stripe Integration Vault</h2>
                  <p className="text-sm text-honey/40 max-w-md mx-auto">Redirect to Stripe Dashboard for detailed invoicing and historical tax records.</p>
                </div>
                <a 
                  href="https://dashboard.stripe.com" 
                  target="_blank" 
                  rel="noreferrer"
                  className="px-10 py-4 bg-honey text-[#0A0704] text-[10px] uppercase font-black tracking-widest rounded-lg"
                >
                  Open External Stripe Dashboard
                </a>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Batch Action Bar: Floating Elite Logic */}
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
                  <button 
                    onClick={() => handleBatchHiveUpdate({ status: 'assigned' })}
                    className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[9px] font-black uppercase tracking-widest text-[#F1E9DB]/60 hover:text-honey hover:border-honey/40 transition-all flex items-center gap-2"
                  >
                    <CheckCircle size={12} /> Set_Assigned
                  </button>
                  <button 
                    onClick={() => handleBatchHiveUpdate({ status: 'available' })}
                    className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[9px] font-black uppercase tracking-widest text-[#F1E9DB]/60 hover:text-honey hover:border-honey/40 transition-all flex items-center gap-2"
                  >
                    <Plus size={12} /> Release_Pool
                  </button>
                  <button 
                    onClick={async () => {
                      const loc = prompt('Enter new deployment zone for selected units:');
                      if (loc) handleBatchHiveUpdate({ location: loc });
                    }}
                    className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[9px] font-black uppercase tracking-widest text-[#F1E9DB]/60 hover:text-honey hover:border-honey/40 transition-all flex items-center gap-2"
                  >
                    <MapPin size={12} /> Sync_Geography
                  </button>
                  <button 
                    onClick={async () => {
                      const harvest = prompt('Enter active harvest (e.g. Summer Thyme):');
                      if (harvest) handleBatchHiveUpdate({ activeHarvest: harvest });
                    }}
                    className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[9px] font-black uppercase tracking-widest text-[#F1E9DB]/60 hover:text-honey hover:border-honey/40 transition-all flex items-center gap-2"
                  >
                    <Activity size={12} /> Sync_Honey
                  </button>
                  <button 
                    onClick={async () => {
                      const date = prompt('Enter next harvest date (YYYY-MM-DD):');
                      if (date) handleBatchHiveUpdate({ nextHarvestDate: date });
                    }}
                    className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[9px] font-black uppercase tracking-widest text-[#F1E9DB]/60 hover:text-honey hover:border-honey/40 transition-all flex items-center gap-2"
                  >
                    <Calendar size={12} /> Sync_Timing
                  </button>
                  <button 
                    onClick={handleBatchJournalEntry}
                    className="px-4 py-2 bg-honey text-black rounded-full text-[9px] font-black uppercase tracking-widest hover:scale-105 transition-all flex items-center gap-2"
                  >
                    <StickyNote size={12} /> Collective_Journal
                  </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={() => handleBatchUserUpdate({ tier: 'premium' })}
                    className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[9px] font-black uppercase tracking-widest text-[#F1E9DB]/60 hover:text-honey hover:border-honey/40 transition-all flex items-center gap-2"
                  >
                    <Zap size={12} /> Massive_Upgrade
                  </button>
                  <button 
                    onClick={() => {
                      const note = prompt('Enter admin note for selected guardians:');
                      if (note) handleBatchUserUpdate({ adminNotes: note });
                    }}
                    className="px-4 py-2 bg-honey text-black rounded-full text-[9px] font-black uppercase tracking-widest hover:scale-105 transition-all flex items-center gap-2"
                  >
                    <StickyNote size={12} /> Attach_Note
                  </button>
                </>
              )}
            </div>

            <div className="h-8 w-[1px] bg-honey/20"></div>
            <button 
              onClick={() => { setSelectedHiveIds([]); setSelectedUserUids([]); }}
              className="text-[9px] uppercase font-black text-red-500 hover:underline tracking-widest"
            >
              Cancel_Op
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
