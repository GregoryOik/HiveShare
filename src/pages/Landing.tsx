import React, { useState, useEffect } from 'react';
import { Plus, Menu, X, Scale, Camera, Thermometer, Package, FlaskConical, MapPin, ShoppingCart, Trash2, Star, ArrowRight, Bug, Milk, Leaf, Hexagon, Compass, Sparkles, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../lib/useAuth';
import { useLanguage } from '../lib/useLanguage';
import NomadicFloweringCalendar from '../components/NomadicFloweringCalendar';
import HoneyConciergeModal from '../components/HoneyConciergeModal';
import CookieConsent from '../components/CookieConsent';

const Navbar = ({ cartItemsCount, setIsCartOpen, onOpenConcierge }: any) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, profile } = useAuth();
  const { language, toggleLanguage, t } = useLanguage();
  const isEl = language === 'el';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-hive-bg/95 backdrop-blur-md border-b border-honey/15 shadow-xs' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          <Link to="/" className="font-display text-2xl sm:text-3xl tracking-wide z-50 relative text-[#2A1B0A]">
            Hive<span className="text-honey">Share</span>
          </Link>
          
          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-7 lg:space-x-9 text-[10px] uppercase tracking-[0.2em] font-bold text-[#2A1B0A]/80">
            <a href="#how-it-works" className="hover:text-honey transition-colors duration-200">{isEl ? 'Πώς λειτουργεί' : 'How it works'}</a>
            <a href="#origins" className="hover:text-honey transition-colors duration-200">{isEl ? 'Προέλευση' : 'Origins'}</a>
            <a href="#nomadic-calendar" className="hover:text-honey transition-colors duration-200 text-honey">{isEl ? 'Νομαδικός Κύκλος' : 'Nomadic Route'}</a>
            <a href="#pricing" className="hover:text-honey transition-colors duration-200">{isEl ? 'Τιμές' : 'Pricing'}</a>
            <button
              onClick={onOpenConcierge}
              className="hover:text-honey text-honey/90 transition-colors duration-200 flex items-center gap-1 uppercase"
            >
              <Sparkles size={12} /> {isEl ? 'Τεστ Γεύσης' : 'Quiz'}
            </button>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4 lg:space-x-5">
            {/* Bilingual Switcher */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full border border-honey/30 bg-honey/10 text-honey hover:bg-honey hover:text-[#0C0804] text-[9px] font-mono font-bold uppercase tracking-widest transition-all"
              title={isEl ? 'Switch to English' : 'Αλλαγή σε Ελληνικά'}
            >
              <Globe size={11} /> {isEl ? 'EN' : 'ΕΛ'}
            </button>

            {profile?.role === 'admin' && (
              <Link to="/admin" className="text-[10px] uppercase tracking-[0.2em] font-black text-honey hover:text-[#2A1B0A] hover:bg-honey px-3 py-1.5 rounded-full border border-honey/30 transition-all">
                {isEl ? 'Διαχείριση' : 'Admin'}
              </Link>
            )}
            {user ? (
              <Link to="/dashboard" className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#2A1B0A]/80 hover:text-honey transition-colors duration-200">
                {isEl ? 'Ημερολόγιο' : 'Journal'}
              </Link>
            ) : (
              <Link to="/login" className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#2A1B0A]/80 hover:text-honey transition-colors duration-200">
                {isEl ? 'Σύνδεση' : 'Log In'}
              </Link>
            )}
            <Link 
              to="/buy-honey"
              className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#2A1B0A]/80 hover:text-honey transition-colors duration-200"
            >
              {isEl ? 'Αγορά Μελιού' : 'Buy Honey'}
            </Link>
            <a 
              href="#pricing"
              className="inline-block bg-honey text-[#2A1B0A] px-5 py-2.5 text-xs uppercase tracking-wider font-bold hover:bg-honey/90 transition-colors active:scale-95 rounded-[2px]"
            >
              {isEl ? 'Υιοθεσία' : 'Get Started'}
            </a>
            <button 
              onClick={() => setIsCartOpen(true)} 
              className="relative text-[#2A1B0A]/80 hover:text-honey transition-colors p-1"
              aria-label="Cart"
            >
              <ShoppingCart size={19} />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-honey text-[#2A1B0A] text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Header Bar Right Side */}
          <div className="flex md:hidden items-center gap-2.5 z-50">
            {/* Quick Language Toggle on Mobile */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full border border-honey/30 bg-honey/10 text-honey text-[10px] font-mono font-bold tracking-widest uppercase"
              aria-label="Toggle language"
            >
              <Globe size={11} /> {isEl ? 'EN' : 'ΕΛ'}
            </button>

            {/* Quick Cart on Mobile */}
            <button 
              onClick={() => setIsCartOpen(true)} 
              className="relative text-[#2A1B0A] p-2 hover:text-honey transition-colors"
              aria-label="Shopping Cart"
            >
              <ShoppingCart size={20} />
              {cartItemsCount > 0 && (
                <span className="absolute top-0.5 right-0.5 bg-honey text-[#2A1B0A] text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </button>

            {/* Hamburger Button */}
            <button 
              className="p-2 text-[#2A1B0A] hover:text-honey transition-colors focus:outline-none"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      <div className={`fixed inset-0 bg-hive-bg/98 backdrop-blur-3xl z-40 flex flex-col justify-between transition-all duration-300 ease-in-out md:hidden ${mobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>
        <div className="absolute inset-0 bg-gradient-to-b from-honey/5 via-transparent to-honey/10 pointer-events-none"></div>
        
        {/* Drawer Content */}
        <div className="h-[100dvh] overflow-y-auto px-6 pt-24 pb-8 flex flex-col justify-between relative z-10 space-y-8">
          <div className="space-y-5 text-left">
            <div className="text-[9px] uppercase tracking-[0.3em] text-[#9E6000] font-bold mb-3 border-b border-honey/15 pb-2">
              {isEl ? 'Πλοήγηση' : 'Navigation'}
            </div>

            <a 
              href="#how-it-works" 
              onClick={() => setMobileMenuOpen(false)} 
              className="block font-display text-2xl text-[#2A1B0A] hover:text-honey transition-colors py-1"
            >
              {isEl ? '01 · Πώς λειτουργεί' : '01 · How It Works'}
            </a>
            <a 
              href="#origins" 
              onClick={() => setMobileMenuOpen(false)} 
              className="block font-display text-2xl text-[#2A1B0A] hover:text-honey transition-colors py-1"
            >
              {isEl ? '02 · Προέλευση & Σοδειές' : '02 · Signature Terroirs'}
            </a>
            <a 
              href="#nomadic-calendar" 
              onClick={() => setMobileMenuOpen(false)} 
              className="block font-display text-2xl text-honey hover:text-[#2A1B0A] transition-colors py-1"
            >
              {isEl ? '03 · Νομαδικός Κύκλος' : '03 · Nomadic Route'}
            </a>
            <a 
              href="#pricing" 
              onClick={() => setMobileMenuOpen(false)} 
              className="block font-display text-2xl text-[#2A1B0A] hover:text-honey transition-colors py-1"
            >
              {isEl ? '04 · Επίπεδα Αναδοχής' : '04 · Guardianship Tiers'}
            </a>
            <Link 
              to="/buy-honey" 
              onClick={() => setMobileMenuOpen(false)} 
              className="block font-display text-2xl text-honey hover:text-[#2A1B0A] transition-colors py-1"
            >
              {isEl ? '05 · Συλλογή Βάζων' : '05 · Single Batch Jars'}
            </Link>

            <button
              onClick={() => { setMobileMenuOpen(false); onOpenConcierge(); }}
              className="w-full text-left font-display text-2xl text-[#2A1B0A] hover:text-honey transition-colors py-1 flex items-center justify-between border-t border-honey/10 pt-4"
            >
              <span>{isEl ? 'Τεστ Γεύσης (Sommelier)' : 'Palate Concierge Quiz'}</span>
              <Sparkles size={18} className="text-honey" />
            </button>
          </div>

          {/* Drawer Actions */}
          <div className="space-y-3 pt-6 border-t border-honey/20">
            <a 
              href="#pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full bg-honey text-[#2A1B0A] py-3.5 text-center font-bold text-xs uppercase tracking-widest rounded-[2px] shadow-md active:scale-98"
            >
              {isEl ? 'Υιοθεσία Κυψέλης — Από 140€/έτος' : 'Adopt a Hive — From €140/yr'}
            </a>

            <div className="grid grid-cols-2 gap-3">
              {user ? (
                <Link 
                  to="/dashboard" 
                  onClick={() => setMobileMenuOpen(false)} 
                  className="text-[#2A1B0A] text-center font-bold text-xs uppercase tracking-wider py-3 border border-honey/30 rounded-[2px] bg-white/40"
                >
                  {isEl ? 'Ημερολόγιο' : 'Journal'}
                </Link>
              ) : (
                <Link 
                  to="/login" 
                  onClick={() => setMobileMenuOpen(false)} 
                  className="text-[#2A1B0A] text-center font-bold text-xs uppercase tracking-wider py-3 border border-honey/30 rounded-[2px] bg-white/40"
                >
                  {isEl ? 'Σύνδεση' : 'Log In'}
                </Link>
              )}

              {profile?.role === 'admin' ? (
                <Link 
                  to="/admin" 
                  onClick={() => setMobileMenuOpen(false)} 
                  className="text-honey text-center font-bold text-xs uppercase tracking-wider py-3 border border-honey/40 rounded-[2px] bg-honey/10"
                >
                  Admin
                </Link>
              ) : (
                <Link 
                  to="/buy-honey" 
                  onClick={() => setMobileMenuOpen(false)} 
                  className="text-[#2A1B0A] text-center font-bold text-xs uppercase tracking-wider py-3 border border-honey/30 rounded-[2px] bg-white/40"
                >
                  {isEl ? 'Αγορά' : 'Shop'}
                </Link>
              )}
            </div>

            <div className="text-center pt-2 text-[9px] uppercase tracking-widest text-[#2A1B0A]/50 font-mono">
              Laconia · Mani · Mount Mainalo · Evia
            </div>
          </div>
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

  const rows = 35;
  const cols = 35;

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
    <svg className="absolute inset-0 w-full h-full opacity-35" xmlns="http://www.w3.org/2000/svg">
      {hexes}
    </svg>
  );
};

const Hero = ({ onOpenConcierge }: any) => {
  const { language } = useLanguage();
  const isEl = language === 'el';

  return (
    <section className="min-h-screen flex flex-col md:flex-row pt-16 sm:pt-20 overflow-hidden relative">
      {/* Left Column */}
      <div className="w-full md:w-[48%] lg:w-[45%] flex flex-col justify-center px-4 sm:px-8 md:pl-16 lg:pl-28 py-8 sm:py-14 md:py-20 text-[#2A1B0A]">
        <div className="w-10 sm:w-12 h-[1px] bg-honey mb-4 sm:mb-6"></div>
        <div className="text-[9px] sm:text-[10px] uppercase tracking-[0.25em] text-[#9E6000] mb-3 sm:mb-6 font-bold flex items-center gap-2">
          <span>{isEl ? 'Λακωνία, Ελλάδα · Από το 1996' : 'Laconia, Greece · Est. 1996'}</span>
        </div>
        
        <h1 className="font-display text-3xl sm:text-5xl md:text-5xl lg:text-[4.2rem] leading-[1.08] font-light mb-4 sm:mb-6 text-[#2A1B0A]/95">
          {isEl ? (
            <>
              Γίνετε Ανάδοχος <span className="italic text-honey">Πραγματικής Κυψέλης.</span><br className="hidden sm:inline" />
              {' '}Λάβετε το Μέλι σας σε Κάθε Σοδειά.
            </>
          ) : (
            <>
              Own a Share of <span className="italic text-honey">Real Beehives.</span><br className="hidden sm:inline" />
              {' '}Receive Your Honey Every Harvest.
            </>
          )}
        </h1>
        
        <p className="text-[#2A1B0A]/85 text-sm sm:text-base max-w-md mb-6 sm:mb-8 leading-relaxed font-light">
          {isEl
            ? 'Απευθείας από τα 30χρονα οικογενειακά μελισσοκομεία μας στη Μάνη. Υιοθετήστε τη δική σας επώνυμη κυψέλη, παρακολουθήστε την σε πραγματικό χρόνο και παραλάβετε 100% αγνό, ανεπεξέργαστο μέλι στην πόρτα σας.'
            : 'Direct from our 30-year family apiaries in Mani, Laconia. Adopt your own named hive, monitor its vitality live, and receive 100% raw honey harvests shipped to your door.'}
        </p>

        {/* Living Colony Telemetry Badge (Mobile Dedicated & Clean) */}
        <div className="md:hidden my-6 p-4 bg-hive-panel/90 border border-honey/30 rounded-[2px] shadow-sm space-y-3">
          <div className="flex items-center justify-between text-[10px] font-mono">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_#22c55e]" />
              <span className="font-bold text-[#2A1B0A] tracking-wider uppercase">
                {isEl ? 'Κυψέλη #247 · Λάγια, Μάνη' : 'Living Colony #247 · Mani'}
              </span>
            </div>
            <span className="text-[8px] uppercase tracking-wider text-green-700 font-bold bg-green-600/10 px-2 py-0.5 rounded-xs border border-green-600/20">
              {isEl ? 'Άνθιση Θυμαριού' : 'Thyme Bloom Active'}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2.5 border-t border-honey/15 text-center">
            <div>
              <div className="text-[8px] uppercase tracking-wider text-[#2A1B0A]/50 font-bold mb-0.5">{isEl ? 'Βάρος' : 'Weight'}</div>
              <div className="font-display text-lg text-honey font-semibold">38.2 kg</div>
              <div className="text-[8px] text-green-700 font-mono">+180g / 24h</div>
            </div>
            <div className="border-x border-honey/15">
              <div className="text-[8px] uppercase tracking-wider text-[#2A1B0A]/50 font-bold mb-0.5">{isEl ? 'Θερμ.' : 'Temp'}</div>
              <div className="font-display text-lg text-[#2A1B0A] font-semibold">34.5°C</div>
              <div className="text-[8px] text-[#2A1B0A]/60 font-mono">{isEl ? 'Ιδανική' : 'Optimal'}</div>
            </div>
            <div>
              <div className="text-[8px] uppercase tracking-wider text-[#2A1B0A]/50 font-bold mb-0.5">{isEl ? 'Υγεία' : 'Vitality'}</div>
              <div className="font-display text-lg text-green-700 font-semibold">98%</div>
              <div className="text-[8px] text-honey font-mono">{isEl ? 'Ενεργή' : 'Active'}</div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 text-[9px] text-[#2A1B0A]/60 font-mono border-t border-honey/10">
            <span>{isEl ? 'Επόμενος τρύγος: Ιούλιος 2026' : 'Next harvest: July 2026'}</span>
            <span className="text-honey font-bold">{isEl ? '100% Αγνό' : '100% Raw Unheated'}</span>
          </div>
        </div>
        
        {/* CTA Button Group */}
        <div className="mb-6 max-w-md flex flex-col gap-3">
          <a 
            href="#pricing"
            className="w-full bg-honey text-[#0C0804] px-6 py-4 text-center text-xs uppercase tracking-[0.2em] font-bold hover:bg-honey/90 transition-all rounded-[2px] shadow-[0_4px_20px_rgba(200,134,10,0.25)] active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <span>{isEl ? 'Υιοθεσία Κυψέλης — Από 140€/έτος' : 'Adopt Your Hive — From €140/yr'}</span>
            <ArrowRight size={14} />
          </a>
          
          <div className="grid grid-cols-2 gap-2.5">
            <button 
              onClick={onOpenConcierge}
              className="border border-honey/40 bg-honey/10 text-[#2A1B0A] hover:bg-honey hover:text-[#0C0804] px-3 py-3.5 text-[11px] uppercase tracking-wider font-bold transition-all rounded-[2px] flex items-center justify-center gap-1.5 active:scale-95"
            >
              <Sparkles size={13} className="text-honey" />
              <span>{isEl ? 'Τεστ Γεύσης' : 'Palate Quiz'}</span>
            </button>
            <Link 
              to="/buy-honey"
              className="border border-honey/30 text-[#2A1B0A]/85 hover:text-[#2A1B0A] hover:border-honey/60 px-3 py-3.5 text-[11px] uppercase tracking-wider font-bold transition-colors rounded-[2px] text-center active:scale-95 flex items-center justify-center"
            >
              {isEl ? 'Αγορά Βάζου' : 'Buy Jars'}
            </Link>
          </div>

          <p className="text-xs text-[#2A1B0A]/70 font-medium pt-1">
            {isEl ? 'Ερωτήσεις;' : 'Questions?'} <a href="mailto:info@oikonomakos.gr" className="text-honey font-bold hover:underline">info@oikonomakos.gr</a>
          </p>
        </div>
        
        {/* Key Metrics Strip */}
        <div className="flex items-center justify-between sm:justify-start sm:space-x-8 mt-4 pt-4 border-t border-honey/15">
          <div>
            <div className="font-display text-2xl sm:text-3xl text-[#2A1B0A]">600</div>
            <div className="text-[8px] sm:text-[9px] uppercase tracking-widest text-[#2A1B0A]/70 font-bold">{isEl ? 'Ενεργές Κυψέλες' : 'Active hives'}</div>
          </div>
          <div className="w-[1px] h-8 bg-honey/20"></div>
          <div>
            <div className="font-display text-2xl sm:text-3xl text-[#2A1B0A]">6t</div>
            <div className="text-[8px] sm:text-[9px] uppercase tracking-widest text-[#2A1B0A]/70 font-bold">{isEl ? 'Ετήσια Παραγωγή' : 'Annual yield'}</div>
          </div>
          <div className="w-[1px] h-8 bg-honey/20"></div>
          <div>
            <div className="font-display text-2xl sm:text-3xl text-[#2A1B0A]">3</div>
            <div className="text-[8px] sm:text-[9px] uppercase tracking-widest text-[#2A1B0A]/70 font-bold">{isEl ? 'Σοδειές / έτος' : 'Harvests/yr'}</div>
          </div>
        </div>
      </div>
      
      {/* Right Column - Dusk Honey Visual (Desktop only) */}
      <div className="hidden md:flex w-full md:w-[52%] lg:w-[55%] bg-hive-dark relative overflow-hidden min-h-screen items-center justify-center border-l border-honey/10">
        {/* Background Image of Mani Landscape */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/mani_landscape.png" 
            alt="Mani landscape with beehives" 
            className="w-full h-full object-cover opacity-30 mix-blend-overlay"
          />
        </div>
        
        {/* Hexagon Grid */}
        <HexagonGrid />

        {/* Vertical Connecting Line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-honey/20 to-transparent"></div>

        {/* TOP - Hive ID */}
        <div className="absolute top-8 left-8 md:top-12 md:left-12 border-l-2 border-honey pl-4 z-10">
          <div className="text-[9px] uppercase tracking-widest text-[#E8A030] mb-1 font-bold">
            Your hive
          </div>
          <div className="font-display italic text-3xl text-pale-honey drop-shadow-md">#247</div>
          <div className="text-[9px] text-white/70 mt-1 font-bold">Lagia, Mani</div>
        </div>

        {/* Hive ID Counter Base Layer */}
        <div className="absolute inset-0 flex items-center justify-center z-1 pointer-events-none overflow-hidden">
          <span className="font-display text-[16rem] lg:text-[20rem] leading-none text-honey/[0.03] select-none">
            247
          </span>
        </div>

        {/* MIDDLE - Temp */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/40 backdrop-blur-md border border-honey/30 p-5 rounded-[2px] z-10 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
          <div className="text-[9px] uppercase tracking-widest text-honey/80 mb-2">Temp</div>
          <div className="font-display text-3xl text-pale-honey">34.5°C</div>
        </div>

        {/* RIGHT MIDDLE - Activity */}
        <div className="absolute top-1/3 right-12 bg-black/40 backdrop-blur-md border border-honey/30 p-4 rounded-[2px] z-10 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
          <div className="text-[9px] uppercase tracking-widest text-honey/80 mb-2">Activity</div>
          <div className="font-display text-2xl text-green-400">High</div>
        </div>
        
        {/* Live Data Card */}
        <div className="absolute bottom-12 right-12 bg-black/80 backdrop-blur-xl border border-honey/60 p-5 rounded-[2px] shadow-[0_20px_50px_rgba(0,0,0,0.9)] z-10 origin-bottom-right">
          <div className="flex items-center space-x-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-blink shadow-[0_0_10px_#22c55e]"></div>
            <div className="text-[10px] uppercase tracking-widest text-honey font-bold">Live · Hive #247</div>
          </div>
          <div className="font-display italic text-4xl text-pale-honey mb-0.5 drop-shadow-sm">38.2 kg</div>
          <div className="text-[10px] text-white/80 font-medium">Updated 4 min ago</div>
        </div>
      </div>
    </section>
  );
};

const HowItWorks = () => {
  const { language } = useLanguage();
  const isEl = language === 'el';

  const steps = isEl ? [
    { num: '01', title: 'Επιλέξτε την Κυψέλη σας', desc: 'Κατοχυρώστε την αριθμημένη κυψέλη σας στα μελισσοκομεία της Λακωνίας. Τρεις ανάδοχοι μοιράζονται μία κυψέλη για βιώσιμη παραγωγή.' },
    { num: '02', title: 'Συνδεθείτε με τη Μάνη', desc: 'Αποκτήστε πρόσβαση στο Ημερολόγιο Κυψέλης. Παρακολουθήστε τις μέλισσές σας με ζωντανά δεδομένα βάρους, θερμοκρασίας και υγείας.' },
    { num: '03', title: 'Φυσική Ωρίμανση', desc: 'Με την αλλαγή των εποχών, ο Πέτρος συλλέγει το μέλι αποκλειστικά από τον δικό σας τομέα. Χωρίς προσμίξεις, χωρίς θέρμανση, 100% αγνό.' },
    { num: '04', title: 'Παραλαβή Σοδειάς', desc: 'Παραλαμβάνετε το μέλι σας αυτόματα στο σπίτι. Από τους βράχους της Μάνης στο τραπέζι σας — αυθεντική ελληνική κληρονομιά.' }
  ] : [
    { num: '01', title: 'Claim Your Unit', desc: 'Secure your numbered hive in our Laconian apiaries. Three guardians share one physical unit to ensure sustainable management.' },
    { num: '02', title: 'Connect to Mani', desc: 'Access your apiary journal. Watch your bees thrive via real-time weight, temperature, and vitality reports direct from the mountains.' },
    { num: '03', title: 'Natural Maturation', desc: 'As the seasons turn, Petros extracts honey exclusively from your sector. No blending, no heating, just raw hive-to-jar purity.' },
    { num: '04', title: 'Direct Harvest', desc: 'Receive your harvests automatically. From the Mani cliffs to your table—authentic heritage delivered anywhere in Europe.' }
  ];

  return (
    <section id="how-it-works" className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 max-w-7xl mx-auto">
      <div className="text-center mb-10 sm:mb-16 space-y-2">
        <div className="text-[9px] sm:text-[10px] uppercase tracking-[0.3em] text-[#9E6000] font-bold">
          {isEl ? 'Η Διαδικασία Αναδοχής' : 'The Guardianship Journey'}
        </div>
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-light text-[#2A1B0A]">
          {isEl ? 'Από τα άνθη του βουνού στο τραπέζι σας.' : 'From mountain bloom to your kitchen table.'}
        </h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 border border-honey/20 rounded-[2px] overflow-hidden bg-hive-panel/30">
        {steps.map((step, i) => (
          <div key={i} className="group relative p-6 sm:p-8 border-b md:border-b-0 md:border-r border-honey/20 last:border-b-0 md:last:border-r-0 transition-colors duration-500 hover:bg-hive-panel min-h-[220px] md:min-h-[320px] flex flex-col justify-between overflow-hidden">
            <span className="absolute top-2 right-4 font-display text-6xl sm:text-7xl md:text-[8rem] leading-none text-honey/[0.08] select-none group-hover:text-honey/15 transition-colors duration-500">
              {step.num}
            </span>
            <div className="mt-auto relative z-10">
              <div className={`h-[1.5px] bg-honey mb-4 sm:mb-6 transition-all duration-700 group-hover:w-full ${['w-8','w-16','w-24','w-full'][i]}`}></div>
              <h3 className="font-display text-xl sm:text-[1.35rem] mb-2 sm:mb-3 text-[#2A1B0A] leading-snug">{step.title}</h3>
              <p className="text-xs sm:text-sm text-[#2A1B0A]/80 leading-relaxed font-light">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

const WhatYouGet = () => {
  const { language } = useLanguage();
  const isEl = language === 'el';

  const features = isEl ? [
    { icon: <Scale size={18} strokeWidth={1} className="text-honey" />, title: 'Ζωντανή παρακολούθηση βάρους', desc: 'Δείτε σε πραγματικό χρόνο πόσο μέλι παράγουν οι μέλισσές σας μέρα με τη μέρα.' },
    { icon: <Camera size={18} strokeWidth={1} className="text-honey" />, title: 'Φωτογραφίες μελισσοκομείου', desc: 'Οπτικό ημερολόγιο της κυψέλης σας με τακτικές ενημερώσεις από τον μελισσοκόμο.' },
    { icon: <Thermometer size={18} strokeWidth={1} className="text-honey" />, title: 'Δείκτες υγείας αποικίας', desc: 'Έλεγχος εσωτερικής θερμοκρασίας και υγρασίας για άριστη ευρωστία του σμήνους.' },
    { icon: <Package size={18} strokeWidth={1} className="text-honey" />, title: 'Άμεση & Εποχιακή Αποστολή', desc: 'Βάζο καλωσορίσματος σε 2 εβδομάδες και έπειτα ανοιξιάτικες και φθινοπωρινές παραδόσεις.' },
    { icon: <FlaskConical size={18} strokeWidth={1} className="text-honey" />, title: 'Εργαστηριακός έλεγχος αγνότητας', desc: 'Κάθε παρτίδα αναλύεται από τη Eurofins για 100% αυθεντικότητα και μηδενικά κατάλοιπα.' },
    { icon: <MapPin size={18} strokeWidth={1} className="text-honey" />, title: 'Απευθείας από τον Μελισσοκόμο', desc: 'Χωρίς μεσάζοντες, χωρίς αναμίξεις. Κατευθείαν από τον Πέτρο Οικονομάκο σε εσάς.' }
  ] : [
    { icon: <Scale size={18} strokeWidth={1} className="text-honey" />, title: 'Live weight tracking', desc: 'See exactly how much honey your bees are producing in real-time.' },
    { icon: <Camera size={18} strokeWidth={1} className="text-honey" />, title: 'Apiary snapshots', desc: 'A visual record of your colony, updated regularly by the beekeeper.' },
    { icon: <Thermometer size={18} strokeWidth={1} className="text-honey" />, title: 'Colony health data', desc: 'Monitor internal temperature and humidity to ensure your bees are thriving.' },
    { icon: <Package size={18} strokeWidth={1} className="text-honey" />, title: 'Immediate & Seasonal Delivery', desc: 'A Welcome Jar within 2 weeks, followed by Spring and Autumn harvests.' },
    { icon: <FlaskConical size={18} strokeWidth={1} className="text-honey" />, title: 'Lab-certified purity', desc: 'Every batch is tested by Eurofins for authenticity and zero pesticide residue.' },
    { icon: <MapPin size={18} strokeWidth={1} className="text-honey" />, title: 'Direct from the Beekeeper', desc: 'No middlemen, no blending. Straight from Petros Oikonomakos to you.' }
  ];

  return (
    <section id="features" className="py-16 sm:py-24 md:py-32 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 border border-honey/20 rounded-[2px] overflow-hidden bg-white/40">
          {features.map((f, i) => (
            <div key={i} className="p-6 sm:p-8 md:p-10 border-b md:border-b-0 md:border-r last:border-b-0 md:[&:nth-child(n+4)]:border-b-0 md:[&:nth-child(1)]:border-b md:[&:nth-child(2)]:border-b md:[&:nth-child(3)]:border-b border-honey/20 hover:bg-hive-panel transition-colors duration-500">
              <div className="w-10 h-10 border border-honey/40 flex items-center justify-center mb-6 rounded-[2px] bg-honey/10">
                {f.icon}
              </div>
              <h3 className="font-display text-xl sm:text-[1.3rem] mb-2 sm:mb-3 text-[#2A1B0A]">{f.title}</h3>
              <p className="text-xs sm:text-sm text-[#2A1B0A]/80 leading-relaxed font-light">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const DashboardPreview = () => {
  const { language } = useLanguage();
  const isEl = language === 'el';

  return (
    <section className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-10 md:gap-20 overflow-hidden">
      <div className="w-full md:w-[45%] space-y-6">
        <div>
          <div className="text-[9px] sm:text-[10px] uppercase tracking-[0.3em] text-[#9E6000] font-bold mb-2">
            {isEl ? 'Ζωντανό Ημερολόγιο Αναδόχου' : 'Live Apiary Journal'}
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-light text-[#2A1B0A] leading-tight">
            {isEl ? 'Δείτε πώς παράγεται το μέλι σας.' : 'Watch your honey being made.'}
          </h2>
        </div>

        <ul className="space-y-4 sm:space-y-5 text-xs sm:text-sm text-[#2A1B0A]/85 font-medium">
          <li className="flex gap-3">
            <span className="text-honey font-bold">—</span>
            {isEl ? 'Ζωντανές μετρήσεις βάρους δείχνουν ακριβώς πότε ξεκινά η νεκταροέκκριση.' : 'Real-time weight metrics show exactly when the nectar flow begins.'}
          </li>
          <li className="flex gap-3">
            <span className="text-honey font-bold">—</span>
            {isEl ? 'Εσωτερικοί αισθητήρες κλίματος επιβεβαιώνουν ότι η αποικία διατηρεί ιδανική θερμοκρασία.' : 'Internal climate sensors ensure the colony is healthy and regulating temperature.'}
          </li>
          <li className="flex gap-3">
            <span className="text-honey font-bold">—</span>
            {isEl ? 'Τακτικές φωτογραφίες από το μελισσοκομείο σας συνδέουν με τη φύση της Μάνης.' : 'Regular snapshots from the apiary connect you to the landscape.'}
          </li>
          <li className="flex gap-3">
            <span className="text-honey font-bold">—</span>
            {isEl ? 'Προβλέψεις συγκομιδής σας ενημερώνουν για την επόμενη παράδοση στο σπίτι σας.' : 'Harvest predictions tell you exactly when to expect your next delivery.'}
          </li>
        </ul>
      </div>
      
      <div className="w-full md:w-[55%] md:perspective-[1200px]">
        <div className="bg-hive-panel border border-honey/25 rounded-[2px] p-5 sm:p-7 shadow-[0_0_30px_rgba(200,134,10,0.06)] transform rotate-0 md:rotate-y-[-5deg] md:hover:rotate-y-0 transition-transform duration-700">
          {/* Header */}
          <div className="flex justify-between items-center border-b border-honey/15 pb-4 mb-6">
            <div className="text-[#2A1B0A]/90 text-xs sm:text-sm font-semibold tracking-wide">
              {isEl ? 'Κυψέλη #247 — Λάγια, Μάνη' : 'Hive #247 — Lagia, Mani'}
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-blink shadow-[0_0_8px_#22c55e]"></div>
              <div className="text-[9px] uppercase tracking-widest text-[#2A1B0A]/60 font-bold">
                {isEl ? 'Ζωντανά' : 'Live'}
              </div>
            </div>
          </div>
          
          {/* Metrics */}
          <div className="grid grid-cols-3 gap-2.5 sm:gap-4 mb-6">
            <div className="bg-white/80 p-3 sm:p-4 border border-honey/30 rounded-[2px]">
              <div className="text-[8px] sm:text-[10px] uppercase tracking-widest text-[#9E6000] mb-1 font-bold">
                {isEl ? 'Βάρος' : 'Weight'}
              </div>
              <div className="font-display text-xl sm:text-2xl text-honey font-bold">38.2 kg</div>
            </div>
            <div className="bg-white/60 p-3 sm:p-4 border border-honey/15 rounded-[2px]">
              <div className="text-[8px] sm:text-[10px] uppercase tracking-widest text-[#2A1B0A]/50 mb-1 font-bold">
                {isEl ? 'Θερμ.' : 'Temp'}
              </div>
              <div className="font-display text-xl sm:text-2xl text-[#2A1B0A] font-semibold">34.5°C</div>
            </div>
            <div className="bg-white/60 p-3 sm:p-4 border border-honey/15 rounded-[2px]">
              <div className="text-[8px] sm:text-[10px] uppercase tracking-widest text-[#2A1B0A]/50 mb-1 font-bold">
                {isEl ? 'Αποικία' : 'Activity'}
              </div>
              <div className="font-display text-xl sm:text-2xl text-green-700 font-semibold">
                {isEl ? 'Υψηλή' : 'High'}
              </div>
            </div>
          </div>
          
          {/* Chart Placeholder */}
          <div className="h-32 sm:h-40 border-b border-l border-honey/15 flex items-end gap-1.5 sm:gap-2 px-2 pb-0 pt-4 mb-6 relative bg-white/30 rounded-xs">
            <div className="absolute top-1.5 left-2 text-[8px] sm:text-[9px] uppercase tracking-widest text-[#2A1B0A]/40 font-mono">
              {isEl ? 'Βάρος (7 ημέρες)' : 'Weight (7 days)'}
            </div>
            {[40, 55, 45, 60, 75, 85, 100].map((h, i) => (
              <div key={i} className={`flex-1 bg-honey transition-all duration-1000 ${i === 6 ? 'opacity-100 shadow-[0_0_12px_rgba(200,134,10,0.4)]' : 'opacity-40'}`} style={{ height: `${h}%` }}></div>
            ))}
          </div>
          
          {/* Clean Telemetry Status */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pt-2 border-t border-honey/10">
            <div className="text-[11px] text-[#2A1B0A]/80 font-medium">
              {isEl ? 'Εκτιμώμενος τρύγος: 14 Ιουλίου 2026' : 'Next harvest est. 14 Jul 2026'}
            </div>
            
            <div className="text-[9px] uppercase tracking-widest text-green-800 font-bold border border-green-600/30 px-2.5 py-1 bg-green-500/10 rounded-[2px]">
              {isEl ? 'Άνθιση θυμαριού ενεργή' : 'Thyme flow active'}
            </div>
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

const Origins = () => {
  const { language } = useLanguage();
  const isEl = language === 'el';

  const localizedHarvests = isEl ? [
    { 
      color: '#CAA362', 
      name: 'Αγριολούλουδα & Βανίλια', 
      season: 'Φεβ–Μάρ', 
      location: 'Σπάρτη / Κάτω Αστέρι, Λακωνία', 
      character: 'Μέλι Αγριολούλουδων & Βανίλιας',
      icon: 'Bug',
      yield: '800g'
    },
    { 
      color: '#CAA362', 
      name: 'Θυμάρι & Φασκόμηλο', 
      season: 'Ιούν–Ιούλ', 
      location: 'Λάγια, Μάνη', 
      character: 'Μέλι Θυμαρίσιο & Φασκόμηλο',
      icon: 'Milk',
      yield: '800g'
    },
    { 
      color: '#CAA362', 
      name: 'Ελατόμελο (Μαίναλο)', 
      season: 'Ιούλ–Αύγ', 
      location: 'Καρυές, Αρκαδία', 
      character: 'Αγνό Ελατόμελο',
      icon: 'Leaf',
      yield: '1.2kg'
    },
    { 
      color: '#CAA362', 
      name: 'Πευκόμελο', 
      season: 'Αύγ–Οκτ', 
      location: 'Εύβοια', 
      character: 'Πευκόμελο',
      icon: 'Hexagon',
      yield: '1.2kg'
    }
  ] : harvests;

  return (
    <section id="origins" className="py-16 sm:py-24 md:py-32 bg-hive-bg relative overflow-hidden">
      {/* Subtle Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-honey/5 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-honey/5 blur-[120px] rounded-full"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-12 sm:mb-20 space-y-3 sm:space-y-4">
          <div className="flex items-center justify-center gap-3 sm:gap-4 text-honey">
            <div className="h-[1px] w-8 sm:w-12 bg-honey/30"></div>
            <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.35em] font-bold">
              {isEl ? 'Ο Νομαδικός Κύκλος' : 'The Nomadic Cycle'}
            </span>
            <div className="h-[1px] w-8 sm:w-12 bg-honey/30"></div>
          </div>
          <h2 className="font-display text-3xl sm:text-5xl md:text-6xl text-[#2A1B0A] leading-tight">
            {isEl ? 'Εποχιακές Χαρακτηριστικές Σοδειές' : 'Seasonal Signature Harvests'}
          </h2>
          <p className="text-[#2A1B0A]/70 max-w-2xl mx-auto leading-relaxed font-light text-xs sm:text-sm">
            {isEl
              ? 'Τα μελισσοκομεία μας ακολουθούν την ανθοφορία σε όλη την Ελλάδα, συλλέγοντας τη μοναδική βοτανική ταυτότητα κάθε περιοχής. Κάθε βάζο διηγείται μια ιστορία ορεινού αέρα και άγριας χλωρίδας.'
              : 'Our apiaries follow the bloom across Greece, capturing the unique botanical essence of each region. Every jar tells a story of mountain air and wild flora.'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {localizedHarvests.map((h, idx) => {
            const Icon = h.icon === 'Bug' ? Bug : h.icon === 'Milk' ? Milk : h.icon === 'Leaf' ? Leaf : Hexagon;
            return (
              <div 
                key={idx}
                className="group relative bg-hive-panel/50 border border-honey/15 p-6 sm:p-8 rounded-[2px] backdrop-blur-sm hover:border-honey/40 transition-all duration-500 overflow-hidden"
              >
                {/* Decorative Jar Background Offset */}
                <div className="absolute -top-10 -right-10 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity duration-500 group-hover:rotate-12 transform pointer-events-none">
                  <Package size={160} strokeWidth={1} />
                </div>

                <div className="relative z-10 space-y-6 sm:space-y-8">
                  <div className="flex justify-between items-start">
                    <div className="p-2.5 sm:p-3 bg-honey/10 text-honey rounded-sm">
                      <Icon size={22} strokeWidth={1.5} />
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] font-bold uppercase tracking-widest text-honey mb-0.5">{h.season}</div>
                      <div className="text-[8px] uppercase tracking-widest text-[#2A1B0A]/40 font-bold">
                        {isEl ? 'Περίοδος Άνθισης' : 'Season Bloom'}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl sm:text-2xl font-display text-[#2A1B0A] mb-1.5">{h.name}</h3>
                    <div className="flex items-center gap-1.5 text-honey/90 mb-3">
                      <MapPin size={11} />
                      <span className="text-[9px] sm:text-[10px] uppercase tracking-widest font-bold">{h.location.split(',')[0]}</span>
                    </div>
                  </div>

                  <div className="space-y-3 pt-4 sm:pt-6 border-t border-honey/10 text-[9px] sm:text-[10px] uppercase tracking-widest">
                    <div className="flex justify-between items-center">
                      <span className="text-[#2A1B0A]/50 font-bold">
                        {isEl ? 'Βοτανική Πηγή' : 'Botanical Source'}
                      </span>
                      <span className="text-[#2A1B0A] font-bold text-right max-w-[120px] truncate">{h.character.split(' ')[0]}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#2A1B0A]/50 font-bold">
                        {isEl ? 'Ποσότητα' : 'Est. Yield'}
                      </span>
                      <span className="text-honey font-bold">{h.yield} / {isEl ? 'βάζο' : 'jar'}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-12 sm:mt-16 text-center">
           <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.25em] font-bold text-[#2A1B0A]/40 font-mono">
             {isEl ? 'Πιστοποιημένο · Αφιλτράριστο · Αγνό Ελληνικό Μέλι' : 'Certified Pure · Unfiltered · Raw Greek Honey'}
           </p>
        </div>
      </div>
    </section>
  );
};

const Beekeeper = () => {
  const { language } = useLanguage();
  const isEl = language === 'el';

  return (
    <section className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-10 sm:gap-16 md:gap-24">
      <div className="w-full md:w-1/2 relative">
        <div className="absolute -inset-3 sm:-inset-4 border border-honey/20 rounded-[2px] -z-10 translate-x-2 translate-y-2"></div>
        <img 
          src="/beekeeper.png" 
          alt="Petros Oikonomakos working the hives" 
          className="w-full aspect-[4/5] object-cover rounded-[2px] sepia-[0.08] contrast-[1.05] shadow-xl"
        />
      </div>
      <div className="w-full md:w-1/2 text-[#2A1B0A] space-y-6">
        <div className="w-8 h-[1px] bg-honey"></div>
        <p className="font-display text-2xl sm:text-3xl md:text-4xl leading-[1.35] font-light text-[#2A1B0A]/95 italic">
          {isEl
            ? '«Φροντίζω αυτά τα βουνά εδώ και 30 χρόνια. Γνωρίζω πότε θα ανθίσει το θυμάρι στη Μάνη πριν καν συμβεί. Ο πατέρας μου μου έμαθε τη γλώσσα των μελισσών, και τώρα μοιραζόμαστε αυτή την κληρονομιά μαζί σας.»'
            : '"I have managed these mountains for 30 years. I know when the thyme will bloom in Mani before it happens. My father taught me the language of the bees, and now we share that heritage with you."'}
        </p>
        <div className="text-[9px] sm:text-[10px] uppercase tracking-widest text-[#2A1B0A]/70 font-bold border-t border-honey/15 pt-4">
          {isEl
            ? 'Πέτρος Οικονομάκος · Αρχιμελισσοκόμος (30+ Χρόνια Εμπειρίας)'
            : 'Petros Oikonomakos · Master Beekeeper (30+ Years Experience)'}
        </div>
      </div>
    </section>
  );
};

const Pricing = ({ cartPlan, setCartPlan, setIsCartOpen, hasOliveOil, setHasOliveOil, setSelectedPlanForSignup }: any) => {
  const { language } = useLanguage();
  const isEl = language === 'el';

  return (
    <section id="pricing" className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 max-w-7xl mx-auto text-[#2A1B0A]">
      <div className="text-center mb-12 sm:mb-20 space-y-3">
        <div className="text-[9px] sm:text-[10px] uppercase tracking-[0.3em] text-[#9E6000] font-bold">
          {isEl ? 'Επιλογές Αναδοχής' : 'Guardianship Allocation'}
        </div>
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-light text-[#2A1B0A]">
          {isEl ? 'Επίπεδα Αναδοχής Κυψέλης' : 'Membership Tiers'}
        </h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 items-stretch gap-6 md:gap-0">
        {/* Starter */}
        <div className="border border-honey/20 p-6 sm:p-8 md:p-12 text-[#2A1B0A] bg-hive-panel/60 backdrop-blur-sm rounded-[2px] md:border-r-0 flex flex-col justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-widest text-[#2A1B0A]/80 mb-4 sm:mb-6 font-bold">
              {isEl ? 'Βασική Αναδοχή' : 'Starter Guardianship'}
            </div>
            
            <div className="mb-6">
              <div className="flex items-baseline gap-2">
                <span className="font-display text-5xl sm:text-6xl text-honey font-light">€140</span>
                <span className="text-honey uppercase tracking-widest text-[10px] font-bold">
                  {isEl ? '/έτος' : '/year'}
                </span>
              </div>
              <div className="text-[#2A1B0A]/70 text-[10px] uppercase tracking-widest mt-1 font-semibold">
                {isEl ? 'Περ. €11,60/μήνα · Δωρεάν Αποστολή Ε.Ε.' : 'Approx. €11.60/month · Free EU Shipping'}
              </div>
            </div>
            
            <ul className="space-y-3.5 text-xs sm:text-sm text-[#2A1B0A]/85 mb-8 sm:mb-12">
              <li className="flex gap-2.5"><span className="text-honey font-bold">—</span> {isEl ? 'Βάζο καλωσορίσματος (250g) εντός 2 εβδομάδων' : 'Welcome jar (250g) shipped within 2 weeks'}</li>
              <li className="flex gap-2.5"><span className="text-honey font-bold">—</span> {isEl ? 'Πρόσβαση στο Ημερολόγιο Κυψέλης (IoT δεδομένα)' : 'Apiary Journal access (live IoT metrics)'}</li>
              <li className="flex gap-2.5"><span className="text-honey font-bold">—</span> {isEl ? '3 εποχιακές συγκομιδές (2,5kg σύνολο — 56€/kg)' : '3 seasonal harvests (2.5kg total — €56/kg)'}</li>
              <li className="flex gap-2.5"><span className="text-honey font-bold">—</span> {isEl ? 'Πιστοποιητικό αυθεντικότητας Eurofins' : 'Eurofins lab certificate of authenticity'}</li>
            </ul>
          </div>
          
          <button 
            onClick={() => setSelectedPlanForSignup({ id: 'starter', name: isEl ? 'Βασική Αναδοχή' : 'Starter Guardianship' })}
            className="block text-center w-full border border-honey/40 text-[#2A1B0A] py-3.5 text-xs uppercase tracking-wider font-bold hover:bg-honey hover:text-[#0C0804] transition-all rounded-[2px] active:scale-95"
          >
            {isEl ? 'Επιλογή Starter' : 'Select Starter'}
          </button>
        </div>
        
        {/* Premium */}
        <div className="border-2 border-honey p-6 sm:p-8 md:p-12 bg-hive-bg text-[#2A1B0A] relative z-10 shadow-[0_20px_50px_rgba(200,134,10,0.18)] md:-my-3 rounded-[2px] flex flex-col justify-between">
          <div className="absolute top-0 right-0 bg-honey text-[#0C0804] text-[9px] uppercase tracking-widest px-3 py-1 font-bold rounded-bl-sm">
            {isEl ? 'Επίτιμο Επίπεδο' : 'Patron Tier'}
          </div>
          
          <div>
            <div className="text-[10px] uppercase tracking-widest text-honey mb-4 sm:mb-6 font-bold">
              {isEl ? 'Επίτιμος Προστάτης' : 'Premium Patron'}
            </div>
            
            <div className="mb-6">
              <div className="flex items-baseline gap-2">
                <span className="font-display text-6xl sm:text-7xl text-honey font-light">€340</span>
                <span className="text-honey uppercase tracking-widest text-xs font-bold">
                  {isEl ? '/έτος' : '/year'}
                </span>
              </div>
              <div className="text-honey text-[11px] uppercase tracking-widest mt-1 font-bold">
                {isEl ? 'Περ. €28/μήνα · Επώνυμη Κυψέλη στη Μάνη' : 'Approx. €28/month · Named Colony in Mani'}
              </div>
            </div>
            
            <ul className="space-y-3.5 text-xs sm:text-sm text-[#2A1B0A] mb-8 sm:mb-12 font-medium">
              <li className="flex gap-2.5"><span className="text-honey font-bold">—</span> {isEl ? 'Πήλινο δοχείο υποδοχής (1kg) άμεσα' : 'Welcome crock (1kg) shipped immediately'}</li>
              <li className="flex gap-2.5"><span className="text-honey font-bold">—</span> {isEl ? 'Πλήρες Ημερολόγιο Κυψέλης & βιομετρική τηλεμετρία' : 'Apiary Journal access (full live biometric telemetry)'}</li>
              <li className="flex gap-2.5"><span className="text-honey font-bold">—</span> {isEl ? '3 εποχιακές παραδόσεις (5kg σύνολο — 68€/kg)' : '3 seasonal harvests (5kg total — €68/kg)'}</li>
              <li className="flex gap-2.5"><span className="text-honey font-bold">—</span> {isEl ? 'Επώνυμη ετικέτα με το όνομά σας σε κάθε βάζο' : 'Named jar (your name printed on every label)'}</li>
              <li className="flex gap-2.5"><span className="text-honey font-bold">—</span> {isEl ? 'Επίσημο Πιστοποιητικό Αναδοχής για κορνίζα' : 'Framable Certificate of Hive Adoption'}</li>
              <li className="flex gap-2.5"><span className="text-honey font-bold">—</span> {isEl ? 'Βουλοκερωμένη επιστολή από τον Πέτρο σε κάθε σοδειά' : 'Wax-sealed letter from Petros with each batch'}</li>
              <li className="flex gap-2.5"><span className="text-honey font-bold">—</span> {isEl ? 'Ανοιχτή Πρόσκληση: Επίσκεψη στο μελισσοκομείο στη Μάνη' : "Open invitation: Visit Petros' apiary in Mani, Greece"}</li>
            </ul>
          </div>
          
          <button 
            onClick={() => setSelectedPlanForSignup({ id: 'premium', name: isEl ? 'Επίτιμος Προστάτης' : 'Premium Patron' })}
            className="block text-center w-full bg-honey text-[#2A1B0A] py-4 text-xs uppercase tracking-wider font-bold hover:bg-honey/90 transition-colors rounded-[2px] shadow-[0_0_20px_rgba(200,134,10,0.25)] active:scale-95"
          >
            {isEl ? 'Επιλογή Premium' : 'Select Premium'}
          </button>
        </div>
        
        {/* Corporate */}
        <div className="border border-honey/20 p-6 sm:p-8 md:p-10 bg-hive-panel/60 md:border-l-0 rounded-[2px] flex flex-col justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-widest text-[#2A1B0A]/80 mb-4 sm:mb-6 font-bold">
              {isEl ? 'Εταιρική Αναδοχή' : 'Corporate Apiary'}
            </div>
            
            <div className="mb-6">
              <div className="flex items-baseline gap-1 text-[#2A1B0A]">
                <span className="font-display text-5xl sm:text-[3.2rem] leading-none font-light">€2,900</span>
                <span className="text-xs uppercase tracking-widest text-[#2A1B0A]/60 font-bold ml-1">{isEl ? '/έτος' : '/year'}</span>
              </div>
              <div className="text-[#2A1B0A]/60 text-[10px] uppercase tracking-widest mt-1 font-semibold">
                {isEl ? 'Σύμπλεγμα 15 Κυψελών · Εταιρικό Seal' : '15 Dedicated Hives · Custom Seal'}
              </div>
            </div>
            
            <ul className="space-y-3.5 text-xs sm:text-sm text-[#2A1B0A] mb-8 sm:mb-12">
              <li className="flex gap-2.5"><span className="text-honey font-bold">—</span> {isEl ? 'Σύμπλεγμα 15 αποκλειστικών κυψελών' : 'Block of 15 dedicated hives'}</li>
              <li className="flex gap-2.5"><span className="text-honey font-bold">—</span> {isEl ? 'Εταιρικό portal & προσαρμοσμένη τηλεμετρία' : 'Custom branded apiary journal & telemetry'}</li>
              <li className="flex gap-2.5"><span className="text-honey font-bold">—</span> {isEl ? 'Ειδικές ετικέτες με το λογότυπο της εταιρείας σας' : 'Custom branded jars with corporate seal'}</li>
              <li className="flex gap-2.5"><span className="text-honey font-bold">—</span> {isEl ? 'Αποστολές εταιρικών δώρων για στελέχη & πελάτες' : 'Executive client gifting fulfillment'}</li>
            </ul>
          </div>
          
          <button 
            onClick={() => document.getElementById('join')?.scrollIntoView({ behavior: 'smooth' })}
            className="w-full border border-honey/40 text-[#2A1B0A] py-3.5 text-xs uppercase tracking-wider font-bold hover:bg-honey hover:text-[#0C0804] transition-colors rounded-[2px] active:scale-95"
          >
            {isEl ? 'Επικοινωνήστε Μαζί μας' : 'Contact Us'}
          </button>
        </div>
      </div>

      {/* Olive Oil Add-on */}
      <div className="mt-12 sm:mt-16 border border-honey/25 p-6 sm:p-8 bg-hive-panel/80 rounded-[2px] max-w-3xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-32 h-32 bg-honey/10 blur-[50px] pointer-events-none"></div>
        <div className="relative z-10 space-y-1">
          <div className="text-[9px] uppercase tracking-widest text-[#9E6000] font-bold">
            {isEl ? 'Ετήσια Επιλογή' : 'Annual Add-on'}
          </div>
          <h3 className="font-display text-xl sm:text-2xl text-[#2A1B0A]">
            {isEl ? '+ Εξαιρετικό Παρθένο Ελαιόλαδο Λακωνίας · 500ml' : '+ Laconian Olive Oil · 500ml'}
          </h3>
          <p className="text-xs sm:text-sm text-[#2A1B0A]/75 font-light">
            {isEl ? 'Μονοποικιλιακό, ψυχρής έκθλιψης, σοδειάς 2026' : 'Single-estate, cold-pressed, harvest 2026'}
          </p>
          <p className="text-xs text-[#2A1B0A]/60 font-light">
            {isEl ? 'Συμπεριλαμβάνεται στη φθινοπωρινή σας αποστολή' : 'Added to your autumn shipment'}
          </p>
        </div>
        <div className="w-full sm:w-auto text-left sm:text-right flex flex-row sm:flex-col items-center sm:items-end justify-between gap-3 relative z-10 pt-2 sm:pt-0 border-t sm:border-t-0 border-honey/15">
          <div className="font-display text-2xl sm:text-3xl text-[#2A1B0A]">18 €</div>
          <button 
            onClick={() => {
              setHasOliveOil(true);
              setIsCartOpen(true);
            }}
            disabled={hasOliveOil || !cartPlan}
            className="px-5 py-2.5 bg-honey text-[#2A1B0A] text-[10px] uppercase tracking-widest font-bold hover:bg-honey/90 transition-colors rounded-[2px] disabled:opacity-50 disabled:cursor-not-allowed shadow-xs active:scale-95 shrink-0"
          >
            {!cartPlan ? (isEl ? 'Επιλέξτε πλάνο πρώτα' : 'Select a plan first') : hasOliveOil ? (isEl ? 'Προστέθηκε' : 'Added to Cart') : (isEl ? 'Προσθήκη' : 'Add to Cart')}
          </button>
        </div>
      </div>
    </section>
  );
};

const AboutOurHoney = () => {
  const { language } = useLanguage();
  const isEl = language === 'el';

  return (
    <section className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 border-t border-honey/10 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[radial-gradient(circle,_rgba(200,134,10,0.03)_0%,_transparent_70%)] pointer-events-none"></div>
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-10 sm:gap-16 relative z-10">
        <div className="w-full md:w-1/2">
          <img 
            src="/4jars.jpg" 
            alt="Four seasonal harvests of Greek honey" 
            className="w-full h-64 sm:h-96 md:h-[500px] object-cover rounded-[2px] shadow-2xl border border-honey/20"
          />
        </div>
        <div className="w-full md:w-1/2 text-[#2A1B0A]">
          <div className="text-[9px] sm:text-[10px] uppercase tracking-[0.25em] text-[#9E6000] font-bold mb-3 sm:mb-4">
            {isEl ? 'Ποιότητα & Προδιαγραφές' : 'Quality & Compliance'}
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-light mb-6 sm:mb-8 text-[#2A1B0A]">
            {isEl ? 'Σχετικά με το Μέλι μας' : 'About Our Honey'}
          </h2>
          
          <div className="space-y-4 sm:space-y-6 text-xs sm:text-sm text-[#2A1B0A]/85 leading-relaxed font-normal">
            <p className="text-[#2A1B0A]">
              {isEl
                ? 'Κάθε βάζο μελιού που παραλαμβάνετε παράγεται αποκλειστικά από τον αρχιμελισσοκόμο Πέτρο Οικονομάκο. Οι κυψέλες μας ταξιδεύουν στα πιο παρθένα ελληνικά τοπία για να αιχμαλωτίσουν ξεχωριστές εποχιακές γεύσεις: Αγριολούλουδα από τη Σπάρτη, Θυμάρι από τη Λάγια (Μάνη), Ελατόμελο Βανίλια από το Μαίναλο και Πευκόμελο από την Εύβοια.'
                : "Every jar of honey you receive is produced exclusively by master beekeeper Petros Oikonomakos. Our hives travel across Greece's most pristine landscapes to capture distinct seasonal flavors: Wildflower from Sparta, Thyme from Lagia (Mani), Fir Vanilla from Arachova (Arcadia), and Pine from Evia."}
            </p>
            
            <ul className="space-y-3 sm:space-y-4">
              <li className="flex gap-3">
                <span className="text-honey font-bold mt-0.5">✓</span> 
                <span>
                  <strong>{isEl ? '100% Αγνό & Ανεπεξέργαστο:' : '100% Pure & Unblended:'}</strong>{' '}
                  {isEl ? 'Το μέλι μας είναι ωμό, ανεπεξέργαστο, απαστερίωτο και ποτέ δεν αναμιγνύεται με εισαγόμενα μέλια ή σιρόπια.' : 'Our honey is raw, unpasteurized, and never blended with imported honeys or syrups.'}
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-honey font-bold mt-0.5">✓</span> 
                <span>
                  <strong>{isEl ? 'Πλήρης Συμμόρφωση με την Οδηγία της Ε.Ε.:' : 'EU Honey Directive Compliant:'}</strong>{' '}
                  {isEl ? 'Τηρούμε αυστηρά όλους τους κανονισμούς της Ευρωπαϊκής Ένωσης για την ποιότητα του μελιού, εξασφαλίζοντας μηδενική προσθήκη ζάχαρης ή νερού.' : 'We strictly adhere to all European Union regulations regarding honey quality, ensuring no added sugar or water.'}
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-honey font-bold mt-0.5">✓</span> 
                <span>
                  <strong>{isEl ? 'Επίσημη Ετικέτα Ιχνηλασιμότητας:' : 'Official Labeling:'}</strong>{' '}
                  {isEl ? 'Κάθε συσκευασία φέρει πλήρη ετικέτα με την ένδειξη «Ελληνικό Προϊόν», το ακριβές βάρος, τα στοιχεία παραγωγού και αριθμό παρτίδας για 100% ιχνηλασιμότητα.' : 'Each delivery comes with a fully compliant EU label indicating "Product of Greece", the exact weight, and our official producer details and VAT number for complete traceability.'}
                </span>
              </li>
            </ul>
            
            <p className="pt-4 border-t border-honey/20 italic text-[#2A1B0A]/70 font-medium">
              {isEl
                ? 'Όταν υιοθετείτε μια κυψέλη, δεν αποκτάτε απλώς μια ψηφιακή εμπειρία — εξασφαλίζετε μια ετήσια σοδειά αυθεντικού, χειροποίητου ελληνικού μελιού κατευθείαν στην πόρτα σας.'
                : "When you adopt a hive, you're not just getting a digital experience; you're securing a seasonal supply of authentic, artisanal Greek honey delivered straight to your door."}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

const FAQ = () => {
  const { language } = useLanguage();
  const isEl = language === 'el';

  const faqs = isEl ? [
    { q: 'Είναι η κυψέλη πραγματικά δική μου;', a: 'Μισθώνετε την παραγωγή και τα δεδομένα μίας συγκεκριμένης πραγματικής κυψέλης για ένα έτος. Οι μέλισσες και τα ξύλινα πλαίσια παραμένουν υπό την άμεση φροντίδα των αρχιμελισσοκόμων μας για την υγεία της αποικίας.' },
    { q: 'Τι συμβαίνει αν η κυψέλη έχει μειωμένη παραγωγή;', a: 'Η φύση είναι απρόβλεπτη. Εάν η κυψέλη σας υποαποδώσει λόγω καιρικών συνθηκών, συμπληρώνουμε την αποστολή σας από τις εφεδρικές κυψέλες του ίδιου μελισσοκομείου, εξασφαλίζοντας την ελάχιστη εγγυημένη ποσότητα.' },
    { q: 'Πώς αποστέλλεται το μέλι στην Ευρώπη;', a: 'Η δωρεάν αποστολή σε όλη την Ε.Ε. περιλαμβάνεται σε κάθε συνδρομή. Αποστέλλουμε τρεις φορές το χρόνο αμέσως μετά τον τρύγο. Τα βάζα προστατεύονται σε ειδική ανθεκτική συσκευασία.' },
    { q: 'Μπορώ να ακυρώσω τη συνδρομή;', a: 'Μπορείτε να ακυρώσετε την ανανέωση οποιαδήποτε στιγμή. Επειδή ο αγροτικός κύκλος απαιτεί προκαταβολική προετοιμασία, οι ετήσιες συνδρομές δεν επιστρέφονται μετά την έναρξη της σεζόν τον Μάρτιο.' },
    { q: 'Πότε ξεκινά η αποστολή του HiveShare;', a: 'Οι ιδρυτικές κυψέλες δεσμεύονται για το 2026. Το πρώτο σας βάζο καλωσορίσματος αποστέλλεται εντός 2 εβδομάδων από την αναδοχή.' }
  ] : [
    { q: 'Do I actually own the hive?', a: 'You lease the production and data of a specific physical hive for the year. The bees and the physical woodenware remain the property and responsibility of our master beekeepers to ensure the colony\'s health.' },
    { q: 'What if my hive has a bad season?', a: 'Agriculture is unpredictable. If your specific hive underproduces due to weather or colony health, we supplement your delivery from our reserve hives in the same apiary to ensure you receive your minimum yield.' },
    { q: 'How is honey shipped to NL/DE?', a: 'Free EU shipping is included in every membership. We ship three times a year immediately following extraction. Jars are secured in custom protective packaging. Shipping typically takes 4-6 business days.' },
    { q: 'Can I cancel?', a: 'You can cancel your renewal at any time. Because the agricultural cycle requires upfront investment, annual memberships are non-refundable once the season begins in March.' },
    { q: 'When does HiveShare launch?', a: 'Our founding member hives are being assigned throughout 2026. Your first jar ships within 2 weeks of adoption.' }
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 max-w-[720px] mx-auto text-[#2A1B0A]">
      <div className="text-center mb-10 sm:mb-16 space-y-2">
        <div className="text-[9px] sm:text-[10px] uppercase tracking-[0.3em] text-[#9E6000] font-bold">
          {isEl ? 'Συχνές Ερωτήσεις' : 'Common Inquiries'}
        </div>
        <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-light text-[#2A1B0A]/95">
          {isEl ? 'Όλα όσα θέλετε να γνωρίζετε' : 'Questions we get asked'}
        </h2>
      </div>
      
      <div className="space-y-0 border-t border-honey/20">
        {faqs.map((faq, i) => (
          <div key={i} className="border-b border-honey/20">
            <button 
              className="w-full py-5 sm:py-6 flex justify-between items-center text-left focus:outline-none group gap-4"
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              aria-expanded={openIndex === i}
            >
              <span className="font-display text-base sm:text-[1.2rem] group-hover:text-honey transition-colors text-[#2A1B0A] leading-snug">{faq.q}</span>
              <Plus className={`w-4 sm:w-5 h-4 sm:h-5 text-[#2A1B0A]/70 group-hover:text-honey transition-all duration-300 shrink-0 ${openIndex === i ? 'rotate-45 text-honey' : ''}`} strokeWidth={2} />
            </button>
            <div 
              className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndex === i ? 'max-h-60 opacity-100 pb-5 sm:pb-6' : 'max-h-0 opacity-0'}`}
            >
              <p className="text-xs sm:text-sm text-[#2A1B0A]/85 leading-relaxed font-light">{faq.a}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

const FinalCTA = () => {
  const { language } = useLanguage();
  const isEl = language === 'el';
  const [submitted, setSubmitted] = useState(false);

  return (
    <section id="join" className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 relative overflow-hidden text-[#2A1B0A] border-t border-honey/10">
      <div className="absolute inset-0 bg-[radial-gradient(circle,_rgba(200,134,10,0.08)_0%,_transparent_70%)]"></div>
      
      <div className="max-w-2xl mx-auto text-center relative z-10">
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-light mb-4 sm:mb-6 text-[#2A1B0A]">
          {isEl ? 'Συνδεθείτε με την Πηγή του Ελληνικού Μελιού' : 'Connect Directly with Greek Apiary Heritage'}
        </h2>
        <p className="text-[#2A1B0A]/85 text-sm sm:text-base mb-8 sm:mb-12 font-light max-w-lg mx-auto">
          {isEl
            ? 'Επικοινωνήστε μαζί μας για εξατομικευμένη αναδοχή κυψέλης, ιδιωτικές επισκέψεις στα μελισσοκομεία μας στη Μάνη ή εξειδικευμένες εταιρικές αποστολές.'
            : 'Get in touch for bespoke hive guardianship inquiries, private visits to our Mani apiaries, or distinguished corporate gifting.'}
        </p>
        
        <div className="mb-12 sm:mb-16 max-w-md mx-auto text-left">
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
                placeholder={isEl ? "Το email σας" : "Your email"} 
                required
                className="w-full bg-white/70 border border-honey/40 px-4 py-3 text-base sm:text-sm focus:outline-none focus:border-honey transition-colors rounded-[2px] placeholder:text-[#2A1B0A]/50 text-[#2A1B0A] font-medium"
              />
              <textarea 
                name="message"
                placeholder={isEl ? "Το μήνυμά σας (προαιρετικό)" : "Your message (optional)"} 
                rows={3}
                className="w-full bg-white/70 border border-honey/40 px-4 py-3 text-base sm:text-sm focus:outline-none focus:border-honey transition-colors rounded-[2px] placeholder:text-[#2A1B0A]/50 text-[#2A1B0A] resize-none font-medium"
              ></textarea>
              <button type="submit" className="bg-honey text-[#2A1B0A] px-8 py-3.5 text-xs font-bold uppercase tracking-widest hover:bg-honey/90 transition-colors rounded-[2px] active:scale-95 w-full">
                {isEl ? "Αποστολή Μηνύματος" : "Send Inquiry"}
              </button>
            </form>
          ) : (
            <div className="py-4 text-sm italic text-honey font-serif animate-fade-in text-center bg-honey/10 border border-honey/20 rounded-[2px]">
              {isEl ? "Σας ευχαριστούμε. Θα επικοινωνήσουμε άμεσα μαζί σας." : "Thank you. Our family team will be in touch shortly."}
            </div>
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-[9px] sm:text-[10px] uppercase tracking-widest text-[#2A1B0A]/70 font-bold">
          <div>{isEl ? '100% Αγνό Ανεπεξέργαστο Μέλι' : '100% Raw Unheated Honey'}</div>
          <div className="hidden sm:block w-[1px] h-3 bg-honey/50"></div>
          <div>{isEl ? 'Πιστοποίηση Eurofins' : 'Eurofins Lab Certified'}</div>
          <div className="hidden sm:block w-[1px] h-3 bg-honey/50"></div>
          <div>{isEl ? 'Απευθείας από τον Μελισσοκόμο' : 'Direct From Petros'}</div>
        </div>
      </div>
    </section>
  );
};

import Footer from '../components/Footer';

export default function Landing() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isConciergeOpen, setIsConciergeOpen] = useState(false);
  const [cartPlan, setCartPlan] = useState<{id: string, name: string, price: number, link: string} | null>(null);
  const [hasOliveOil, setHasOliveOil] = useState(false);
  const [selectedPlanForSignup, setSelectedPlanForSignup] = useState<{id: string, name: string} | null>(null);
  const { user } = useAuth();
  const { language } = useLanguage();
  const isEl = language === 'el';

  const cartItemsCount = (cartPlan ? 1 : 0) + (hasOliveOil ? 1 : 0);
  const cartTotal = (cartPlan?.price || 0) + (hasOliveOil ? 18 : 0);

  return (
    <div className="min-h-screen bg-hive-bg text-[#2A1B0A] font-body selection:bg-honey selection:text-[#2A1B0A]">
      <Navbar
        cartItemsCount={cartItemsCount}
        setIsCartOpen={setIsCartOpen}
        onOpenConcierge={() => setIsConciergeOpen(true)}
      />
      <Hero onOpenConcierge={() => setIsConciergeOpen(true)} />
      <HowItWorks />
      <WhatYouGet />
      <DashboardPreview />
      <Origins />
      <Beekeeper />
      <NomadicFloweringCalendar />
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

      {/* Honey Concierge Quiz Modal */}
      <HoneyConciergeModal
        isOpen={isConciergeOpen}
        onClose={() => setIsConciergeOpen(false)}
      />

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
                    <div className="flex justify-between items-center border-b border-honey/20 pb-4">
                      <div>
                        <div className="font-bold text-[#2A1B0A]">{cartPlan.name}</div>
                        <div className="text-xs text-[#2A1B0A]/70 font-medium">Annual Subscription</div>
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
                <p className="text-[#2A1B0A]/90 leading-relaxed text-sm font-medium">
                  {user 
                    ? `You're logged in as ${user.email}. Excellent choice to continue your support of Laconian bees.`
                    : selectedPlanForSignup.id === 'premium'
                      ? "You've chosen the gold standard. From live vitality reports to your name on the jars, your bees are ready to welcome their new sponsor."
                      : "A beautiful start to your connection with Greek nature. You'll soon be tracking your bees and receiving the purest honey from the Mani mountains."
                  }
                </p>
                
                {!user && (
                  <div className="grid grid-cols-1 gap-4 pt-4">
                    <div className="flex items-center gap-4 text-[#2A1B0A]/80 group font-bold">
                      <div className="w-8 h-8 rounded-full border border-[#2A1B0A]/20 flex items-center justify-center text-[10px] group-hover:border-honey group-hover:text-honey transition-colors">01</div>
                      <div className="text-xs uppercase tracking-widest">Create secure account</div>
                    </div>
                    <div className="flex items-center gap-4 text-[#2A1B0A]/40">
                      <div className="w-8 h-8 rounded-full border border-[#2A1B0A]/10 flex items-center justify-center text-[10px]">02</div>
                      <div className="text-xs uppercase tracking-widest font-bold">{selectedPlanForSignup.id === 'premium' ? 'Secure your premium slot' : 'Complete secure checkout'}</div>
                    </div>
                    <div className="flex items-center gap-4 text-[#2A1B0A]/40">
                      <div className="w-8 h-8 rounded-full border border-[#2A1B0A]/10 flex items-center justify-center text-[10px]">03</div>
                      <div className="text-xs uppercase tracking-widest font-bold">{selectedPlanForSignup.id === 'premium' ? 'Finalize hive naming' : 'Assign your hive'}</div>
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
