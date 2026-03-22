import React, { useState, useEffect } from 'react';
import { Plus, Menu, X, Scale, Camera, Thermometer, Package, FlaskConical, MapPin, ShoppingCart, Trash2, Star, ArrowRight, Bug, Milk, Leaf, Hexagon, Compass } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../lib/useAuth';
import CookieConsent from '../components/CookieConsent';
import BeeCursor from '../components/BeeCursor';

const Navbar = ({ cartItemsCount, setIsCartOpen }: any) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <nav className={`fixed top-0 w-full z-50 transition-colors duration-300 ${scrolled ? 'bg-hive-bg/90 backdrop-blur-md border-b border-honey/10' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="font-display text-2xl tracking-wide z-50 relative text-[#2A1B0A]">
            Hive<span className="text-honey">Share</span>
          </div>
          <div className="hidden md:flex items-center space-x-12 text-[10px] uppercase tracking-[0.2em] font-medium text-[#2A1B0A]/50">
            <a href="#how-it-works" className="hover:text-honey transition-colors duration-200">How it works</a>
            <a href="#features" className="hover:text-honey transition-colors duration-200">Features</a>
            <a href="#origins" className="hover:text-honey transition-colors duration-200">Origins</a>
            <a href="#pricing" className="hover:text-honey transition-colors duration-200">Pricing</a>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            {user ? (
              <Link to="/dashboard" className="text-[10px] uppercase tracking-[0.2em] font-medium text-[#2A1B0A]/50 hover:text-honey transition-colors duration-200">
                Apiary Journal
              </Link>
            ) : (
              <Link to="/login" className="text-[10px] uppercase tracking-[0.2em] font-medium text-[#2A1B0A]/50 hover:text-honey transition-colors duration-200">
                Log In
              </Link>
            )}
            <a 
              href="#pricing"
              className="inline-block bg-honey text-[#2A1B0A] px-6 py-3 text-xs uppercase tracking-wider font-medium hover:bg-honey/90 transition-colors active:scale-95 rounded-[2px]"
            >
              Get Started
            </a>
            <button 
              onClick={() => setIsCartOpen(true)} 
              className="relative text-[#2A1B0A]/80 hover:text-honey transition-colors"
            >
              <ShoppingCart size={20} />
              {cartItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-honey text-[#2A1B0A] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </button>
          </div>
          <button 
            className="md:hidden z-50 relative text-[#2A1B0A]/80"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      <div className={`fixed inset-0 bg-hive-bg z-40 flex flex-col items-center justify-center transition-transform duration-500 ease-in-out ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-honey/5 blur-[80px] rounded-full pointer-events-none"></div>
        <div className="flex flex-col items-center space-y-8 text-sm uppercase tracking-[0.2em] font-bold text-[#2A1B0A]/80">
          <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="hover:text-honey transition-colors duration-200">How it works</a>
          <a href="#features" onClick={() => setMobileMenuOpen(false)} className="hover:text-honey transition-colors duration-200">Features</a>
          <a href="#origins" onClick={() => setMobileMenuOpen(false)} className="hover:text-honey transition-colors duration-200">Origins</a>
          <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="hover:text-honey transition-colors duration-200">Pricing</a>
          {user ? (
            <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="hover:text-honey transition-colors duration-200">Apiary Journal</Link>
          ) : (
            <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="hover:text-honey transition-colors duration-200">Log In</Link>
          )}
          <a 
            href="#pricing"
            onClick={() => setMobileMenuOpen(false)}
            className="mt-8 inline-block bg-honey text-[#2A1B0A] px-8 py-4 text-xs uppercase tracking-wider font-medium hover:bg-honey/90 transition-colors rounded-[2px]"
          >
            Get Started
          </a>
          <button 
            onClick={() => { setMobileMenuOpen(false); setIsCartOpen(true); }}
            className="mt-4 flex items-center gap-2 text-honey font-medium uppercase tracking-widest text-sm"
          >
            <ShoppingCart size={20} /> Cart ({cartItemsCount})
          </button>
        </div>
      </div>
    </>
  );
};

const HexagonGrid = () => {
  const hexRadius = 32;
  const hexWidth = Math.sqrt(3) * hexRadius; // ~55.42
  const hexHeight = 2 * hexRadius; // 64
  const xOffset = hexWidth + 4; // 4px gap
  const yOffset = hexHeight * 0.75 + 3; // 3px gap

  const rows = 40;
  const cols = 40;

  const hexes = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = col * xOffset + (row % 2 === 1 ? xOffset / 2 : 0);
      const y = row * yOffset;
      hexes.push(
        <polygon
          key={`${row}-${col}`}
          points="27.71,0 55.42,16 55.42,48 27.71,64 0,48 0,16"
          transform={`translate(${x}, ${y})`}
          className="fill-honey/10 hover:fill-honey/40 transition-colors duration-1000 hover:duration-0 cursor-pointer"
        />
      );
    }
  }

  return (
    <svg className="absolute inset-0 w-full h-full opacity-40" xmlns="http://www.w3.org/2000/svg">
      {hexes}
    </svg>
  );
};

