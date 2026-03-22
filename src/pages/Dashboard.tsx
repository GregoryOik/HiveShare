import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Check, Clock, Package, ChevronDown, LogOut, Share2, Settings as SettingsIcon, AlertTriangle, ArrowRight, Award, Crown, Star, Lock, Plus } from 'lucide-react';
import { useHiveData } from '../lib/useHiveData';
import { useAuth } from '../lib/useAuth';
import OnboardingStepper from '../components/OnboardingStepper';
import { jsPDF } from 'jspdf';

const BeeCursor = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [rotation, setRotation] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // Detect touch devices
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      setIsTouchDevice(true);
      return;
    }

    let lastX = -100;
    let lastY = -100;

    const updatePosition = (e: MouseEvent) => {
      setIsVisible(true);
      const deltaX = e.clientX - lastX;
      const deltaY = e.clientY - lastY;
      
      if (Math.abs(deltaX) > 1 || Math.abs(deltaY) > 1) {
        if (deltaX > 2) setIsFlipped(true);
        else if (deltaX < -2) setIsFlipped(false);

        const tilt = deltaY * 0.8;
        setRotation(Math.max(-35, Math.min(35, tilt)));
      } else {
        setRotation(0);
      }

      setPosition({ x: e.clientX, y: e.clientY });
      lastX = e.clientX;
      lastY = e.clientY;

      const target = e.target as HTMLElement;
      setIsHovering(
        window.getComputedStyle(target).cursor === 'pointer' || 
        target.tagName.toLowerCase() === 'a' ||
        target.tagName.toLowerCase() === 'button' ||
        target.closest('a') !== null ||
        target.closest('button') !== null
      );
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', updatePosition);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    
    return () => {
      window.removeEventListener('mousemove', updatePosition);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, []);

  if (isTouchDevice || !isVisible) return null;

  return (
    <>
      <style>{`
        body, a, button, [role="button"], input, select, textarea, .cursor-pointer {
          cursor: none !important;
        }
      `}</style>
      <div 
        className="fixed pointer-events-none z-[9999] flex items-center justify-center"
        style={{ 
          left: `${position.x}px`, 
          top: `${position.y}px`,
          transform: `translate(-50%, -50%) scale(${isHovering ? 1.4 : 1})`,
          transition: 'transform 0.15s ease-out',
          filter: 'drop-shadow(0px 4px 6px rgba(0,0,0,0.2))'
        }}
      >
        <span 
          className="text-3xl leading-none" 
          style={{ 
            transform: `scaleX(${isFlipped ? -1 : 1}) rotate(${isFlipped ? -rotation : rotation}deg)`,
            transition: 'transform 0.1s ease-out'
          }}
        >
          🐝
        </span>
      </div>
    </>
  );
};

