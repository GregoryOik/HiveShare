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
  Radio,
  User as UserIcon,
  Trash2,
  Key,
  CalendarDays,
  ExternalLink,
  ChevronRight,
  ShieldX,
  UserMinus,
  X,
  Users
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
  const [showTour, setShowTour] = useState(false);
  const [tourStep, setTourStep] = useState(0);
  const [activeTab, setActiveTab] = useState<'main' | 'settings' | 'harvest' | 'apiary'>('main');
  const [settingsStep, setSettingsStep] = useState<'overview' | 'security' | 'danger'>('overview');

  const { updateProfile, updatePassword, deleteAccount } = useAuth();

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
      if (!loading && profile?.tier && profile.tier !== 'none' && (!profile.subscribedHives || profile.subscribedHives.length === 0) && !isAutoAssigning) {
        setIsAutoAssigning(true);
        try {
          await claimRandomHive(profile.tier as 'starter' | 'premium');
        } catch (err) {
          console.error('[Dashboard] Auto-assignment failed:', err);
        } finally {
          setIsAutoAssigning(false);
        }
      }
    };
    attemptAutoAssign();
  }, [loading, profile, claimRandomHive, isAutoAssigning]);

  useEffect(() => {
    if (profile && profile.hasSeenTour === false) {
      setShowTour(true);
    }
  }, [profile]);

  const downloadCertificate = (hiveId: string) => {
    setIsGeneratingPDF(true);
    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
    const userName = (profile?.customLabel || user?.displayName || user?.email || 'Valued Guardian').toUpperCase();
    const date = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    const serial = `GR-SP-600-${hiveId}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

    // 1. Background Layer (Deep Noir)
    doc.setFillColor(15, 12, 8); // #0F0C08
    doc.rect(0, 0, 297, 210, 'F');

    // 2. Taygetos / Honeycomb Watermark (Discrete)
    doc.setDrawColor(200, 134, 10, 0.15); // Very subtle honey
    doc.setLineWidth(0.1);
    // Draw some mountain silhouettes at the bottom
    doc.moveTo(10, 180);
    doc.lineTo(60, 150);
    doc.lineTo(100, 170);
    doc.lineTo(150, 140);
    doc.lineTo(200, 165);
    doc.lineTo(260, 145);
    doc.lineTo(287, 180);
    doc.stroke();

    // 3. Beeswax / Old Document Border
    doc.setDrawColor(200, 134, 10);
    doc.setLineWidth(1.5);
    doc.rect(8, 8, 281, 194); // outer
    doc.setLineWidth(0.4);
    doc.rect(11, 11, 275, 188); // inner

    // 4. Header Section - LOGO & TITLE
    doc.setTextColor(200, 134, 10);
    doc.setFont('times', 'bold');
    doc.setFontSize(22);
    doc.text('HiveShare', 148.5, 25, { align: 'center', charSpace: 4 });
    
    doc.setFontSize(14);
    doc.text('OFFICIAL CERTIFICATE OF ADOPTION', 148.5, 38, { align: 'center', charSpace: 2 });
    doc.setFontSize(10);
    doc.setFont('times', 'normal');
    doc.text('BEEHIVE CO-OWNERSHIP PROGRAM', 148.5, 45, { align: 'center', charSpace: 1 });

    // 5. Main Body
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.text('This is to certify that', 148.5, 65, { align: 'center' });
    
    doc.setTextColor(200, 134, 10);
    doc.setFontSize(28);
    doc.setFont('times', 'bold');
    doc.text(userName, 148.5, 82, { align: 'center' });

    doc.setTextColor(255, 255, 255);
    doc.setFont('times', 'normal');
    doc.setFontSize(14);
    doc.text(`is an official co-owner of a honeybee colony in Laconia, Greece, for the 2026 season.`, 148.5, 95, { align: 'center' });

    // 6. Technical Engineering Section (IoT)
    doc.setFillColor(30, 25, 20);
    doc.rect(40, 110, 217, 35, 'F');
    doc.setDrawColor(200, 134, 10, 0.3);
    doc.rect(40, 110, 217, 35, 'S');

    doc.setFontSize(8);
    doc.setTextColor(200, 134, 10);
    doc.setFont('times', 'bold');
    doc.text('TECHNICAL_SPECIFICATIONS_&_IOT_NODE_DATA', 45, 116);

    doc.setTextColor(255, 255, 255, 0.9);
    doc.setFont('times', 'normal');
    const techLeft = 50;
    const techRight = 160;
    doc.text(`HIVE ID: ${serial}`, techLeft, 125);
    doc.text(`LOCATION: Sparta, Peloponnese (37.0745° N, 22.4303° E)`, techLeft, 132);
    doc.text(`HARDWARE: NB-IoT Telemetry System Enabled`, techRight, 125);
    doc.text(`COLONY TYPE: Apis Mellifera Cecropia (Greek Bee)`, techRight, 132);

    // 7. The Promise (Impact)
    doc.setTextColor(255, 255, 255, 0.7);
    doc.setFontSize(10);
    const impactText = "By holding this certificate, you are actively protecting 30,000 pollinators and supporting sustainable, nomadic apiculture in the Greek highlands. Your contribution ensures the survival of the local ecosystem and the production of 100% unadulterated, premium honey.";
    const splitImpact = doc.splitTextToSize(impactText, 210);
    doc.text(splitImpact, 148.5, 155, { align: 'center' });

    // 8. Dual Signatures
    doc.setDrawColor(200, 134, 10, 0.5);
    doc.setLineWidth(0.3);
    
    // Left: Founder
    doc.line(40, 185, 120, 185);
    doc.setTextColor(255, 255, 255);
    doc.setFont('times', 'italic');
    doc.setFontSize(12);
    doc.text('Gregory Oikonomakos', 80, 180, { align: 'center' });
    doc.setFont('times', 'normal');
    doc.setFontSize(7);
    doc.text('FOUNDER & LEAD ENGINEER', 80, 190, { align: 'center', charSpace: 1 });

    // Right: Master Apiarist
    doc.line(177, 185, 257, 185);
    doc.setTextColor(255, 255, 255);
    doc.setFont('times', 'italic');
    doc.setFontSize(12);
    doc.text('Petros Oikonomakos', 217, 180, { align: 'center' });
    doc.setFont('times', 'normal');
    doc.setFontSize(7);
    doc.text('MASTER APIARIST (30+ YEARS EXPERIENCE)', 217, 190, { align: 'center', charSpace: 1 });

    doc.save(`HiveShare_Adoption_Certificate_${hiveId}.pdf`);
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
            <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-honey/10 border border-honey/20 rounded-full">
              <div className="w-1.5 h-1.5 rounded-full bg-honey animate-pulse"></div>
              <span className="text-[8px] uppercase tracking-widest font-black text-honey">PROTOTYPE_DATA: SIMULATED_FLIGHT</span>
            </div>
            {profile?.role === 'admin' && (
              <Link
                to="/admin"
                className="hidden lg:flex items-center gap-2 px-4 py-1.5 bg-[#C8860A]/10 border border-[#C8860A]/30 rounded-full text-[9px] uppercase tracking-[0.2em] text-[#C8860A] font-black hover:bg-[#C8860A] hover:text-[#2A1B0A] transition-all"
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
            <button onClick={() => setActiveTab('settings')} className="px-8 py-3 bg-honey text-[#2A1B0A] text-[10px] uppercase tracking-widest font-bold rounded-sm">Update Address</button>
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
                  {profile?.tier === 'premium' ? <Crown className="text-honey w-4 h-4" /> : 
                   profile?.tier === 'starter' ? <Star className="text-honey w-4 h-4" /> : 
                   <Users className="text-[#2A1B0A]/30 w-4 h-4" />}
                  {profile?.tier === 'premium' ? 'Premium Guardian' : 
                   profile?.tier === 'starter' ? 'Starter Guardian' : 
                   'Free Observer'}
                </div>
                <div className="h-[1px] bg-honey/10"></div>
                <button onClick={() => setActiveTab('settings')} className="flex items-center gap-3 text-[10px] uppercase tracking-widest text-[#2A1B0A]/40 hover:text-honey transition-all group">
                  <Settings size={14} className="group-hover:rotate-90 transition-transform" />
                  <span>Account Settings</span>
                </button>
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
                <h2 className="font-display italic text-8xl text-honey mb-8">{activeHive.weight.toFixed(1)}<span className="text-3xl ml-2 not-italic text-honey/40">kg</span></h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 pt-6 border-t border-honey/10">
                    <div className="space-y-1"><div className="text-[8px] md:text-[9px] uppercase tracking-widest text-honey/60 font-black">Temp</div><div className="text-sm text-white font-black">{activeHive.temp}°C</div></div>
                    <div className="space-y-1"><div className="text-[8px] md:text-[9px] uppercase tracking-widest text-honey/60 font-black">Humidity</div><div className="text-sm text-white font-black">{activeHive.humidity}%</div></div>
                    <div className="space-y-1"><div className="text-[8px] md:text-[9px] uppercase tracking-widest text-honey/60 font-black">Activity</div><div className="text-sm text-white font-black">{activeHive.activity}</div></div>
                    <div className="space-y-1"><div className="text-[8px] md:text-[9px] uppercase tracking-widest text-honey/60 font-black">Health</div><div className="text-sm text-green-400 font-black uppercase tracking-widest">Stable</div></div>
                  </div>
              </div>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-8 border border-honey/10 bg-hive-panel/40 rounded-[2px]">
                  <div className="text-[10px] uppercase tracking-[0.2em] text-honey font-bold mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                       <span>Growth Analysis</span>
                       <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                    </div>
                    <div className="flex items-center gap-4">
                      {activeHive.history && activeHive.history.length > 1 && (
                        <div className="flex flex-col items-end">
                          <span className="text-[8px] text-green-400 font-black tracking-widest bg-green-400/10 px-2 py-0.5 rounded-full mb-1">
                            +{(activeHive.history[activeHive.history.length-1].weight - activeHive.history[0].weight).toFixed(1)}kg TREND
                          </span>
                          <span className="text-[7px] text-honey/30 uppercase tracking-tighter">Proj. Yield: ~{(activeHive.weight * 0.45).toFixed(1)}kg</span>
                        </div>
                      )}
                      {activeHive.lastSyncTimestamp && (
                        <span className="text-[8px] text-honey/40 font-black tracking-widest">
                          LAST_SYNC: {new Date(activeHive.lastSyncTimestamp).toLocaleTimeString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="h-64 relative group">
                    <div className="absolute inset-0 pointer-events-none transition-opacity duration-1000 opacity-20 group-hover:opacity-40" style={{ backgroundImage: 'radial-gradient(#C8860A 0.5px, transparent 0.5px)', backgroundSize: '20px 20px' }}></div>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={activeHive.history}>
                        <defs>
                          <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#C8860A" stopOpacity={0.6}/>
                            <stop offset="95%" stopColor="#C8860A" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <Tooltip 
                          content={({ active, payload, label }) => {
                            if (active && payload && payload.length) {
                              return (
                                <div className="bg-[#1A1208] border border-honey/40 p-4 rounded-none shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-animate">
                                  <p className="text-[10px] uppercase tracking-[0.2em] text-honey/60 mb-2 font-black">{label}</p>
                                  <p className="text-2xl font-display italic text-honey">{payload[0].value} <span className="text-sm not-italic text-honey/40">kg</span></p>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="weight" 
                          stroke="#C8860A" 
                          strokeWidth={3}
                          fillOpacity={1} 
                          fill="url(#colorWeight)" 
                          animationDuration={2000}
                          dot={{ r: 2, fill: '#C8860A', strokeWidth: 0, fillOpacity: 0.6 }}
                          activeDot={{ r: 5, fill: '#C8860A', stroke: '#000', strokeWidth: 2 }}
                        />
                        <XAxis 
                          dataKey="day" 
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: 'rgba(255, 185, 41, 0.4)', fontSize: 8, fontWeight: 900 }}
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
                      <div key={i} className="pl-4 border-l-2 border-honey/40 bg-honey/5 py-2">
                        <div className="text-[9px] uppercase tracking-widest text-[#2A1B0A] font-black mb-1 opacity-60">{entry.type} · {new Date(entry.date).toLocaleDateString()}</div>
                        <p className="text-sm text-[#2A1B0A] italic leading-relaxed font-medium">"{entry.content}"</p>
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

      {/* Onboarding Tour Overlay */}
      {showTour && profile && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 sm:p-10 pointer-events-none">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto" onClick={() => setShowTour(false)}></div>
          <div className="bg-hive-panel border border-honey/30 p-8 sm:p-12 rounded-[2px] w-full max-w-lg relative z-10 shadow-[0_40px_100px_rgba(0,0,0,0.8)] animate-in zoom-in duration-500 pointer-events-auto">
            <div className="absolute -top-12 sm:-top-20 -left-12 sm:-left-20 w-48 h-48 sm:w-64 sm:h-64 bg-honey/10 blur-[80px] rounded-full pointer-events-none"></div>
            
            <button 
              onClick={() => setShowTour(false)}
              className="absolute top-6 right-6 text-[#2A1B0A]/20 hover:text-honey transition-colors"
            >
              <X size={20} />
            </button>

            <div className="relative z-10 space-y-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full border border-honey/40 flex items-center justify-center text-honey font-display text-lg">
                  {tourStep + 1}
                </div>
                <div className="text-[10px] uppercase tracking-[0.3em] text-[#2A1B0A]/40 font-black">Apiary Activation Sequence</div>
              </div>

              {tourStep === 0 && (
                <div className="space-y-6">
                  <h3 className="font-display text-4xl text-[#2A1B0A] leading-tight italic">Welcome home, <br/><span className="text-honey not-italic">{profile.customLabel || 'Guardian'}</span></h3>
                  <p className="text-[#2A1B0A]/70 leading-relaxed text-sm font-medium">
                    Your connection to the Mani mountains is now active. This journal is your window into the hive. Let's show you around.
                  </p>
                </div>
              )}

              {tourStep === 1 && (
                <div className="space-y-6">
                  <h3 className="font-display text-3xl text-[#2A1B0A]">Weight Tracking</h3>
                  <div className="bg-honey/5 border border-honey/10 p-4 rounded-sm">
                    <AreaChart width={300} height={60} data={[{w:40}, {w:45}, {w:42}, {w:50}, {w:55}]} className="mx-auto opacity-40">
                      <Area type="monotone" dataKey="w" stroke="#C8860A" fill="#C8860A" fillOpacity={0.2} />
                    </AreaChart>
                  </div>
                  <p className="text-[#2A1B0A]/70 leading-relaxed text-sm font-medium">
                    Monitor real-time honey accumulation. When the thyme blooms in Mani, you'll see a sharp upward spike in weight.
                  </p>
                </div>
              )}

              {tourStep === 2 && (
                <div className="space-y-6">
                  <h3 className="font-display text-3xl text-[#2A1B0A]">Beekeeper Journal</h3>
                  <div className="flex items-center gap-4 p-4 border border-honey/20 bg-honey/5">
                    <StickyNote size={20} className="text-honey" />
                    <span className="text-xs text-[#2A1B0A] italic font-medium">"Bees are active on the thyme bloom today..."</span>
                  </div>
                  <p className="text-[#2A1B0A]/70 leading-relaxed text-sm font-medium">
                    Our master beekeepers log snapshots and health notes directly into your dashboard as they rotate the hives.
                  </p>
                </div>
              )}

              {tourStep === 3 && (
                <div className="space-y-6">
                  <h3 className="font-display text-3xl text-[#2A1B0A]">Account Settings</h3>
                  <div className="flex items-center gap-4 p-4 border border-honey/20 bg-honey/5">
                    <UserIcon size={20} className="text-honey" />
                    <span className="text-xs text-[#2A1B0A] font-bold">PROFILE_LOCK: ACTIVE</span>
                  </div>
                  <p className="text-[#2A1B0A]/70 leading-relaxed text-sm font-medium">
                    Update your delivery address, change your password, or manage your digital certificate in the settings tab.
                  </p>
                </div>
              )}

              <div className="flex justify-between items-center pt-8 border-t border-honey/10">
                <button 
                  onClick={() => setTourStep(prev => Math.max(0, prev - 1))}
                  disabled={tourStep === 0}
                  className="text-[10px] uppercase tracking-widest text-[#2A1B0A]/30 hover:text-[#2A1B0A] disabled:opacity-0 transition-colors py-2 font-black"
                >
                  PREV
                </button>
                <div className="flex gap-1.5 px-4 h-6 items-center">
                  {[0,1,2,3].map(i => (
                    <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all ${tourStep === i ? 'bg-honey w-4' : 'bg-honey/20'}`}></div>
                  ))}
                </div>
                {tourStep < 3 ? (
                  <button 
                    onClick={() => setTourStep(prev => prev + 1)}
                    className="bg-honey text-[#2A1B0A] px-6 py-3 text-[10px] uppercase tracking-[0.2em] font-black hover:bg-honey/90 transition-all rounded-sm shadow-lg flex items-center gap-2"
                  >
                    NEXT <ChevronRight size={14} />
                  </button>
                ) : (
                  <button 
                    onClick={async () => {
                      await updateProfile({ hasSeenTour: true });
                      setShowTour(false);
                    }}
                    className="bg-green-600 text-white px-6 py-3 text-[10px] uppercase tracking-[0.2em] font-black hover:bg-green-700 transition-all rounded-sm shadow-xl"
                  >
                    FINISH TOUR
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Account Settings Modal */}
      {activeTab === 'settings' && profile && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md overflow-y-auto">
          <div className="bg-hive-panel border border-honey/30 p-8 sm:p-12 rounded-[2px] w-full max-w-2xl relative shadow-[0_40px_100px_rgba(0,0,0,0.8)] animate-in fade-in zoom-in duration-300">
            <button 
              onClick={() => setActiveTab('main')}
              className="absolute top-6 right-6 text-[#2A1B0A]/20 hover:text-honey transition-colors"
            >
              <X size={24} />
            </button>

            <div className="space-y-10">
              <div className="space-y-2">
                <h3 className="font-display text-4xl text-[#2A1B0A]">Account Settings</h3>
                <p className="text-[10px] uppercase tracking-[0.3em] font-black text-honey">Identity & Security Control</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-b border-honey/10 pb-8">
                <div className="md:col-span-1 space-y-4">
                  <button 
                    onClick={() => setSettingsStep('overview')}
                    className={`w-full text-left p-4 flex items-center gap-3 text-[10px] uppercase tracking-widest font-black transition-all rounded-sm border ${settingsStep === 'overview' ? 'bg-honey text-[#2A1B0A] border-honey shadow-lg' : 'bg-transparent text-[#2A1B0A]/40 border-honey/10 hover:border-honey/40'}`}
                  >
                    <UserIcon size={14} /> Profile
                  </button>
                  <button 
                    onClick={() => setSettingsStep('security')}
                    className={`w-full text-left p-4 flex items-center gap-3 text-[10px] uppercase tracking-widest font-black transition-all rounded-sm border ${settingsStep === 'security' ? 'bg-honey text-[#2A1B0A] border-honey shadow-lg' : 'bg-transparent text-[#2A1B0A]/40 border-honey/10 hover:border-honey/40'}`}
                  >
                    <Lock size={14} /> Security
                  </button>
                  <button 
                    onClick={() => setSettingsStep('danger')}
                    className={`w-full text-left p-4 flex items-center gap-3 text-[10px] uppercase tracking-widest font-black transition-all rounded-sm border ${settingsStep === 'danger' ? 'bg-red-600 text-white border-red-600 shadow-lg' : 'bg-transparent text-red-500/40 border-red-500/10 hover:border-red-500/40'}`}
                  >
                    <ShieldX size={14} /> Danger Zone
                  </button>
                </div>

                <div className="md:col-span-2 space-y-8 animate-in fade-in slide-in-from-right duration-500">
                  {settingsStep === 'overview' && (
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <label className="text-[9px] uppercase tracking-widest font-black text-honey">Guardian Name</label>
                        <input 
                          type="text" 
                          defaultValue={profile.customLabel} 
                          onBlur={(e) => updateProfile({ customLabel: e.target.value })}
                          className="w-full bg-[#1A1208]/50 border border-honey/20 p-4 text-sm text-[#2A1B0A] focus:outline-none focus:border-honey/60 transition-all rounded-sm"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-4">
                          <label className="text-[9px] uppercase tracking-widest font-black text-honey">DOB (Season Start)</label>
                          <input 
                            type="date" 
                            defaultValue={profile.dob} 
                            onBlur={(e) => updateProfile({ dob: e.target.value })}
                            className="w-full bg-[#1A1208]/50 border border-honey/20 p-4 text-xs text-[#2A1B0A] focus:outline-none focus:border-honey/60 transition-all rounded-sm"
                          />
                        </div>
                        <div className="space-y-4">
                          <label className="text-[9px] uppercase tracking-widest font-black text-honey">Apiary ID</label>
                          <div className="w-full bg-[#1A1208]/10 border border-honey/10 p-4 text-sm text-[#2A1B0A]/40 font-mono rounded-sm">
                            {profile.subscribedHives?.[0] || 'ASSIGNING...'}
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <label className="text-[9px] uppercase tracking-widest font-black text-honey">Shipping Destination</label>
                        <input 
                          type="text" 
                          defaultValue={profile.shippingAddress} 
                          placeholder="Street, City, Postcode, Country"
                          onBlur={(e) => updateProfile({ shippingAddress: e.target.value })}
                          className="w-full bg-[#1A1208]/50 border border-honey/20 p-4 text-sm text-[#2A1B0A] focus:outline-none focus:border-honey/60 transition-all rounded-sm placeholder:italic placeholder:text-[#2A1B0A]/30"
                        />
                      </div>
                    </div>
                  )}

                  {settingsStep === 'security' && (
                    <div className="space-y-6">
                       <div className="p-6 bg-honey/5 border border-honey/10 rounded-sm">
                          <div className="flex items-center gap-3 mb-4">
                            <Key size={16} className="text-honey" />
                            <h4 className="text-sm font-black text-[#2A1B0A] uppercase tracking-widest">Update Password</h4>
                          </div>
                          <p className="text-[10px] text-[#2A1B0A]/60 mb-6 leading-relaxed">
                            For your security, once you change your password you will be logged out of all other sessions.
                          </p>
                          <form onSubmit={async (e) => {
                            e.preventDefault();
                            const pass = (e.target as any).newPass.value;
                            if (pass.length < 6) return alert('Password must be 6+ characters');
                            await updatePassword(pass);
                            alert('Password updated successfully');
                          }} className="space-y-4">
                            <input 
                              name="newPass"
                              type="password" 
                              placeholder="New Secure Password" 
                              className="w-full bg-hive-bg border border-honey/20 p-4 text-sm text-[#2A1B0A] focus:outline-none focus:border-honey rounded-sm"
                            />
                            <button type="submit" className="w-full bg-honey text-[#2A1B0A] py-4 text-[10px] uppercase tracking-widest font-black hover:shadow-xl transition-all">Update Sequence</button>
                          </form>
                       </div>
                    </div>
                  )}

                  {settingsStep === 'danger' && (
                    <div className="space-y-8">
                       <div className="p-8 border-2 border-red-600/20 bg-red-600/5 rounded-sm">
                          <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-full bg-red-600/20 flex items-center justify-center">
                               <UserMinus size={24} className="text-red-600" />
                            </div>
                            <div>
                              <h4 className="text-lg font-black text-red-600 uppercase tracking-widest">Delete Account</h4>
                              <p className="text-[10px] text-red-600/60 uppercase tracking-widest">This action is irreversible</p>
                            </div>
                          </div>
                          <p className="text-xs text-[#2A1B0A]/70 leading-relaxed mb-8">
                            Deleting your account will immediately terminate your nomadic journal access, halt harvest deliveries, and erase your identity from the blockchain records.
                          </p>
                          <button 
                            onClick={async () => {
                              if (window.confirm('CRITICAL: Are you sure you want to delete your entire HiveShare identity? This cannot be undone.')) {
                                try {
                                  await deleteAccount();
                                  window.location.href = '/';
                                } catch (e) {
                                  alert('Re-authentication required: Please log out and back in to delete your account for security.');
                                }
                              }
                            }}
                            className="w-full border-2 border-red-600 text-red-600 py-4 text-[10px] uppercase tracking-[0.2em] font-black hover:bg-red-600 hover:text-white transition-all shadow-xl"
                          >
                             PURGE ACCOUNT DATA
                          </button>
                       </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="text-center">
                 <button onClick={() => setActiveTab('main')} className="text-[10px] uppercase tracking-[0.4em] font-black text-[#2A1B0A]/20 hover:text-honey transition-all">
                    Return to Journal Base
                 </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
