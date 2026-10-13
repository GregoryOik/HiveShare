import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../lib/useLanguage';

const Footer = () => {
  const { language } = useLanguage();
  const isEl = language === 'el';
  const [clicks, setClicks] = React.useState(0);
  const [secretShown, setSecretShown] = React.useState(false);

  const handleLogoClick = () => {
    const next = clicks + 1;
    setClicks(next);
    if (next === 5) {
      setSecretShown(true);
    }
  };

  return (
    <footer className="bg-[#050302] text-cream/50 py-16 px-6 border-t border-honey/10 mt-auto relative overflow-hidden">
      {secretShown && (
        <div className="max-w-xl mx-auto mb-8 p-4 bg-[#140E08] border border-honey/40 rounded text-center text-xs text-honey font-mono animate-in fade-in zoom-in-95 duration-300">
          🍯 {isEl ? 'Μυστικός Όρκος Μελισσοκόμου:' : 'The Beekeeper’s Secret Oath:'}
          <div className="text-white/80 font-serif italic text-sm mt-1">
            {isEl
              ? '«Ποτέ μην αφαιρείς το μέλι πριν οι μέλισσες σφραγίσουν το κερί. Η υπομονή είναι η μόνη συνταγή.»'
              : '“Never harvest the comb before the bees have capped the wax. Patience is our only recipe.”'}
          </div>
          <div className="text-[10px] text-honey/60 mt-2 uppercase tracking-widest">— Πέτρος Οικονομάκος, Μάνη 1996</div>
        </div>
      )}

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10 md:gap-0 text-[10px] uppercase tracking-[0.2em] font-bold">
        <button
          onClick={handleLogoClick}
          className="font-display text-lg tracking-wide text-cream normal-case hover:text-honey transition-colors text-left focus:outline-none group flex items-center gap-2"
          title="HiveShare"
        >
          <span>Hive<span className="text-honey">Share</span></span>
          <span className="text-xs opacity-0 group-hover:opacity-100 transition-opacity">🐝</span>
        </button>
        
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8">
          <Link to="/buy-honey" className="text-cream/60 hover:text-honey transition-colors">
            {isEl ? 'Αγορά Μελιού' : 'Buy Honey'}
          </Link>
          <span className="text-honey/20">·</span>
          <Link to="/verify" className="text-cream/60 hover:text-honey transition-colors">
            {isEl ? 'Έλεγχος Παρτίδας (QR)' : 'Verify Batch (QR)'}
          </Link>
          <span className="text-honey/20">·</span>
          <Link to="/privacy" className="text-cream/60 hover:text-honey transition-colors">
            {isEl ? 'Πολιτική Απορρήτου' : 'Privacy Policy'}
          </Link>
          <span className="text-honey/20">·</span>
          <Link to="/terms" className="text-cream/60 hover:text-honey transition-colors">
            {isEl ? 'Όροι Χρήσης' : 'Terms'}
          </Link>
          <span className="text-honey/20">·</span>
          <a href="mailto:info@oikonomakos.gr" className="text-cream/60 hover:text-honey transition-colors">
            {isEl ? 'Επικοινωνία' : 'Contact'}
          </a>
        </div>
        
        <div className="text-cream/30 text-center md:text-right">
          <div>{isEl ? '© 2026 HiveShare · Σπάρτη & Μάνη, Λακωνία' : '© 2026 HiveShare · Sparta, Laconia, Greece'}</div>
          <div className="text-[9px] text-honey/40 normal-case tracking-normal font-mono mt-0.5">
            {isEl ? '🐝 35.2°C θερμοκρασία γόνου κυψέλης · Όλα ήρεμα' : '🐝 35.2°C brood temperature · Colony calm'}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
