import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { 
  Activity, 
  Settings, 
  MapPin, 
  Calendar, 
  Camera, 
  Package, 
  ArrowRight, 
  Award, 
  RefreshCw,
  StickyNote,
  LogOut,
  Star,
  Crown,
  Lock,
  Clock,
  AlertTriangle,
  ShieldAlert,
  Image as ImageIcon,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Radio
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { useAuth } from '../lib/useAuth';
import { useHiveData, useSiteConfig } from '../lib/useHiveData';
import Footer from '../components/Footer';
import OnboardingStepper from '../components/OnboardingStepper';
import { jsPDF } from 'jspdf';

export default function Dashboard() {
  const { user, profile, logout } = useAuth();
  const { hives, loading, claimRandomHive } = useHiveData();
  const { config } = useSiteConfig();
  const [selectedHiveId, setSelectedHiveId] = useState<string>('');
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isAutoAssigning, setIsAutoAssigning] = useState(false);

  // Redirect if not logged in
  if (!user && !loading) return <Navigate to="/login" />;

  // Maintenance Mode Interceptor
  if (config?.maintenanceMode && profile?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-[#0A0704] flex items-center justify-center p-6 text-center">
        <div className="max-w-md space-y-8 animate-in fade-in zoom-in duration-1000">
           <div className="relative inline-block">
             <div className="absolute inset-0 bg-honey/20 blur-3xl rounded-full animate-pulse"></div>
             <ShieldAlert className="w-24 h-24 text-honey relative z-10 mx-auto" strokeWidth={1} />
           </div>
           <div className="space-y-4">
             <h2 className="font-display text-4xl text-white tracking-tight">HIVE_STASIS_ACTIVE</h2>
             <p className="text-[10px] uppercase tracking-[0.3em] font-black text-honey">System Wide Recalibration in Progress</p>
             <p className="text-sm text-white/40 leading-relaxed font-sans">
               We are currently performing deep-layer apiary synchronization. Your nomadic data is safe but temporarily offline for precision tuning.
             </p>
           </div>
           <div className="pt-8 border-t border-white/5">
             <div className="inline-flex items-center gap-2 group cursor-wait">
               <RefreshCw size={14} className="text-honey animate-spin" />
               <span className="text-[9px] uppercase tracking-widest text-honey/40 font-black">Syncing...</span>
             </div>
           </div>
        </div>
      </div>
    );
  }

  // Initial hive selection
  useEffect(() => {
    if (hives.length > 0 && !selectedHiveId) {
      const activeId = profile?.subscribedHives?.[0] || hives[0].id;
      setSelectedHiveId(activeId);
    }
  }, [hives, selectedHiveId, profile]);

  // Auto-assignment failsafe
  useEffect(() => {
    const attemptAutoAssign = async () => {
      if (!loading && profile?.tier && (!profile.subscribedHives || profile.subscribedHives.length === 0) && !isAutoAssigning) {
        setIsAutoAssigning(true);
        try {
          await claimRandomHive(profile.tier);
        } catch (err) {
          console.error('[Dashboard] Auto-assignment failed:', err);
        } finally {
          setIsAutoAssigning(false);
        }
      }
    };
    attemptAutoAssign();
  }, [loading, profile, claimRandomHive, isAutoAssigning]);

  const downloadCertificate = (hiveId: string) => {
    setIsGeneratingPDF(true);
    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
    const userName = profile?.customLabel || user?.email || 'Valued Member';
    const date = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

    doc.setFillColor(26, 18, 8); // #1A1208
    doc.rect(0, 0, 297, 210, 'F');
    doc.setDrawColor(200, 134, 10); // #C8860A
    doc.setLineWidth(2);
    doc.rect(10, 10, 277, 190);
    doc.setTextColor(200, 134, 10);
    doc.setFontSize(40);
    doc.text('CERTIFICATE OF ADOPTION', 148.5, 60, { align: 'center' });
    doc.setTextColor(255, 255, 255);
    doc.text(userName.toUpperCase(), 148.5, 105, { align: 'center' });
    doc.save(`HiveShare_Certificate_${hiveId}.pdf`);
    setIsGeneratingPDF(false);
  };

  if (loading) return (
    <div className="min-h-screen bg-hive-bg flex items-center justify-center font-display text-xl tracking-widest text-[#2A1B0A] animate-pulse">
      Connecting to your hive in Laconia...
    </div>
  );

  const activeHive = hives.find(h => h.id === selectedHiveId) || hives[0];

  if (!activeHive) {
    const isSubscriber = !!profile?.tier;
    return (
      <div className="min-h-screen bg-hive-bg flex flex-col font-body selection:bg-honey selection:text-[#2A1B0A]">
        <header className="border-b border-honey/10 bg-hive-bg/80 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <Link to="/" className="font-display text-2xl tracking-wide text-[#2A1B0A]">Hive<span className="text-honey">Share</span></Link>
            <button onClick={logout} className="text-[#2A1B0A]/40 hover:text-red-500 transition-colors"><LogOut className="w-4 h-4" /></button>
          </div>
        </header>
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-2xl w-full text-center space-y-10">
            {isSubscriber ? (
              <>
                <div className="w-24 h-24 mx-auto border border-honey/20 rounded-full flex items-center justify-center bg-hive-bg shadow-2xl">
                  <Package className="w-8 h-8 text-honey" />
                </div>
                <div className="space-y-4">
                  <h1 className="font-display text-4xl text-[#2A1B0A]">{config?.dashboardGreeting || 'Greetings, Guardian'}</h1>
                  <p className="text-sm text-[#2A1B0A]/60 max-w-md mx-auto">We're connecting your account to a specific apiary in Laconia. Please wait a moment.</p>
                </div>
              </>
            ) : (
              <div className="space-y-8 animate-in fade-in duration-1000">
                <Lock className="w-16 h-16 text-honey/40 mx-auto" />
                <h1 className="font-display text-5xl text-[#2A1B0A]">Membership Inactive</h1>
                <p className="text-[#2A1B0A]/60 max-w-lg mx-auto leading-relaxed">You don't have an active hive subscription. Join us to start your journey.</p>
                <Link to="/membership" className="inline-block px-10 py-5 bg-honey text-[#2A1B0A] font-bold uppercase tracking-widest text-xs hover:shadow-xl rounded-[2px]">View Plans</Link>
              </div>
            )}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-hive-bg text-[#2A1B0A]/80 font-body selection:bg-honey selection:text-[#2A1B0A] flex flex-col relative overflow-hidden">
      <header className="border-b border-honey/10 bg-hive-bg/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="font-display text-2xl tracking-wide text-[#2A1B0A]">Hive<span className="text-honey">Share</span></Link>
          <div className="flex items-center gap-6">
            {profile?.role === 'admin' && (
              <Link
                to="/admin"
                className="hidden lg:flex items-center gap-2 px-4 py-1.5 bg-[#C8860A]/10 border border-[#C8860A]/30 rounded-full text-[9px] uppercase tracking-[0.2em] text-[#C8860A] font-black hover:bg-[#C8860A] hover:text-[#2A1B0A] transition-all animate-pulse"
              >
                <Lock className="w-3 h-3" /> Central Station (God Mode)
              </Link>
            )}
            <div className="hidden md:flex flex-col items-end">
              <span className="text-[10px] uppercase tracking-widest text-[#2A1B0A]/40 font-bold">Laconia Apiary ID</span>
              <span className="text-xs text-honey font-medium">{profile?.subscribedHives?.[0] || 'ASSIGNING...'}</span>
            </div>
            <button onClick={logout} className="text-[#2A1B0A]/40 hover:text-red-500 transition-colors"><LogOut className="w-4 h-4" /></button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12 flex-1 w-full relative z-10">
        {config?.systemAnnouncement && (
          <div className="mb-10 bg-[#C8860A]/10 border border-[#C8860A]/30 p-4 rounded-[2px] backdrop-blur-md flex items-center gap-4 animate-in slide-in-from-top duration-700">
            <div className="w-8 h-8 rounded-full bg-[#C8860A]/20 flex items-center justify-center flex-shrink-0">
              <Star size={14} className="text-[#C8860A] animate-pulse" />
            </div>
            <p className="text-[10px] uppercase tracking-[0.2em] font-black text-[#C8860A]">
              {config.systemAnnouncement}
            </p>
          </div>
        )}
        {profile && !profile.shippingAddress && (
          <div className="mb-10 bg-honey/5 border border-honey/20 p-5 rounded-[2px] flex flex-col md:flex-row items-center justify-between gap-6 backdrop-blur-sm">
            <div className="flex items-center gap-4">
              <AlertTriangle className="text-honey w-6 h-6" />
              <div className="text-left"><p className="text-sm font-bold text-[#2A1B0A] uppercase">Shipping Address Required</p><p className="text-xs text-[#2A1B0A]/70">We need your address to ship your seasonal honey harvest.</p></div>
            </div>
            <Link to="/settings" className="px-8 py-3 bg-honey text-[#2A1B0A] text-[10px] uppercase tracking-widest font-bold rounded-sm">Update Address</Link>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar */}
          <aside className="lg:w-72 space-y-8">
            <div className="p-6 bg-hive-panel/40 border border-honey/10 rounded-[2px] backdrop-blur-md">
              <div className="text-[10px] uppercase tracking-[0.2em] text-honey font-bold mb-6">Your Apiaries</div>
              <div className="space-y-3">
                {hives.map(hive => (
                  <button key={hive.id} onClick={() => setSelectedHiveId(hive.id)} className={`w-full text-left p-4 rounded-[2px] border transition-all ${selectedHiveId === hive.id ? 'bg-honey/10 border-honey/40' : 'border-honey/5 hover:border-honey/20'}`}>
                    <div className="text-xs font-bold tracking-widest uppercase text-[#2A1B0A]">Hive #{hive.id}</div>
                    <div className="text-[10px] uppercase tracking-widest text-[#2A1B0A]/40">{hive.location}</div>
                  </button>
                ))}
              </div>
            </div>
            <div className="p-6 bg-hive-panel/40 border border-honey/10 rounded-[2px]">
              <div className="text-[10px] uppercase tracking-[0.2em] text-honey font-bold mb-4">Membership</div>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-xs uppercase tracking-widest text-[#2A1B0A] font-bold">
                  {profile?.tier === 'premium' ? <Crown className="text-honey w-4 h-4" /> : <Star className="text-honey w-4 h-4" />}
                  {profile?.tier || 'Standard'}
                </div>
                <div className="h-[1px] bg-honey/10"></div>
                <Link to="/harvest" className="flex items-center gap-3 text-[10px] uppercase tracking-widest text-[#2A1B0A]/40 hover:text-honey transition-all group">
                  <Package size={14} className="group-hover:scale-110 transition-transform" />
                  <span>Harvest Tracker</span>
                </Link>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 space-y-8">
            <section className="relative p-12 border border-honey/20 rounded-[2px] bg-hive-panel/60 overflow-hidden text-center backdrop-blur-xl">
              <div className="relative z-10">
                <div className="text-[10px] uppercase tracking-[0.3em] text-honey font-bold mb-2 flex items-center justify-center gap-2">
                  Current Weight
                  {activeHive.iotActive && (
                    <div className="flex items-center gap-1.5 ml-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                      <span className="text-[8px] tracking-[0.2em] text-green-500/80 font-black">LIVE</span>
                    </div>
                  )}
                </div>
                <h2 className="font-display italic text-8xl text-[#2A1B0A] mb-8">{activeHive.weight.toFixed(1)}<span className="text-3xl ml-2 not-italic text-honey/60">kg</span></h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 pt-6 border-t border-honey/10">
                    <div className="space-y-1"><div className="text-[8px] md:text-[9px] uppercase tracking-widest text-[#2A1B0A]/60 font-black">Temp</div><div className="text-sm text-[#2A1B0A] font-black">{activeHive.temp}°C</div></div>
                    <div className="space-y-1"><div className="text-[8px] md:text-[9px] uppercase tracking-widest text-[#2A1B0A]/60 font-black">Humidity</div><div className="text-sm text-[#2A1B0A] font-black">{activeHive.humidity}%</div></div>
                    <div className="space-y-1"><div className="text-[8px] md:text-[9px] uppercase tracking-widest text-[#2A1B0A]/60 font-black">Activity</div><div className="text-sm text-[#2A1B0A] font-black">{activeHive.activity}</div></div>
                    <div className="space-y-1"><div className="text-[8px] md:text-[9px] uppercase tracking-widest text-[#2A1B0A]/60 font-black">Health</div><div className="text-sm text-green-600 font-black uppercase tracking-widest">Stable</div></div>
                  </div>
              </div>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-8 border border-honey/10 bg-hive-panel/40 rounded-[2px]">
                  <div className="text-[10px] uppercase tracking-[0.2em] text-honey font-bold mb-6 flex items-center justify-between">
                    <span>Growth Analysis</span>
                    {activeHive.lastSyncTimestamp && (
                      <span className="text-[8px] text-[#2A1B0A]/30 font-black tracking-widest">
                        LAST_SYNC: {new Date(activeHive.lastSyncTimestamp).toLocaleTimeString()}
                      </span>
                    )}
                  </div>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={activeHive.history}>
                        <defs>
                          <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#C8860A" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#C8860A" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <Tooltip
                          contentStyle={{ backgroundColor: '#1A1208', border: '1px solid rgba(200, 134, 10, 0.2)', borderRadius: '2px', fontSize: '10px' }}
                          itemStyle={{ color: '#C8860A' }}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="weight" 
                          stroke="#C8860A" 
                          strokeWidth={2}
                          fillOpacity={1} 
                          fill="url(#colorWeight)" 
                          animationDuration={2000}
                        />
                        <XAxis 
                          dataKey="day" 
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: 'rgba(42, 27, 10, 0.4)', fontSize: 8, fontWeight: 900 }}
                          dy={10}
                        />
                        <YAxis hide domain={['dataMin - 1', 'dataMax + 1']} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
              </div>

              <div className="p-8 border border-honey/10 bg-hive-panel/40 rounded-[2px] flex flex-col justify-between">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-honey font-bold mb-6 flex items-center gap-2"><StickyNote size={14}/> Master beekeeper Notes</div>
                  <div className="space-y-4">
                    {activeHive.journal?.map((entry, i) => (
                      <div key={i} className="pl-4 border-l-2 border-honey/20">
                        <div className="text-[9px] uppercase tracking-widest text-honey font-bold mb-1">{entry.type} · {new Date(entry.date).toLocaleDateString()}</div>
                        <p className="text-xs text-[#2A1B0A]/70 italic leading-relaxed">"{entry.content}"</p>
                      </div>
                    )) || <p className="text-xs text-[#2A1B0A]/40">No entries yet.</p>}
                  </div>
                </div>
                <button onClick={() => downloadCertificate(activeHive.id)} className="mt-8 flex items-center justify-center gap-2 py-4 border border-honey/20 text-[10px] uppercase tracking-widest font-bold text-honey hover:bg-honey hover:text-[#2A1B0A] transition-all rounded-[2px]">
                   <Award size={14}/> Download Adoption Certificate
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
