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

  if (hivesLoading || usersLoading) return <div className="min-h-screen bg-[#110C05] p-12 text-white flex items-center justify-center">Loading...</div>;

  const data = hives.find(h => h.id === selectedHiveId) || hives[0];

  if (!data) return <div className="min-h-screen bg-[#110C05] p-12 text-white flex items-center justify-center">No hives found.</div>;

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
    <div className="min-h-screen bg-[#110C05] text-[#FAF4E8] p-6 md:p-12 font-sans">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8 border-b border-honey/20 pb-6">
          <div>
            <h1 className="text-3xl font-display text-honey mb-2">HiveShare Central Station</h1>
            <p className="text-white/50 text-sm">Manage all apiaries and subscriber dashboards</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs text-honey bg-honey/10 px-3 py-1.5 rounded-[2px] border border-honey/20 hidden sm:flex">
              <span className="w-2 h-2 rounded-full bg-honey animate-pulse"></span>
              System Online
            </div>
            <Link to="/dashboard" className="text-xs text-white/50 hover:text-white transition-colors uppercase tracking-widest">
              Dashboard
            </Link>
            <button onClick={logout} className="text-white/50 hover:text-white transition-colors" title="Sign Out">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          
          {/* Sidebar: Hive Selection */}
          <div className="md:col-span-1 space-y-4">
            <div className="bg-[#1A1208] border border-honey/20 p-4 rounded-[2px]">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-display text-honey uppercase tracking-widest">Your Hives</h2>
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
                  <button
                    key={hive.id}
                    onClick={() => setSelectedHiveId(hive.id)}
                    className={`w-full text-left px-3 py-2 rounded-[2px] text-sm transition-colors flex items-center justify-between ${
                      selectedHiveId === hive.id 
                        ? 'bg-honey text-[#110C05] font-medium' 
                        : 'text-white/60 hover:bg-white/5'
                    }`}
                  >
                    <span>Hive #{hive.id}</span>
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
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content: Manual Overrides */}
          <div className="md:col-span-3 space-y-6">
            <div className="bg-[#1A1208] border border-honey/20 p-6 rounded-[2px]">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-display text-honey">Hive #{data.id} Telemetry</h2>
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
                  className="text-[10px] uppercase tracking-widest bg-honey/10 text-honey border border-honey/30 px-3 py-1.5 rounded-[2px] hover:bg-honey hover:text-[#110C05] transition-all"
                >
                  Simulate 24h Data
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs text-white/50 mb-2 flex items-center gap-2">
                    <MapPin className="w-3 h-3" /> Location
                  </label>
                  <input 
                    type="text" 
                    value={data.location}
                    onChange={(e) => updateHive(data.id, { location: e.target.value })}
                    className="w-full bg-[#110C05] border border-honey/20 rounded-[2px] px-3 py-2 text-white focus:outline-none focus:border-honey/50 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs text-white/50 mb-2 flex items-center gap-2">
                    <Scale className="w-3 h-3" /> Current Weight (kg)
                  </label>
                  <input 
                    type="number" 
                    step="0.1"
                    value={data.weight}
                    onChange={(e) => updateHive(data.id, { weight: Number(e.target.value) })}
                    className="w-full bg-[#110C05] border border-honey/20 rounded-[2px] px-3 py-2 text-white focus:outline-none focus:border-honey/50 transition-colors"
                  />
                </div>
                
                <div>
                  <label className="block text-xs text-white/50 mb-2 flex items-center gap-2">
                    <Activity className="w-3 h-3" /> Activity Level
                  </label>
                  <select 
                    value={data.activity}
                    onChange={(e) => updateHive(data.id, { activity: e.target.value as any })}
                    className="w-full bg-[#110C05] border border-honey/20 rounded-[2px] px-3 py-2 text-white focus:outline-none focus:border-honey/50 transition-colors appearance-none"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-white/50 mb-2 flex items-center gap-2">
                    <Thermometer className="w-3 h-3" /> Internal Temp (°C)
                  </label>
                  <input 
                    type="number" 
                    step="0.1"
                    value={data.temp}
                    onChange={(e) => updateHive(data.id, { temp: Number(e.target.value) })}
                    className="w-full bg-[#110C05] border border-honey/20 rounded-[2px] px-3 py-2 text-white focus:outline-none focus:border-honey/50 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs text-white/50 mb-2 flex items-center gap-2">
                    <Droplets className="w-3 h-3" /> Humidity (%)
                  </label>
                  <input 
                    type="number" 
                    value={data.humidity}
                    onChange={(e) => updateHive(data.id, { humidity: Number(e.target.value) })}
                    className="w-full bg-[#110C05] border border-honey/20 rounded-[2px] px-3 py-2 text-white focus:outline-none focus:border-honey/50 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Content Management */}
            <div className="bg-[#1A1208] border border-honey/20 p-6 rounded-[2px]">
              <h2 className="text-xl font-display text-honey mb-6">Hive Details & Content</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs text-white/50 mb-2 flex items-center gap-2">
                    <MapPin className="w-3 h-3" /> Bee Species
                  </label>
                  <input 
                    type="text" 
                    value={data.beeSpecies || ''}
                    onChange={(e) => updateHive(data.id, { beeSpecies: e.target.value })}
                    className="w-full bg-[#110C05] border border-honey/20 rounded-[2px] px-3 py-2 text-white focus:outline-none focus:border-honey/50 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs text-white/50 mb-2 flex items-center gap-2">
                    <Calendar className="w-3 h-3" /> Installation Date
                  </label>
                  <input 
                    type="date" 
                    value={data.installationDate || ''}
                    onChange={(e) => updateHive(data.id, { installationDate: e.target.value })}
                    className="w-full bg-[#110C05] border border-honey/20 rounded-[2px] px-3 py-2 text-white focus:outline-none focus:border-honey/50 transition-colors"
                  />
                </div>

                <div className="md:col-span-2 border-t border-honey/10 pt-4 mt-2"></div>

                <div>
                  <label className="block text-xs text-white/50 mb-2 flex items-center gap-2">
                    <Calendar className="w-3 h-3" /> Active Harvest Season
                  </label>
                  <select 
                    value={data.activeHarvest}
                    onChange={(e) => updateHive(data.id, { activeHarvest: e.target.value })}
                    className="w-full bg-[#110C05] border border-honey/20 rounded-[2px] px-3 py-2 text-white focus:outline-none focus:border-honey/50 transition-colors appearance-none"
                  >
                    <option value="Spring Thyme">Spring Thyme</option>
                    <option value="Summer Wildflower">Summer Wildflower</option>
                    <option value="Autumn Pine">Autumn Pine</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-white/50 mb-2 flex items-center gap-2">
                    <Calendar className="w-3 h-3" /> Next Harvest Date
                  </label>
                  <input 
                    type="text" 
                    value={data.nextHarvestDate}
                    onChange={(e) => updateHive(data.id, { nextHarvestDate: e.target.value })}
                    className="w-full bg-[#110C05] border border-honey/20 rounded-[2px] px-3 py-2 text-white focus:outline-none focus:border-honey/50 transition-colors"
                  />
                </div>
                
                <div className="md:col-span-2 pt-4 border-t border-honey/10">
                  <label className="block text-xs text-white/50 mb-2 flex items-center gap-2">
                    <ImageIcon className="w-3 h-3" /> Latest Hive Snapshot URL
                  </label>
                  <input 
                    type="text" 
                    value={data.photoUrl}
                    onChange={(e) => updateHive(data.id, { photoUrl: e.target.value })}
                    placeholder="/beekeeper.jpg"
                    className="w-full bg-[#110C05] border border-honey/20 rounded-[2px] px-3 py-2 text-white focus:outline-none focus:border-honey/50 transition-colors text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Subscriber Management */}
            <div className="bg-[#1A1208] border border-honey/20 p-6 rounded-[2px]">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-display text-honey flex items-center gap-2">
                  <Users className="w-5 h-5" /> Subscriber Management
                </h2>
                <span className="text-xs text-white/50 bg-white/5 px-2 py-1 rounded">
                  {assignedUsers.length} Sponsors
                </span>
              </div>
              
              <div className="space-y-6">
                {/* Assign New User */}
                <div className="flex items-end gap-4 bg-[#110C05] p-4 rounded-[2px] border border-honey/10">
                  <div className="flex-1">
                    <label className="block text-xs text-white/50 mb-2">Assign Hive to User</label>
                    <select 
                      value={selectedUserEmail}
                      onChange={(e) => setSelectedUserEmail(e.target.value)}
                      className="w-full bg-[#1A1208] border border-honey/20 rounded-[2px] px-3 py-2 text-white focus:outline-none focus:border-honey/50 transition-colors appearance-none text-sm"
                    >
                      <option value="">Select a user by email...</option>
                      {unassignedUsers.map(u => (
                        <option key={u.uid} value={u.email}>{u.email}</option>
                      ))}
                    </select>
                  </div>
                  <button 
                    onClick={handleAssign}
                    disabled={!selectedUserEmail}
                    className="bg-honey text-[#110C05] px-4 py-2 rounded-[2px] text-sm font-medium hover:bg-honey/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <UserPlus className="w-4 h-4" /> Assign
                  </button>
                </div>

                {/* Assigned Users List */}
                <div>
                  <h3 className="text-xs text-white/50 mb-3 uppercase tracking-widest">Current Sponsors</h3>
                  {assignedUsers.length === 0 ? (
                    <div className="text-sm text-white/30 italic p-4 bg-[#110C05] rounded-[2px] border border-white/5 text-center">
                      No users are currently assigned to this hive.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {assignedUsers.map(user => (
                        <div key={user.uid} className="flex flex-col gap-2 bg-[#110C05] p-3 rounded-[2px] border border-white/5">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-white/80">{user.email}</span>
                            <button 
                              onClick={() => removeHiveFromUser(user.uid, data.id)}
                              className="text-red-400/70 hover:text-red-400 transition-colors p-1"
                              title="Remove Access"
                            >
                              <UserMinus className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                            <div className="space-y-2">
                              <label className="text-[10px] text-white/40 uppercase tracking-widest block">Role</label>
                              <select 
                                value={user.role}
                                onChange={(e) => updateUser(user.uid, { role: e.target.value as any })}
                                className="w-full bg-[#1A1208] border border-honey/20 rounded-[2px] px-2 py-1.5 text-xs text-white focus:outline-none focus:border-honey/50"
                              >
                                <option value="user">User (Prospect)</option>
                                <option value="subscriber">Subscriber</option>
                                <option value="admin">Admin</option>
                              </select>
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] text-white/40 uppercase tracking-widest block">Custom Label</label>
                              <input 
                                type="text" 
                                value={user.customLabel || ''}
                                onChange={(e) => updateUser(user.uid, { customLabel: e.target.value })}
                                placeholder="e.g. The Smith Family"
                                className="w-full bg-[#1A1208] border border-honey/20 rounded-[2px] px-2 py-1.5 text-xs text-white focus:outline-none focus:border-honey/50 transition-colors"
                              />
                            </div>
                            <div className="md:col-span-2 space-y-2">
                              <label className="text-[10px] text-white/40 uppercase tracking-widest block">Shipping Address</label>
                              <textarea 
                                value={user.shippingAddress || ''}
                                onChange={(e) => updateUser(user.uid, { shippingAddress: e.target.value })}
                                placeholder="No address provided yet."
                                rows={2}
                                className="w-full bg-[#1A1208] border border-honey/20 rounded-[2px] px-2 py-1.5 text-xs text-white focus:outline-none focus:border-honey/50 transition-colors resize-none"
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
        
        <div className="mt-12 text-center">
          <p className="text-xs text-white/30">
            Tip: Open the <a href="/dashboard" target="_blank" className="text-honey hover:underline">Dashboard</a> in a new window side-by-side with this Admin panel. Changes made here will instantly sync to the dashboard!
          </p>
        </div>
      </div>
    </div>
  );
}
