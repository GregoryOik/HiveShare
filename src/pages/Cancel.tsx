import React from 'react';
import { XCircle, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Cancel() {
  return (
    <div className="min-h-screen bg-[#1A1208] text-white flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 mx-auto bg-honey/10 border border-honey/20 rounded-full flex items-center justify-center">
          <XCircle className="w-10 h-10 text-honey" />
        </div>
        
        <div className="space-y-4">
          <h1 className="font-display text-4xl text-white">Payment Canceled</h1>
          <p className="text-white/60 leading-relaxed font-light">
            No worries! Your hive is still waiting for you. If you had trouble with the checkout, feel free to try again or contact our support.
          </p>
        </div>

        <div className="pt-6 flex flex-col gap-4">
          <Link 
            to="/membership" 
            className="inline-flex items-center justify-center gap-2 bg-honey text-white px-10 py-4 text-xs uppercase tracking-widest font-medium hover:bg-honey/90 transition-all rounded-sm group"
          >
            <ShoppingCart className="w-4 h-4" />
            Return to Membership Plans
          </Link>
          <Link 
            to="/dashboard" 
            className="text-[10px] uppercase tracking-widest text-white/30 hover:text-white transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
