import React, { useState, useEffect } from 'react';
import { useHiveData } from '../lib/useHiveData';
import { useAuth } from '../lib/useAuth';
import { useAdminUsers } from '../lib/useAdminUsers';
import { Activity, Thermometer, Droplets, Scale, Calendar, Image as ImageIcon, Plus, Trash2, MapPin, LogOut, Users, UserPlus, UserMinus } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Admin() {
  const { hives, loading: hivesLoading, updateHive, addHive, removeHive } = useHiveData();
  const { users, loading: usersLoading, assignHiveToUser, removeHiveFromUser, updateUser } = useAdminUsers();
  const { logout } = useAuth();
  const [selectedHiveId, setSelectedHiveId] = useState<string>('');
  const [selectedUserEmail, setSelectedUserEmail] = useState<string>('');

  useEffect(() => {
    if (hives.length > 0 && !selectedHiveId) {
      setSelectedHiveId(hives[0].id);
    }
  }, [hives, selectedHiveId]);

  if (hivesLoading || usersLoading) return <div className="min-h-screen bg-hive-bg p-12 text-[#2A1B0A] flex items-center justify-center">Loading...</div>;

  const data = hives.find(h => h.id === selectedHiveId) || hives[0];

  if (!data) return <div className="min-h-screen bg-hive-bg p-12 text-[#2A1B0A] flex items-center justify-center">No hives found.</div>;

  const assignedUsers = users.filter(u => u.subscribedHives?.includes(data.id));
  const unassignedUsers = users.filter(u => !u.subscribedHives?.includes(data.id));

  const handleAssign = () => {
    const user = users.find(u => u.email === selectedUserEmail);
    if (user) {
      assignHiveToUser(user.uid, data.id);
      setSelectedUserEmail('');
    }
  };

  return (
    <div className="min-h-screen bg-hive-bg text-[#2A1B0A] p-6 md:p-12 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 border-b border-[#2A1B0A]/10 pb-8 gap-6">
          <div>
            <h1 className="text-4xl font-display text-[#2A1B0A] mb-2">Central Station</h1>
            <p className="text-[#2A1B0A]/50 text-sm italic">Managing the vitality of Laconia's apiaries</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-[10px] text-[#C8860A] font-bold uppercase tracking-widest bg-[#C8860A]/5 px-3 py-1.5 rounded-full border border-[#C8860A]/10">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C8860A] animate-pulse"></span>
              Live Connection
            </div>
            <Link to="/dashboard" className="text-xs text-[#2A1B0A]/40 hover:text-[#C8860A] transition-colors font-bold uppercase tracking-widest">
              Journal
            </Link>
            <button onClick={logout} className="text-[#2A1B0A]/40 hover:text-red-500 transition-colors" title="Sign Out">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          
          {/* Sidebar: Hive Selection */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white border border-[#2A1B0A]/10 p-6 rounded-xl shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xs font-bold text-[#2A1B0A]/40 uppercase tracking-widest">Your Hives</h2>
                <button 
                  onClick={async () => {
                    const newId = await addHive();
                    if (newId) setSelectedHiveId(newId);
                  }}
                  className="text-honey hover:text-white transition-colors"
                  title="Add New Hive"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              
              <div className="space-y-2">
              {hives.map(hive => (
                  <div
                    key={hive.id}
                    className={`w-full text-left px-4 py-3 rounded-lg text-sm transition-all duration-300 ${
                      selectedHiveId === hive.id 
                        ? 'bg-[#C8860A] text-white shadow-lg shadow-[#C8860A]/20 transform scale-[1.02]' 
                        : 'text-[#2A1B0A]/60 hover:bg-[#2A1B0A]/5'
                    }`}
                  >
                    <button 
                      onClick={() => setSelectedHiveId(hive.id)}
                      className="w-full flex items-center justify-between"
                    >
                      <span>Hive #{hive.id}</span>
                      <div className="flex items-center gap-2">
                        <span className={`text-[8px] uppercase tracking-widest px-1.5 py-0.5 rounded-sm border ${
                          hive.status === 'available' ? 'border-green-500/30 text-green-400 bg-green-500/10' :
                          hive.status === 'shared' ? 'border-blue-500/30 text-blue-400 bg-blue-500/10' :
                          'border-red-500/30 text-red-400 bg-red-500/10'
                        }`}>
                          {hive.status} {hive.currentSubscribers ? `(${hive.currentSubscribers})` : ''}
                        </span>
                        {hives.length > 1 && selectedHiveId === hive.id && (
                          <Trash2 
                            className="w-3 h-3 opacity-50 hover:opacity-100" 
                            onClick={(e) => {
                              e.stopPropagation();
                              removeHive(hive.id);
                              setSelectedHiveId(hives[0].id);
                            }}
                          />
                        )}
                      </div>
                    </button>
                    {selectedHiveId === hive.id && hive.status !== 'available' && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          updateHive(hive.id, { status: 'available', currentSubscribers: 0 });
                        }}
                        className="mt-1 w-full text-[9px] uppercase tracking-widest text-center py-1 border border-green-500/30 text-green-400 hover:bg-green-500/20 transition-colors rounded-[2px]"
                      >
                        Reset to Available
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content: Manual Overrides */}
          <div className="lg:col-span-3 space-y-10">
            <div className="bg-white border border-[#2A1B0A]/10 p-8 rounded-xl shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
                <h2 className="text-2xl font-display text-[#2A1B0A]">Hive #{data.id} Vitality</h2>
                <button 
                  onClick={() => {
                    const newWeight = data.weight + (Math.random() * 0.4 - 0.1); // Slight growth
                    const newHistory = [...data.history.slice(1), { day: 'New', weight: Number(newWeight.toFixed(1)) }];
                    updateHive(data.id, { 
                      weight: Number(newWeight.toFixed(1)),
                      temp: 34 + (Math.random() * 2),
                      humidity: 60 + (Math.random() * 10),
                      history: newHistory
                    });
                  }}
                  className="text-[10px] uppercase tracking-widest bg-[#C8860A]/10 text-[#C8860A] border border-[#C8860A]/20 px-4 py-2 rounded-full hover:bg-[#C8860A] hover:text-white transition-all font-bold"
                >
                  Simulate 24h Data
                </button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-[#2A1B0A]/40 mb-3 font-bold flex items-center gap-2">
                    <MapPin className="w-3 h-3 text-honey" /> Location
                  </label>
                  <input 
                    type="text" 
                    value={data.location}
                    onChange={(e) => updateHive(data.id, { location: e.target.value })}
                    className="w-full bg-[#2A1B0A]/5 border border-[#2A1B0A]/10 rounded-lg px-4 py-2.5 text-[#2A1B0A] focus:outline-none focus:border-[#C8860A]/50 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-[#2A1B0A]/40 mb-3 font-bold flex items-center gap-2">
                    <Scale className="w-3 h-3 text-honey" /> Weight (kg)
                  </label>
                  <input 
                    type="number" 
                    step="0.1"
                    value={data.weight}
                    onChange={(e) => updateHive(data.id, { weight: Number(e.target.value) })}
                    className="w-full bg-[#2A1B0A]/5 border border-[#2A1B0A]/10 rounded-lg px-4 py-2.5 text-[#2A1B0A] focus:outline-none focus:border-[#C8860A]/50 transition-all"
                  />
                </div>
                
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-[#2A1B0A]/40 mb-3 font-bold flex items-center gap-2">
                    <Activity className="w-3 h-3 text-honey" /> Activity
                  </label>
                  <select 
                    value={data.activity}
                    onChange={(e) => updateHive(data.id, { activity: e.target.value as any })}
                    className="w-full bg-[#2A1B0A]/5 border border-[#2A1B0A]/10 rounded-lg px-4 py-2.5 text-[#2A1B0A] focus:outline-none focus:border-[#C8860A]/50 transition-all appearance-none"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-[#2A1B0A]/40 mb-3 font-bold flex items-center gap-2">
                    <Thermometer className="w-3 h-3 text-honey" /> Temp (°C)
                  </label>
                  <input 
                    type="number" 
                    step="0.1"
                    value={data.temp}
                    onChange={(e) => updateHive(data.id, { temp: Number(e.target.value) })}
                    className="w-full bg-[#2A1B0A]/5 border border-[#2A1B0A]/10 rounded-lg px-4 py-2.5 text-[#2A1B0A] focus:outline-none focus:border-[#C8860A]/50 transition-all"
                  />
                </div>

                <div className="sm:col-span-2 lg:col-span-1">
                  <label className="block text-[10px] uppercase tracking-widest text-[#2A1B0A]/40 mb-3 font-bold flex items-center gap-2">
                    <Droplets className="w-3 h-3 text-honey" /> Humidity (%)
                  </label>
                  <input 
                    type="number" 
                    value={data.humidity}
                    onChange={(e) => updateHive(data.id, { humidity: Number(e.target.value) })}
                    className="w-full bg-[#2A1B0A]/5 border border-[#2A1B0A]/10 rounded-lg px-4 py-2.5 text-[#2A1B0A] focus:outline-none focus:border-[#C8860A]/50 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Content Management */}
            <div className="bg-white border border-[#2A1B0A]/10 p-8 rounded-xl shadow-sm">
              <h2 className="text-2xl font-display text-[#2A1B0A] mb-8">Details & Content</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-[#2A1B0A]/40 mb-3 font-bold flex items-center gap-2">
                    <ImageIcon className="w-3 h-3 text-honey" /> Bee Species
                  </label>
                  <input 
                    type="text" 
                    value={data.beeSpecies || ''}
                    onChange={(e) => updateHive(data.id, { beeSpecies: e.target.value })}
                    className="w-full bg-[#2A1B0A]/5 border border-[#2A1B0A]/10 rounded-lg px-4 py-2.5 text-[#2A1B0A] focus:outline-none focus:border-[#C8860A]/50 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-[#2A1B0A]/40 mb-3 font-bold flex items-center gap-2">
                    <Calendar className="w-3 h-3 text-honey" /> Installed
                  </label>
                  <input 
                    type="date" 
                    value={data.installationDate || ''}
                    onChange={(e) => updateHive(data.id, { installationDate: e.target.value })}
                    className="w-full bg-[#2A1B0A]/5 border border-[#2A1B0A]/10 rounded-lg px-4 py-2.5 text-[#2A1B0A] focus:outline-none focus:border-[#C8860A]/50 transition-all font-sans"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-[#2A1B0A]/40 mb-3 font-bold flex items-center gap-2">
                    <Calendar className="w-3 h-3 text-honey" /> Season
                  </label>
                  <select 
                    value={data.activeHarvest}
                    onChange={(e) => updateHive(data.id, { activeHarvest: e.target.value })}
                    className="w-full bg-[#2A1B0A]/5 border border-[#2A1B0A]/10 rounded-lg px-4 py-2.5 text-[#2A1B0A] focus:outline-none focus:border-[#C8860A]/50 transition-all appearance-none"
                  >
                    <option value="Spring Thyme">Spring Thyme</option>
                    <option value="Summer Wildflower">Summer Wildflower</option>
                    <option value="Autumn Pine">Autumn Pine</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-[#2A1B0A]/40 mb-3 font-bold flex items-center gap-2">
                    <Calendar className="w-3 h-3 text-honey" /> Next Harvest
                  </label>
                  <input 
                    type="text" 
                    value={data.nextHarvestDate}
                    onChange={(e) => updateHive(data.id, { nextHarvestDate: e.target.value })}
                    className="w-full bg-[#2A1B0A]/5 border border-[#2A1B0A]/10 rounded-lg px-4 py-2.5 text-[#2A1B0A] focus:outline-none focus:border-[#C8860A]/50 transition-all"
                  />
                </div>
                
                <div className="sm:col-span-2">
                  <label className="block text-[10px] uppercase tracking-widest text-[#2A1B0A]/40 mb-3 font-bold flex items-center gap-2">
                    <ImageIcon className="w-3 h-3 text-honey" /> Live Photo URL
                  </label>
                  <input 
                    type="text" 
                    value={data.photoUrl}
                    onChange={(e) => updateHive(data.id, { photoUrl: e.target.value })}
                    placeholder="/beekeeper.jpg"
                    className="w-full bg-[#2A1B0A]/5 border border-[#2A1B0A]/10 rounded-lg px-4 py-2.5 text-[#2A1B0A] focus:outline-none focus:border-[#C8860A]/50 transition-all text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Subscriber Management */}
            <div className="bg-white border border-[#2A1B0A]/10 p-8 rounded-xl shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                <h2 className="text-2xl font-display text-[#2A1B0A] flex items-center gap-3">
                  <Users className="w-6 h-6 text-honey" /> Subscribers
                </h2>
                <span className="text-[10px] uppercase tracking-widest text-[#C8860A] bg-[#C8860A]/5 px-4 py-1.5 rounded-full border border-[#C8860A]/10 font-bold">
                  {assignedUsers.length} Active Guardians
                </span>
              </div>
              
              <div className="space-y-6">
                {/* Assign New User */}
                <div className="flex flex-col sm:flex-row items-end gap-6 bg-[#2A1B0A]/5 p-6 rounded-xl border border-[#2A1B0A]/5">
                  <div className="w-full flex-1">
                    <label className="block text-[10px] uppercase tracking-widest text-[#2A1B0A]/40 mb-3 font-bold">Assign Hive to User</label>
                    <select 
                      value={selectedUserEmail}
                      onChange={(e) => setSelectedUserEmail(e.target.value)}
                      className="w-full bg-white border border-[#2A1B0A]/10 rounded-lg px-4 py-2.5 text-[#2A1B0A] focus:outline-none focus:border-[#C8860A]/50 transition-all appearance-none text-sm"
                    >
                      <option value="">Select email...</option>
                      {unassignedUsers.map(u => (
                        <option key={u.uid} value={u.email}>{u.email}</option>
                      ))}
                    </select>
                  </div>
                  <button 
                    onClick={handleAssign}
                    disabled={!selectedUserEmail}
                    className="w-full sm:w-auto bg-[#C8860A] text-white px-8 py-2.5 rounded-lg text-sm font-bold hover:bg-[#C8860A]/90 transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-[#C8860A]/20"
                  >
                    <UserPlus className="w-4 h-4" /> Assign
                  </button>
                </div>

                {/* Assigned Users List */}
                <div>
                  <h3 className="text-xs text-white/50 mb-3 uppercase tracking-widest">Current Sponsors</h3>
                  {assignedUsers.length === 0 ? (
                    <div className="text-sm text-white/30 italic p-4 bg-black/20 rounded-[2px] border border-white/5 text-center">
                      No users are currently assigned to this hive.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {assignedUsers.map(user => (
                        <div key={user.uid} className="flex flex-col gap-2 bg-black/20 p-3 rounded-[2px] border border-white/5">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-white/80">{user.email}</span>
                            <button 
                              onClick={() => removeHiveFromUser(user.uid, data.id)}
                              className="text-red-500/50 hover:text-red-500 transition-colors p-2 hover:bg-red-500/5 rounded-full"
                              title="Remove Access"
                            >
                              <UserMinus className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
                            <div className="space-y-2">
                              <label className="text-[10px] text-[#2A1B0A]/40 uppercase tracking-widest block mb-2 font-bold">Role</label>
                              <select 
                                value={user.role}
                                onChange={(e) => updateUser(user.uid, { role: e.target.value as any })}
                                className="w-full bg-white border border-[#2A1B0A]/10 rounded-lg px-3 py-2 text-xs text-[#2A1B0A] focus:outline-none focus:border-[#C8860A]/50"
                              >
                                <option value="user">User (Prospect)</option>
                                <option value="subscriber">Subscriber</option>
                                <option value="admin">Admin</option>
                              </select>
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] text-[#2A1B0A]/40 uppercase tracking-widest block mb-2 font-bold">Tier</label>
                              <select 
                                value={user.tier || 'starter'}
                                onChange={(e) => updateUser(user.uid, { tier: e.target.value as any })}
                                className="w-full bg-white border border-[#2A1B0A]/10 rounded-lg px-3 py-2 text-xs text-[#2A1B0A] focus:outline-none focus:border-[#C8860A]/50 font-sans"
                              >
                                <option value="starter">Starter (€80/yr)</option>
                                <option value="premium">Premium (€200/yr)</option>
                              </select>
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] text-[#2A1B0A]/40 uppercase tracking-widest block mb-2 font-bold">Label</label>
                              <input 
                                type="text" 
                                value={user.customLabel || ''}
                                onChange={(e) => updateUser(user.uid, { customLabel: e.target.value })}
                                placeholder="e.g. The Smith Family"
                                className="w-full bg-white border border-[#2A1B0A]/10 rounded-lg px-3 py-2 text-xs text-[#2A1B0A] focus:outline-none focus:border-[#C8860A]/50 transition-colors"
                              />
                            </div>
                            <div className="sm:col-span-2 space-y-2">
                              <label className="text-[10px] text-[#2A1B0A]/40 uppercase tracking-widest block mb-2 font-bold">Address</label>
                              <textarea 
                                value={user.shippingAddress || ''}
                                onChange={(e) => updateUser(user.uid, { shippingAddress: e.target.value })}
                                placeholder="No address provided yet."
                                rows={2}
                                className="w-full bg-white border border-[#2A1B0A]/10 rounded-lg px-3 py-2 text-xs text-[#2A1B0A] focus:outline-none focus:border-[#C8860A]/50 transition-colors resize-none ml-0"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

        </div>
        
        <div className="mt-16 text-center">
          <p className="text-xs text-[#2A1B0A]/30">
            Professional dashboard for master beekeepers. Changes sync in real-time to the <a href="/dashboard" target="_blank" className="text-[#C8860A] hover:underline font-bold">Apiary Journal</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
