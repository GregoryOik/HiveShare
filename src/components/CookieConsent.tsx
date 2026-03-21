import React, { useState, useEffect } from 'react';
import { Cookie, X } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('hiveshare_cookie_consent');
    if (!consent) {
      // Small delay for UX
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptAll = () => {
    localStorage.setItem('hiveshare_cookie_consent', 'all');
    setVisible(false);
  };

  const acceptEssential = () => {
    localStorage.setItem('hiveshare_cookie_consent', 'essential');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9999] p-4 animate-in slide-in-from-bottom duration-500">
      <div className="max-w-4xl mx-auto bg-[#110C05] border border-honey/20 rounded-[2px] shadow-2xl shadow-black/50 p-6">
        <div className="flex items-start gap-4">
          <Cookie className="w-6 h-6 text-honey shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-sm font-display text-white mb-2">We Value Your Privacy 🍯</h3>
            <p className="text-xs text-white/50 leading-relaxed mb-4">
              We use essential cookies to keep you logged in and remember your preferences. We also use analytics cookies to understand how visitors interact with our site. 
              You can read more in our <Link to="/privacy" className="text-honey hover:underline">Privacy Policy</Link>.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <button 
                onClick={acceptAll}
                className="bg-honey text-white px-6 py-2.5 text-[10px] uppercase tracking-widest font-medium hover:bg-honey/90 transition-colors rounded-[2px]"
              >
                Accept All
              </button>
              <button 
                onClick={acceptEssential}
                className="bg-transparent border border-white/20 text-white/70 px-6 py-2.5 text-[10px] uppercase tracking-widest font-medium hover:border-white/40 hover:text-white transition-colors rounded-[2px]"
              >
                Essential Only
              </button>
            </div>
          </div>
          <button 
            onClick={acceptEssential} 
            className="text-white/30 hover:text-white/60 transition-colors shrink-0"
            aria-label="Close cookie banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