const Hero = () => {
  const [submitted, setSubmitted] = useState(false);

  return (
    <section className="min-h-screen flex flex-col md:flex-row pt-20 overflow-hidden relative">
      {/* Left Column */}
      <div className="w-full md:w-[45%] flex flex-col justify-center px-6 md:pl-24 lg:pl-32 py-12 md:py-20 text-[#2A1B0A]">
        <div className="w-12 h-[1px] bg-honey mb-6"></div>
        <div className="text-[10px] uppercase tracking-[0.2em] text-[#2A1B0A]/50 mb-6">
          Laconia, Greece · Est. 2026
        </div>
        
        <h1 className="font-display text-5xl md:text-6xl lg:text-[4.5rem] leading-[1.0] font-light mb-6 text-[#2A1B0A]/95">
          Own a piece of <span className="italic text-honey drop-shadow-[0_0_15px_rgba(200,134,10,0.3)]">Greece.</span><br />
          Watch it live.<br />
          Taste it home.
        </h1>
        
        <p className="text-[#2A1B0A]/60 text-sm md:text-base max-w-sm mb-8 leading-relaxed font-light">
          From €80/year (Approx. €7/month) — Free EU Shipping included. Your own named hive in Laconia, live vitality reports, and three harvests of raw Greek honey delivered to your door. Your first jar ships within two weeks. After that, your hive decides the rest.
        </p>
        
        <div className="mb-8 max-w-md flex flex-col gap-4">
          <div className="flex flex-wrap gap-3">
            <a 
              href="#pricing"
              className="bg-honey text-[#2A1B0A] px-6 md:px-8 py-4 text-[10px] md:text-xs uppercase tracking-wider font-bold hover:bg-honey/90 transition-colors rounded-[2px] inline-block shadow-[0_0_20px_rgba(200,134,10,0.2)] whitespace-nowrap"
            >
              Adopt Your Hive — From €80/yr
            </a>
            <a 
              href="#how-it-works"
              className="border border-honey/20 text-[#2A1B0A]/80 px-6 py-4 text-xs uppercase tracking-wider font-bold hover:bg-white/10 hover:border-honey/30 transition-colors rounded-[2px] inline-block"
            >
              How It Works
            </a>
          </div>
          <p className="text-xs text-[#2A1B0A]/40">
            Questions? <a href="mailto:info@oikonomakos.gr" className="text-honey hover:underline">info@oikonomakos.gr</a>
          </p>
        </div>
        
        <div className="flex items-center space-x-8 mt-6">
          <div>
            <div className="font-display text-3xl mb-1 text-[#2A1B0A]">600</div>
            <div className="text-[9px] uppercase tracking-widest text-[#2A1B0A]/40">Active hives</div>
          </div>
          <div className="w-[1px] h-10 bg-white/10"></div>
          <div>
            <div className="font-display text-3xl mb-1 text-[#2A1B0A]">6t</div>
            <div className="text-[9px] uppercase tracking-widest text-[#2A1B0A]/40">Annual yield</div>
          </div>
          <div className="w-[1px] h-10 bg-white/10"></div>
          <div>
            <div className="font-display text-3xl mb-1 text-[#2A1B0A]">3</div>
            <div className="text-[9px] uppercase tracking-widest text-[#2A1B0A]/40">Harvests/year</div>
          </div>
        </div>
      </div>
      
      {/* Right Column - Dusk Honey */}
      <div className="w-full md:w-[55%] bg-hive-dark relative overflow-hidden min-h-[60vh] md:min-h-screen flex items-center justify-center border-l border-honey/10">
        <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--color-honey)_0%,_transparent_70%)]"></div>
        
        {/* Hexagon Grid */}
        <HexagonGrid />

        {/* Vertical Connecting Line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-honey/20 to-transparent"></div>

        {/* TOP - Hive ID */}
        <div className="absolute top-6 left-6 md:top-12 md:left-12 border-l-2 border-honey/40 pl-3 md:pl-4 z-10">
          <div className="text-[8px] md:text-[9px] uppercase tracking-widest text-honey/60 mb-1">
            Your hive
          </div>
          <div className="font-display italic text-2xl md:text-3xl text-pale-honey">#247</div>
          <div className="text-[8px] md:text-[9px] text-white/20 mt-1">Lagia, Mani</div>
        </div>

        {/* Hive ID Counter Base Layer */}
        <div className="absolute inset-0 flex items-center justify-center z-1 pointer-events-none overflow-hidden">
          <span className="font-display text-[12rem] md:text-[20rem] leading-none text-honey/[0.03] select-none">
            247
          </span>
        </div>

        {/* MIDDLE - Temp */}
        <div className="absolute top-[45%] md:top-1/2 left-1/4 md:left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/40 backdrop-blur-md border border-honey/30 p-3 md:p-5 rounded-[2px] z-10 scale-[0.85] md:scale-100 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
          <div className="text-[8px] md:text-[9px] uppercase tracking-widest text-honey/80 mb-1 md:mb-2">Temp</div>
          <div className="font-display text-xl md:text-3xl text-pale-honey">34.5°C</div>
        </div>

        {/* RIGHT MIDDLE - Activity */}
        <div className="absolute top-[15%] right-4 md:top-1/3 md:right-12 bg-black/40 backdrop-blur-md border border-honey/30 p-3 md:p-4 rounded-[2px] z-10 scale-[0.85] md:scale-100 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
          <div className="text-[8px] md:text-[9px] uppercase tracking-widest text-honey/80 mb-1 md:mb-2">Activity</div>
          <div className="font-display text-lg md:text-2xl text-green-400">High</div>
        </div>
        
        {/* Live Data Card */}
        <div className="absolute bottom-4 right-4 md:bottom-12 md:right-12 bg-black/60 backdrop-blur-xl border border-honey/40 p-3 md:p-5 rounded-[2px] shadow-[0_20px_50px_rgba(0,0,0,0.8)] z-10 scale-[0.9] md:scale-100 origin-bottom-right">
          <div className="flex items-center space-x-2 mb-2 md:mb-3">
            <div className="w-1 md:w-2 h-1 md:h-2 rounded-full bg-green-500 animate-blink shadow-[0_0_10px_#22c55e]"></div>
            <div className="text-[8px] md:text-[10px] uppercase tracking-widest text-honey font-bold">Live · Hive #247</div>
          </div>
          <div className="font-display italic text-2xl md:text-4xl text-pale-honey mb-0.5">38.2 kg</div>
          <div className="text-[8px] md:text-[10px] text-white/40">Updated 4 min ago</div>
        </div>
      </div>
    </section>
  );
};

