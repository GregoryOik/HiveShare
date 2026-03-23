import React from 'react';
import { 
  Terminal, 
  Settings, 
  RefreshCw, 
  Lock,
  Search,
  CheckCircle
} from 'lucide-react';
import { HiveData, SiteConfig } from '../../lib/useHiveData';

interface AdminSystemSettingsProps {
  config: SiteConfig | null;
  updateConfig: (data: Partial<SiteConfig>) => Promise<void>;
  hives: HiveData[];
  filteredHives: HiveData[];
  setSelectedHiveId: (id: string | null) => void;
  setActiveTab: (tab: 'hives' | 'users' | 'system' | 'finance') => void;
  users: { length: number };
}

export function AdminSystemSettings({
  config,
  updateConfig,
  hives,
  filteredHives,
  setSelectedHiveId,
  setActiveTab,
  users
}: AdminSystemSettingsProps) {
  if (!config) return null;

  return (
    <div className="space-y-8 animate-in zoom-in duration-500">
      {/* Global Site Configuration */}
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         {/* Live Apiary Overview */}
         <div className="col-span-1 bg-[#120D08] border border-honey/10 rounded-lg p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-[10px] uppercase tracking-widest font-black text-honey">Field Pulse Overview</h3>
              <div className="flex items-center gap-2 text-[8px] text-green-400">
                 <RefreshCw size={10} className="animate-spin" /> LIVE_SYNC_ACTIVE
              </div>
            </div>
            <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
              <table className="w-full text-left">
                <thead className="text-[8px] uppercase tracking-widest font-black text-honey/40 border-b border-honey/10">
                  <tr>
                    <th className="pb-2">Unit</th>
                    <th className="pb-2">Zone</th>
                    <th className="pb-2">Biometrics</th>
                    <th className="pb-2">Status</th>
                    <th className="pb-2">Harvest</th>
                    <th className="pb-2 text-right">Action</th>
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

         <div className="col-span-1 space-y-8">
            <div className="bg-[#120D08] border border-honey/10 rounded-lg p-6 space-y-4">
              <div className="text-[9px] uppercase tracking-widest text-honey font-black">Global Projected Yield</div>
              <div className="text-3xl font-display text-white">{(hives.reduce((acc, h) => acc + h.weight, 0) * 0.4).toFixed(1)}kg</div>
              <p className="text-[10px] text-white/40 italic leading-relaxed">Composite data suggests a robust harvest across all active Mani sectors.</p>
            </div>

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
         </div>
      </div>
    </div>
  );
}
