import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../lib/useLanguage';

const Footer = () => {
  const { language } = useLanguage();
  const isEl = language === 'el';

  return (
    <footer className="bg-[#050302] text-cream/50 py-16 px-6 border-t border-honey/10 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10 md:gap-0 text-[10px] uppercase tracking-[0.2em] font-bold">
        <div className="font-display text-lg tracking-wide text-cream normal-case">
          Hive<span className="text-honey">Share</span>
        </div>
        
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
        
        <div className="text-cream/30">
          {isEl ? '© 2026 HiveShare · Σπάρτη & Μάνη, Λακωνία' : '© 2026 HiveShare · Sparta, Laconia, Greece'}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