const HowItWorks = () => {
  const steps = [
    { num: '01', title: 'The Assignment', desc: 'You are paired with a specific, numbered hive in our Laconian apiary.' },
    { num: '02', title: 'The Connection', desc: 'Access your apiary journal. Watch the weight grow, see the weather, view apiary snapshots.' },
    { num: '03', title: 'The Harvest', desc: 'As the seasons change, our beekeepers extract honey exclusively from your hive.' },
    { num: '04', title: 'The Delivery', desc: 'Your Welcome Jar ships within 2 weeks. After that, seasonal harvests arrive as nature dictates.' }
  ];

  return (
    <section id="how-it-works" className="py-32 px-6 max-w-7xl mx-auto">
      <h2 className="font-display text-4xl font-light mb-16 text-[#2A1B0A] text-center">From mountain bloom to your kitchen table.</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-4 border border-honey/20 rounded-[2px] overflow-hidden">
        {steps.map((step, i) => (
          <div key={i} className="group relative p-8 border-b md:border-b-0 md:border-r border-honey/20 last:border-0 transition-colors duration-500 hover:bg-hive-panel min-h-[320px] flex flex-col overflow-hidden">
            <span className="absolute top-0 right-0 font-display text-[8rem] leading-none text-honey/5 select-none -translate-y-2 translate-x-2 group-hover:text-honey/10 transition-colors duration-500">
              {step.num}
            </span>
            <div className="mt-auto relative z-10">
              <div className={`h-[1px] bg-honey mb-6 transition-all duration-700 group-hover:w-full ${['w-8','w-16','w-24','w-full'][i]}`}></div>
              <h3 className="font-display text-[1.4rem] mb-4 text-[#2A1B0A]/90">{step.title}</h3>
              <p className="text-sm text-[#2A1B0A]/50 leading-relaxed font-light">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

const WhatYouGet = () => {
  const features = [
    { icon: <Scale size={18} strokeWidth={1} className="text-honey/60" />, title: 'Live weight tracking', desc: 'See exactly how much honey your bees are producing in real-time.' },
    { icon: <Camera size={18} strokeWidth={1} className="text-honey/60" />, title: 'Apiary snapshots', desc: 'A visual record of your colony, updated regularly by the beekeeper.' },
    { icon: <Thermometer size={18} strokeWidth={1} className="text-honey/60" />, title: 'Colony health data', desc: 'Monitor internal temperature and humidity to ensure your bees are thriving.' },
    { icon: <Package size={18} strokeWidth={1} className="text-honey/60" />, title: 'Immediate & Seasonal Delivery', desc: 'A Welcome Jar within 2 weeks, followed by Spring and Autumn harvests.' },
    { icon: <FlaskConical size={18} strokeWidth={1} className="text-honey/60" />, title: 'Lab-certified purity', desc: 'Every batch is tested by Eurofins for authenticity and zero pesticide residue.' },
    { icon: <MapPin size={18} strokeWidth={1} className="text-honey/60" />, title: 'Direct from the Beekeeper', desc: 'No middlemen, no blending. Straight from Petros Oikonomakos to you.' }
  ];

  return (
    <section id="features" className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 border border-honey/20 rounded-[2px] overflow-hidden">
          {features.map((f, i) => (
            <div key={i} className="p-10 border-b md:border-b-0 md:border-r md:[&:nth-child(n+4)]:border-b-0 [&:nth-child(1)]:border-b [&:nth-child(2)]:border-b [&:nth-child(3)]:border-b border-honey/20 hover:bg-hive-panel transition-colors duration-500">
              <div className="w-10 h-10 border border-honey/40 flex items-center justify-center mb-8 rounded-[2px] bg-honey/5">
                {f.icon}
              </div>
              <h3 className="font-display text-[1.3rem] mb-3 text-[#2A1B0A]/90">{f.title}</h3>
              <p className="text-xs text-[#2A1B0A]/50 leading-relaxed font-light">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const DashboardPreview = () => {
  return (
    <section className="py-32 px-6 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-20 overflow-hidden">
      <div className="w-full md:w-[40%]">
        <h2 className="font-display text-4xl font-light mb-10 text-[#2A1B0A]">Watch your honey being made.</h2>
        <ul className="space-y-6 text-sm text-[#2A1B0A]/50">
          <li className="flex gap-4"><span className="text-honey">—</span> Real-time weight metrics show exactly when the nectar flow begins.</li>
          <li className="flex gap-4"><span className="text-honey">—</span> Internal climate sensors ensure the colony is healthy and regulating temperature.</li>
          <li className="flex gap-4"><span className="text-honey">—</span> Regular snapshots from the apiary connect you to the landscape.</li>
          <li className="flex gap-4"><span className="text-honey">—</span> Harvest predictions tell you exactly when to expect your next delivery.</li>
        </ul>
      </div>
      
      <div className="w-full md:w-[60%] perspective-[1200px]">
        <div className="bg-hive-panel border border-honey/20 rounded-[2px] p-6 shadow-[0_0_30px_rgba(200,134,10,0.05)] transform rotate-y-[-5deg] transition-transform duration-700 hover:rotate-y-0">
          {/* Header */}
          <div className="flex justify-between items-center border-b border-honey/10 pb-4 mb-6">
            <div className="text-[#2A1B0A]/90 text-sm tracking-wide">Hive #247 — Lagia, Mani</div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-blink"></div>
              <div className="text-[9px] uppercase tracking-widest text-[#2A1B0A]/50">Live</div>
            </div>
          </div>
          
          {/* Metrics */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-white/5 p-4 border border-honey/10 rounded-[2px]">
              <div className="text-[10px] uppercase tracking-widest text-[#2A1B0A]/40 mb-2">Weight</div>
              <div className="font-display text-2xl text-honey">38.2 kg</div>
            </div>
            <div className="bg-white/5 p-4 border border-honey/10 rounded-[2px]">
              <div className="text-[10px] uppercase tracking-widest text-[#2A1B0A]/40 mb-2">Temp</div>
              <div className="font-display text-2xl text-honey">34.5°C</div>
            </div>
            <div className="bg-white/5 p-4 border border-honey/10 rounded-[2px]">
              <div className="text-[10px] uppercase tracking-widest text-[#2A1B0A]/40 mb-2">Activity</div>
              <div className="font-display text-2xl text-honey">High</div>
            </div>
          </div>
          
          {/* Chart Placeholder */}
          <div className="h-40 border-b border-l border-honey/10 flex items-end gap-2 px-2 pb-0 pt-4 mb-6 relative">
            <div className="absolute top-0 left-2 text-[9px] text-[#2A1B0A]/30">Weight (7 days)</div>
            {[40, 55, 45, 60, 75, 85, 100].map((h, i) => (
              <div key={i} className={`flex-1 bg-honey transition-all duration-1000 ${i === 6 ? 'opacity-100 shadow-[0_0_15px_rgba(200,134,10,0.4)]' : 'opacity-40'}`} style={{ height: `${h}%` }}></div>
            ))}
          </div>
          
          {/* Footer */}
          <div className="flex justify-between items-center pt-2">
            <div className="text-[11px] text-[#2A1B0A]/50">Next harvest est. 14 Jul</div>
            <div className="text-[10px] uppercase tracking-widest text-green-400/80 border border-green-400/20 px-2 py-1 bg-green-400/5 rounded-[2px]">Thyme flow active</div>
          </div>
        </div>
      </div>
    </section>
  );
};

const harvests = [
  { 
    color: '#CAA362', 
    name: 'Wildflower & Vanilla', 
    season: 'Feb–Mar', 
    location: 'Sparta / Kato Asteri, Laconia', 
    character: 'Vanilla & Wildflower honey',
    icon: 'Bug',
    yield: '800g'
  },
  { 
    color: '#CAA362', 
    name: 'Thyme & Sage', 
    season: 'Jun–Jul', 
    location: 'Lagia, Mani', 
    character: 'Thyme & Sage honey',
    icon: 'Milk',
    yield: '800g'
  },
  { 
    color: '#CAA362', 
    name: 'Fir honey', 
    season: 'Jul–Aug', 
    location: 'Karyes, Arcadia', 
    character: 'Fir honey',
    icon: 'Leaf',
    yield: '1.2kg'
  },
  { 
    color: '#CAA362', 
    name: 'Pine honey', 
    season: 'Aug–Oct', 
    location: 'Evia island', 
    character: 'Pine honey',
    icon: 'Hexagon',
    yield: '1.2kg'
  }
];

const OriginsMap = ({ activeIndex }: { activeIndex: number | null }) => {
  // Coordinates refined for the visual layout (0-500 scale)
  const Sparta = { x: 235, y: 460 };
  const Lagia = { x: 235, y: 410 };
  const Karyes = { x: 170, y: 320 };
  const Evia = { x: 380, y: 160 };

  const dots = [Sparta, Lagia, Karyes, Evia];

  return (
    <div className="w-full aspect-[4/3] border border-honey/10 bg-[#0F0A05] relative flex items-center justify-center overflow-hidden group rounded-lg shadow-2xl">
      {/* Stylized Map Outline Overlay (Greece) - Translucent Dark */}
      <div className="absolute inset-0 opacity-40 pointer-events-none">
         <svg viewBox="0 0 500 500" className="w-full h-full fill-[#1A1208]/80 stroke-honey/20 stroke-[1.5]">
            <path d="M120,330 Q140,300 180,310 T240,350 Q260,400 240,500 T160,510 T120,430 Z" />
            <path d="M250,330 Q280,310 320,320 T380,260 Q400,190 370,160 T320,190 T280,250" />
            <path d="M350,230 Q380,180 410,210 T390,260 Q360,280 340,250 Z" className="fill-honey/5 stroke-honey/40" />
         </svg>
      </div>

      <svg viewBox="0 0 500 500" className="absolute inset-0 w-full h-full">
        <defs>
          <radialGradient id="dot-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#C8860A" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#C8860A" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Unified Curved Route */}
        <path 
          d={`M${Sparta.x},${Sparta.y} Q200,430 ${Lagia.x},${Lagia.y} T${Karyes.x},${Karyes.y} Q250,230 ${Evia.x},${Evia.y} Q380,450 ${Sparta.x},${Sparta.y}`}
          className="stroke-honey/40 stroke-[1] fill-none stroke-dasharray-[4,6] stroke-dashoffset-animate"
        />

        {/* Dots with Glow */}
        {dots.map((dot, idx) => (
          <g key={idx}>
            {activeIndex === idx && (
              <circle cx={dot.x} cy={dot.y} r="25" fill="url(#dot-glow)" className="animate-pulse" />
            )}
            <circle 
              cx={dot.x} 
              cy={dot.y} 
              r={activeIndex === idx ? 6 : 4} 
              fill={activeIndex === idx ? '#E8A030' : '#C8860A'} 
              className="transition-all duration-500 shadow-2xl"
              style={{ filter: activeIndex === idx ? 'drop-shadow(0 0 8px rgba(232, 160, 48, 0.8))' : 'none' }}
            />
          </g>
        ))}
      </svg>

      {/* Region Label */}
      <div className="absolute bottom-6 right-6 text-right pointer-events-none">
         <div className="text-[10px] uppercase tracking-widest text-honey/40 font-bold mb-1">Nomadic Journey</div>
         <div className="text-xl font-display text-honey/80 italic">
           {activeIndex !== null ? harvests[activeIndex].location.split(',')[1] || 'Central Greece' : 'Laconia & Central Greece'}
         </div>
      </div>
    </div>
  );
};

const Origins = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  return (
    <section id="origins" className="py-32 bg-hive-bg">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          
          {/* Map on Left for Desktop */}
          <div className="order-1 lg:order-1 relative">
            <OriginsMap activeIndex={activeIndex} />
            <div className="absolute -top-4 -left-4 w-12 h-12 border-t-2 border-l-2 border-honey/20"></div>
          </div>

          {/* Sidebar on Right for Desktop */}
          <div className="order-2 lg:order-2">
            <div className="flex items-center justify-between mb-12 pb-6 border-b border-honey/10">
               <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#2A1B0A]/40">Seasonal Harvest Journey</span>
               <div className="w-6 h-6 text-honey animate-pulse">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m16 12-4-4-4 4M12 8v9"/></svg>
               </div>
            </div>

              {harvests.map((h, idx) => {
                const Icon = h.icon === 'Bug' ? Bug : h.icon === 'Milk' ? Milk : h.icon === 'Leaf' ? Leaf : Hexagon;
                return (
                  <button
                    key={idx}
                    onMouseEnter={() => setActiveIndex(idx)}
                    className={`w-full text-left p-6 rounded-xl transition-all duration-500 group border ${
                      activeIndex === idx 
                        ? 'bg-hive-dark border-honey/30 shadow-2xl relative' 
                        : 'border-transparent hover:bg-honey/5'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                       <h3 className={`text-xl transition-colors font-display ${activeIndex === idx ? 'text-honey' : 'text-[#2A1B0A]'}`}>
                         {h.location}
                       </h3>
                    </div>
                    
                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-3">
                          <Icon className={`w-4 h-4 transition-colors ${activeIndex === idx ? 'text-honey' : 'text-[#2A1B0A]/30'}`} />
                          <span className={`text-sm transition-colors ${activeIndex === idx ? 'text-honey/80 font-medium' : 'text-[#2A1B0A]/50'}`}>
                            {h.character}
                          </span>
                       </div>
                       <span className={`text-xs transition-colors ${activeIndex === idx ? 'text-honey/60 font-medium' : 'text-[#2A1B0A]/20'}`}>
                          {h.season}
                       </span>
                    </div>

                    {activeIndex === idx && (
                      <div className="absolute inset-0 border border-honey/40 rounded-xl pointer-events-none shadow-[inset_0_0_20px_rgba(200,134,10,0.1)]"></div>
                    )}
                  </button>
                );
              })}
          </div>
        </div>
      </div>
    </section>
  );
};

const Beekeeper = () => {
  return (
    <section className="py-32 px-6 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16 md:gap-24">
      <div className="w-full md:w-1/2 relative">
        <div className="absolute -inset-4 border border-honey/20 rounded-[2px] -z-10 translate-x-2 translate-y-2"></div>
        {/* TODO: Replace /beekeeper.jpg in the public folder with the actual photo of your father working the hives */}
        <img 
          src="/beekeeper.jpg" 
          alt="Petros Oikonomakos working the hives" 
          className="w-full aspect-[4/5] object-cover rounded-[2px] sepia-[0.2] contrast-125"
        />
      </div>
      <div className="w-full md:w-1/2 text-[#2A1B0A]">
        <div className="w-8 h-[1px] bg-honey mb-10"></div>
        <p className="font-display text-3xl md:text-4xl leading-[1.4] font-light text-[#2A1B0A]/90 italic mb-10">
          "I manage 600 hives. I know when the thyme will bloom in Mani two weeks before it happens. My grandfather followed the same blooms across these mountains."
        </p>
        <div className="text-[10px] uppercase tracking-widest text-[#2A1B0A]/40">
          Petros Oikonomakos · Master Beekeeper
        </div>
      </div>
    </section>
  );
};

const Pricing = ({ cartPlan, setCartPlan, setIsCartOpen, hasOliveOil, setHasOliveOil, setSelectedPlanForSignup }: any) => {
  return (
    <section id="pricing" className="py-32 px-6 max-w-7xl mx-auto text-[#2A1B0A]">
      <h2 className="font-display text-4xl font-light mb-20 text-center text-[#2A1B0A]">Membership Tiers</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-6 md:gap-0">
        {/* Starter */}
        <div className="border border-honey/20 p-8 md:p-12 text-[#2A1B0A] bg-hive-panel/60 backdrop-blur-sm rounded-[2px] md:border-r-0">
          <div className="text-[10px] uppercase tracking-widest text-[#2A1B0A]/60 mb-6 font-bold">Starter</div>
          <div className="mb-2 flex items-start">
              <div className="flex items-baseline gap-2 mb-2">
                <span className="font-display text-5xl text-honey">€80</span>
                <span className="text-honey uppercase tracking-widest text-[10px] font-bold">/year</span>
              </div>
              <div className="text-[#2A1B0A]/80 text-[10px] uppercase tracking-widest mb-6 font-bold">Approx. €7/month</div>
          </div>
          <div className="text-[10px] text-honey font-bold uppercase tracking-widest mb-10">Free EU Shipping included</div>
          
          <ul className="space-y-4 text-sm text-[#2A1B0A]/80 mb-12">
            <li className="flex gap-3"><span className="text-honey">—</span> Welcome jar (250g)</li>
            <li className="flex gap-3"><span className="text-honey">—</span> Apiary Journal access (basic metrics)</li>
            <li className="flex gap-3"><span className="text-honey">—</span> 3 seasonal harvests (~800g each, 2.5kg total)</li>
            <li className="flex gap-3"><span className="text-honey">—</span> Standard label</li>
          </ul>
          
          <button 
            onClick={() => setSelectedPlanForSignup({ id: 'starter', name: 'Starter Membership' })}
            className="block text-center w-full border border-honey/30 text-[#2A1B0A]/90 py-3 text-xs uppercase tracking-wider font-medium hover:bg-white/5 transition-colors rounded-[2px]"
          >
            Select Starter
          </button>
        </div>
        
        {/* Premium */}
        <div className="border-2 border-honey p-8 md:p-12 bg-hive-bg text-[#2A1B0A] relative z-10 shadow-[0_20px_50px_rgba(200,134,10,0.2)] md:-my-3 rounded-[2px]">
          <div className="absolute top-0 right-0 bg-honey text-hive-bg text-[9px] uppercase tracking-widest px-3 py-1 font-bold rounded-bl-sm">Recommended</div>
          <div className="text-[10px] uppercase tracking-widest text-honey mb-6 font-bold">Premium</div>
          <div className="mb-2 flex items-start">
              <div className="flex items-baseline gap-2 mb-2">
                <span className="font-display text-7xl text-honey">€200</span>
                <span className="text-honey uppercase tracking-widest text-xs font-bold">/year</span>
              </div>
              <div className="text-[#2A1B0A]/80 text-[11px] uppercase tracking-widest mb-8 font-bold">Approx. €17/month</div>
          </div>
          <div className="text-[10px] text-honey font-bold uppercase tracking-widest mb-10">Free EU Shipping included</div>
          
          <ul className="space-y-4 text-sm text-[#2A1B0A]/90 mb-12">
            <li className="flex gap-3"><span className="text-honey">—</span> Welcome jar (1kg) shipped immediately</li>
            <li className="flex gap-3"><span className="text-honey">—</span> Apiary Journal access (full live vitality reports)</li>
                <li className="flex gap-3"><span className="text-honey">—</span> 3 seasonal harvests (~1.3kg each, 5kg total)</li>
            <li className="flex gap-3"><span className="text-honey">—</span> Named jar (your name on the label)</li>
            <li className="flex gap-3"><span className="text-honey">—</span> Digital Certificate of Adoption</li>
            <li className="flex gap-3"><span className="text-honey">—</span> Handwritten note from Petros with each harvest</li>
            <li className="flex gap-3"><span className="text-honey">—</span> Priority shipping & exclusive variety access</li>
          </ul>
          
          <button 
            onClick={() => setSelectedPlanForSignup({ id: 'premium', name: 'Premium Membership' })}
            className="block text-center w-full bg-honey text-[#2A1B0A] py-4 text-xs uppercase tracking-wider font-bold hover:bg-honey/90 transition-colors rounded-[2px] shadow-[0_0_15px_rgba(200,134,10,0.2)]"
          >
            Select Premium
          </button>
        </div>
        
        {/* Corporate */}
        <div className="border border-honey/20 p-10 bg-hive-panel md:border-l-0 rounded-[2px]">
          <div className="text-[10px] uppercase tracking-widest text-[#2A1B0A]/40 mb-6">Corporate</div>
          <div className="mb-2 flex items-start text-[#2A1B0A]">
            <span className="font-display text-[3rem] leading-none">1,800</span>
            <span className="text-xl font-medium mt-1 ml-1">€</span>
          </div>
          <div className="text-xs text-[#2A1B0A]/40 mb-10">per year</div>
          
          <ul className="space-y-4 text-sm text-[#2A1B0A]/80 mb-12">
            <li className="flex gap-3"><span className="text-honey">—</span> Block of 15 dedicated hives</li>
            <li className="flex gap-3"><span className="text-honey">—</span> Custom branded apiary journal</li>
            <li className="flex gap-3"><span className="text-honey">—</span> Custom branded honey jars</li>
            <li className="flex gap-3"><span className="text-honey">—</span> Corporate gifting fulfillment</li>
          </ul>
          
          <button 
            onClick={() => document.getElementById('join')?.scrollIntoView({ behavior: 'smooth' })}
            className="w-full border border-honey/30 text-[#2A1B0A]/90 py-3 text-xs uppercase tracking-wider font-medium hover:bg-white/5 transition-colors rounded-[2px]"
          >
            Contact Us
          </button>
        </div>
      </div>

      {/* Olive Oil Add-on */}
      <div className="mt-16 border border-honey/20 p-8 bg-hive-panel rounded-[2px] max-w-3xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-32 h-32 bg-honey/10 blur-[50px] pointer-events-none"></div>
        <div className="relative z-10">
          <div className="text-[10px] uppercase tracking-widest text-honey font-bold mb-2">Annual Add-on</div>
          <h3 className="font-display text-2xl mb-2 text-[#2A1B0A]">+ Laconian Olive Oil · 500ml</h3>
          <p className="text-sm text-[#2A1B0A]/50 mb-1">Single-estate, cold-pressed, harvest 2026</p>
          <p className="text-sm text-[#2A1B0A]/50">Added to your autumn shipment</p>
        </div>
        <div className="text-center md:text-right flex flex-col items-center md:items-end relative z-10">
          <div className="font-display text-3xl text-[#2A1B0A] mb-2">18 €</div>
          <button 
            onClick={() => {
              setHasOliveOil(true);
              setIsCartOpen(true);
            }}
            disabled={hasOliveOil || !cartPlan}
            className="px-6 py-2 bg-honey text-[#2A1B0A] text-[10px] uppercase tracking-widest font-bold hover:bg-honey/90 transition-colors rounded-[2px] disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_10px_rgba(200,134,10,0.2)]"
          >
            {!cartPlan ? 'Select a plan first' : hasOliveOil ? 'Added to Cart' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </section>
  );
};

const AboutOurHoney = () => {
  return (
    <section className="py-32 px-6 border-t border-honey/10 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[radial-gradient(circle,_rgba(200,134,10,0.03)_0%,_transparent_70%)] pointer-events-none"></div>
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-16 relative z-10">
        <div className="w-full md:w-1/2">
          <img 
            src="/4jars.jpg" 
            alt="Four seasonal harvests of Greek honey" 
            className="w-full h-[500px] object-cover rounded-[2px] shadow-2xl border border-honey/20"
          />
        </div>
        <div className="w-full md:w-1/2 text-[#2A1B0A]">
          <div className="text-[10px] uppercase tracking-[0.2em] text-honey font-bold mb-4">Quality & Compliance</div>
          <h2 className="font-display text-4xl font-light mb-8 text-[#2A1B0A]/90">About Our Honey</h2>
          
          <div className="space-y-6 text-sm text-[#2A1B0A]/50 leading-relaxed">
            <p className="text-[#2A1B0A]/70">
              Every jar of honey you receive is produced exclusively by master beekeeper Petros Oikonomakos. Our hives travel across Greece's most pristine landscapes to capture distinct seasonal flavors: Wildflower from Sparta, Thyme from Lagia (Mani), Fir Vanilla from Arachova (Arcadia), and Pine from Evia.
            </p>
            
            <ul className="space-y-4">
              <li className="flex gap-4">
                <span className="text-honey mt-1">✓</span> 
                <span><strong>100% Pure & Unblended:</strong> Our honey is raw, unpasteurized, and never blended with imported honeys or syrups.</span>
              </li>
              <li className="flex gap-4">
                <span className="text-honey mt-1">✓</span> 
                <span><strong>EU Honey Directive Compliant:</strong> We strictly adhere to all European Union regulations regarding honey quality, ensuring no added sugar or water.</span>
              </li>
              <li className="flex gap-4">
                <span className="text-honey mt-1">✓</span> 
                <span><strong>Official Labeling:</strong> Each delivery comes with a fully compliant EU label indicating "Product of Greece", the exact weight, and our official producer details and VAT number for complete traceability.</span>
              </li>
            </ul>
            
            <p className="pt-4 border-t border-honey/10 italic text-[#2A1B0A]/40">
              When you adopt a hive, you're not just getting a digital experience; you're securing a seasonal supply of authentic, artisanal Greek honey delivered straight to your door.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

const FAQ = () => {
  const faqs = [
    { q: 'Do I actually own the hive?', a: 'You lease the production and data of a specific physical hive for the year. The bees and the physical woodenware remain the property and responsibility of our master beekeepers to ensure the colony\'s health.' },
    { q: 'What if my hive has a bad season?', a: 'Agriculture is unpredictable. If your specific hive underproduces due to weather or colony health, we supplement your delivery from our reserve hives in the same apiary to ensure you receive your minimum yield.' },
    { q: 'How is honey shipped to NL/DE?', a: 'Free EU shipping is included in every membership. We ship three times a year immediately following extraction. Jars are secured in custom protective packaging. Shipping typically takes 4-6 business days.' },
    { q: 'Can I cancel?', a: 'You can cancel your renewal at any time. Because the agricultural cycle requires upfront investment, annual memberships are non-refundable once the season begins in March.' },
    { q: 'When does HiveShare launch?', a: 'Our founding member hives are being assigned throughout 2026. Your first jar ships within 2 weeks of adoption.' }
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-32 px-6 max-w-[720px] mx-auto text-[#2A1B0A]">
      <h2 className="font-display text-3xl font-light mb-16 text-center text-[#2A1B0A]/90">Questions we get asked</h2>
      
      <div className="space-y-0">
        {faqs.map((faq, i) => (
          <div key={i} className="border-b border-honey/20">
            <button 
              className="w-full py-6 flex justify-between items-center text-left focus:outline-none group"
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
            >
              <span className="font-display text-[1.2rem] group-hover:text-honey transition-colors text-[#2A1B0A]/90">{faq.q}</span>
              <Plus className={`w-5 h-5 text-[#2A1B0A]/40 group-hover:text-honey transition-all duration-500 ${openIndex === i ? 'rotate-45' : ''}`} strokeWidth={1} />
            </button>
            <div 
              className={`overflow-hidden transition-all duration-500 ease-in-out ${openIndex === i ? 'max-h-40 opacity-100 pb-6' : 'max-h-0 opacity-0'}`}
            >
              <p className="text-sm text-[#2A1B0A]/50 leading-relaxed font-light">{faq.a}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

const FinalCTA = () => {
  const [submitted, setSubmitted] = useState(false);

  return (
    <section id="join" className="py-32 px-6 relative overflow-hidden text-[#2A1B0A] border-t border-honey/10">
      <div className="absolute inset-0 bg-[radial-gradient(circle,_rgba(200,134,10,0.08)_0%,_transparent_70%)]"></div>
      
      <div className="max-w-2xl mx-auto text-center relative z-10">
        <h2 className="font-display text-5xl font-light mb-6 text-[#2A1B0A]/95">Be first to own a Greek beehive</h2>
        <p className="text-[#2A1B0A]/60 text-base mb-12">
          Founding members get early access, locked pricing, and a named hive in our first batch of 50.
        </p>
        
        <div className="mb-16 max-w-md mx-auto text-left">
          {!submitted ? (
            <form 
              onSubmit={async (e) => { 
                e.preventDefault(); 
                const form = e.target as HTMLFormElement;
                const data = new FormData(form);
                try {
                  await fetch("https://formspree.io/f/xbdzbpyn", {
                    method: "POST",
                    body: data,
                    headers: { 'Accept': 'application/json' }
                  });
                } catch (err) {
                  console.error(err);
                }
                setSubmitted(true); 
              }} 
              className="flex flex-col gap-3"
            >
              <input 
                type="email" 
                name="email"
                placeholder="Your email" 
                required
                className="w-full bg-transparent border border-honey/30 px-4 py-3 text-sm focus:outline-none focus:border-honey transition-colors rounded-[2px] placeholder:text-[#2A1B0A]/30 text-[#2A1B0A]"
              />
              <textarea 
                name="message"
                placeholder="Your message (optional)" 
                rows={3}
                className="w-full bg-transparent border border-honey/30 px-4 py-3 text-sm focus:outline-none focus:border-honey transition-colors rounded-[2px] placeholder:text-[#2A1B0A]/30 text-[#2A1B0A] resize-none"
              ></textarea>
              <button type="submit" className="bg-honey text-[#2A1B0A] px-8 py-3 text-sm font-medium hover:bg-honey/90 transition-colors rounded-[2px] active:scale-95 w-full">
                Send Request
              </button>
            </form>
          ) : (
            <div className="py-3 text-sm italic text-pale-honey animate-fade-in text-center">
              Thank you. We have received your message.
            </div>
          )}
        </div>
        
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 text-[10px] uppercase tracking-widest text-[#2A1B0A]/40">
          <div>No payment required now</div>
          <div className="hidden md:block w-[1px] h-3 bg-honey/30"></div>
          <div>Founding member pricing locked</div>
          <div className="hidden md:block w-[1px] h-3 bg-honey/30"></div>
          <div>Cancel anytime</div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-[#050302] text-[#2A1B0A]/40 py-10 px-6 border-t border-honey/5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 md:gap-0 text-[10px] uppercase tracking-widest">
        <div className="font-display text-lg tracking-wide text-[#2A1B0A]/80 normal-case">
          Hive<span className="text-honey">Share</span>
        </div>
        
        <div className="flex items-center gap-6">
          <Link to="/privacy" className="hover:text-honey transition-colors">Privacy Policy</Link>
          <span className="text-[#2A1B0A]/10">·</span>
          <Link to="/terms" className="hover:text-honey transition-colors">Terms</Link>
          <span className="text-[#2A1B0A]/10">·</span>
          <a href="#" className="hover:text-honey transition-colors">Contact</a>
        </div>
        
        <div>© 2026 HiveShare · Sparta, Laconia, Greece</div>
      </div>
    </footer>
  );
};

export default function Landing() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartPlan, setCartPlan] = useState<{id: string, name: string, price: number, link: string} | null>(null);
  const [hasOliveOil, setHasOliveOil] = useState(false);
  const [selectedPlanForSignup, setSelectedPlanForSignup] = useState<{id: string, name: string} | null>(null);
  const { user } = useAuth();

  const cartItemsCount = (cartPlan ? 1 : 0) + (hasOliveOil ? 1 : 0);
  const cartTotal = (cartPlan?.price || 0) + (hasOliveOil ? 18 : 0);

  return (
    <div className="min-h-screen bg-hive-bg text-cream font-body selection:bg-honey selection:text-[#2A1B0A]">
      <Navbar cartItemsCount={cartItemsCount} setIsCartOpen={setIsCartOpen} />
      <Hero />
      <HowItWorks />
      <WhatYouGet />
      <DashboardPreview />
      <Origins />
      <Beekeeper />
      <Pricing 
        cartPlan={cartPlan} 
        setCartPlan={setCartPlan} 
        setIsCartOpen={setIsCartOpen} 
        hasOliveOil={hasOliveOil} 
        setHasOliveOil={setHasOliveOil} 
        setSelectedPlanForSignup={setSelectedPlanForSignup} 
      />
      <AboutOurHoney />
      <FAQ />
      <FinalCTA />
      <Footer />

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex justify-end" onClick={() => setIsCartOpen(false)}>
          <div className="w-full max-w-md bg-hive-panel border-l border-honey/20 h-full shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col animate-in slide-in-from-right duration-300" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-honey/10 flex justify-between items-center bg-hive-bg">
              <h2 className="font-display text-2xl text-[#2A1B0A]">Your Cart</h2>
              <button onClick={() => setIsCartOpen(false)} className="text-[#2A1B0A]/40 hover:text-[#2A1B0A] transition-colors"><X size={24} /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
              {cartItemsCount === 0 ? (
                <p className="text-[#2A1B0A]/40 text-center mt-10">Your cart is empty.</p>
              ) : (
                <>
                  {cartPlan && (
                    <div className="flex justify-between items-center border-b border-honey/10 pb-4">
                      <div>
                        <div className="font-medium text-[#2A1B0A]/90">{cartPlan.name}</div>
                        <div className="text-xs text-[#2A1B0A]/50">Annual Subscription</div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="font-display text-xl text-honey">{cartPlan.price} €</div>
                        <button onClick={() => setCartPlan(null)} className="text-[#2A1B0A]/30 hover:text-red-400 transition-colors"><X size={16} /></button>
                      </div>
                    </div>
                  )}
                  {hasOliveOil && (
                    <div className="flex justify-between items-center border-b border-honey/10 pb-4">
                      <div>
                        <div className="font-medium text-[#2A1B0A]/90">Laconian Olive Oil</div>
                        <div className="text-xs text-[#2A1B0A]/50">500ml · Annual Add-on</div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="font-display text-xl text-honey">18 €</div>
                        <button onClick={() => setHasOliveOil(false)} className="text-[#2A1B0A]/30 hover:text-red-400 transition-colors"><X size={16} /></button>
                      </div>
                    </div>
                  )}
                  {!hasOliveOil && cartPlan && (
                    <div className="mt-4 p-5 rounded-[2px] bg-hive-bg border border-honey/20 flex flex-col gap-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium text-[#2A1B0A]/90 mb-1">Add Laconian Olive Oil?</p>
                          <p className="text-xs text-[#2A1B0A]/50">500ml Single-estate, cold-pressed</p>
                        </div>
                        <span className="font-display text-xl text-honey">18 €</span>
                      </div>
                      <button 
                        onClick={() => setHasOliveOil(true)}
                        className="w-full py-2.5 mt-2 bg-transparent text-[#2A1B0A]/80 border border-honey/30 text-[10px] uppercase tracking-widest font-bold hover:bg-honey hover:text-[#2A1B0A] hover:border-honey transition-colors rounded-[2px]"
                      >
                        Add to Cart
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
            
            {cartItemsCount > 0 && (
              <div className="p-6 border-t border-honey/10 bg-hive-bg">
                <div className="flex justify-between items-center mb-6 text-[#2A1B0A] text-[#2A1B0A]">
                  <span className="text-sm uppercase tracking-widest text-[#2A1B0A]/50">Total</span>
                  <span className="font-display text-3xl text-pale-honey">{cartTotal} €</span>
                </div>
                {cartPlan ? (
                  user ? (
                    <a 
                      href={cartPlan.link}
                      className="block text-center w-full bg-honey text-[#2A1B0A] py-4 text-xs uppercase tracking-wider font-bold hover:bg-honey/90 transition-colors rounded-[2px] shadow-[0_0_15px_rgba(200,134,10,0.2)]"
                    >
                      Proceed to Checkout
                    </a>
                  ) : (
                    <Link 
                      to="/login"
                      className="block text-center w-full bg-honey text-[#2A1B0A] py-4 text-xs uppercase tracking-wider font-bold hover:bg-honey/90 transition-colors rounded-[2px] shadow-[0_0_15px_rgba(200,134,10,0.2)]"
                    >
                      Login to Checkout
                    </Link>
                  )
                ) : (
                  <button 
                    disabled
                    className="block text-center w-full bg-honey/20 text-[#2A1B0A]/50 py-4 text-xs uppercase tracking-wider font-bold cursor-not-allowed rounded-[2px]"
                  >
                    Select a plan to checkout
                  </button>
                )}
                <p className="text-[10px] text-[#2A1B0A]/40 text-center mt-4">
                  {hasOliveOil && cartPlan ? "Note: Olive oil (€18) will be invoiced separately via email after your membership is confirmed." : ""}
                  {!cartPlan && hasOliveOil ? "Please select a membership plan to checkout with add-ons." : ""}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
      <CookieConsent />

      {/* Plan Confirmation (Premium Upgrade) */}
      {selectedPlanForSignup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-xl"
            onClick={() => setSelectedPlanForSignup(null)}
          ></div>
          <div className="bg-hive-panel/95 border border-honey/30 p-10 rounded-[2px] w-full max-w-lg relative z-10 shadow-[0_0_50px_rgba(200,134,10,0.15)] animate-in fade-in zoom-in duration-500 overflow-hidden">
            {/* Subtle Golden Glow */}
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-honey/10 blur-[80px] rounded-full pointer-events-none"></div>
            
            <button 
              onClick={() => setSelectedPlanForSignup(null)}
              className="absolute top-6 right-6 text-[#2A1B0A]/20 hover:text-honey transition-colors"
            >
              <X size={20} />
            </button>

            <div className="relative z-10">
              <div className="text-[10px] uppercase tracking-[0.3em] text-honey font-bold mb-4">
                {user ? 'Welcome Back' : selectedPlanForSignup.id === 'premium' ? 'The Royal Treatment' : 'Your Gateway to Sparta'}
              </div>
              <h3 className="font-display text-4xl text-[#2A1B0A] mb-6 leading-tight">
                {user ? 'Proceed with' : 'Adopting your'} <br/>
                <span className="italic text-pale-honey">{selectedPlanForSignup.name}</span>
              </h3>
              
              <div className="space-y-6 mb-10">
                <p className="text-[#2A1B0A]/60 leading-relaxed text-sm font-light">
                  {user 
                    ? `You're logged in as ${user.email}. Excellent choice to continue your support of Laconian bees.`
                    : selectedPlanForSignup.id === 'premium'
                      ? "You've chosen the gold standard. From live vitality reports to your name on the jars, your bees are ready to welcome their new sponsor."
                      : "A beautiful start to your connection with Greek nature. You'll soon be tracking your bees and receiving the purest honey from the Mani mountains."
                  }
                </p>
                
                {!user && (
                  <div className="grid grid-cols-1 gap-4 pt-4">
                    <div className="flex items-center gap-4 text-[#2A1B0A]/40 group">
                      <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-[10px] group-hover:border-honey/50 group-hover:text-honey transition-colors">01</div>
                      <div className="text-xs uppercase tracking-widest">Create secure account</div>
                    </div>
                    <div className="flex items-center gap-4 text-[#2A1B0A]/20">
                      <div className="w-8 h-8 rounded-full border border-white/5 flex items-center justify-center text-[10px]">02</div>
                      <div className="text-xs uppercase tracking-widest">{selectedPlanForSignup.id === 'premium' ? 'Secure your premium slot' : 'Complete secure checkout'}</div>
                    </div>
                    <div className="flex items-center gap-4 text-[#2A1B0A]/20">
                      <div className="w-8 h-8 rounded-full border border-white/5 flex items-center justify-center text-[10px]">03</div>
                      <div className="text-xs uppercase tracking-widest">{selectedPlanForSignup.id === 'premium' ? 'Finalize hive naming' : 'Assign your hive'}</div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex flex-col gap-4">
                <Link
                  to="/membership"
                  state={{ from: '/', tier: selectedPlanForSignup.id }}
                  className="w-full bg-honey text-[#2A1B0A] py-5 text-xs uppercase tracking-[0.2em] font-bold hover:bg-honey/90 transition-all rounded-[2px] flex items-center justify-center gap-3 group shadow-xl"
                >
                  {user ? 'Continue to Checkout' : 'Continue to Step 01'}
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <button 
                  onClick={() => setSelectedPlanForSignup(null)}
                  className="text-[10px] uppercase tracking-widest text-[#2A1B0A]/30 hover:text-[#2A1B0A] transition-colors py-2"
                >
                  Change selection
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
