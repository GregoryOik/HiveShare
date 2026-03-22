import React, { useState, useEffect } from 'react';
import { useHiveData } from '../lib/useHiveData';
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
  AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

export default function Admin() {
  const { hives, loading: hivesLoading, updateHive, addHive, removeHive } = useHiveData();
  const { users, loading: usersLoading, assignHiveToUser, removeHiveFromUser, updateUser } = useAdminUsers();
  const { user: authUser, logout } = useAuth();
  
  const [activeTab, setActiveTab] = useState<'hives' | 'users' | 'system' | 'finance'>('hives');
  const [selectedHiveId, setSelectedHiveId] = useState<string>('');
  const [selectedUserUid, setSelectedUserUid] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isPostingNote, setIsPostingNote] = useState(false);
  const [newJournalEntry, setNewJournalEntry] = useState('');

  const [isAddingHive, setIsAddingHive] = useState(false);

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
        alert(`New unit #${newId} initialized successfully.`);
      } else {
        alert('Initialization failed. You may not have administrative permissions, or the system is offline.');
      }
    } catch (err) {
      console.error(err);
      alert('A critical error occurred while attempting to commission a new unit.');
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

  return (
    <div className="min-h-screen bg-[#0A0704] text-[#F1E9DB] font-body selection:bg-honey selection:text-[#0A0704] flex flex-col relative overflow-hidden">
      {/* Background Grid & Vibe */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(200,134,10,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(200,134,10,0.05)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_transparent_0%,_#0A0704_90%)]"></div>
      </div>

      {/* Admin Header */}
      <header className="h-20 border-b border-honey/20 bg-[#0A0704]/80 backdrop-blur-xl sticky top-0 z-50 px-8 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="font-display text-2xl tracking-tight text-white group">
            HIVE<span className="text-honey">SHARE</span>
            <span className="ml-2 text-[8px] px-1.5 py-0.5 border border-honey/40 rounded-sm text-honey font-black vertical-super uppercase">Admin Mode</span>
          </Link>
          
          <nav className="hidden lg:flex items-center gap-1">
            {[
              { id: 'hives', icon: Zap, label: 'Apiary Fleet' },
              { id: 'users', icon: Users, label: 'Guardians' },
              { id: 'system', icon: Terminal, label: 'System Health' },
              { id: 'finance', icon: DollarSign, label: 'Revenue' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-[10px] uppercase tracking-widest font-black transition-all ${
                  activeTab === tab.id 
                    ? 'bg-honey text-[#0A0704] shadow-[0_0_20px_rgba(200,134,10,0.3)]' 
                    : 'text-honey/40 hover:text-honey hover:bg-honey/10'
                }`}
              >
                <tab.icon size={12} /> {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-6">
          <Link 
            to="/dashboard" 
            className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] uppercase tracking-widest font-black text-honey hover:bg-white/10 transition-all"
          >
            Project Journal
          </Link>
          <div className="flex flex-col items-end mr-4">
            <span className="text-[9px] uppercase tracking-[0.2em] text-honey font-black">Master Operator</span>
            <span className="text-[10px] text-white/40">{authUser?.email}</span>
          </div>
          <button onClick={logout} className="p-2 border border-honey/20 text-honey hover:bg-red-500/10 hover:border-red-500/40 hover:text-red-500 transition-all rounded-full">
            <LogOut size={16} />
          </button>
        </div>
      </header>

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
              {activeTab === 'hives' && hives.map(hive => (
                <button
                  key={hive.id}
                  onClick={() => setSelectedHiveId(hive.id)}
                  className={`w-full text-left p-4 rounded-lg border transition-all ${
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
              ))}

              {activeTab === 'users' && filteredUsers.map(u => (
                <button
                  key={u.uid}
                  onClick={() => setSelectedUserUid(u.uid)}
                  className={`w-full text-left p-4 rounded-lg border transition-all ${
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
                        <label className="text-[10px] uppercase tracking-widest text-honey font-black block mb-2">Weight Adjustment</label>
                        <input 
                          type="range" min="0" max="100" step="0.1"
                          value={selectedHive.weight}
                          onChange={(e) => updateHive(selectedHive.id, { weight: Number(e.target.value) })}
                          className="w-full accent-honey"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase tracking-widest text-honey font-black block mb-2">Internal Temp</label>
                        <input 
                          type="number" step="0.1"
                          value={selectedHive.temp}
                          onChange={(e) => updateHive(selectedHive.id, { temp: Number(e.target.value) })}
                          className="w-full bg-black/40 border border-honey/20 rounded-md p-3 text-white text-sm"
                        />
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <label className="text-[10px] uppercase tracking-widest text-honey font-black block mb-2">Bee Species Management</label>
                        <input 
                          type="text"
                          value={selectedHive.beeSpecies || 'Apis mellifera macedonica'}
                          onChange={(e) => updateHive(selectedHive.id, { beeSpecies: e.target.value })}
                          className="w-full bg-black/40 border border-honey/20 rounded-md p-3 text-white text-xs font-sans"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase tracking-widest text-honey font-black block mb-2">Deployment Zone</label>
                        <input 
                          type="text"
                          value={selectedHive.location}
                          onChange={(e) => updateHive(selectedHive.id, { location: e.target.value })}
                          className="w-full bg-black/40 border border-honey/20 rounded-md p-3 text-white text-xs font-sans"
                        />
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <label className="text-[10px] uppercase tracking-widest text-honey font-black block mb-2">Current Harvest Focus</label>
                        <select 
                          value={selectedHive.activeHarvest}
                          onChange={(e) => updateHive(selectedHive.id, { activeHarvest: e.target.value })}
                          className="w-full bg-black/40 border border-honey/20 rounded-md p-3 text-white text-sm appearance-none cursor-pointer"
                        >
                          <option>Spring Wildflower</option>
                          <option>Summer Thyme</option>
                          <option>Autumn Pine</option>
                        </select>
                      </div>
                      <div className="pt-2">
                        <button 
                          onClick={() => removeHive(selectedHive.id)}
                          className="w-full py-3 border border-red-500/20 text-red-500/60 hover:bg-red-500 hover:text-white transition-all text-[10px] uppercase font-bold rounded-lg"
                        >
                          Decommission Hive
                        </button>
                      </div>
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
                        const entry = { id: Date.now().toString(), date: new Date().toISOString(), content: newJournalEntry, type: 'Observation' };
                        const updatedJournal = [entry, ...(selectedHive.journal || [])];
                        await updateHive(selectedHive.id, { journal: updatedJournal });
                        setNewJournalEntry('');
                        setIsPostingNote(false);
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
                          reader.onloadend = () => updateHive(selectedHive.id, { photoUrl: reader.result as string });
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
                        onChange={(e) => updateHive(selectedHive.id, { photoUrl: e.target.value })}
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
                        onChange={(e) => updateUser(selectedUser.uid, { role: e.target.value as any })}
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
                        onChange={(e) => updateUser(selectedUser.uid, { tier: e.target.value as any })}
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
                    <label className="text-[10px] uppercase tracking-widest text-honey font-black block">Logistical Address</label>
                    <textarea 
                      value={selectedUser.shippingAddress || ''}
                      onChange={(e) => updateUser(selectedUser.uid, { shippingAddress: e.target.value })}
                      placeholder="No delivery coordinates established."
                      rows={3}
                      className="w-full bg-black border border-honey/20 rounded-md p-4 text-sm text-white focus:border-honey outline-none font-sans resize-none"
                    />
                  </div>
                </div>

                <div className="col-span-12 lg:col-span-4 space-y-8">
                  <div className="p-6 bg-black/40 border border-honey/10 rounded-lg space-y-4">
                    <div className="text-[10px] uppercase tracking-[0.2em] text-honey font-black">Associations</div>
                    <div className="space-y-3">
                      {selectedUser.subscribedHives?.length === 0 ? (
                        <p className="text-[10px] text-white/20 italic">No hives linked to this profile.</p>
                      ) : (
                        selectedUser.subscribedHives?.map(id => (
                          <div key={id} className="flex items-center justify-between p-3 bg-white/5 rounded-md">
                            <span className="text-xs font-bold">Hive #{id}</span>
                            <button onClick={() => removeHiveFromUser(selectedUser.uid, id)} className="text-red-500/40 hover:text-red-500 transition-all"><UserMinus size={14}/></button>
                          </div>
                        ))
                      )}
                    </div>
                    <div className="pt-4">
                       <label className="text-[9px] uppercase tracking-widest text-honey/40 block mb-2 font-black">Quick Assign</label>
                       <select 
                         onChange={(e) => {
                           if (e.target.value) {
                             assignHiveToUser(selectedUser.uid, e.target.value);
                             e.target.value = '';
                           }
                         }}
                         className="w-full bg-black/60 border border-honey/20 rounded-md p-2 text-[10px] text-white outline-none"
                       >
                         <option value="">Choose hive to link...</option>
                         {hives.filter(h => !selectedUser.subscribedHives?.includes(h.id)).map(h => (
                           <option key={h.id} value={h.id}>Hive #{h.id} ({h.status})</option>
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
               <div className="bg-[#120D08] border border-honey/10 rounded-lg p-10 flex flex-col items-center justify-center text-center space-y-6 min-h-[400px]">
                  <Terminal size={48} className="text-honey animate-pulse" />
                  <div className="space-y-2">
                    <h2 className="text-3xl font-display text-white">Grid Core Active</h2>
                    <p className="text-sm text-honey/40 max-w-md mx-auto">Monitoring sensor arrays across Laconia and Mani. System uptime: 99.98%.</p>
                  </div>
                  <div className="flex gap-4">
                    <div className="px-6 py-2 bg-green-500/10 border border-green-500/40 rounded-full text-[10px] uppercase font-black text-green-400">Firebase Operational</div>
                    <div className="px-6 py-2 bg-honey/10 border border-honey/40 rounded-full text-[10px] uppercase font-black text-honey">Stripe API Online</div>
                  </div>
               </div>
               
               <div className="grid grid-cols-2 gap-8">
                  <div className="bg-[#120D08] border border-honey/10 rounded-lg p-8">
                    <div className="text-[10px] uppercase tracking-widest text-honey font-black mb-6">Recent Security Events</div>
                      <div className="space-y-4 font-mono text-[9px] text-white/30">
                        <div>{"[23:42:15] > ACCESS_GRANTED :: User admin@hive.local"}</div>
                        <div>{"[23:41:02] > PRICE_SYNC :: Stripe products integrated (2)"}</div>
                        <div>{"[22:15:55] > HIVE_HEARTBEAT :: 124 sensors transmitting normally"}</div>
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

      <Footer />
    </div>
  );
}
