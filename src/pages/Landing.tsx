import React, { useState, useEffect } from 'react';
import { Plus, Menu, X, Scale, Camera, Thermometer, Package, FlaskConical, MapPin, ShoppingCart, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../lib/useAuth';

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
      <nav className={`fixed top-0 w-full z-50 transition-colors duration-300 ${scrolled ? 'bg-cream/90 backdrop-blur-md border-b border-border-amber' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="font-display text-2xl tracking-wide z-50 relative">
            Hive<span className="text-honey">Share</span>
          </div>
          <div className="hidden md:flex items-center space-x-12 text-[10px] uppercase tracking-[0.2em] font-medium text-text-muted">
            <a href="#how-it-works" className="hover:text-honey transition-colors duration-200">How it works</a>
            <a href="#features" className="hover:text-honey transition-colors duration-200">Features</a>
            <a href="#origins" className="hover:text-honey transition-colors duration-200">Origins</a>
            <a href="#pricing" className="hover:text-honey transition-colors duration-200">Pricing</a>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            {user ? (
              <Link to="/dashboard" className="text-[10px] uppercase tracking-[0.2em] font-medium text-text-muted hover:text-honey transition-colors duration-200">
                Dashboard
              </Link>
            ) : (
              <Link to="/login" className="text-[10px] uppercase tracking-[0.2em] font-medium text-text-muted hover:text-honey transition-colors duration-200">
                Log In
              </Link>
            )}
            <a 
              href="#pricing"
              className="inline-block bg-honey text-white px-6 py-3 text-xs uppercase tracking-wider font-medium hover:bg-honey/90 transition-colors active:scale-95"
            >
              Get Started
            </a>
            <button 
              onClick={() => setIsCartOpen(true)} 
              className="relative text-text-dark hover:text-honey transition-colors"
            >
              <ShoppingCart size={20} />
              {cartItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-honey text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </button>
          </div>
          <button 
            className="md:hidden z-50 relative text-text-dark"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      <div className={`fixed inset-0 bg-cream z-40 flex flex-col items-center justify-center transition-transform duration-500 ease-in-out ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col items-center space-y-8 text-sm uppercase tracking-[0.2em] font-medium text-text-dark">
          <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="hover:text-honey transition-colors duration-200">How it works</a>
          <a href="#features" onClick={() => setMobileMenuOpen(false)} className="hover:text-honey transition-colors duration-200">Features</a>
          <a href="#origins" onClick={() => setMobileMenuOpen(false)} className="hover:text-honey transition-colors duration-200">Origins</a>
          <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="hover:text-honey transition-colors duration-200">Pricing</a>
          {user ? (
            <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="hover:text-honey transition-colors duration-200">Dashboard</Link>
          ) : (
            <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="hover:text-honey transition-colors duration-200">Log In</Link>
          )}
          <a 
            href="#pricing"
            onClick={() => setMobileMenuOpen(false)}
            className="mt-8 inline-block bg-honey text-white px-8 py-4 text-xs uppercase tracking-wider font-medium hover:bg-honey/90 transition-colors"
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
    <section className="min-h-screen flex flex-col md:flex-row pt-20">
      {/* Left Column */}
      <div className="w-full md:w-[45%] flex flex-col justify-center px-6 md:pl-24 lg:pl-32 py-12 md:py-20">
        <div className="w-12 h-[1px] bg-honey mb-6"></div>
        <div className="text-[10px] uppercase tracking-[0.2em] text-text-muted mb-6">
          Laconia, Greece · Est. 2026
        </div>
        
        <h1 className="font-display text-5xl md:text-6xl lg:text-[4.5rem] leading-[1.0] font-light mb-6">
          Own a piece of <span className="italic text-honey">Greece.</span><br />
          Watch it live.<br />
          Taste it home.
        </h1>
        
        <p className="text-text-muted text-base max-w-sm mb-8 leading-relaxed font-light">
          €80/year — less than €7 a month. Your own named hive in Laconia, live data, and three harvests of raw Greek honey delivered to your door. Your first jar ships within two weeks. After that, your hive decides the rest.
        </p>
        
        <div className="mb-8 max-w-md">
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
                className="w-full bg-transparent border border-border-amber px-4 py-3 text-sm focus:outline-none focus:border-honey transition-colors rounded-[2px] placeholder:text-text-muted/50"
              />
              <textarea 
                name="message"
                placeholder="Your message (optional)" 
                rows={3}
                className="w-full bg-transparent border border-border-amber px-4 py-3 text-sm focus:outline-none focus:border-honey transition-colors rounded-[2px] placeholder:text-text-muted/50 resize-none"
              ></textarea>
              <button type="submit" className="bg-honey text-white px-8 py-3 text-sm font-medium hover:bg-honey/90 transition-colors rounded-[2px] w-fit">
                Send Request
              </button>
            </form>
          ) : (
            <div className="py-3 text-sm italic text-text-muted animate-fade-in">
              Message received. We'll be in touch.
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-8 mt-6">
          <div>
            <div className="font-display text-3xl mb-1">600</div>
            <div className="text-[9px] uppercase tracking-widest text-text-muted">Active hives</div>
          </div>
          <div className="w-[1px] h-10 bg-border-amber"></div>
          <div>
            <div className="font-display text-3xl mb-1">8–9t</div>
            <div className="text-[9px] uppercase tracking-widest text-text-muted">Annual yield</div>
          </div>
          <div className="w-[1px] h-10 bg-border-amber"></div>
          <div>
            <div className="font-display text-3xl mb-1">3</div>
            <div className="text-[9px] uppercase tracking-widest text-text-muted">Harvests/year</div>
          </div>
        </div>
      </div>
      
      {/* Right Column */}
      <div className="w-full md:w-[55%] bg-hive-dark relative overflow-hidden min-h-[60vh] md:min-h-screen flex items-center justify-center border-l border-honey/10">
        <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--color-honey)_0%,_transparent_70%)]"></div>
        
        {/* Hexagon Grid */}
        <HexagonGrid />

        {/* Vertical Connecting Line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-honey/20 to-transparent"></div>

        {/* TOP - Hive ID */}
        <div className="absolute top-6 left-6 md:top-12 md:left-12 border-l-2 border-honey/40 pl-3 md:pl-4 z-10">
          <div className="text-[8px] md:text-[9px] uppercase tracking-widest text-white/30 mb-1">
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
        <div className="absolute top-[45%] md:top-1/2 left-1/3 md:left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#1A1208]/70 backdrop-blur-md border border-honey/20 p-3 md:p-5 rounded-[2px] z-10">
          <div className="text-[8px] md:text-[9px] uppercase tracking-widest text-white/40 mb-1 md:mb-2">Temp</div>
          <div className="font-display text-2xl md:text-3xl text-pale-honey">34.5°C</div>
        </div>

        {/* RIGHT MIDDLE - Activity */}
        <div className="absolute top-1/4 right-6 md:top-1/3 md:right-12 bg-[#1A1208]/70 backdrop-blur-md border border-honey/20 p-3 md:p-4 rounded-[2px] z-10">
          <div className="text-[8px] md:text-[9px] uppercase tracking-widest text-white/40 mb-1 md:mb-2">Activity</div>
          <div className="font-display text-xl md:text-2xl text-green-400">High</div>
        </div>
        
        {/* Live Data Card */}
        <div className="absolute bottom-6 right-6 md:bottom-12 md:right-12 bg-[#1A1208]/60 backdrop-blur-md border border-honey/30 p-4 md:p-5 rounded-[2px] shadow-2xl z-10">
          <div className="flex items-center space-x-2 mb-2 md:mb-3">
            <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-green-500 animate-blink"></div>
            <div className="text-[9px] md:text-[10px] uppercase tracking-widest text-white/70 font-medium">Live · Hive #247</div>
          </div>
          <div className="font-display italic text-3xl md:text-4xl text-pale-honey mb-1">38.2 kg</div>
          <div className="text-[9px] md:text-[10px] text-white/40">Updated 4 min ago</div>
        </div>
      </div>
    </section>
  );
};

