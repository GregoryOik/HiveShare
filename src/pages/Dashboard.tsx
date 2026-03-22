import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Check, Clock, Package, ChevronDown, LogOut, Share2, Settings as SettingsIcon, AlertTriangle, ArrowRight, Award, Crown, Star, Lock, Plus, Image as ImageIcon } from 'lucide-react';
import { useHiveData } from '../lib/useHiveData';
import { useAuth } from '../lib/useAuth';
import OnboardingStepper from '../components/OnboardingStepper';
import { jsPDF } from 'jspdf';

export default function Dashboard() {
  const { hives, loading } = useHiveData();
  const { user, profile, logout } = useAuth();
  const [selectedHiveId, setSelectedHiveId] = useState<string>('');
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isAutoAssigning, setIsAutoAssigning] = useState(false);
  const { claimRandomHive } = useHiveData();

  const downloadCertificate = (hiveId: string) => {
    setIsGeneratingPDF(true);
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    const userName = profile?.customLabel || user?.displayName || user?.email?.split('@')[0] || 'Member';
    const date = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

    // Background
    doc.setFillColor(26, 18, 8); // #1A1208
    doc.rect(0, 0, 297, 210, 'F');

    // Border
    doc.setDrawColor(200, 134, 10); // #C8860A (Honey)
    doc.setLineWidth(2);
    doc.rect(10, 10, 277, 190);
    doc.setLineWidth(0.5);
    doc.rect(13, 13, 271, 184);

    // Content
    doc.setTextColor(200, 134, 10);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(40);
    doc.text('CERTIFICATE OF ADOPTION', 148.5, 60, { align: 'center' });

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(18);
    doc.text('This is to certify that', 148.5, 85, { align: 'center' });

    doc.setFontSize(32);
    doc.setFont('helvetica', 'bold');
    doc.text(userName.toUpperCase(), 148.5, 105, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(18);
    doc.text('has successfully adopted', 148.5, 120, { align: 'center' });

    doc.setFontSize(24);
    doc.setTextColor(200, 134, 10);
    doc.text(`HIVE #${hiveId}`, 148.5, 135, { align: 'center' });

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.text('Located in the ancient groves of Lagia, Mani (Laconia, Greece)', 148.5, 145, { align: 'center' });

    doc.setFontSize(12);
    doc.text(`Date of Issue: ${date}`, 148.5, 170, { align: 'center' });
    
    doc.setFont('helvetica', 'italic');
    doc.text('Petros Oikonomakos, Master Beekeeper', 148.5, 185, { align: 'center' });

    // Logo Placeholder
    doc.setDrawColor(200, 134, 10);
    doc.line(110, 180, 187, 180);

    doc.save(`HiveShare_Certificate_Hive_${hiveId}.pdf`);
    setIsGeneratingPDF(false);
  };

  useEffect(() => {
    if (hives.length > 0 && !selectedHiveId) {
      setSelectedHiveId(hives[0].id);
    }
  }, [hives, selectedHiveId]);

  // Auto-assignment failsafe: If user has a tier but no hives, assign one automatically
  useEffect(() => {
    const attemptAutoAssign = async () => {
      if (!loading && profile?.tier && (!profile.subscribedHives || profile.subscribedHives.length === 0) && !isAutoAssigning) {
        setIsAutoAssigning(true);
        try {
          console.log('[Dashboard] Auto-assigning hive for tier:', profile.tier);
          await claimRandomHive(profile.tier);
          // The useHiveData hook will pick up the change through onSnapshot
        } catch (err) {
          console.error('[Dashboard] Auto-assignment failed:', err);
        } finally {
          setIsAutoAssigning(false);
        }
      }
    };
    attemptAutoAssign();
  }, [loading, profile, claimRandomHive, isAutoAssigning]);

  if (loading) return <div className="min-h-screen bg-hive-bg text-[#2A1B0A] p-12 flex items-center justify-center font-display text-xl tracking-widest animate-pulse">Connecting to your hive in Laconia...</div>;
  
  const data = hives.find(h => h.id === selectedHiveId) || hives[0];

  if (!data) {
    // Determine if the user is a non-subscriber/cancelled or just waiting for a hive
    const isSubscriber = !!profile?.tier;

    return (
      <div className="min-h-screen bg-hive-bg text-[#2A1B0A]/80 font-body selection:bg-honey selection:text-[#2A1B0A] flex flex-col relative overflow-hidden">
        {/* Cinematic Background Glows */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-honey/5 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-honey/5 blur-[120px] rounded-full pointer-events-none"></div>

        <header className="border-b border-honey/20 bg-hive-bg/80 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between w-full relative">
            <Link to="/" className="font-display text-2xl tracking-wide text-[#2A1B0A] hover:text-honey transition-colors duration-300">
              Hive<span className="text-honey">Share</span>
            </Link>
            <button onClick={logout} className="text-[#2A1B0A]/40 hover:text-red-500 transition-colors" title="Sign Out">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center p-6 bg-hive-bg">
          <div className="max-w-2xl w-full text-center space-y-10 relative">
            {isSubscriber ? (
              <>
                <OnboardingStepper steps={[
                  { label: 'Sign Up', completed: true, active: false },
                  { label: 'Choose Plan', completed: true, active: false },
                  { label: 'Payment', completed: true, active: false },
                  { label: 'Hive Assigned', completed: false, active: true },
                  { label: 'Apiary Journal', completed: false, active: false },
                ]} />

                <div className="w-24 h-24 mx-auto border border-honey/20 rounded-full flex items-center justify-center bg-hive-bg shadow-[0_0_30px_rgba(200,134,10,0.2)]">
                  <Package className="w-8 h-8 text-honey" />
                </div>
                
                <div className="space-y-4">
                  <h1 className="font-display text-3xl md:text-4xl text-[#2A1B0A]">
                    {isAutoAssigning ? "Finalizing Your Hive Selection..." : "Your Hive is Being Set Up"}
                  </h1>
                  <p className="text-sm text-[#2A1B0A]/60 leading-relaxed max-w-md mx-auto">
                    {isAutoAssigning 
                      ? "We're connecting your account to a specific apiary in Laconia, Greece. This only happens once."
                      : "We're connecting your account to your assigned hive. This usually takes a few moments. Try refreshing the page."
                    }
                  </p>
                  {!isAutoAssigning && (
                    <button 
                      onClick={() => window.location.reload()}
                      className="inline-flex items-center gap-2 text-honey hover:text-honey/80 font-bold uppercase tracking-widest text-[10px] mt-4"
                    >
                      <Clock className="w-3 h-3" /> Refresh Status
                    </button>
                  )}
                </div>
              </>
            ) : (
              <div className="space-y-12 animate-in fade-in duration-1000">
                 <div className="w-32 h-32 mx-auto relative">
                    <div className="absolute inset-0 bg-honey/10 blur-[40px] rounded-full"></div>
                    <div className="relative w-full h-full border border-honey/20 rounded-full flex items-center justify-center bg-hive-bg shadow-2xl">
                      <Lock className="w-10 h-10 text-honey opacity-40" />
                    </div>
                 </div>

                 <div className="space-y-6">
                    <div className="inline-block px-4 py-1 border border-honey/20 rounded-full text-[10px] uppercase tracking-[0.3em] text-honey font-bold mb-2">
                       Membership Inactive
                    </div>
                    <h1 className="font-display text-5xl text-[#2A1B0A] leading-tight">
                       Your nomadic journey <br/>is currently <span className="italic text-pale-honey">on pause.</span>
                    </h1>
                    <p className="text-[#2A1B0A]/60 max-w-lg mx-auto leading-relaxed">
                       You don't have an active beehive subscription. To begin tracking your own colony in the mountains of Mani and receiving seasonal harvests, please select a plan.
                    </p>
                 </div>

                 <div className="flex flex-col md:flex-row items-center justify-center gap-6 pt-6">
                    <Link 
                       to="/membership" 
                       className="px-10 py-5 bg-honey text-[#2A1B0A] font-bold uppercase tracking-widest text-xs hover:bg-honey/90 transition-all rounded-[2px] shadow-xl group"
                    >
                       View Membership Plans <ArrowRight className="inline-block ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link 
                       to="/" 
                       className="px-10 py-5 border border-honey/20 text-[#2A1B0A]/80 font-bold uppercase tracking-widest text-xs hover:bg-honey/5 transition-all rounded-[2px]"
                    >
                       Back to Home
                    </Link>
                 </div>
              </div>
            )}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-hive-bg text-[#2A1B0A]/80 font-body selection:bg-honey selection:text-[#2A1B0A] flex flex-col relative overflow-hidden">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-honey/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-honey/10 blur-[120px] rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_rgba(200,134,10,0.06)_0%,_transparent_70%)]"></div>
      </div>

      <header className="border-b border-honey/10 bg-hive-bg/80 backdrop-blur-md sticky top-0 z-50 relative">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between w-full">
          <Link to="/" className="font-display text-2xl tracking-wide text-[#2A1B0A] hover:text-honey transition-colors duration-300">
            Hive<span className="text-honey">Share</span>
          </Link>
          
          <div className="flex items-center gap-6">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-[9px] uppercase tracking-[0.2em] text-[#2A1B0A]/60 font-bold">Authenticated</span>
              <span className="text-[10px] text-honey font-bold">{profile?.email}</span>
            </div>
            
            <div className="h-8 w-[1px] bg-honey/10 mx-2 hidden md:block"></div>

            <button 
              onClick={logout} 
              className="group flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] font-bold text-[#2A1B0A]/60 hover:text-[#2A1B0A] transition-all duration-300 bg-white/10 hover:bg-honey/10 px-4 py-2 rounded-full border border-honey/10 hover:border-honey/30"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pt-12 md:pt-16 pb-20 relative z-10">
        {/* Missing Address Alert */}
        {profile && !profile.shippingAddress && (
          <div className="mb-10 bg-honey/5 border border-honey/20 p-5 rounded-[2px] flex flex-col md:flex-row items-center justify-between gap-6 animate-in fade-in slide-in-from-top-4 duration-700 backdrop-blur-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-honey/10 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="text-honey w-6 h-6" />
              </div>
              <div className="space-y-1 text-left">
                <p className="text-sm font-bold text-[#2A1B0A] tracking-wide uppercase font-display">Shipping Address Required</p>
                <p className="text-xs text-[#2A1B0A]/70 leading-relaxed font-medium">Your membership is active, but we don't know where to ship your honey!</p>
              </div>
            </div>
            <Link 
              to="/settings" 
              className="px-8 py-3 bg-honey text-[#2A1B0A] text-[10px] uppercase tracking-widest font-bold hover:bg-honey/90 transition-all rounded-sm flex items-center gap-2"
            >
              Update Settings <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        )}

        {/* Apiary Journal Content */}
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar */}
          <aside className="lg:w-72 space-y-8">
            <div className="p-6 bg-hive-panel/40 border border-honey/10 rounded-[2px] backdrop-blur-md">
              <div className="text-[10px] uppercase tracking-[0.2em] text-honey font-bold mb-6">Your Apiaries</div>
              <div className="space-y-3">
                {hives.map(hive => (
                  <button
                    key={hive.id}
                    onClick={() => setSelectedHiveId(hive.id)}
                    className={`w-full text-left p-4 rounded-[2px] border transition-all duration-300 group ${
                      selectedHiveId === hive.id 
                        ? 'bg-honey/10 border-honey/40 shadow-[0_0_15px_rgba(200,134,10,0.1)]' 
                        : 'border-white/5 hover:border-honey/20 bg-white/5'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className={`text-xs font-bold tracking-widest uppercase ${selectedHiveId === hive.id ? 'text-[#2A1B0A]' : 'text-[#2A1B0A]/60'}`}>
                        Hive #{hive.id}
                      </span>
                      {selectedHiveId === hive.id && <div className="w-1.5 h-1.5 rounded-full bg-honey animate-pulse"></div>}
                    </div>
                    <div className={`text-[10px] uppercase tracking-widest ${selectedHiveId === hive.id ? 'text-[#2A1B0A]/60' : 'text-[#2A1B0A]/40'}`}>{hive.location}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6 bg-hive-panel/40 border border-honey/10 rounded-[2px] backdrop-blur-md">
              <div className="text-[10px] uppercase tracking-[0.2em] text-honey font-bold mb-6">Membership</div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  {profile?.tier === 'premium' ? <Crown className="text-honey w-4 h-4" /> : <Star className="text-honey w-4 h-4" />}
                  <div className="text-xs uppercase tracking-widest text-[#2A1B0A]/80 font-bold">{profile?.tier} Account</div>
                </div>
                <div className="h-[1px] bg-honey/5"></div>
                <Link to="/settings" className="flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] text-[#2A1B0A]/40 hover:text-[#2A1B0A] transition-colors">
                  <SettingsIcon className="w-3.5 h-3.5" />
                  Manage Settings
                </Link>
              </div>
            </div>
          </aside>

          {/* Main Feed */}
          <div className="flex-1 space-y-8">
            {/* Hero Visualization */}
            <section className="relative p-12 border border-honey/20 rounded-[2px] bg-hive-panel/60 overflow-hidden flex flex-col items-center justify-center text-center backdrop-blur-xl">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(200,134,10,0.1)_0%,_transparent_70%)]"></div>
              
              <div className="relative z-10 w-full max-w-2xl">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="text-[10px] uppercase tracking-[0.3em] text-honey font-bold">Total Accumulation</div>
                  <div className="px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-[8px] uppercase tracking-widest font-bold">Live Link Active</div>
                </div>
                
                <h2 className="font-display italic text-8xl md:text-9xl text-[#2A1B0A] mb-6 drop-shadow-[0_0_20px_rgba(200,134,10,0.2)]">
                  {data.weight.toFixed(1)}<span className="text-3xl md:text-4xl ml-2 not-italic text-honey/60">kg</span>
                </h2>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-honey/10">
                  <div className="space-y-1">
                    <div className="text-[9px] uppercase tracking-[0.2em] text-[#2A1B0A]/60 font-bold">Internal Temp</div>
                    <div className="text-sm text-[#2A1B0A] font-bold uppercase tracking-widest">{data.temp}°C</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-[9px] uppercase tracking-[0.2em] text-[#2A1B0A]/60 font-bold">Humidity</div>
                    <div className="text-sm text-[#2A1B0A] font-bold uppercase tracking-widest">{data.humidity}%</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-[9px] uppercase tracking-[0.2em] text-[#2A1B0A]/60 font-bold">Acoustics</div>
                    <div className="text-sm text-[#2A1B0A] font-bold uppercase tracking-widest">{data.activity}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-[9px] uppercase tracking-[0.2em] text-[#2A1B0A]/60 font-bold">Species</div>
                    <div className="text-sm text-[#2A1B0A] font-bold uppercase tracking-widest">Macedonica</div>
                  </div>
                </div>
              </div>
            </section>

            {/* Analysis Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Chart */}
              <div className="p-8 border border-honey/10 bg-hive-panel/40 rounded-[2px] backdrop-blur-md flex flex-col">
                <div className="flex justify-between items-center mb-10">
                  <div className="text-[10px] uppercase tracking-[0.2em] text-honey font-bold">7-Day Growth Curve</div>
                </div>
                <div className="h-64 mt-auto">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.history}>
                      <Bar dataKey="weight" radius={[2, 2, 0, 0]}>
                        {data.history.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={index === data.history.length - 1 ? '#C8860A' : 'rgba(200,134,10,0.15)'} 
                          />
                        ))}
                      </Bar>
                      <XAxis dataKey="day" hide />
                      <YAxis hide domain={['dataMin - 2', 'dataMax + 2']} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Hive Photo Gallery */}
              <div className="p-8 border border-honey/10 bg-hive-panel/40 rounded-[2px] backdrop-blur-md group">
                <div className="flex justify-between items-center mb-10">
                  <div className="text-[10px] uppercase tracking-[0.2em] text-honey font-bold">Live Apiary View</div>
                  <div className="text-[8px] uppercase tracking-widest text-[#2A1B0A]/40 font-bold">Last Updated: Today</div>
                </div>
                <div className="relative aspect-video rounded-sm overflow-hidden border border-honey/10 shadow-lg">
                  <img 
                    src={data.photoUrl || '/beekeeper.jpg'} 
                    alt="Latest hive photo" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 flex items-center gap-2">
                    <ImageIcon className="w-3 h-3 text-honey" />
                    <span className="text-[10px] text-white/90 uppercase tracking-widest font-medium">Hive #{data.id} Observation</span>
                  </div>
                </div>
                <p className="mt-4 text-[10px] text-[#2A1B0A]/50 italic leading-relaxed">
                  Real-time photo from the Laconia apiary. Our team updates these views weekly to show colony health and floral surroundings.
                </p>
              </div>

              {/* Harvest Timeline */}
              <div className="p-8 border border-honey/10 bg-hive-panel/40 rounded-[2px] backdrop-blur-md">
                <div className="text-[10px] uppercase tracking-[0.2em] text-honey font-bold mb-10">Production Cycle</div>
                <div className="space-y-6">
                  <div className="relative pl-6 border-l border-honey/20 pb-4">
                    <div className="absolute left-[-4.5px] top-0 w-2 h-2 rounded-full bg-honey shadow-[0_0_8px_rgba(200,134,10,0.5)]"></div>
                    <div className="text-[10px] uppercase tracking-widest text-honey mb-1">Active Flow</div>
                    <div className="text-sm text-[#2A1B0A] font-medium mb-1">{data.activeHarvest}</div>
                    <div className="w-full h-1 bg-white/5 rounded-full mt-3 overflow-hidden">
                      <div className="h-full bg-honey w-[65%]"></div>
                    </div>
                  </div>
                  <div className="relative pl-6 border-l border-honey/20 opacity-30">
                    <div className="absolute left-[-4.5px] top-0 w-2 h-2 rounded-full bg-white/20"></div>
                    <div className="text-[10px] uppercase tracking-widest text-[#2A1B0A] mb-1">Next: August</div>
                    <div className="text-sm text-[#2A1B0A] font-medium">Autumn Pine Blend</div>
                  </div>
                </div>
                <div className="mt-10 pt-6 border-t border-white/5">
                  <button 
                    onClick={() => downloadCertificate(data.id)}
                    className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-bold text-honey/60 hover:text-honey transition-colors group"
                  >
                    <Award className="w-4 h-4" />
                    Adoption Certificate
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
