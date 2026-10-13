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
  StickyNote,
  X,
  Copy,
  Check,
  Code2
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
  const [showIotModal, setShowIotModal] = useState(false);
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);

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
          <div className="bg-[#120D08] border border-honey/20 rounded-lg p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-honey/15 pb-4">
              <h3 className="text-xs uppercase tracking-[0.2em] text-honey font-bold flex items-center gap-2">
                <Radio size={14} className="text-honey animate-pulse" /> IoT Hardware Uplink
              </h3>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${selectedHive.iotActive ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" : "bg-red-500"}`}></div>
                <span className="text-[9px] uppercase tracking-widest text-white/60 font-mono">
                  {selectedHive.iotActive ? "Synchronized" : "Standby"}
                </span>
              </div>
            </div>
            
            {/* API Access Token & Endpoint */}
            <div className="space-y-3">
              <div className="p-3 bg-black/60 border border-honey/15 rounded-sm space-y-2">
                <div className="flex items-center justify-between text-[9px] uppercase tracking-widest text-honey/70 font-bold">
                  <span>Hive Hardware Token</span>
                  <button 
                    onClick={async () => {
                      const newToken = `hs_key_${selectedHive.id}_${Math.random().toString(36).substring(2, 10)}`;
                      await updateHive(selectedHive.id, { iotKey: newToken });
                    }}
                    className="text-white/40 hover:text-honey transition-colors text-[8px]"
                    title="Generate New Secret Key"
                  >
                    Regenerate Key
                  </button>
                </div>
                <div className="font-mono text-[10px] text-honey break-all select-all bg-honey/5 px-2 py-1.5 rounded border border-honey/10">
                  {selectedHive.iotKey || `hs_key_${selectedHive.id}_default99`}
                </div>
                {selectedHive.lastSyncTimestamp && (
                  <div className="text-[9px] text-white/40 font-mono">
                    Last ping: {new Date(selectedHive.lastSyncTimestamp).toLocaleString('en-GB')}
                  </div>
                )}
              </div>

              {/* Hardware Guide Trigger */}
              <button
                type="button"
                onClick={() => setShowIotModal(true)}
                className="w-full py-2 bg-honey/10 border border-honey/30 hover:bg-honey hover:text-[#0C0804] text-honey text-[9px] uppercase tracking-widest font-black transition-all rounded-sm flex items-center justify-center gap-2"
              >
                <Zap size={12} /> View Hardware Setup (cURL / ESP32)
              </button>
            </div>

            {/* Quick Test Pulse */}
            <div className="pt-2 border-t border-honey/10 space-y-3">
              <div className="text-[9px] uppercase tracking-widest text-honey/70 font-bold">
                Manual Sensor Calibration (Field Override)
              </div>
              <div className="grid grid-cols-3 gap-2">
                 <div className="space-y-1">
                    <span className="text-[8px] uppercase text-white/40">Weight (kg)</span>
                    <input 
                      type="number"
                      step="0.1"
                      value={iotWeight}
                      onChange={(e) => setIotWeight(e.target.value)}
                      placeholder={selectedHive.weight.toString()}
                      className="w-full bg-black/60 border border-honey/20 rounded-sm p-2 text-xs text-white focus:border-honey outline-none font-mono"
                    />
                 </div>
                 <div className="space-y-1">
                    <span className="text-[8px] uppercase text-white/40">Temp (°C)</span>
                    <input 
                      type="number"
                      step="0.1"
                      value={iotTemp}
                      onChange={(e) => setIotTemp(e.target.value)}
                      placeholder={selectedHive.temp.toString()}
                      className="w-full bg-black/60 border border-honey/20 rounded-sm p-2 text-xs text-white focus:border-honey outline-none font-mono"
                    />
                 </div>
                 <div className="space-y-1">
                    <span className="text-[8px] uppercase text-white/40">Humid (%)</span>
                    <input 
                      type="number"
                      value={iotHumidity}
                      onChange={(e) => setIotHumidity(e.target.value)}
                      placeholder={selectedHive.humidity.toString()}
                      className="w-full bg-black/60 border border-honey/20 rounded-sm p-2 text-xs text-white focus:border-honey outline-none font-mono"
                    />
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button 
                  onClick={async () => {
                    if (isSyncing) return;
                    setIsSyncing(true);
                    try {
                      await seedHiveHistory(selectedHive.id);
                      alert("Historic biometrics curve generated for dashboard chart.");
                    } catch (err: any) {
                      alert(`Generation failed: ${err.message}`);
                    } finally {
                      setIsSyncing(false);
                    }
                  }}
                  className="py-2.5 bg-black/40 border border-honey/20 text-honey/80 hover:text-honey hover:border-honey/40 text-[8px] font-bold uppercase tracking-wider transition-all rounded-sm flex items-center justify-center gap-1.5"
                >
                  <TrendingUp size={12}/> Growth Pattern
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
                  className="py-2.5 bg-honey text-[#0C0804] text-[8px] font-black uppercase tracking-wider hover:bg-honey/90 transition-all rounded-sm flex items-center justify-center gap-1.5 shadow-sm"
                >
                  {isSyncing ? <RefreshCw size={12} className="animate-spin" /> : <Plus size={12} />} Push Pulse
                </button>
              </div>
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

      {/* ── IOT HARDWARE CONNECTION GUIDE MODAL ── */}
      {showIotModal && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/85 backdrop-blur-md" onClick={() => setShowIotModal(false)} />
          <div className="relative z-10 bg-[#16100A] border border-honey/30 rounded-[2px] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-honey/15 pb-4">
              <div>
                <div className="text-[9px] uppercase tracking-[0.3em] text-honey font-bold flex items-center gap-2">
                  <Code2 size={12} /> Hardware Telemetry Uplink
                </div>
                <h3 className="font-display text-2xl text-white">Hive #{selectedHive.id} Sensor Protocol</h3>
              </div>
              <button onClick={() => setShowIotModal(false)} className="text-white/40 hover:text-white p-1">
                <X size={20} />
              </button>
            </div>

            <p className="text-xs text-white/70 leading-relaxed font-light">
              Connect physical digital scales (e.g. HX711 with ESP32) and DHT22 microclimate probes to stream real-time weight, internal temperature, and humidity directly to HiveShare.
            </p>

            {/* Hardware Credentials */}
            <div className="grid grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-3 bg-black/60 border border-honey/15 rounded-sm">
                <span className="text-[9px] uppercase text-honey/60 block mb-1">Target Hive ID</span>
                <span className="text-white font-bold">{selectedHive.id}</span>
              </div>
              <div className="p-3 bg-black/60 border border-honey/15 rounded-sm">
                <span className="text-[9px] uppercase text-honey/60 block mb-1">Access Token</span>
                <span className="text-honey break-all">{selectedHive.iotKey || `hs_key_${selectedHive.id}_default99`}</span>
              </div>
            </div>

            {/* Snippet 1: cURL Test Command */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[9px] uppercase tracking-widest text-honey font-bold">1. cURL Terminal Ping (Test Uplink)</span>
                <button
                  onClick={() => {
                    const snippet = `curl -X POST https://oikonomakos.gr/api/telemetry \\\n  -H "Content-Type: application/json" \\\n  -H "X-Hive-Key: ${selectedHive.iotKey || `hs_key_${selectedHive.id}_default99`}" \\\n  -d '{"hiveId":"${selectedHive.id}","weight":${selectedHive.weight},"temp":${selectedHive.temp},"humidity":${selectedHive.humidity}}'`;
                    navigator.clipboard.writeText(snippet);
                    setCopiedSnippet('curl');
                    setTimeout(() => setCopiedSnippet(null), 2000);
                  }}
                  className="text-[9px] uppercase tracking-wider text-honey/70 hover:text-honey font-bold flex items-center gap-1 transition-colors"
                >
                  {copiedSnippet === 'curl' ? <><Check size={11} className="text-green-400" /> Copied</> : <><Copy size={11} /> Copy cURL</>}
                </button>
              </div>
              <pre className="p-3 bg-black/80 border border-honey/20 text-honey/90 text-[11px] font-mono rounded overflow-x-auto select-all leading-relaxed">
{`curl -X POST https://oikonomakos.gr/api/telemetry \\
  -H "Content-Type: application/json" \\
  -H "X-Hive-Key: ${selectedHive.iotKey || `hs_key_${selectedHive.id}_default99`}" \\
  -d '{"hiveId":"${selectedHive.id}","weight":${selectedHive.weight},"temp":${selectedHive.temp},"humidity":${selectedHive.humidity}}'`}
              </pre>
            </div>

            {/* Snippet 2: ESP32 / Arduino C++ Snippet */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[9px] uppercase tracking-widest text-honey font-bold">2. ESP32 Arduino C++ HTTP Client</span>
                <button
                  onClick={() => {
                    const cppSnippet = `// HiveShare ESP32 Telemetry Transmitter\n#include <WiFi.h>\n#include <HTTPClient.h>\n\nconst char* hiveId = "${selectedHive.id}";\nconst char* token = "${selectedHive.iotKey || `hs_key_${selectedHive.id}_default99`}";\n\nvoid sendTelemetry(float weight, float temp, float humidity) {\n  HTTPClient http;\n  http.begin("https://oikonomakos.gr/api/telemetry");\n  http.addHeader("Content-Type", "application/json");\n  http.addHeader("X-Hive-Key", token);\n  \n  String payload = String("{\\"hiveId\\":\\"") + hiveId + "\\",\\"weight\\":" + weight + ",\\"temp\\":" + temp + ",\\"humidity\\":" + humidity + "}";\n  int httpCode = http.POST(payload);\n  http.end();\n}`;
                    navigator.clipboard.writeText(cppSnippet);
                    setCopiedSnippet('cpp');
                    setTimeout(() => setCopiedSnippet(null), 2000);
                  }}
                  className="text-[9px] uppercase tracking-wider text-honey/70 hover:text-honey font-bold flex items-center gap-1 transition-colors"
                >
                  {copiedSnippet === 'cpp' ? <><Check size={11} className="text-green-400" /> Copied</> : <><Copy size={11} /> Copy C++ Code</>}
                </button>
              </div>
              <pre className="p-3 bg-black/80 border border-honey/20 text-white/80 text-[10px] font-mono rounded overflow-x-auto select-all leading-relaxed">
{`// HiveShare ESP32 Telemetry Transmitter
#include <WiFi.h>
#include <HTTPClient.h>

const char* hiveId = "${selectedHive.id}";
const char* token = "${selectedHive.iotKey || `hs_key_${selectedHive.id}_default99`}";

void sendTelemetry(float weight, float temp, float humidity) {
  HTTPClient http;
  http.begin("https://oikonomakos.gr/api/telemetry");
  http.addHeader("Content-Type", "application/json");
  http.addHeader("X-Hive-Key", token);
  
  String payload = String("{\\"hiveId\\":\\"") + hiveId + "\\",\\"weight\\":" + weight + ",\\"temp\\":" + temp + ",\\"humidity\\":" + humidity + "}";
  int httpCode = http.POST(payload);
  http.end();
}`}
              </pre>
            </div>

            <div className="flex justify-end pt-4 border-t border-honey/15">
              <button
                type="button"
                onClick={() => setShowIotModal(false)}
                className="px-6 py-2.5 bg-honey text-[#0C0804] font-bold text-xs uppercase tracking-wider rounded-[2px] hover:bg-honey/90 transition-all"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