export default function Dashboard() {
  const { hives, loading } = useHiveData();
  const { user, profile, logout } = useAuth();
  const [selectedHiveId, setSelectedHiveId] = useState<string>('');
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

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

  if (loading) return <div className="min-h-screen bg-[#1A1208] text-white p-12 flex items-center justify-center">Loading hive data...</div>;
  
  const data = hives.find(h => h.id === selectedHiveId) || hives[0];

  if (!data) {
    return (
      <div className="min-h-screen bg-[#1A1208] text-white/80 font-body selection:bg-honey selection:text-white flex flex-col">
        <header className="border-b border-honey/20 bg-[#1A1208] sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between w-full">
            <a href="https://oikonomakos.gr/" className="font-display text-2xl tracking-wide text-white">
              Hive<span className="text-honey">Share</span>
            </a>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-honey/50"></div>
                <span className="text-[10px] uppercase tracking-widest text-white/50">{profile?.email}</span>
              </div>
              <button onClick={logout} className="text-[10px] uppercase tracking-widest text-white/30 hover:text-white transition-colors flex items-center gap-1">
                <LogOut className="w-3 h-3" />
                <span className="hidden md:inline">Logout</span>
              </button>
            </div>
          </div>
        </header>
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-2xl w-full text-center space-y-10">
            {/* Onboarding Stepper */}
            <OnboardingStepper steps={[
              { label: 'Sign Up', completed: true, active: false },
              { label: 'Choose Plan', completed: !!profile?.tier || (profile?.subscribedHives && profile.subscribedHives.length > 0), active: !profile?.tier && (!profile?.subscribedHives || profile.subscribedHives.length === 0) },
              { label: 'Payment', completed: !!profile?.subscribedHives && profile.subscribedHives.length > 0, active: !!profile?.tier && (!profile?.subscribedHives || profile.subscribedHives.length === 0) },
              { label: 'Hive Assigned', completed: false, active: !!profile?.subscribedHives && profile.subscribedHives.length > 0 },
              { label: 'Dashboard', completed: false, active: false },
            ]} />

            <div className="w-24 h-24 mx-auto border border-honey/20 rounded-full flex items-center justify-center bg-[#110C05] shadow-[0_0_30px_rgba(200,134,10,0.15)]">
              <Package className="w-8 h-8 text-honey" />
            </div>
            
            <div className="space-y-4">
              {profile?.subscribedHives && profile.subscribedHives.length > 0 ? (
                <>
                  <h1 className="font-display text-3xl md:text-4xl text-white">Your Hive is Being Set Up</h1>
                  <p className="text-sm text-white/60 leading-relaxed max-w-md mx-auto">
                    We're connecting your account to your assigned hive. This usually takes a few moments. Try refreshing the page.
                  </p>
                  <button 
                    onClick={() => window.location.reload()} 
                    className="mt-4 inline-block bg-honey text-white px-8 py-3 text-xs uppercase tracking-widest font-medium hover:bg-honey/90 transition-colors rounded-sm"
                  >
                    Refresh
                  </button>
                </>
              ) : (
                <>
                  <h1 className="font-display text-3xl md:text-4xl text-white">Ready for Your Own Honey?</h1>
                  <p className="text-sm text-white/60 leading-relaxed max-w-md mx-auto">
                    HiveShare by oikonomakos.gr lets you sponsor a real beehive and track its health, weight, and honey harvests in real time — turning your honey subscription into a living, data-driven experience.
                  </p>
                </>
              )}
            </div>

            <div className="bg-[#110C05] border border-honey/10 rounded-2xl p-6 text-left space-y-4 max-w-sm mx-auto">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 bg-honey/20 p-1 rounded-full text-honey"><Check className="w-3 h-3" /></div>
                <p className="text-sm text-white/80"><strong className="text-white font-medium">Real-time tracking:</strong> Watch your hive's weight and activity grow.</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-0.5 bg-honey/20 p-1 rounded-full text-honey"><Check className="w-3 h-3" /></div>
                <p className="text-sm text-white/80"><strong className="text-white font-medium">Pure harvest:</strong> Receive premium honey straight from your bees.</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-0.5 bg-honey/20 p-1 rounded-full text-honey"><Check className="w-3 h-3" /></div>
                <p className="text-sm text-white/80"><strong className="text-white font-medium">Support nature:</strong> Help sustain local bee populations.</p>
              </div>
            </div>

            <div className="pt-4">
              <Link 
                to="/membership" 
                className="inline-block bg-honey text-white px-10 py-4 text-xs uppercase tracking-widest font-medium hover:bg-honey/90 transition-all hover:shadow-[0_0_20px_rgba(200,134,10,0.3)] rounded-sm"
              >
                Adopt Your Hive Today
              </Link>
              <p className="mt-4 text-xs text-white/30">
                Already adopted? <a href="mailto:info@oikonomakos.gr" className="text-honey hover:underline">Contact support</a> to link your account.
              </p>
            </div>

            <div className="mt-12 pt-8 border-t border-honey/10 text-left max-w-sm mx-auto space-y-6">
              <h3 className="text-xs font-display text-honey uppercase tracking-widest text-center mb-6">Frequently Asked Questions</h3>
              
              <div>
                <h4 className="text-sm text-white font-medium mb-1">How many hives can I sponsor?</h4>
                <p className="text-xs text-white/50 leading-relaxed">You can sponsor as many hives as you like! Each hive will appear in a dropdown menu at the top of your dashboard.</p>
              </div>
              
              <div>
                <h4 className="text-sm text-white font-medium mb-1">How often do I get honey?</h4>
                <p className="text-xs text-white/50 leading-relaxed">Honey is typically shipped 1-2 times per year, directly following the main harvest seasons (Spring and Autumn).</p>
              </div>
              
              <div>
                <h4 className="text-sm text-white font-medium mb-1">How long does adoption last?</h4>
                <p className="text-xs text-white/50 leading-relaxed">Adoptions are valid for one full year and can be renewed annually to keep tracking your bees.</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-[#1A1208] text-white/80 font-body selection:bg-honey selection:text-white pb-20">
      <BeeCursor />
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

          <div className="flex items-center gap-2 px-3 py-1 bg-honey/10 border border-honey/20 rounded-full">
            {profile?.tier === 'premium' ? (
              <>
                <Crown size={12} className="text-honey" />
                <span className="text-[10px] uppercase tracking-widest text-honey font-bold">Premium Member</span>
              </>
            ) : (
              <>
                <Star size={12} className="text-white/40" />
                <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Starter Member</span>
              </>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-blink"></div>
              <div className="text-[10px] uppercase tracking-widest text-white/70 font-medium hidden sm:block">Live</div>
            </div>
            {profile?.role === 'admin' && (
              <Link to="/admin" className="text-[10px] uppercase tracking-widest text-honey hover:text-white transition-colors">Admin</Link>
            )}
            <Link to="/settings" className="text-white/50 hover:text-white transition-colors" title="Settings">
              <SettingsIcon className="w-4 h-4" />
            </Link>
            <button onClick={logout} className="text-white/50 hover:text-white transition-colors" title="Sign Out">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pt-12 md:pt-16">
        {/* Missing Address Alert */}
        {profile && !profile.shippingAddress && (
          <div className="mb-10 bg-[#FFB800]/5 border border-[#FFB800]/20 p-5 rounded-[2px] flex flex-col md:flex-row items-center justify-between gap-6 animate-in fade-in slide-in-from-top-4 duration-700">
            <div className="flex items-center gap-4 text-center md:text-left flex-col md:flex-row">
              <div className="w-12 h-12 rounded-full bg-[#FFB800]/10 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="text-[#FFB800] w-6 h-6" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-white tracking-wide uppercase">Shipping Address Required</p>
                <p className="text-xs text-white/50 leading-relaxed font-light">Your membership is active, but we don't know where to ship your honey! Please provide an address in your settings.</p>
              </div>
            </div>
            <Link 
              to="/settings" 
              className="px-8 py-3 bg-[#FFB800] text-[#110C05] text-[10px] uppercase tracking-widest font-bold hover:bg-[#FFB800]/90 transition-all hover:shadow-[0_0_20px_rgba(255,184,0,0.2)] rounded-sm flex items-center gap-2 whitespace-nowrap"
            >
              Update Settings
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        )}
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
          
          <div className="relative z-10 w-full max-w-2xl px-6">
            <div className="text-xs text-white/60 mb-6 flex items-center justify-center gap-3 flex-wrap">
              <span>This week: <strong className="text-white">+{((data.weight - data.history[0].weight)).toFixed(1)} kg</strong></span>
              <span className="w-1 h-1 rounded-full bg-white/20"></span>
              <span>Activity: <strong className="text-white">{data.activity}</strong></span>
              <span className="w-1 h-1 rounded-full bg-white/20"></span>
              <span>Next harvest: <strong className="text-white">{data.nextHarvestDate}</strong></span>
            </div>

            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="text-[10px] uppercase tracking-widest text-white/40">Current Hive Weight</div>
              <div className="px-2 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-[9px] uppercase tracking-widest font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                Healthy & Active
              </div>
            </div>
            
            <div className="font-display italic text-7xl md:text-8xl text-honey mb-6">{data.weight.toFixed(1)} kg</div>
            
            {/* Subtle trend line (mockup using SVG) */}
            <div className="w-48 h-8 mx-auto opacity-50 mb-6">
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
            
            <div className="flex flex-col items-center gap-4">
              <div className="bg-[#1A1208] border border-honey/10 rounded-full py-2 px-6 inline-block">
                <p className="text-xs text-white/70">
                  <strong className="text-honey font-medium">Great news!</strong> Your hive is gaining honey fast – weight increased by <span className="text-white">+{((data.weight - data.history[0].weight)).toFixed(1)} kg</span> this week.
                </p>
              </div>
              
              <button 
                onClick={() => {
                  const text = `I just adopted a beehive with HiveShare! My bees have gathered ${data.weight.toFixed(1)}kg of honey so far. Adopt your own at oikonomakos.gr`;
                  window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
                }} 
                className="text-[10px] uppercase tracking-widest text-honey hover:text-white transition-colors border border-honey/20 px-4 py-2 rounded-full flex items-center gap-2 hover:bg-honey/10"
              >
                <Share2 className="w-3 h-3" /> Share my hive
              </button>
              <Link 
                to="/membership" 
                className="text-[10px] uppercase tracking-widest text-white/50 hover:text-honey transition-colors border border-white/10 hover:border-honey/30 px-4 py-2 rounded-full flex items-center gap-2 hover:bg-honey/5"
              >
                <Plus className="w-3 h-3" /> Adopt another hive
              </Link>
            </div>
          </div>
        </section>

        {/* Metrics & Chart Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-16">
          
          {/* Metric Cards */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            {/* Temp & Acoustic (Conditionally Locked) */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#110C05] border border-honey/10 p-5 rounded-[2px] relative overflow-hidden group">
                <p className="text-[10px] uppercase tracking-widest text-white/30 mb-2">Internal Temp</p>
                <div className="flex items-end gap-2">
                  <span className="text-2xl font-display text-white">{profile?.tier === 'premium' ? `${data.temp}°C` : '—'}</span>
                  {profile?.tier === 'premium' && (
                    <span className="text-[10px] text-green-500 mb-1">+0.2</span>
                  )}
                </div>
                {profile?.tier !== 'premium' && (
                  <div className="absolute inset-0 bg-[#110C05]/80 backdrop-blur-[2px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-help">
                    <div className="flex flex-col items-center gap-1">
                      <Lock size={12} className="text-honey" />
                      <span className="text-[8px] uppercase tracking-widest text-honey font-bold">Premium Only</span>
                    </div>
                  </div>
                )}
              </div>
              <div className="bg-[#110C05] border border-honey/10 p-5 rounded-[2px] relative overflow-hidden group">
                <p className="text-[10px] uppercase tracking-widest text-white/30 mb-2">Acoustic Activity</p>
                <div className="flex items-end gap-2">
                  <span className="text-2xl font-display text-white">{profile?.tier === 'premium' ? data.activity : '—'}</span>
                  {profile?.tier === 'premium' && (
                    <div className="flex gap-0.5 mb-1.5">
                      {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className={`w-1 h-3 rounded-full ${i <= 4 ? 'bg-honey animate-pulse' : 'bg-honey/20'}`} style={{ animationDelay: `${i * 0.1}s` }}></div>
                      ))}
                    </div>
                  )}
                </div>
                {profile?.tier !== 'premium' && (
                  <div className="absolute inset-0 bg-[#110C05]/80 backdrop-blur-[2px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-help">
                    <div className="flex flex-col items-center gap-1">
                      <Lock size={12} className="text-honey" />
                      <span className="text-[8px] uppercase tracking-widest text-honey font-bold">Premium Only</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="bg-[#110C05] border border-honey/20 p-5 rounded-[2px] flex justify-between items-center">
              <div className="text-[10px] uppercase tracking-widest text-white/40">Humidity</div>
              <div className="font-display text-2xl text-white/90">{data.humidity}%</div>
            </div>
            
            <div className="bg-[#110C05] border border-honey/20 p-5 rounded-[2px] flex flex-col gap-1">
              <div className="text-[10px] uppercase tracking-widest text-white/40">Bee Species</div>
              <div className="font-display text-lg text-white/90">{data.beeSpecies || 'Apis mellifera'}</div>
            </div>

            <div className="bg-[#110C05] border border-honey/20 p-5 rounded-[2px] flex flex-col gap-1">
              <div className="text-[10px] uppercase tracking-widest text-white/40">Installed</div>
              <div className="font-display text-lg text-white/90">{data.installationDate ? new Date(data.installationDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Spring 2025'}</div>
            </div>
          </div>

          {/* Weight Chart */}
          <div className="lg:col-span-8 bg-[#110C05] border border-honey/20 p-6 rounded-[2px] flex flex-col">
            <div className="flex justify-between items-start mb-8">
              <div className="text-[10px] uppercase tracking-widest text-white/40">7-Day Weight Accumulation</div>
              <div className="text-[10px] text-honey bg-honey/10 px-2 py-1 rounded border border-honey/20">Active nectar flow</div>
            </div>
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

        {/* Harvest Timeline & Diary */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-16">
          
          {/* Timeline */}
          <div className="lg:col-span-5 bg-[#110C05] border border-honey/20 p-8 rounded-[2px]">
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

          {/* Upcoming Harvest Card & Diary */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="bg-[#110C05] border border-honey/20 p-8 rounded-[2px] flex flex-col justify-center items-center text-center flex-1">
              <Package size={32} strokeWidth={1} className="text-honey mb-6" />
              <div className="text-[10px] uppercase tracking-widest text-white/40 mb-4">Next Delivery</div>
              <h3 className="font-display text-3xl text-white/90 mb-4">
                {profile?.customLabel ? `Your Jar: ${profile.customLabel}` : data.activeHarvest}
              </h3>
              <div className="w-12 h-[1px] bg-honey/30 mb-6"></div>
              <div className="space-y-2 text-sm text-white/60 mb-8">
                <p>Est. harvest: <span className="text-white/90">{data.nextHarvestDate}</span></p>
                {profile?.customLabel && (
                  <p>Harvest type: <span className="text-white/90">{data.activeHarvest}</span></p>
                )}
                <p>Expected yield: <span className="text-white/90">~3.5 kg</span></p>
                <p>Status: <span className="text-honey">Maturing in comb</span></p>
              </div>

              {profile?.role === 'subscriber' && (
                <button 
                  onClick={() => downloadCertificate(data.id)}
                  disabled={isGeneratingPDF}
                  className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-bold text-honey/80 hover:text-honey transition-colors group disabled:opacity-50"
                >
                  <Award className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  {isGeneratingPDF ? "Generating..." : "Download Adoption Certificate"}
                </button>
              )}
            </div>

            {/* Hive Diary */}
            <div className="bg-[#110C05] border border-honey/20 p-6 rounded-[2px] flex-1 flex flex-col">
              <h3 className="text-xs font-display text-honey uppercase tracking-widest mb-4">Beekeeper's Diary</h3>
              <div className="space-y-4 flex-1">
                <div className="border-l-2 border-honey/30 pl-4 py-1">
                  <div className="text-[10px] text-white/40 mb-1">Today</div>
                  <p className="text-xs text-white/80 leading-relaxed">
                    Bees are extremely active today. The warm spring airflow has triggered a massive foraging response. Added a new super to accommodate the rapid nectar flow.
                  </p>
                </div>
                <div className="border-l-2 border-white/10 pl-4 py-1">
                  <div className="text-[10px] text-white/40 mb-1">3 days ago</div>
                  <p className="text-xs text-white/60 leading-relaxed">
                    Routine inspection completed. Queen is healthy and laying well. Brood pattern looks excellent. Hive weight increased by 0.4kg since last check.
                  </p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-white/5 text-[10px] text-white/30 text-right">
                Last entry: 20 March 2026
              </div>
            </div>
          </div>

        </div>

        {/* Photo Gallery */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-display text-2xl text-white/90">Apiary Snapshots</h3>
            <button className="text-[10px] uppercase tracking-widest text-honey hover:text-white transition-colors">View Gallery</button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="group cursor-pointer">
              <div className="aspect-[4/3] bg-[#110C05] border border-honey/20 rounded-[2px] overflow-hidden mb-3 relative">
                <div className="absolute inset-0 flex items-center justify-center text-white/10 group-hover:scale-105 transition-transform duration-700">
                  <img src={data.photoUrl} alt="Latest snapshot" className="w-full h-full object-cover opacity-40 sepia-[0.3]" />
                </div>
              </div>
              <div className="text-xs text-white/80">Latest hive snapshot</div>
              <div className="text-[10px] text-white/40 mt-1">Updated occasionally</div>
            </div>
            
            <div className="group cursor-pointer">
              <div className="aspect-[4/3] bg-[#110C05] border border-honey/20 rounded-[2px] overflow-hidden mb-3 relative">
                <div className="absolute inset-0 flex items-center justify-center text-white/10 group-hover:scale-105 transition-transform duration-700">
                  <img src="/map-texture.jpg" alt="Previous snapshot" className="w-full h-full object-cover opacity-20 sepia-[0.3]" />
                </div>
              </div>
              <div className="text-xs text-white/80">Previous snapshot</div>
              <div className="text-[10px] text-white/40 mt-1">Last month</div>
            </div>
            
            <div className="group cursor-pointer">
              <div className="aspect-[4/3] bg-[#110C05] border border-honey/20 rounded-[2px] overflow-hidden mb-3 relative flex items-center justify-center">
                <div className="text-xs text-white/20 font-display italic">Archive</div>
              </div>
              <div className="text-xs text-white/80">Older photos</div>
              <div className="text-[10px] text-white/40 mt-1">View all</div>
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
