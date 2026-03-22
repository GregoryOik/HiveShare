import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[#050302] text-cream/50 py-16 px-6 border-t border-honey/10 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10 md:gap-0 text-[10px] uppercase tracking-[0.2em] font-bold">
        <div className="font-display text-lg tracking-wide text-cream normal-case">
          Hive<span className="text-honey">Share</span>
        </div>
        
        <div className="flex items-center gap-10">
          <Link to="/privacy" className="text-cream/60 hover:text-honey transition-colors">Privacy Policy</Link>
          <span className="text-honey/20">·</span>
          <Link to="/terms" className="text-cream/60 hover:text-honey transition-colors">Terms</Link>
          <span className="text-honey/20">·</span>
          <a href="mailto:hello@hiveshare.gr" className="text-cream/60 hover:text-honey transition-colors">Contact</a>
        </div>
        
        <div className="text-cream/30">© 2026 HiveShare · Sparta, Laconia, Greece</div>
      </div>
    </footer>
  );
};

export default Footer;
