import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#1A1208] text-white flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="font-display text-[8rem] leading-none text-honey/20 select-none">404</div>
        
        <div className="space-y-4 -mt-8">
          <h1 className="font-display text-4xl text-white">Page Not Found</h1>
          <p className="text-white/60 leading-relaxed font-light">
            This hive seems to have swarmed elsewhere. The page you're looking for doesn't exist.
          </p>
        </div>

        <div className="pt-4 flex flex-col gap-4">
          <Link 
            to="/" 
            className="inline-block bg-honey text-white px-10 py-4 text-xs uppercase tracking-widest font-medium hover:bg-honey/90 transition-all hover:shadow-[0_0_20px_rgba(200,134,10,0.3)] rounded-sm"
          >
            Back to Home
          </Link>
          <Link 
            to="/dashboard" 
            className="text-[10px] uppercase tracking-widest text-white/30 hover:text-white transition-colors"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
