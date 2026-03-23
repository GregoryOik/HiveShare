import React, { useState } from 'react';
import { 
  Scale, 
  Thermometer, 
  Droplets, 
  Zap, 
  RefreshCw, 
  Plus, 
  CheckCircle,
  Radio,
  TrendingUp,
  Trash2,
  StickyNote
} from 'lucide-react';
import { HiveData } from '../../lib/useHiveData';

interface AdminHiveDetailsProps {
  selectedHive: HiveData;
  updateHive: (id: string, data: Partial<HiveData>) => Promise<void>;
  pushHivePulse: (id: string, pulse: { weight: number; temp: number; humidity: number }) => Promise<void>;
  seedHiveHistory: (id: string) => Promise<void>;
  addJournalEntry: (id: string, entry: string, type?: string) => Promise<boolean>;
  removeHive: (id: string) => Promise<void>;
}

export function AdminHiveDetails({
  selectedHive,
  updateHive,
  pushHivePulse,
  seedHiveHistory,
  addJournalEntry,
  removeHive
}: AdminHiveDetailsProps) {
  const [iotWeight, setIotWeight] = useState('');
  const [iotTemp, setIotTemp] = useState('');
  const [iotHumidity, setIotHumidity] = useState('');
  const [journalText, setJournalText] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);

  return (
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
        </div>

        {/* Tactical Info & IoT Simulator */}
        <div className="col-span-12 lg:col-span-4 space-y-8">
          <div className="bg-[#120D08] border border-honey/10 rounded-lg p-6">
            <h3 className="text-[10px] uppercase tracking-[0.2em] text-honey font-black mb-6 flex items-center gap-2">
              <Radio size={14} className="text-honey animate-pulse" /> IoT_Uplink_Simulator
            </h3>
            
            <div className="space-y-6">
              <div className="p-4 bg-honey/5 border border-honey/10 rounded-md">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[9px] uppercase tracking-widest text-honey/40 font-black">Uplink Target</span>
                  <span className="text-[8px] font-mono text-white/20">REST_API_READY</span>
                </div>
                <div className="bg-black/40 border border-honey/10 rounded p-2 text-[10px] font-mono text-honey break-all relative group cursor-pointer" onClick={() => {
                  navigator.clipboard.writeText("https://api.hiveshare.io/v1/uplink");
                }}>
                  https://api.hiveshare.io/v1/uplink
                  <div className="absolute inset-0 bg-honey/10 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center text-white text-[8px] font-black uppercase">Click to Copy Payload Target</div>
                </div>
                <p className="text-[7px] text-white/30 uppercase tracking-tighter leading-tight mt-1">
                  * This is a REST endpoint placeholder. For real hardware integration (ESP32/Arduino), 
                  please contact support to activate your dedicated API gateway.
                </p>
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
                  if (isSyncing) return;
                  setIsSyncing(true);
                  try {
                    await seedHiveHistory(selectedHive.id);
                    alert("Growth Pattern Generated Successfully! Check the Dashboard.");
                  } catch (err: any) {
                    alert(`Generation failed: ${err.message}`);
                  } finally {
                    setIsSyncing(false);
                  }
                }}
                className="w-full py-2 bg-honey border border-honey text-black text-[9px] font-black uppercase tracking-widest hover:bg-black hover:text-honey transition-all rounded-sm flex items-center justify-center gap-2"
              >
                <TrendingUp size={12}/> Generate_Growth_Pattern
              </button>

              <button 
                onClick={async () => {
                  if (isSyncing) return;
                  setIsSyncing(true);
                  try {
                    await pushHivePulse(selectedHive.id, {
                      weight: iotWeight ? Number(iotWeight) : selectedHive.weight,
                      temp: iotTemp ? Number(iotTemp) : selectedHive.temp,
                      humidity: iotHumidity ? Number(iotHumidity) : selectedHive.humidity
                    });
                    setIotWeight(''); setIotTemp(''); setIotHumidity('');
                  } finally {
                    setIsSyncing(false);
                  }
                }}
                disabled={isSyncing}
                className="w-full py-3 bg-[#1A1208] border border-honey/30 text-honey text-[10px] font-black uppercase tracking-widest hover:bg-honey hover:text-black transition-all rounded-sm flex items-center justify-center gap-2"
              >
                {isSyncing ? <RefreshCw size={14} className="animate-spin" /> : <Plus size={14} />} Push_Sensor_Pulse
              </button>
            </div>
          </div>

          <div className="bg-[#120D08] border border-honey/10 rounded-lg p-6">
            <h3 className="text-[10px] uppercase tracking-[0.2em] text-honey font-black mb-6">Colony Logs</h3>
            <div className="space-y-4">
              <textarea 
                value={journalText}
                onChange={(e) => setJournalText(e.target.value)}
                placeholder="Log significant hive event..."
                className="w-full bg-black/40 border border-honey/20 rounded-md p-4 text-xs text-white focus:border-honey outline-none min-h-[100px] resize-none font-sans"
              />
              <button 
                onClick={async () => {
                  if (!journalText.trim()) return;
                  try {
                    await addJournalEntry(selectedHive.id, journalText);
                    setJournalText('');
                  } catch (err: any) {
                    alert(`Log Failed: ${err.message}`);
                  }
                }}
                className="w-full py-3 bg-honey/5 border border-honey/20 text-honey text-[9px] font-black uppercase tracking-widest hover:bg-honey/10 transition-all rounded-sm flex items-center justify-center gap-2"
              >
                <StickyNote size={14} /> Commit_to_Journal
              </button>
            </div>
          </div>

          <button 
            onClick={async () => {
              if (window.confirm(`PROTOCOL_OMEGA: Permanent decommissioning of Hive #${selectedHive.id}?`)) {
                try {
                  await removeHive(selectedHive.id);
                } catch (err: any) {
                  alert(`Decommissioning Failed: ${err.message}`);
                }
              }
            }}
            className="w-full py-3 bg-red-500/5 border border-red-500/20 text-red-500/40 text-[9px] font-black uppercase tracking-widest hover:bg-red-500/10 hover:text-red-500 transition-all rounded-sm flex items-center justify-center gap-2"
          >
            <Trash2 size={14}/> Decommission_Unit
          </button>
        </div>
      </div>
    </div>
  );
}
