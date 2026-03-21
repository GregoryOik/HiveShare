import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Check, Clock, Package, ChevronDown, LogOut } from 'lucide-react';
import { useHiveData } from '../lib/useHiveData';
import { useAuth } from '../lib/useAuth';

export default function Dashboard() {
  const { hives, loading } = useHiveData();
  const { logout, profile } = useAuth();
  const [selectedHiveId, setSelectedHiveId] = useState<string>('');

  useEffect(() => {
    if (hives.length > 0 && !selectedHiveId) {
      setSelectedHiveId(hives[0].id);
    }
  }, [hives, selectedHiveId]);

  if (loading) return <div className="min-h-screen bg-[#1A1208] text-white p-12 flex items-center justify-center">Loading hive data...</div>;
  
  const data = hives.find(h => h.id === selectedHiveId) || hives[0];

  if (!data) return <div className="min-h-screen bg-[#1A1208] text-white p-12 flex items-center justify-center">No hives found for your account.</div>;
  
  return (
    <div className="min-h-screen bg-[#1A1208] text-white/80 font-body selection:bg-honey selection:text-white pb-20">
      {/* Header */}
      <header className="border-b border-honey/20 bg-[#1A1208] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <a href="https://oikonomakos.gr/" className="font-display text-2xl tracking-wide text-white">
            Hive<span className="text-honey">Share</span>
          </a>
          
          <div className="hidden md:flex items-center gap-2 text-sm tracking-widest uppercase text-white/50 relative group">
            <select 
              value={data.id}
              onChange={(e) => setSelectedHiveId(e.target.value)}
              className="appearance-none bg-transparent border-none text-white focus:outline-none cursor-pointer pr-6 font-medium"
            >
              {hives.map(hive => (
                <option key={hive.id} value={hive.id} className="bg-[#1A1208] text-white">
                  Hive #{hive.id} — {hive.location}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 absolute right-0 pointer-events-none text-honey" />
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-blink"></div>
              <div className="text-[10px] uppercase tracking-widest text-white/70 font-medium hidden sm:block">Live</div>
            </div>
            {profile?.role === 'admin' && (
              <Link to="/admin" className="text-[10px] uppercase tracking-widest text-honey hover:text-white transition-colors">Admin</Link>
            )}
            <button onClick={logout} className="text-white/50 hover:text-white transition-colors" title="Sign Out">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pt-12">
        {/* Mobile Title */}
        <div className="md:hidden text-xs tracking-widest uppercase text-white/50 mb-8 text-center relative flex justify-center items-center">
          <select 
            value={data.id}
            onChange={(e) => setSelectedHiveId(e.target.value)}
            className="appearance-none bg-transparent border-none text-white focus:outline-none cursor-pointer pr-6 font-medium text-center"
          >
            {hives.map(hive => (
              <option key={hive.id} value={hive.id} className="bg-[#1A1208] text-white">
                Hive #{hive.id} — {hive.location}
              </option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 absolute right-0 pointer-events-none text-honey" style={{ right: 'calc(50% - 100px)' }} />
        </div>

        {/* Hero Section */}
        <section className="relative mb-16 py-12 border border-honey/20 rounded-[2px] bg-[#110C05] overflow-hidden flex flex-col items-center justify-center text-center">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(200,134,10,0.15)_0%,_transparent_60%)]"></div>
          
          <div className="relative z-10">
            <div className="text-[10px] uppercase tracking-widest text-white/40 mb-4">Current Hive Weight</div>
            <div className="font-display italic text-7xl md:text-8xl text-honey mb-6">{data.weight.toFixed(1)} kg</div>
            
            {/* Subtle trend line (mockup using SVG) */}
            <div className="w-48 h-8 mx-auto opacity-50">
              <svg viewBox="0 0 100 20" className="w-full h-full overflow-visible">
                <path 
                  d="M0,15 Q20,15 40,10 T80,5 T100,0" 
                  fill="none" 
                  stroke="#C8860A" 
                  strokeWidth="1" 
                  strokeDasharray="2 2"
                />
                <circle cx="100" cy="0" r="2" fill="#C8860A" />
              </svg>
            </div>
            <div className="text-[10px] text-white/30 mt-2">+{((data.weight - data.history[0].weight)).toFixed(1)} kg this week</div>
          </div>
        </section>

        {/* Metrics & Chart Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-16">
          
          {/* Three Metric Cards */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-[#110C05] border border-honey/20 p-6 rounded-[2px] flex justify-between items-center">
              <div className="text-[10px] uppercase tracking-widest text-white/40">Internal Temp</div>
              <div className="font-display text-3xl text-white/90">{data.temp.toFixed(1)}°C</div>
            </div>
            
            <div className="bg-[#110C05] border border-honey/20 p-6 rounded-[2px] flex justify-between items-center">
              <div className="text-[10px] uppercase tracking-widest text-white/40">Humidity</div>
              <div className="font-display text-3xl text-white/90">{data.humidity}%</div>
            </div>
            
            <div className="bg-[#110C05] border border-honey/20 p-6 rounded-[2px] flex justify-between items-center">
              <div className="text-[10px] uppercase tracking-widest text-white/40">Activity</div>
              <div className={`font-display text-3xl ${data.activity === 'High' ? 'text-green-400' : data.activity === 'Medium' ? 'text-honey' : 'text-white/50'}`}>{data.activity}</div>
            </div>
          </div>

          {/* Weight Chart */}
          <div className="lg:col-span-8 bg-[#110C05] border border-honey/20 p-6 rounded-[2px] flex flex-col">
            <div className="text-[10px] uppercase tracking-widest text-white/40 mb-8">7-Day Weight Accumulation</div>
            <div className="flex-1 min-h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.history} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <XAxis 
                    dataKey="day" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10, textAnchor: 'middle' }} 
                    dy={10}
                  />
                  <YAxis 
                    domain={['dataMin - 1', 'dataMax + 1']} 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }}
                  />
                  <Tooltip 
                    cursor={{ fill: 'rgba(200,134,10,0.05)' }}
                    contentStyle={{ backgroundColor: '#110C05', borderColor: 'rgba(200,134,10,0.2)', borderRadius: '2px', fontSize: '12px' }}
                    itemStyle={{ color: '#C8860A' }}
                  />
                  <Bar dataKey="weight" radius={[2, 2, 0, 0]} maxBarSize={40}>
                    {data.history.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={index === data.history.length - 1 ? '#C8860A' : 'rgba(200,134,10,0.3)'} 
                        style={index === data.history.length - 1 ? { filter: 'drop-shadow(0 0 8px rgba(200,134,10,0.5))' } : {}}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Harvest Timeline & Upcoming */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-16">
          
          {/* Timeline */}
          <div className="bg-[#110C05] border border-honey/20 p-8 rounded-[2px]">
            <h3 className="font-display text-2xl mb-8 text-white/90">Harvest Timeline</h3>
            
            <div className="space-y-8 relative before:absolute before:inset-0 before:ml-[11px] before:-translate-x-px before:h-full before:w-[1px] before:bg-honey/10">
              
              {/* Completed */}
              <div className="relative flex items-center justify-between group is-active">
                <div className="flex items-center justify-center w-6 h-6 rounded-full border border-honey bg-honey/20 text-honey shadow-[0_0_10px_rgba(200,134,10,0.2)] z-10 shrink-0">
                  <Check size={12} strokeWidth={3} />
                </div>
                <div className="w-[calc(100%-3rem)] border border-honey/20 p-4 rounded-[2px] bg-[#1A1208]">
                  <div className="text-[10px] uppercase tracking-widest text-honey mb-1">Completed</div>
                  <div className="font-display text-xl text-white/90 mb-1">Spring Thyme</div>
                  <div className="text-xs text-white/40">Yield: 2.1 kg</div>
                </div>
              </div>

              {/* Active */}
              <div className="relative flex items-center justify-between group is-active">
                <div className="flex items-center justify-center w-6 h-6 rounded-full border border-honey bg-[#110C05] z-10 shrink-0">
                  <div className="w-2 h-2 rounded-full bg-honey animate-pulse"></div>
                </div>
                <div className="w-[calc(100%-3rem)] border border-honey/40 p-4 rounded-[2px] bg-[#1A1208] shadow-[0_0_15px_rgba(200,134,10,0.05)]">
                  <div className="text-[10px] uppercase tracking-widest text-honey mb-1">Active Flow</div>
                  <div className="font-display text-xl text-white/90 mb-3">{data.activeHarvest}</div>
                  
                  {/* Progress bar */}
                  <div className="w-full h-1 bg-honey/10 rounded-full overflow-hidden">
                    <div className="h-full bg-honey w-[65%]"></div>
                  </div>
                  <div className="flex justify-between mt-2 text-[9px] text-white/40">
                    <span>Nectar gathering</span>
                    <span>Curing</span>
                  </div>
                </div>
              </div>

              {/* Upcoming */}
              <div className="relative flex items-center justify-between group">
                <div className="flex items-center justify-center w-6 h-6 rounded-full border border-white/10 bg-[#110C05] z-10 shrink-0">
                  <Clock size={10} className="text-white/30" />
                </div>
                <div className="w-[calc(100%-3rem)] border border-white/5 p-4 rounded-[2px] bg-[#1A1208] opacity-50">
                  <div className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Upcoming</div>
                  <div className="font-display text-xl text-white/90 mb-1">Autumn Pine</div>
                  <div className="text-xs text-white/40">Est. September</div>
                </div>
              </div>

            </div>
          </div>

          {/* Upcoming Harvest Card */}
          <div className="bg-[#110C05] border border-honey/20 p-8 rounded-[2px] flex flex-col justify-center items-center text-center">
            <Package size={32} strokeWidth={1} className="text-honey mb-6" />
            <div className="text-[10px] uppercase tracking-widest text-white/40 mb-4">Next Delivery</div>
            <h3 className="font-display text-3xl text-white/90 mb-4">{data.activeHarvest}</h3>
            <div className="w-12 h-[1px] bg-honey/30 mb-6"></div>
            <div className="space-y-2 text-sm text-white/60">
              <p>Est. harvest: <span className="text-white/90">{data.nextHarvestDate}</span></p>
              <p>Expected yield: <span className="text-white/90">~3.5 kg</span></p>
              <p>Status: <span className="text-honey">Maturing in comb</span></p>
            </div>
          </div>

        </div>

        {/* Photo Gallery */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-display text-2xl text-white/90">Apiary Log</h3>
            <button className="text-[10px] uppercase tracking-widest text-honey hover:text-white transition-colors">View All</button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="group cursor-pointer">
              <div className="aspect-[4/3] bg-[#110C05] border border-honey/20 rounded-[2px] overflow-hidden mb-3 relative">
                <div className="absolute inset-0 flex items-center justify-center text-white/10 group-hover:scale-105 transition-transform duration-700">
                  <img src={data.photoUrl} alt="Today's photo" className="w-full h-full object-cover opacity-40 sepia-[0.3]" />
                </div>
              </div>
              <div className="text-xs text-white/80">Today's apiary photo</div>
              <div className="text-[10px] text-white/40 mt-1">08:30 AM</div>
            </div>
            
            <div className="group cursor-pointer">
              <div className="aspect-[4/3] bg-[#110C05] border border-honey/20 rounded-[2px] overflow-hidden mb-3 relative">
                <div className="absolute inset-0 flex items-center justify-center text-white/10 group-hover:scale-105 transition-transform duration-700">
                  <img src="/map-texture.jpg" alt="Yesterday's photo" className="w-full h-full object-cover opacity-20 sepia-[0.3]" />
                </div>
              </div>
              <div className="text-xs text-white/80">Yesterday</div>
              <div className="text-[10px] text-white/40 mt-1">07:45 AM</div>
            </div>
            
            <div className="group cursor-pointer">
              <div className="aspect-[4/3] bg-[#110C05] border border-honey/20 rounded-[2px] overflow-hidden mb-3 relative flex items-center justify-center">
                <div className="text-xs text-white/20 font-display italic">No photo recorded</div>
              </div>
              <div className="text-xs text-white/80">2 days ago</div>
              <div className="text-[10px] text-white/40 mt-1">--:--</div>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-6 mt-20 pt-8 border-t border-honey/10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-[10px] uppercase tracking-widest text-white/40">
          Next shipment tracking: <span className="text-white/20 italic normal-case">Pending harvest completion</span>
        </div>
        <div className="text-[10px] uppercase tracking-widest text-white/20">
          HiveShare Member Portal
        </div>
      </footer>
    </div>
  );
}
