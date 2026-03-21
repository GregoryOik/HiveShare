import React from 'react';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Success() {
  return (
    <div className="min-h-screen bg-[#1A1208] text-white flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 mx-auto bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center">
          <CheckCircle className="w-10 h-10 text-green-500" />
        </div>
        
        <div className="space-y-4">
          <h1 className="font-display text-4xl text-white">Welcome to the Hive!</h1>
          <p className="text-white/60 leading-relaxed font-light">
            Your membership is now active. We are preparing your Welcome Jar and assigning your specific hive in Laconia, Greece.
          </p>
        </div>

        <div className="bg-[#110C05] border border-honey/10 p-6 rounded-[2px] text-left space-y-3">
          <p className="text-[10px] uppercase tracking-widest text-honey font-bold">What happens next?</p>
          <ul className="text-sm text-white/70 space-y-2 font-light">
            <li>• Your Welcome Jar ships within 2 weeks.</li>
            <li>• You will receive an email with your unique Hive ID.</li>
            <li>• Live data will appear in your dashboard shortly.</li>
          </ul>
        </div>

        <div className="pt-6">
          <Link 
            to="/dashboard" 
            className="inline-flex items-center gap-2 bg-honey text-white px-10 py-4 text-xs uppercase tracking-widest font-medium hover:bg-honey/90 transition-all hover:shadow-[0_0_20px_rgba(200,134,10,0.3)] rounded-sm group"
          >
            Go to My Dashboard
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}
