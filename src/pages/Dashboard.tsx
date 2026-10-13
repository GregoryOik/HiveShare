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
  Users,
  Download
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
import CertificateModal from '../components/CertificateModal';

export default function Dashboard() {
  const { user, profile, logout } = useAuth();
  const { hives, loading, claimRandomHive } = useHiveData();
  const { config } = useSiteConfig();
  const [selectedHiveId, setSelectedHiveId] = useState<string>('');
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [showCertModal, setShowCertModal] = useState(false);
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

    // 1. Background Layer (Luminous Ivory / Light Parchment)
    doc.setFillColor(252, 248, 240); // Soft Ivory
    doc.rect(0, 0, 297, 210, 'F');

    // 2. Subtle Radiance Pattern (Circular subtle honey glows)
    doc.setDrawColor(200, 134, 10, 0.05);
    for (let i = 0; i < 300; i += 40) {
      for (let j = 0; j < 220; j += 40) {
        doc.circle(i, j, 30, 'S');
      }
    }

    // 3. Taygetos Silhouette (Subtle Grey/Gold)
    doc.setDrawColor(180, 160, 140, 0.2); 
    doc.setLineWidth(0.2);
    doc.moveTo(0, 210);
    doc.lineTo(40, 160);
    doc.lineTo(90, 185);
    doc.lineTo(160, 145);
    doc.lineTo(220, 180);
    doc.lineTo(260, 155);
    doc.lineTo(297, 210);
    doc.stroke();

    // 4. Elite Gold Border
    doc.setDrawColor(180, 130, 40); // Rich Gold
    doc.setLineWidth(2);
    doc.rect(7, 7, 283, 196); // Bold outer
    doc.setLineWidth(0.3);
    doc.rect(10, 10, 277, 190); // Delicate inner

    // 5. Header Section
    doc.setTextColor(140, 100, 30); // Darker Gold/Brown
    doc.setFont('times', 'bold');
    doc.setFontSize(26);
    doc.text('HiveShare', 148.5, 30, { align: 'center', charSpace: 5 });
    
    doc.setFontSize(14);
    doc.text('OFFICIAL CERTIFICATE OF ADOPTION', 148.5, 42, { align: 'center', charSpace: 3 });
    doc.setFontSize(9);
    doc.setFont('times', 'normal');
    doc.setTextColor(100, 80, 40);
    doc.text('BEEHIVE CO-OWNERSHIP PROGRAM • MANI, GREECE', 148.5, 48, { align: 'center', charSpace: 1 });

    // 6. Main Proclamation
    doc.setTextColor(40, 30, 20); // Deep Walnut
    doc.setFontSize(16);
    doc.text('This is to certify that', 148.5, 70, { align: 'center' });
    
    doc.setTextColor(180, 130, 40);
    doc.setFontSize(42);
    doc.setFont('times', 'bold');
    doc.text(userName, 148.5, 92, { align: 'center' });

    doc.setTextColor(40, 30, 20);
    doc.setFont('times', 'normal');
    doc.setFontSize(15);
    doc.text(`is an official co-owner of a honeybee colony in Laconia, Greece, for the 2026 season.`, 148.5, 108, { align: 'center' });

    // 7. Engineering / IoT Station (Light Theme)
    doc.setFillColor(245, 235, 220); // Muted beige
    doc.rect(40, 120, 217, 35, 'F');
    doc.setDrawColor(180, 130, 40, 0.4);
    doc.rect(40, 120, 217, 35, 'S');

    doc.setFontSize(9);
    doc.setTextColor(100, 80, 40);
    doc.setFont('times', 'bold');
    doc.text('TECHNICAL_SPECIFICATIONS_&_IOT_NODE_DATA', 148.5, 126, { align: 'center' });

    doc.setTextColor(60, 50, 40);
    doc.setFont('times', 'normal');
    doc.setFontSize(9);
    const techLeft = 55;
    const techRight = 165;
    doc.text(`HIVE ID: ${serial}`, techLeft, 136);
    doc.text(`LOCATION: Sparta, Peloponnese (37.0745° N, 22.4303° E)`, techLeft, 144);
    doc.text(`HARDWARE: NB-IoT Telemetry System Enabled`, techRight, 136);
    doc.text(`COLONY TYPE: Apis Mellifera Cecropia (Greek Bee)`, techRight, 144);

    // 8. The Impact Statement
    doc.setTextColor(80, 70, 60);
    doc.setFontSize(10);
    const impactText = "By holding this certificate, you are actively protecting 30,000 pollinators and supporting sustainable, nomadic apiculture in the Greek highlands. Your contribution ensures the survival of the local ecosystem and the production of 100% unadulterated, premium honey.";
    const splitImpact = doc.splitTextToSize(impactText, 210);
    doc.text(splitImpact, 148.5, 168, { align: 'center' });

    // 9. Signature Block
    doc.setDrawColor(180, 130, 40, 0.6);
    doc.setLineWidth(0.4);
    
    // Left: Founder
    doc.line(40, 192, 120, 192);
    doc.setTextColor(40, 30, 20);
    doc.setFont('times', 'italic');
    doc.setFontSize(13);
    doc.text('Gregory Oikonomakos', 80, 187, { align: 'center' });
    doc.setFont('times', 'normal');
    doc.setFontSize(8);
    doc.text('FOUNDER & LEAD ENGINEER', 80, 197, { align: 'center', charSpace: 1 });

    // Right: Master Apiarist
    doc.line(177, 192, 257, 192);
    doc.setTextColor(40, 30, 20);
    doc.setFont('times', 'italic');
    doc.setFontSize(13);
    doc.text('Petros Oikonomakos', 217, 187, { align: 'center' });
    doc.setFont('times', 'normal');
    doc.setFontSize(8);
    doc.text('MASTER APIARIST (30+ YEARS EXPERIENCE)', 217, 197, { align: 'center', charSpace: 1 });

    doc.save(`HiveShare_Official_Record_${hiveId}.pdf`);
    setIsGeneratingPDF(false);
  };

  if (loading) return (
    <div className="min-h-screen bg-hive-bg text-[#2A1B0A] flex flex-col items-center justify-center p-6 text-center">
      <div className="relative mb-6">
        <div className="w-12 h-12 border-2 border-honey/20 border-t-honey rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="w-2 h-2 rounded-full bg-honey animate-pulse"></span>
        </div>
      </div>
      <div className="font-display text-2xl text-[#2A1B0A] mb-2 tracking-wide">
        Hive<span className="text-honey">Share</span>
      </div>
      <div className="text-[10px] uppercase tracking-[0.3em] font-mono text-honey font-bold">
        Connecting to apiary telemetry in Mani...
      </div>
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
      <header className="border-b border-honey/10 bg-hive-bg/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-3">
          <Link to="/" className="font-display text-2xl tracking-wide text-[#2A1B0A]">
            Hive<span className="text-honey">Share</span>
          </Link>
          <div className="flex items-center gap-2.5 sm:gap-6">
            <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 bg-honey/10 border border-honey/20 rounded-full">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-[8px] uppercase tracking-widest font-mono font-bold text-honey">
                <span className="hidden sm:inline">APIARY_TELEMETRY: </span>ACTIVE
              </span>
            </div>
            {profile?.role === 'admin' && (
              <Link
                to="/admin"
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 min-h-[36px] bg-[#C8860A]/10 border border-[#C8860A]/30 rounded-full text-[8px] sm:text-[9px] uppercase tracking-[0.2em] text-[#C8860A] font-black hover:bg-[#C8860A] hover:text-[#2A1B0A] transition-all whitespace-nowrap"
              >
                <Lock className="w-3 h-3" /> <span className="hidden sm:inline">Central Station</span> (Admin)
              </Link>
            )}
            <div className="flex flex-col items-end">
              <span className="text-[8px] sm:text-[9px] uppercase tracking-widest text-[#2A1B0A]/40 font-mono font-bold">Colony ID</span>
              <span className="text-xs text-honey font-mono font-bold">{profile?.subscribedHives?.[0] || 'ASSIGNING...'}</span>
            </div>
            <button 
              onClick={logout} 
              title="Sign Out" 
              className="text-[#2A1B0A]/40 hover:text-red-500 transition-colors p-2 min-h-[44px] min-w-[44px] flex items-center justify-center -mr-2"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-5 sm:py-10 flex-1 w-full relative z-10">
        {config?.systemAnnouncement && (
          <div className="mb-4 sm:mb-8 bg-[#C8860A]/10 border border-[#C8860A]/30 p-3.5 sm:p-4 rounded-[2px] backdrop-blur-md flex items-center gap-3 sm:gap-4 animate-in slide-in-from-top duration-700">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#C8860A]/20 flex items-center justify-center shrink-0">
              <Star size={13} className="text-[#C8860A] animate-pulse" />
            </div>
            <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] font-black text-[#C8860A]">
              {config.systemAnnouncement}
            </p>
          </div>
        )}

        {profile && !profile.shippingAddress && (
          <div className="mb-4 sm:mb-8 bg-honey/5 border border-honey/20 p-4 sm:p-5 rounded-[2px] flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6 backdrop-blur-sm">
            <div className="flex items-center gap-3 sm:gap-4 text-left">
              <AlertTriangle className="text-honey w-5 h-5 sm:w-6 sm:h-6 shrink-0" />
              <div>
                <p className="text-xs sm:text-sm font-bold text-[#2A1B0A] uppercase tracking-wider">Shipping Address Required</p>
                <p className="text-[11px] sm:text-xs text-[#2A1B0A]/70 leading-relaxed">We need your delivery address to fulfill seasonal honey harvests.</p>
              </div>
            </div>
            <button 
              onClick={() => setActiveTab('settings')} 
              className="w-full md:w-auto px-6 sm:px-8 py-2.5 sm:py-3 min-h-[44px] bg-honey text-[#2A1B0A] text-[10px] uppercase tracking-widest font-bold rounded-xs shrink-0 active:scale-95"
            >
              Update Address
            </button>
          </div>
        )}

        {/* Multi-Hive Mobile Swipeable Strip */}
        {hives.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 mb-4 -mx-4 px-4 sm:mx-0 sm:px-0">
            <span className="text-[9px] uppercase tracking-widest font-mono text-[#2A1B0A]/50 shrink-0 font-bold">APIARIES:</span>
            {hives.map(hive => (
              <button
                key={hive.id}
                onClick={() => setSelectedHiveId(hive.id)}
                className={`px-3.5 py-1.5 min-h-[36px] rounded-full border text-xs font-mono shrink-0 transition-all ${
                  selectedHiveId === hive.id
                    ? 'bg-honey text-[#0C0804] border-honey shadow-xs font-bold'
                    : 'bg-white/70 text-[#2A1B0A]/70 border-honey/20 hover:border-honey/40'
                }`}
              >
                #{hive.id} · {hive.location.split(',')[0]}
              </button>
            ))}
          </div>
        )}

        {/* ── LUXURY GUARDIAN WELCOME & QUICK ACTIONS BAR ── */}
        <section className="mb-6 sm:mb-8 bg-hive-panel/75 border border-honey/20 p-5 sm:p-7 rounded-[2px] backdrop-blur-md relative overflow-hidden shadow-xs">
          <div className="absolute top-0 right-0 w-64 h-64 bg-honey/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 relative z-10">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 text-[9px] uppercase tracking-widest font-mono font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  UPLINK: ACTIVE
                </span>
                <span className="text-[10px] uppercase tracking-widest font-mono text-[#2A1B0A]/60 font-semibold">
                  {activeHive.location || 'Laconia, Peloponnese'}
                </span>
                <span className="hidden sm:inline text-honey/40">·</span>
                <span className="inline-block text-[10px] uppercase tracking-widest font-mono text-honey font-bold">
                  {profile?.tier === 'premium' ? 'Premium Patron' : profile?.tier === 'starter' ? 'Starter Guardian' : 'Apiary Observer'}
                </span>
              </div>
              
              <h1 className="font-display text-2xl sm:text-3xl md:text-4xl text-[#2A1B0A] tracking-tight">
                {config?.dashboardGreeting || `Welcome, ${profile?.customLabel || profile?.fullName || user?.displayName?.split(' ')[0] || user?.email?.split('@')[0] || 'Guardian'}`}
              </h1>
              
              <p className="text-xs sm:text-sm text-[#2A1B0A]/70 max-w-xl font-body leading-relaxed">
                Live biometric telemetry and ecological stream for <span className="text-[#2A1B0A] font-semibold">Colony #{activeHive.id}</span> in the Taygetos highlands.
              </p>
            </div>

            {/* Quick Actions (44px min touch-target mobile pills) */}
            <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap pt-2 md:pt-0 border-t md:border-t-0 border-honey/10">
              <button
                onClick={() => setShowCertModal(true)}
                className="flex items-center gap-2 px-3.5 sm:px-4 py-2.5 min-h-[44px] bg-honey text-[#0C0804] text-[10px] uppercase tracking-widest font-bold rounded-[2px] hover:bg-honey/90 active:scale-95 transition-all shadow-xs"
              >
                <Award size={14} className="shrink-0" />
                <span>Certificate</span>
              </button>

              <Link
                to="/harvest"
                className="flex items-center gap-2 px-3.5 sm:px-4 py-2.5 min-h-[44px] bg-white/70 border border-honey/30 text-[#2A1B0A] text-[10px] uppercase tracking-widest font-bold rounded-[2px] hover:bg-white active:scale-95 transition-all shadow-xs"
              >
                <Package size={14} className="shrink-0 text-honey" />
                <span>Harvests</span>
              </Link>

              <button
                onClick={() => setActiveTab('settings')}
                className="flex items-center gap-2 px-3.5 sm:px-4 py-2.5 min-h-[44px] bg-white/70 border border-honey/30 text-[#2A1B0A] text-[10px] uppercase tracking-widest font-bold rounded-[2px] hover:bg-white active:scale-95 transition-all shadow-xs"
              >
                <Settings size={14} className="shrink-0 text-[#2A1B0A]/60" />
                <span>Settings</span>
              </button>

              <button
                onClick={() => downloadCertificate(activeHive.id)}
                disabled={isGeneratingPDF}
                className="flex items-center gap-1.5 px-3 py-2.5 min-h-[44px] border border-honey/30 text-honey hover:bg-honey/10 text-[10px] uppercase tracking-widest font-bold rounded-[2px] active:scale-95 transition-all"
                title="Direct PDF Export"
              >
                <Download size={14} className="shrink-0" />
                <span className="hidden sm:inline">PDF</span>
              </button>
            </div>
          </div>
        </section>

        <div className="flex flex-col lg:flex-row gap-6 sm:gap-10 lg:gap-12">
          {/* Main Telemetry Content (FIRST on mobile order-1, SECOND on desktop lg:order-2) */}
          <div className="order-1 lg:order-2 flex-1 space-y-6 sm:space-y-8 min-w-0">
            {/* Primary Hive Weight & Vitality HUD Card */}
            <section className="relative p-6 sm:p-10 md:p-12 border border-honey/20 rounded-[2px] bg-hive-panel/75 overflow-hidden text-center backdrop-blur-xl shadow-xs">
              {/* Subtle luxury radial glow */}
              <div className="absolute inset-0 pointer-events-none opacity-25" style={{ backgroundImage: 'radial-gradient(#C8860A 0.75px, transparent 0.75px)', backgroundSize: '24px 24px' }}></div>

              <div className="relative z-10">
                {/* HUD Top Bar */}
                <div className="flex items-center justify-between pb-4 sm:pb-5 mb-4 sm:mb-6 border-b border-honey/15 flex-wrap gap-2 text-left">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.25em] font-mono font-bold text-honey">
                      HIVE SCALE STATION #{activeHive.id}
                    </span>
                    <span className="text-[8px] uppercase tracking-widest font-mono text-[#2A1B0A]/40 font-semibold hidden sm:inline">
                      · 37.07° N, 22.43° E
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {activeHive.iotActive ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 text-[8px] sm:text-[9px] uppercase tracking-widest font-mono font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        LIVE UPLINK
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-honey/10 text-honey text-[8px] sm:text-[9px] uppercase tracking-widest font-mono font-bold">
                        CACHED TELEMETRY
                      </span>
                    )}
                    {activeHive.lastSyncTimestamp && (
                      <span className="text-[8px] uppercase tracking-widest font-mono text-[#2A1B0A]/40 hidden md:inline">
                        {new Date(activeHive.lastSyncTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    )}
                  </div>
                </div>

                {/* Weight Big Hero Number */}
                <div className="my-2 sm:my-4">
                  <div className="text-[10px] uppercase tracking-[0.3em] font-mono text-honey font-bold mb-2">
                    Current Biometric Weight
                  </div>
                  <h2 className="font-display italic text-6xl sm:text-7xl md:text-8xl text-[#2A1B0A] tracking-tight">
                    {activeHive.weight.toFixed(1)}
                    <span className="text-2xl sm:text-3xl md:text-4xl not-italic font-sans text-honey font-light ml-2">kg</span>
                  </h2>
                  <p className="text-[11px] sm:text-xs text-[#2A1B0A]/60 font-body mt-2 max-w-sm mx-auto">
                    Continuous load-cell sensor telemetry tracking honey reserve accumulation.
                  </p>
                </div>

                {/* 4 Sensor Dials - High Contrast Luxury Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 pt-6 sm:pt-8 mt-6 sm:mt-8 border-t border-honey/15">
                  <div className="p-3 sm:p-4 bg-white/70 border border-honey/15 rounded-[2px] text-center space-y-1 hover:bg-white transition-all shadow-2xs">
                    <div className="text-[8px] sm:text-[9px] uppercase tracking-widest text-[#8C5E14] font-mono font-bold">Brood Temp</div>
                    <div className="text-base sm:text-lg font-mono font-bold text-[#2A1B0A]">{activeHive.temp}°C</div>
                    <div className="text-[9px] text-[#2A1B0A]/50 font-body">Optimal 34-36°C</div>
                  </div>

                  <div className="p-3 sm:p-4 bg-white/70 border border-honey/15 rounded-[2px] text-center space-y-1 hover:bg-white transition-all shadow-2xs">
                    <div className="text-[8px] sm:text-[9px] uppercase tracking-widest text-[#8C5E14] font-mono font-bold">Humidity</div>
                    <div className="text-base sm:text-lg font-mono font-bold text-[#2A1B0A]">{activeHive.humidity}%</div>
                    <div className="text-[9px] text-[#2A1B0A]/50 font-body">Internal Ambient</div>
                  </div>

                  <div className="p-3 sm:p-4 bg-white/70 border border-honey/15 rounded-[2px] text-center space-y-1 hover:bg-white transition-all shadow-2xs">
                    <div className="text-[8px] sm:text-[9px] uppercase tracking-widest text-[#8C5E14] font-mono font-bold">Activity</div>
                    <div className="text-base sm:text-lg font-mono font-bold text-[#2A1B0A]">{activeHive.activity}</div>
                    <div className="text-[9px] text-[#2A1B0A]/50 font-body">Acoustic Cadence</div>
                  </div>

                  <div className="p-3 sm:p-4 bg-white/70 border border-honey/15 rounded-[2px] text-center space-y-1 hover:bg-white transition-all shadow-2xs">
                    <div className="text-[8px] sm:text-[9px] uppercase tracking-widest text-emerald-800 font-mono font-bold">Colony Health</div>
                    <div className="text-base sm:text-lg font-mono font-bold text-emerald-700 uppercase tracking-wider">Optimal</div>
                    <div className="text-[9px] text-emerald-700/70 font-body">Queen Vigorous</div>
                  </div>
                </div>
              </div>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              {/* Growth Analysis */}
              <div className="p-5 sm:p-7 border border-honey/10 bg-hive-panel/40 rounded-[2px]">
                <div className="text-[10px] uppercase tracking-[0.2em] text-honey font-bold mb-4 sm:mb-6 flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span>Growth Analysis</span>
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]"></div>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
                    {activeHive.history && activeHive.history.length > 1 && (
                      <div className="flex flex-col items-end">
                        <span className="text-[8px] text-emerald-700 font-black tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded-full mb-0.5">
                          +{(activeHive.history[activeHive.history.length-1].weight - activeHive.history[0].weight).toFixed(1)}kg TREND
                        </span>
                        <span className="text-[7px] text-[#2A1B0A]/40 uppercase tracking-tighter">
                          Proj. Yield: ~{(activeHive.weight * 0.45).toFixed(1)}kg
                        </span>
                      </div>
                    )}
                    {activeHive.lastSyncTimestamp && (
                      <span className="text-[8px] text-honey font-bold tracking-widest font-mono">
                        SYNC: {new Date(activeHive.lastSyncTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    )}
                  </div>
                </div>

                <div className="h-56 sm:h-64 relative group">
                  <div className="absolute inset-0 pointer-events-none transition-opacity duration-1000 opacity-20 group-hover:opacity-40" style={{ backgroundImage: 'radial-gradient(#C8860A 0.5px, transparent 0.5px)', backgroundSize: '20px 20px' }}></div>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={activeHive.history} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                              <div className="bg-[#1A1208] border border-honey/40 p-3 sm:p-4 rounded-none shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                                <p className="text-[9px] uppercase tracking-[0.2em] text-honey/60 mb-1 font-mono font-bold">{label}</p>
                                <p className="text-xl sm:text-2xl font-display italic text-honey">{payload[0].value} <span className="text-xs sm:text-sm not-italic text-honey/60">kg</span></p>
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
                        strokeWidth={2.5}
                        fillOpacity={1} 
                        fill="url(#colorWeight)" 
                        animationDuration={1500}
                        dot={{ r: 2, fill: '#C8860A', strokeWidth: 0, fillOpacity: 0.7 }}
                        activeDot={{ r: 5, fill: '#C8860A', stroke: '#0C0804', strokeWidth: 2 }}
                      />
                      <XAxis 
                        dataKey="day" 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#8C5E14', fontSize: 9, fontWeight: 700 }}
                        dy={6}
                      />
                      <YAxis hide domain={['dataMin - 1', 'dataMax + 1']} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Master Beekeeper Field Notes */}
              <div className="p-5 sm:p-7 border border-honey/10 bg-hive-panel/40 rounded-[2px] flex flex-col justify-between">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-honey font-bold mb-4 sm:mb-6 flex items-center gap-2">
                    <StickyNote size={14} className="text-honey" />
                    <span>Master Beekeeper Field Journal</span>
                  </div>
                  <div className="space-y-3.5">
                    {activeHive.journal?.map((entry, i) => (
                      <div key={i} className="pl-3.5 border-l-2 border-honey/40 bg-honey/5 py-2.5 pr-2 rounded-r-xs">
                        <div className="text-[8px] sm:text-[9px] uppercase tracking-widest text-[#2A1B0A]/60 font-mono font-bold mb-1">
                          {entry.type} · {new Date(entry.date).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                        <p className="text-xs sm:text-sm text-[#2A1B0A] italic leading-relaxed font-serif">
                          "{entry.content}"
                        </p>
                      </div>
                    )) || <p className="text-xs text-[#2A1B0A]/40">No entries yet.</p>}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 mt-6 pt-4 border-t border-honey/10">
                  <button 
                    onClick={() => setShowCertModal(true)} 
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-honey text-[#0C0804] text-[10px] uppercase tracking-widest font-bold hover:bg-honey/90 transition-all rounded-[2px] shadow-xs active:scale-95 min-h-[44px]"
                  >
                     <Award size={14}/> View & Print Certificate
                  </button>
                  <button 
                    onClick={() => downloadCertificate(activeHive.id)} 
                    disabled={isGeneratingPDF}
                    className="flex items-center justify-center gap-1.5 px-4 py-3 border border-honey/30 text-[10px] uppercase tracking-widest font-bold text-honey hover:bg-honey/10 transition-all rounded-[2px] active:scale-95 min-h-[44px]"
                    title="Direct PDF Download"
                  >
                     <Download size={14}/> {isGeneratingPDF ? 'Generating...' : 'PDF'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar & Secondary Apiary Info (order-2 on mobile, order-1 on lg screens) */}
          <aside className="order-2 lg:order-1 lg:w-72 space-y-6 sm:space-y-8">
            <div className="p-5 sm:p-6 bg-hive-panel/40 border border-honey/10 rounded-[2px] backdrop-blur-md">
              <div className="text-[10px] uppercase tracking-[0.2em] text-honey font-bold mb-4">Your Apiaries</div>
              <div className="space-y-2.5">
                {hives.map(hive => (
                  <button 
                    key={hive.id} 
                    onClick={() => setSelectedHiveId(hive.id)} 
                    className={`w-full text-left p-3.5 rounded-[2px] border transition-all ${
                      selectedHiveId === hive.id 
                        ? 'bg-honey/15 border-honey/40 shadow-2xs' 
                        : 'border-honey/10 hover:border-honey/20 bg-white/40'
                    }`}
                  >
                    <div className="text-xs font-bold tracking-widest uppercase text-[#2A1B0A]">Hive #{hive.id}</div>
                    <div className="text-[10px] uppercase tracking-widest text-[#2A1B0A]/50 font-mono">{hive.location}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-5 sm:p-6 bg-hive-panel/40 border border-honey/10 rounded-[2px]">
              <div className="text-[10px] uppercase tracking-[0.2em] text-honey font-bold mb-4">Guardianship Status</div>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-xs uppercase tracking-widest text-[#2A1B0A] font-bold">
                  {profile?.tier === 'premium' ? <Crown className="text-honey w-4 h-4" /> : 
                   profile?.tier === 'starter' ? <Star className="text-honey w-4 h-4" /> : 
                   <Users className="text-[#2A1B0A]/40 w-4 h-4" />}
                  {profile?.tier === 'premium' ? 'Premium Guardian' : 
                   profile?.tier === 'starter' ? 'Starter Guardian' : 
                   'Free Observer'}
                </div>
                <div className="h-[1px] bg-honey/10"></div>
                <button onClick={() => setActiveTab('settings')} className="flex items-center gap-3 text-[10px] uppercase tracking-widest text-[#2A1B0A]/60 hover:text-honey transition-all group min-h-[44px]">
                  <Settings size={14} className="group-hover:rotate-90 transition-transform" />
                  <span>Account Settings</span>
                </button>
                <Link to="/harvest" className="flex items-center gap-3 text-[10px] uppercase tracking-widest text-[#2A1B0A]/60 hover:text-honey transition-all group min-h-[44px]">
                  <Package size={14} className="group-hover:scale-110 transition-transform" />
                  <span>Harvest Tracker</span>
                </Link>
              </div>
            </div>

            <div className="p-5 sm:p-6 bg-hive-panel/40 border border-honey/10 rounded-[2px] overflow-hidden group">
              <div className="text-[10px] uppercase tracking-[0.2em] text-honey font-bold mb-4">Master Beekeeper</div>
              <div className="relative h-40 mb-3 overflow-hidden rounded-xs group">
                 <img src="/beekeeper.png" alt="Petros Oikonomakos" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                 <div className="absolute inset-0 bg-gradient-to-t from-[#1A1208]/90 via-[#1A1208]/40 to-transparent"></div>
                 <div className="absolute bottom-3 left-3 text-white">
                    <div className="text-[10px] font-bold uppercase tracking-widest">Petros Oikonomakos</div>
                    <div className="text-[8px] text-white/70 uppercase tracking-wider italic font-serif">30+ Years Highland Apiculture</div>
                 </div>
              </div>
              <p className="text-[10px] text-[#2A1B0A]/70 italic leading-relaxed font-serif">
                "The bees know the Mani mountains better than any machine. I'm just here to listen."
              </p>
            </div>
            
            <div className="p-5 sm:p-6 bg-hive-panel/40 border border-honey/10 rounded-[2px] overflow-hidden group">
              <div className="text-[10px] uppercase tracking-[0.2em] text-honey font-bold mb-4 flex items-center justify-between">
                <span>Apiary Snapshot</span>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-[8px] uppercase tracking-widest font-mono text-emerald-700 font-bold">LIVE CAM</span>
                </div>
              </div>
              <div className="relative h-28 overflow-hidden rounded-xs mb-3">
                 <img src="/mani_landscape.png" alt="Mani Apiary view" className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700" />
                 <div className="absolute inset-0 bg-honey/10 mix-blend-overlay"></div>
              </div>
              <div className="text-[9px] text-[#2A1B0A]/60 uppercase tracking-widest font-mono font-bold flex items-center gap-1.5">
                 <MapPin size={10} className="text-honey" /> Lagia, Laconia · Elevation 840m
              </div>
            </div>
          </aside>
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
                  <div className="bg-honey/5 border border-honey/10 p-4 rounded-sm h-[70px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={[{w:40}, {w:45}, {w:42}, {w:50}, {w:55}]}>
                        <Area type="monotone" dataKey="w" stroke="#C8860A" fill="#C8860A" fillOpacity={0.25} />
                      </AreaChart>
                    </ResponsiveContainer>
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
                      <div className="space-y-3">
                        <label className="text-[9px] uppercase tracking-widest font-mono font-bold text-honey">Guardian Name</label>
                        <input 
                          type="text" 
                          defaultValue={profile.customLabel} 
                          onBlur={(e) => updateProfile({ customLabel: e.target.value })}
                          className="w-full bg-white/90 border border-honey/30 p-3.5 sm:p-4 text-base sm:text-sm text-[#2A1B0A] focus:outline-none focus:border-honey focus:ring-1 focus:ring-honey/40 transition-all rounded-[2px] shadow-2xs"
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <label className="text-[9px] uppercase tracking-widest font-mono font-bold text-honey">DOB (Season Start)</label>
                          <input 
                            type="date" 
                            defaultValue={profile.dob} 
                            onBlur={(e) => updateProfile({ dob: e.target.value })}
                            className="w-full bg-white/90 border border-honey/30 p-3.5 sm:p-4 text-base sm:text-sm text-[#2A1B0A] focus:outline-none focus:border-honey focus:ring-1 focus:ring-honey/40 transition-all rounded-[2px] shadow-2xs"
                          />
                        </div>
                        <div className="space-y-3">
                          <label className="text-[9px] uppercase tracking-widest font-mono font-bold text-honey">Apiary ID</label>
                          <div className="w-full bg-white/50 border border-honey/20 p-3.5 sm:p-4 text-base sm:text-sm text-[#2A1B0A]/70 font-mono rounded-[2px]">
                            {profile.subscribedHives?.[0] || 'ASSIGNING...'}
                          </div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <label className="text-[9px] uppercase tracking-widest font-mono font-bold text-honey">Shipping Destination</label>
                        <input 
                          type="text" 
                          defaultValue={profile.shippingAddress} 
                          placeholder="Street, City, Postcode, Country"
                          onBlur={(e) => updateProfile({ shippingAddress: e.target.value })}
                          className="w-full bg-white/90 border border-honey/30 p-3.5 sm:p-4 text-base sm:text-sm text-[#2A1B0A] focus:outline-none focus:border-honey focus:ring-1 focus:ring-honey/40 transition-all rounded-[2px] shadow-2xs placeholder:italic placeholder:text-[#2A1B0A]/40"
                        />
                      </div>
                    </div>
                  )}

                  {settingsStep === 'security' && (
                    <div className="space-y-6">
                       <div className="p-5 sm:p-6 bg-honey/5 border border-honey/15 rounded-[2px]">
                          <div className="flex items-center gap-3 mb-3">
                            <Key size={16} className="text-honey" />
                            <h4 className="text-xs sm:text-sm font-black text-[#2A1B0A] uppercase tracking-widest">Update Password</h4>
                          </div>
                          <p className="text-xs text-[#2A1B0A]/70 mb-5 leading-relaxed">
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
                              className="w-full bg-white/90 border border-honey/30 p-3.5 sm:p-4 text-base sm:text-sm text-[#2A1B0A] focus:outline-none focus:border-honey focus:ring-1 focus:ring-honey/40 rounded-[2px] shadow-2xs placeholder:text-[#2A1B0A]/40"
                            />
                            <button type="submit" className="w-full bg-honey text-[#0C0804] py-3.5 min-h-[44px] text-[10px] uppercase tracking-widest font-black hover:bg-honey/90 transition-all rounded-[2px] shadow-xs active:scale-95">Update Sequence</button>
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

      {/* ── LUXURY ADOPTION CERTIFICATE MODAL ── */}
      <CertificateModal
        isOpen={showCertModal}
        onClose={() => setShowCertModal(false)}
        guardianName={profile?.customLabel || profile?.fullName || user?.displayName || user?.email?.split('@')[0] || 'Valued Guardian'}
        tierName={profile?.tier === 'premium' ? 'Premium Patron' : 'Starter Guardianship'}
        hiveId={activeHive?.id || '04'}
      />

      <Footer />
    </div>
  );
}
