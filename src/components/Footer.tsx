import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../lib/useLanguage';

const Footer = () => {
  const { language } = useLanguage();
  const isEl = language === 'el';

  return (
    <footer className="bg-[#0A0704] text-[#E8DFD1]/60 py-16 px-6 border-t border-[#C8860A]/15 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 md:gap-0 text-[10px] uppercase tracking-[0.25em] font-medium">
        <Link to="/" className="font-serif text-xl tracking-wider text-[#FFFDF7] normal-case hover:text-honey transition-colors">
          Hive<span className="text-honey">Share</span>
        </Link>
        
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8">
          <Link to="/buy-honey" className="hover:text-honey transition-colors">
            {isEl ? 'Συλλογή Μελιών' : 'Artisanal Jars'}
          </Link>
          <span className="text-honey/20">·</span>
          <Link to="/verify" className="hover:text-honey transition-colors">
            {isEl ? 'Έλεγχος Παρτίδας' : 'Verify Batch'}
          </Link>
          <span className="text-honey/20">·</span>
          <Link to="/privacy" className="hover:text-honey transition-colors">
            {isEl ? 'Πολιτική Απορρήτου' : 'Privacy'}
          </Link>
          <span className="text-honey/20">·</span>
          <Link to="/terms" className="hover:text-honey transition-colors">
            {isEl ? 'Όροι' : 'Terms'}
          </Link>
          <span className="text-honey/20">·</span>
          <a href="mailto:info@oikonomakos.gr" className="hover:text-honey transition-colors">
            {isEl ? 'Επικοινωνία' : 'Contact'}
          </a>
        </div>
        
        <div className="text-[#E8DFD1]/40 text-center md:text-right font-light tracking-widest">
          {isEl ? '© 2026 HiveShare · Σπάρτη & Μάνη, Λακωνία' : '© 2026 HiveShare · Sparta, Laconia, Greece'}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
