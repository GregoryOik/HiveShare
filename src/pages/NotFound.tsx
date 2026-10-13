import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Compass, Sparkles, AlertCircle, ArrowLeft, Heart, RotateCcw } from 'lucide-react';
import { useLanguage } from '../lib/useLanguage';

export default function NotFound() {
  const { language } = useLanguage();
  const isEl = language === 'el';

  const [waggleCount, setWaggleCount] = useState<number>(0);
  const [discoveredNectar, setDiscoveredNectar] = useState<boolean>(false);

  const handleWaggle = () => {
    const next = waggleCount + 1;
    setWaggleCount(next);
    if (next >= 4) {
      setDiscoveredNectar(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF5] text-[#2A1B0A] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Honeycomb Ambience */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-honey/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-honey/15 blur-[120px] rounded-full pointer-events-none" />

      {/* Floating Honeycomb Hexagons */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <pattern id="hex-404" width="56" height="96" patternUnits="userSpaceOnUse" patternTransform="scale(1)">
            <path
              d="M28 0 L56 16 L56 48 L28 64 L0 48 L0 16 Z M28 64 L56 80 L56 112 L28 128 L0 112 L0 80 Z"
              fill="none"
              stroke="#C8860A"
              strokeWidth="0.8"
            />
          </pattern>
          <rect width="100%" height="100%" fill="url(#hex-404)" />
        </svg>
      </div>

      <div className="max-w-lg w-full text-center space-y-8 relative z-10 animate-in fade-in zoom-in-95 duration-500">
        {/* Playful Bee Mascot Badge */}
        <div className="inline-block relative">
          <button
            onClick={handleWaggle}
            className="group relative cursor-pointer focus:outline-none p-4 rounded-full bg-[#FEF7E6] border border-honey/30 shadow-md hover:scale-110 active:scale-95 transition-all"
            title={isEl ? 'Κάντε κλικ στη μέλισσα για το χορό Waggle!' : 'Click the bee to do a waggle dance!'}
          >
            <span
              className={`text-6xl inline-block select-none transition-transform duration-300 ${
                waggleCount % 2 === 1 ? 'rotate-12 translate-x-1' : '-rotate-12 -translate-x-1'
              }`}
            >
              🐝
            </span>
            <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-honey text-[#2A1B0A] text-[9px] uppercase tracking-widest font-mono font-bold px-2 py-0.5 rounded-full border border-white/60 shadow-xs whitespace-nowrap">
              {waggleCount === 0
                ? (isEl ? 'Χορός Waggle' : 'Tap to Waggle')
                : (isEl ? `${waggleCount} Χοροί!` : `${waggleCount} Waggles!`)}
            </span>
          </button>
        </div>

        {/* 404 Headline */}
        <div className="space-y-3">
          <div className="font-serif text-[6.5rem] leading-none font-bold text-honey select-none tracking-tight">
            404
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#2A1B0A] font-bold">
            {isEl ? 'Η Κυψέλη αυτή... Σμηνούργησε!' : 'This Colony Swarmed Elsewhere!'}
          </h1>
          <p className="text-[#2A1B0A]/75 text-sm sm:text-base leading-relaxed max-w-md mx-auto font-sans">
            {isEl
              ? 'Φαίνεται πως οι μέλισσές μας πέταξαν σε διαφορετική πλαγιά του Ταϋγέτου. Το μονοπάτι που ψάχνετε δεν υπάρχει σε αυτό το μελισσοκομείο.'
              : 'Our scout bees flew too far over Cape Tenaro! The URL you’re scouting has no comb built on it yet.'}
          </p>
        </div>

        {/* Secret Easter Egg Reveal */}
        {discoveredNectar && (
          <div className="p-4 bg-[#FEF7E6] border-2 border-honey/50 rounded-[4px] text-left space-y-2 animate-in fade-in slide-in-from-top-4 duration-300 shadow-sm">
            <div className="flex items-center gap-2 text-honey font-bold text-xs uppercase tracking-wider">
              <Sparkles size={15} />
              <span>{isEl ? 'Μυστικό Εύρημα: Κωδικός Νέκταρ!' : 'Secret Discovery: Nectar Code!'}</span>
            </div>
            <p className="text-xs text-[#2A1B0A]/85 leading-relaxed font-sans">
              {isEl
                ? 'Συγχαρητήρια για τον επίμονο χορό! Χρησιμοποιήστε τον κωδικό '
                : 'Congratulations on doing the waggle dance! Use promo code '}
              <span className="font-mono font-bold text-[#9E6000] bg-honey/20 px-1.5 py-0.5 rounded border border-honey/30">
                WAGGLE10
              </span>
              {isEl
                ? ' για 10% έκπτωση στην πρώτη σας αγορά μελιού ή αναδοχής.'
                : ' for 10% off your direct jar purchase or guardianship.'}
            </p>
          </div>
        )}

        {/* Navigation & Rescue Options */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5">
          <Link
            to="/"
            className="w-full sm:w-auto px-7 py-3.5 bg-honey text-[#2A1B0A] hover:bg-honey/90 text-xs uppercase tracking-widest font-bold rounded-[3px] shadow-sm transition-all flex items-center justify-center gap-2"
          >
            <ArrowLeft size={14} /> {isEl ? 'Επιστροφή στην Αρχική' : 'Fly Back Home'}
          </Link>
          <Link
            to="/buy-honey"
            className="w-full sm:w-auto px-6 py-3.5 bg-white/80 border border-[#C8860A]/30 text-[#2A1B0A] hover:bg-[#FEF7E6] text-xs uppercase tracking-widest font-bold rounded-[3px] transition-all flex items-center justify-center gap-2"
          >
            <Compass size={14} className="text-honey" /> {isEl ? 'Συλλογή Μελιών' : 'Explore Honey Jars'}
          </Link>
        </div>

        {/* Beekeeper note */}
        <div className="pt-4 text-[11px] text-[#2A1B0A]/50 italic font-serif">
          {isEl
            ? '«Αν χαθείς στα βουνά της Μάνης, ακολούθησε το άρωμα του θυμαριού.» — Πέτρος Οικονομάκος'
            : '“If ever lost across Mani’s peaks, just follow the scent of wild thyme.” — Petros Oikonomakos'}
        </div>
      </div>
    </div>
  );
}
