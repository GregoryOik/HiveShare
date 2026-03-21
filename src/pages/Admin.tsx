import React, { useState, useEffect } from 'react';
import { useHiveData } from '../lib/useHiveData';
import { useAuth } from '../lib/useAuth';
import { Activity, Thermometer, Droplets, Scale, Calendar, Image as ImageIcon, Plus, Trash2, MapPin, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Admin() {
  const { hives, loading, updateHive, addHive, removeHive } = useHiveData();
  const { logout } = useAuth();
  const [selectedHiveId, setSelectedHiveId] = useState<string>('');

  useEffect(() => {
    if (hives.length > 0 && !selectedHiveId) {
      setSelectedHiveId(hives[0].id);
    }
  }, [hives, selectedHiveId]);

  if (loading) return <div className="min-h-screen bg-[#110C05] p-12 text-white flex items-center justify-center">Loading...</div>;

  const data = hives.find(h => h.id === selectedHiveId) || hives[0];

  if (!data) return <div className="min-h-screen bg-[#110C05] p-12 text-white flex items-center justify-center">No hives found.</div>;

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
              <h2 className="text-xl font-display text-honey mb-6">Content Management</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    <ImageIcon className="w-3 h-3" /> Photo of the Day URL
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
