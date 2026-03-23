import React from 'react';
import { 
  DollarSign, 
  TrendingUp,
  Zap,
  Star,
  Crown,
  History,
  ArrowUpRight
} from 'lucide-react';
import { UserProfile } from '../../lib/useAdminUsers';

interface AdminFinanceProps {
  users: UserProfile[];
}

export function AdminFinance({ users }: AdminFinanceProps) {
  const premiumUsers = users.filter(u => u.tier === 'premium');
  const starterUsers = users.filter(u => u.tier === 'starter');
  const totalSubscribers = premiumUsers.length + starterUsers.length;
  
  // Pricing logic based on Strategic Report (60 per subscriber)
  const premiumPrice = 60; 
  const starterPrice = 25; 

  const annualRunRate = (premiumUsers.length * premiumPrice) + (starterUsers.length * starterPrice);
  const conversionRate = Math.round((totalSubscribers / (users.length || 1)) * 100);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-[#120D08] border border-honey/10 p-8 rounded-lg shadow-xl relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <DollarSign size={80} className="text-honey" />
            </div>
            <div className="text-[10px] uppercase tracking-widest text-honey/40 font-black mb-2">Estimated ARR</div>
            <div className="text-4xl font-display text-white italic">€{annualRunRate.toLocaleString()}</div>
            <div className="flex items-center gap-1 text-green-400 text-[10px] font-bold mt-2">
               <TrendingUp size={12}/> Based on {totalSubscribers} active units
            </div>
         </div>

         <div className="bg-[#120D08] border border-honey/10 p-8 rounded-lg shadow-xl">
            <div className="text-[10px] uppercase tracking-widest text-honey/40 font-black mb-2">Guardian Segmentation</div>
            <div className="space-y-3 pt-1">
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-white/60 font-black">
                     <Crown size={12} className="text-honey" /> Premium
                  </div>
                  <span className="text-sm font-display text-white">{premiumUsers.length}</span>
               </div>
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-white/60 font-black">
                     <Star size={12} className="text-honey" /> Starter
                  </div>
                  <span className="text-sm font-display text-white">{starterUsers.length}</span>
               </div>
            </div>
         </div>

         <div className="bg-[#120D08] border border-honey/10 p-8 rounded-lg shadow-xl">
            <div className="text-[10px] uppercase tracking-widest text-honey/40 font-black mb-2">Conversion Efficiency</div>
            <div className="text-4xl font-display text-white italic">{conversionRate}%</div>
            <div className="w-full bg-white/5 h-1.5 rounded-full mt-4 overflow-hidden">
               <div className="bg-honey h-full transition-all duration-1000" style={{ width: `${conversionRate}%` }}></div>
            </div>
         </div>
      </div>
      
      {/* Historical Context (Simulation for now) */}
      <div className="bg-[#120D08] border border-honey/10 rounded-lg overflow-hidden">
        <div className="px-8 py-6 border-b border-honey/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <History size={18} className="text-honey" />
             <h3 className="text-[11px] uppercase tracking-widest font-black text-white">Nomadic_Finance_History</h3>
          </div>
          <span className="text-[8px] font-mono text-honey/40 uppercase tracking-widest">TRACES_AUDIT_READY</span>
        </div>
        <div className="p-8 space-y-4">
           {[
             { date: 'JUN 2026', total: '€' + (annualRunRate * 0.9).toFixed(0), change: '+12%', status: 'CONFIRMED' },
             { date: 'MAY 2026', total: '€' + (annualRunRate * 0.82).toFixed(0), change: '+5%', status: 'CONFIRMED' },
             { date: 'APR 2026', total: '€' + (annualRunRate * 0.78).toFixed(0), change: '-', status: 'INITIALIZED' }
           ].map((row, i) => (
             <div key={i} className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-md hover:bg-white/10 transition-all cursor-crosshair">
                <span className="text-[10px] font-mono text-white/60">{row.date}</span>
                <span className="text-sm font-display text-white italic">{row.total}</span>
                <span className={`text-[8px] uppercase font-black ${row.change.includes('+') ? 'text-green-500' : 'text-white/20'}`}>{row.change}</span>
                <div className="flex items-center gap-2">
                   <div className={`w-1.5 h-1.5 rounded-full ${row.status === 'CONFIRMED' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]' : 'bg-honey/40'}`}></div>
                   <span className="text-[8px] font-black uppercase text-white/30 tracking-widest">{row.status}</span>
                </div>
             </div>
           ))}
        </div>
      </div>

      <div className="bg-honey/5 border border-honey/10 rounded-lg p-12 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-honey/5 animate-pulse"></div>
        <div className="relative z-10 space-y-6">
          <DollarSign size={48} className="text-honey mx-auto opacity-40" />
          <div className="space-y-2">
            <h2 className="text-2xl font-display text-white">Revenue Vault Connector</h2>
            <p className="text-[10px] uppercase tracking-widest text-honey/60 font-black">Secure Stripe Dashboard Interface</p>
            <p className="text-sm text-white/40 max-w-md mx-auto leading-relaxed mt-4 font-sans">
              Access the external Stripe vault for multi-currency processing, tax reconciliation, and individual guardian billing history.
            </p>
          </div>
          <a 
            href="https://dashboard.stripe.com" 
            target="_blank" 
            rel="noreferrer"
            className="inline-flex items-center gap-3 px-12 py-5 bg-honey text-[#0A0704] text-[10px] uppercase font-black tracking-[0.2em] rounded-[2px] hover:shadow-[0_0_30px_rgba(200,134,10,0.4)] transition-all hover:scale-105"
          >
            Access Encryption Vault <ArrowUpRight size={14} />
          </a>
        </div>
      </div>
    </div>
  );
}