const HowItWorks = () => {
  const steps = [
    { num: '01', title: 'The Assignment', desc: 'You are paired with a specific, numbered hive in our Laconian apiary.' },
    { num: '02', title: 'The Connection', desc: 'Access your dashboard. Watch the weight grow, see the weather, view apiary snapshots.' },
    { num: '03', title: 'The Harvest', desc: 'As the seasons change, our beekeepers extract honey exclusively from your hive.' },
    { num: '04', title: 'The Delivery', desc: 'Your Welcome Jar ships within 2 weeks. After that, seasonal harvests arrive as nature dictates.' }
  ];

  return (
    <section id="how-it-works" className="py-32 px-6 max-w-7xl mx-auto">
      <h2 className="font-display text-3xl font-light mb-16 text-text-dark">From mountain bloom to your kitchen table.</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-4 border border-border-amber">
        {steps.map((step, i) => (
          <div key={i} className="group relative p-8 border-b md:border-b-0 md:border-r border-border-amber last:border-0 transition-colors duration-500 hover:bg-white min-h-[320px] flex flex-col overflow-hidden">
            <span className="absolute top-0 right-0 font-display text-[8rem] leading-none text-honey/5 select-none -translate-y-2 translate-x-2 group-hover:text-honey/10 transition-colors duration-500">
              {step.num}
            </span>
            <div className="mt-auto relative z-10">
              <div className={`h-[1px] bg-honey mb-6 transition-all duration-700 group-hover:w-full ${['w-8','w-16','w-24','w-full'][i]}`}></div>
              <h3 className="font-display text-[1.4rem] mb-4">{step.title}</h3>
              <p className="text-sm text-text-muted leading-relaxed">{step.desc}</p>
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
    <section id="features" className="bg-hive-dark text-cream py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 border border-honey/20">
          {features.map((f, i) => (
            <div key={i} className="p-10 border-b md:border-b-0 md:border-r md:[&:nth-child(n+4)]:border-b-0 [&:nth-child(1)]:border-b [&:nth-child(2)]:border-b [&:nth-child(3)]:border-b border-honey/20 hover:bg-honey/5 transition-colors duration-500">
              <div className="w-10 h-10 border border-honey/40 flex items-center justify-center mb-8 rounded-[2px]">
                {f.icon}
              </div>
              <h3 className="font-display text-[1.3rem] mb-3 text-cream">{f.title}</h3>
              <p className="text-xs text-white/50 leading-relaxed font-light">{f.desc}</p>
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
        <h2 className="font-display text-4xl font-light mb-10">Watch your honey being made.</h2>
        <ul className="space-y-6 text-sm text-text-muted">
          <li className="flex gap-4"><span className="text-honey">—</span> Real-time weight metrics show exactly when the nectar flow begins.</li>
          <li className="flex gap-4"><span className="text-honey">—</span> Internal climate sensors ensure the colony is healthy and regulating temperature.</li>
          <li className="flex gap-4"><span className="text-honey">—</span> Regular snapshots from the apiary connect you to the landscape.</li>
          <li className="flex gap-4"><span className="text-honey">—</span> Harvest predictions tell you exactly when to expect your next delivery.</li>
        </ul>
      </div>
      
      <div className="w-full md:w-[60%] perspective-[1200px]">
        <div className="bg-[#110C05] border border-honey/20 rounded-[2px] p-6 shadow-2xl transform rotate-y-[-5deg] transition-transform duration-700 hover:rotate-y-0">
          {/* Header */}
          <div className="flex justify-between items-center border-b border-honey/10 pb-4 mb-6">
            <div className="text-cream text-sm tracking-wide">Hive #247 — Lagia, Mani</div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-blink"></div>
              <div className="text-[9px] uppercase tracking-widest text-white/50">Live</div>
            </div>
          </div>
          
          {/* Metrics */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-white/5 p-4 border border-honey/10 rounded-[2px]">
              <div className="text-[10px] uppercase tracking-widest text-white/40 mb-2">Weight</div>
              <div className="font-display text-2xl text-honey">38.2 kg</div>
            </div>
            <div className="bg-white/5 p-4 border border-honey/10 rounded-[2px]">
              <div className="text-[10px] uppercase tracking-widest text-white/40 mb-2">Temp</div>
              <div className="font-display text-2xl text-honey">34.5°C</div>
            </div>
            <div className="bg-white/5 p-4 border border-honey/10 rounded-[2px]">
              <div className="text-[10px] uppercase tracking-widest text-white/40 mb-2">Activity</div>
              <div className="font-display text-2xl text-honey">High</div>
            </div>
          </div>
          
          {/* Chart Placeholder */}
          <div className="h-40 border-b border-l border-honey/10 flex items-end gap-2 px-2 pb-0 pt-4 mb-6 relative">
            <div className="absolute top-0 left-2 text-[9px] text-white/30">Weight (7 days)</div>
            {[40, 55, 45, 60, 75, 85, 100].map((h, i) => (
              <div key={i} className={`flex-1 bg-honey transition-all duration-1000 ${i === 6 ? 'opacity-100 shadow-[0_0_15px_rgba(200,134,10,0.4)]' : 'opacity-40'}`} style={{ height: `${h}%` }}></div>
            ))}
          </div>
          
          {/* Footer */}
          <div className="flex justify-between items-center pt-2">
            <div className="text-[11px] text-white/50">Next harvest est. 14 Jul</div>
            <div className="text-[10px] uppercase tracking-widest text-green-400/80 border border-green-400/20 px-2 py-1 bg-green-400/5 rounded-[2px]">Thyme flow active</div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Origins = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const harvests = [
    { 
      color: '#E8A030', 
      name: 'Welcome Jar', 
      season: 'Immediate Delivery', 
      location: 'Within 2 weeks', 
      character: 'Our latest available harvest',
      yield: '250g',
      desc: 'A taste of the apiary to welcome you to the hive.' 
    },
    { 
      color: '#F5C842', 
      name: 'Spring Bloom', 
      season: 'Spring Harvest', 
      location: 'April–May', 
      character: 'Light amber, aromatic',
      yield: '500g',
      desc: 'Thyme, vanilla orchid, sage' 
    },
    { 
      color: '#5C3D1A', 
      name: 'Pine & Earth', 
      season: 'Autumn Harvest', 
      location: 'September–October', 
      character: 'Dark, mineral, rich',
      yield: '500g',
      desc: 'Pine, chestnut' 
    }
  ];

  return (
    <section id="origins" className="bg-hive-dark text-cream py-32 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-20">
        <div className="w-full md:w-[55%]">
          <h2 className="font-display text-4xl font-light mb-6">Immediate welcome. A nomadic journey.</h2>
          <p className="text-sm text-white/60 mb-16 max-w-md leading-relaxed">
            Your first jar ships within two weeks to welcome you to the hive. After that, our hives travel across Greece's most pristine landscapes. What arrives next depends on what bloomed this year — and when.
          </p>
          
          <div className="flex flex-col border-t border-honey/20">
            {harvests.map((h, i) => (
              <div key={i} className="border-b border-honey/20 group">
                <button 
                  className="w-full py-6 flex items-center justify-between text-left focus:outline-none"
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                >
                  <div className="flex items-center gap-6">
                    <div className="w-3 h-3 rounded-full transition-transform duration-300 group-hover:scale-125" style={{ backgroundColor: h.color }}></div>
                    <div>
                      <div className="font-display text-2xl mb-1 group-hover:text-pale-honey transition-colors">{h.name}</div>
                      <div className="text-[10px] uppercase tracking-widest text-white/40">
                        {h.season} <span className="text-honey/50 mx-1">·</span> {h.location}
                      </div>
                    </div>
                  </div>
                  <div className="font-display italic text-lg text-honey/80 text-right">{h.character}</div>
                </button>
                
                <div 
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${openIndex === i ? 'max-h-40 opacity-100 pb-6' : 'max-h-0 opacity-0'}`}
                >
                  <div className="pl-12 pr-4">
                    <p className="text-sm text-white/50 leading-relaxed font-light italic">
                      → {h.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="w-full md:w-[45%] flex items-center justify-center">
          <div className="w-full aspect-square border border-honey/20 bg-[#110C05] relative flex items-center justify-center overflow-hidden group rounded-[2px]">
            {/* TODO: Replace /map-texture.jpg in the public folder with your own map texture or image */}
            <img src="/map-texture.jpg" alt="Map texture" className="absolute inset-0 w-full h-full object-cover opacity-40" />
            {/* Topographic lines simulation */}
            <div className="absolute inset-0 border border-honey/5 rounded-full scale-[0.3] group-hover:scale-[0.32] transition-transform duration-1000"></div>
            <div className="absolute inset-0 border border-honey/10 rounded-full scale-[0.6] group-hover:scale-[0.63] transition-transform duration-1000"></div>
            <div className="absolute inset-0 border border-honey/15 rounded-full scale-[0.9] group-hover:scale-[0.95] transition-transform duration-1000"></div>
            
            <div className="z-10 text-center bg-[#110C05]/80 backdrop-blur-sm p-6 border border-honey/20 rounded-[2px]">
              <div className="text-[10px] uppercase tracking-widest text-white/40 mb-2">36°57'14.0"N 22°21'08.0"E</div>
              <div className="font-display text-xl text-pale-honey">Lagia, Mani</div>
            </div>
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
        <div className="absolute -inset-4 border border-border-amber rounded-[2px] -z-10 translate-x-2 translate-y-2"></div>
        {/* TODO: Replace /beekeeper.jpg in the public folder with the actual photo of your father working the hives */}
        <img 
          src="/beekeeper.jpg" 
          alt="Petros Oikonomakos working the hives" 
          className="w-full aspect-[4/5] object-cover rounded-[2px] sepia-[0.2] contrast-125"
        />
      </div>
      <div className="w-full md:w-1/2">
        <div className="w-8 h-[1px] bg-honey mb-10"></div>
        <p className="font-display text-3xl md:text-4xl leading-[1.4] font-light text-text-dark italic mb-10">
          "I manage 600 hives. I know when the thyme will bloom in Mani two weeks before it happens. My grandfather followed the same blooms across these mountains."
        </p>
        <div className="text-[10px] uppercase tracking-widest text-text-muted">
          Petros Oikonomakos · Master Beekeeper
        </div>
      </div>
    </section>
  );
};

const Pricing = ({ cartPlan, setCartPlan, setIsCartOpen, hasOliveOil, setHasOliveOil }: any) => {
  return (
    <section id="pricing" className="py-32 px-6 max-w-7xl mx-auto">
      <h2 className="font-display text-4xl font-light mb-20 text-center">Membership Tiers</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-6 md:gap-0">
        {/* Starter */}
        <div className="border border-border-amber p-10 bg-white md:border-r-0 rounded-[2px]">
          <div className="text-[10px] uppercase tracking-widest text-text-muted mb-6">Starter</div>
          <div className="mb-2 flex items-start">
            <span className="font-display text-[3rem] leading-none">80</span>
            <span className="text-xl font-medium mt-1 ml-1">€</span>
          </div>
          <div className="text-xs text-text-muted mb-10">per year <span className="text-honey font-medium ml-1">· less than €7/mo</span></div>
          
          <ul className="space-y-4 text-sm text-text-dark mb-12">
            <li className="flex gap-3"><span className="text-honey">—</span> Welcome jar (250g)</li>
            <li className="flex gap-3"><span className="text-honey">—</span> Dashboard access (basic metrics)</li>
            <li className="flex gap-3"><span className="text-honey">—</span> 2 seasonal harvests (~500g each)</li>
            <li className="flex gap-3"><span className="text-honey">—</span> Standard label</li>
          </ul>
          
          <button 
            onClick={() => {
              setCartPlan({ id: 'starter', name: 'Starter Membership', price: 80, link: 'https://buy.stripe.com/test_7sYdR9gYn4ZB9Io8aAdwc00' });
              setIsCartOpen(true);
            }}
            className="block text-center w-full border border-border-amber py-3 text-xs uppercase tracking-wider font-medium hover:bg-cream transition-colors rounded-[2px]"
          >
            Select Starter
          </button>
        </div>
        
        {/* Premium */}
        <div className="border-2 border-honey p-12 bg-hive-dark text-cream relative z-10 shadow-2xl md:-my-3 rounded-[2px]">
          <div className="text-[10px] uppercase tracking-widest text-white/50 mb-6">Premium</div>
          <div className="mb-2 text-pale-honey flex items-start">
            <span className="font-display text-[3rem] leading-none">160</span>
            <span className="text-xl font-medium mt-1 ml-1">€</span>
          </div>
          <div className="text-xs text-white/50 mb-10">per year <span className="text-honey font-medium ml-1">· less than €14/mo</span></div>
          
          <ul className="space-y-4 text-sm text-white/90 mb-12">
            <li className="flex gap-3"><span className="text-honey">—</span> Welcome jar (500g) shipped immediately</li>
            <li className="flex gap-3"><span className="text-honey">—</span> Dashboard access (full metrics + acoustic data)</li>
            <li className="flex gap-3"><span className="text-honey">—</span> 3 seasonal harvests (~700g each)</li>
            <li className="flex gap-3"><span className="text-honey">—</span> Named jar (your name on the label)</li>
            <li className="flex gap-3"><span className="text-honey">—</span> Digital Certificate of Adoption</li>
            <li className="flex gap-3"><span className="text-honey">—</span> Handwritten note from Petros with each harvest</li>
            <li className="flex gap-3"><span className="text-honey">—</span> Priority shipping & exclusive variety access</li>
          </ul>
          
          <button 
            onClick={() => {
              setCartPlan({ id: 'premium', name: 'Premium Membership', price: 160, link: 'https://buy.stripe.com/test_9B6dR9azZdw79Io0I8dwc01' });
              setIsCartOpen(true);
            }}
            className="block text-center w-full bg-honey text-white py-4 text-xs uppercase tracking-wider font-medium hover:bg-honey/90 transition-colors rounded-[2px]"
          >
            Select Premium
          </button>
        </div>
        
        {/* Corporate */}
        <div className="border border-border-amber p-10 bg-white md:border-l-0 rounded-[2px]">
          <div className="text-[10px] uppercase tracking-widest text-text-muted mb-6">Corporate</div>
          <div className="mb-2 flex items-start">
            <span className="font-display text-[3rem] leading-none">1,800</span>
            <span className="text-xl font-medium mt-1 ml-1">€</span>
          </div>
          <div className="text-xs text-text-muted mb-10">per year</div>
          
          <ul className="space-y-4 text-sm text-text-dark mb-12">
            <li className="flex gap-3"><span className="text-honey">—</span> Block of 15 dedicated hives</li>
            <li className="flex gap-3"><span className="text-honey">—</span> Custom branded dashboard</li>
            <li className="flex gap-3"><span className="text-honey">—</span> Custom branded honey jars</li>
            <li className="flex gap-3"><span className="text-honey">—</span> Corporate gifting fulfillment</li>
          </ul>
          
          <button 
            onClick={() => document.getElementById('join')?.scrollIntoView({ behavior: 'smooth' })}
            className="w-full border border-border-amber py-3 text-xs uppercase tracking-wider font-medium hover:bg-cream transition-colors rounded-[2px]"
          >
            Contact Us
          </button>
        </div>
      </div>

      {/* Olive Oil Add-on */}
      <div className="mt-16 border border-border-amber p-8 bg-cream rounded-[2px] max-w-3xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 shadow-sm">
        <div>
          <div className="text-[10px] uppercase tracking-widest text-honey font-bold mb-2">Annual Add-on</div>
          <h3 className="font-display text-2xl mb-2 text-text-dark">+ Laconian Olive Oil · 500ml</h3>
          <p className="text-sm text-text-muted mb-1">Single-estate, cold-pressed, harvest 2026</p>
          <p className="text-sm text-text-muted">Added to your autumn shipment</p>
        </div>
        <div className="text-center md:text-right flex flex-col items-center md:items-end">
          <div className="font-display text-3xl text-text-dark mb-2">18 €</div>
          <button 
            onClick={() => {
              setHasOliveOil(true);
              setIsCartOpen(true);
            }}
            disabled={hasOliveOil || !cartPlan}
            className="px-6 py-2 bg-honey text-white text-[10px] uppercase tracking-widest font-medium hover:bg-honey/90 transition-colors rounded-[2px] disabled:opacity-50 disabled:cursor-not-allowed"
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
    <section className="bg-cream py-32 px-6 border-t border-border-amber">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-16">
        <div className="w-full md:w-1/2">
          <img 
            src="/4jars.jpg" 
            alt="Four seasonal harvests of Greek honey" 
            className="w-full h-[500px] object-cover rounded-[2px] shadow-xl border border-border-amber/30"
          />
        </div>
        <div className="w-full md:w-1/2">
          <div className="text-[10px] uppercase tracking-[0.2em] text-honey mb-4">Quality & Compliance</div>
          <h2 className="font-display text-4xl font-light mb-8 text-text-dark">About Our Honey</h2>
          
          <div className="space-y-6 text-sm text-text-muted leading-relaxed">
            <p>
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
            
            <p className="pt-4 border-t border-border-amber/50 italic">
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
    { q: 'How is honey shipped to NL/DE?', a: 'We ship three times a year immediately following extraction. Jars are secured in custom protective packaging. Shipping within the EU typically takes 4-6 business days.' },
    { q: 'Can I cancel?', a: 'You can cancel your renewal at any time. Because the agricultural cycle requires upfront investment, annual memberships are non-refundable once the season begins in March.' },
    { q: 'When does HiveShare launch?', a: 'Our first 50 founding member hives will be assigned in Spring 2027. The waitlist is currently open.' }
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-32 px-6 max-w-[720px] mx-auto">
      <h2 className="font-display text-3xl font-light mb-16 text-center">Questions we get asked</h2>
      
      <div className="space-y-0">
        {faqs.map((faq, i) => (
          <div key={i} className="border-b border-border-amber">
            <button 
              className="w-full py-6 flex justify-between items-center text-left focus:outline-none group"
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
            >
              <span className="font-display text-[1.2rem] group-hover:text-honey transition-colors">{faq.q}</span>
              <Plus className={`w-5 h-5 text-text-muted transition-transform duration-500 ${openIndex === i ? 'rotate-45' : ''}`} strokeWidth={1} />
            </button>
            <div 
              className={`overflow-hidden transition-all duration-500 ease-in-out ${openIndex === i ? 'max-h-40 opacity-100 pb-6' : 'max-h-0 opacity-0'}`}
            >
              <p className="text-sm text-text-muted leading-relaxed">{faq.a}</p>
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
    <section id="join" className="bg-hive-dark text-cream py-32 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle,_rgba(200,134,10,0.08)_0%,_transparent_70%)]"></div>
      
      <div className="max-w-2xl mx-auto text-center relative z-10">
        <h2 className="font-display text-5xl font-light mb-6">Be first to own a Greek beehive</h2>
        <p className="text-white/60 text-base mb-12">
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
                className="w-full bg-transparent border border-honey/30 px-4 py-3 text-sm focus:outline-none focus:border-honey transition-colors rounded-[2px] placeholder:text-white/30 text-white"
              />
              <textarea 
                name="message"
                placeholder="Your message (optional)" 
                rows={3}
                className="w-full bg-transparent border border-honey/30 px-4 py-3 text-sm focus:outline-none focus:border-honey transition-colors rounded-[2px] placeholder:text-white/30 text-white resize-none"
              ></textarea>
              <button type="submit" className="bg-honey text-white px-8 py-3 text-sm font-medium hover:bg-honey/90 transition-colors rounded-[2px] active:scale-95 w-full">
                Send Request
              </button>
            </form>
          ) : (
            <div className="py-3 text-sm italic text-pale-honey animate-fade-in text-center">
              Thank you. We have received your message.
            </div>
          )}
        </div>
        
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 text-[10px] uppercase tracking-widest text-white/40">
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
    <footer className="bg-[#0A0703] text-white/40 py-10 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 md:gap-0 text-[10px] uppercase tracking-widest">
        <div className="font-display text-lg tracking-wide text-cream normal-case">
          Hive<span className="text-honey">Share</span>
        </div>
        
        <div className="flex items-center gap-6">
          <Link to="/privacy" className="hover:text-honey transition-colors">Privacy Policy</Link>
          <span className="text-white/10">·</span>
          <Link to="/terms" className="hover:text-honey transition-colors">Terms</Link>
          <span className="text-white/10">·</span>
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
  const { user } = useAuth();

  const cartItemsCount = (cartPlan ? 1 : 0) + (hasOliveOil ? 1 : 0);
  const cartTotal = (cartPlan?.price || 0) + (hasOliveOil ? 18 : 0);

  return (
    <div className="min-h-screen bg-cream text-text-dark font-body selection:bg-honey selection:text-white">
      <Navbar cartItemsCount={cartItemsCount} setIsCartOpen={setIsCartOpen} />
      <Hero />
      <HowItWorks />
      <WhatYouGet />
      <DashboardPreview />
      <Origins />
      <Beekeeper />
      <Pricing cartPlan={cartPlan} setCartPlan={setCartPlan} setIsCartOpen={setIsCartOpen} hasOliveOil={hasOliveOil} setHasOliveOil={setHasOliveOil} />
      <AboutOurHoney />
      <FAQ />
      <FinalCTA />
      <Footer />

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex justify-end" onClick={() => setIsCartOpen(false)}>
          <div className="w-full max-w-md bg-cream h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-border-amber flex justify-between items-center bg-white">
              <h2 className="font-display text-2xl">Your Cart</h2>
              <button onClick={() => setIsCartOpen(false)} className="text-text-muted hover:text-text-dark transition-colors"><X size={24} /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
              {cartItemsCount === 0 ? (
                <p className="text-text-muted text-center mt-10">Your cart is empty.</p>
              ) : (
                <>
                  {cartPlan && (
                    <div className="flex justify-between items-center border-b border-border-amber/50 pb-4">
                      <div>
                        <div className="font-medium text-text-dark">{cartPlan.name}</div>
                        <div className="text-xs text-text-muted">Annual Subscription</div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="font-display text-xl">{cartPlan.price} €</div>
                        <button onClick={() => setCartPlan(null)} className="text-text-muted hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                      </div>
                    </div>
                  )}
                  {hasOliveOil && (
                    <div className="flex justify-between items-center border-b border-border-amber/50 pb-4">
                      <div>
                        <div className="font-medium text-text-dark">Laconian Olive Oil</div>
                        <div className="text-xs text-text-muted">500ml · Annual Add-on</div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="font-display text-xl">18 €</div>
                        <button onClick={() => setHasOliveOil(false)} className="text-text-muted hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                      </div>
                    </div>
                  )}
                  {!hasOliveOil && cartPlan && (
                    <div className="mt-4 p-5 rounded-[2px] bg-cream border border-border-amber flex flex-col gap-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium text-text-dark mb-1">Add Laconian Olive Oil?</p>
                          <p className="text-xs text-text-muted">500ml Single-estate, cold-pressed</p>
                        </div>
                        <span className="font-display text-xl text-honey">18 €</span>
                      </div>
                      <button 
                        onClick={() => setHasOliveOil(true)}
                        className="w-full py-2.5 mt-2 bg-white text-text-dark border border-border-amber text-[10px] uppercase tracking-widest font-medium hover:bg-honey hover:text-white hover:border-honey transition-colors rounded-[2px]"
                      >
                        Add to Cart
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
            
            {cartItemsCount > 0 && (
              <div className="p-6 border-t border-border-amber bg-white">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-sm uppercase tracking-widest text-text-muted">Total</span>
                  <span className="font-display text-3xl">{cartTotal} €</span>
                </div>
                {cartPlan ? (
                  user ? (
                    <a 
                      href={cartPlan.link}
                      className="block text-center w-full bg-honey text-white py-4 text-xs uppercase tracking-wider font-medium hover:bg-honey/90 transition-colors rounded-[2px]"
                    >
                      Proceed to Checkout
                    </a>
                  ) : (
                    <Link 
                      to="/login"
                      className="block text-center w-full bg-honey text-white py-4 text-xs uppercase tracking-wider font-medium hover:bg-honey/90 transition-colors rounded-[2px]"
                    >
                      Login to Checkout
                    </Link>
                  )
                ) : (
                  <button 
                    disabled
                    className="block text-center w-full bg-honey/50 text-white py-4 text-xs uppercase tracking-wider font-medium cursor-not-allowed rounded-[2px]"
                  >
                    Select a plan to checkout
                  </button>
                )}
                <p className="text-[10px] text-text-muted text-center mt-3">
                  {hasOliveOil && cartPlan ? "Note: Add-ons will be processed together with your subscription." : ""}
                  {!cartPlan && hasOliveOil ? "Please select a membership plan to checkout with add-ons." : ""}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
