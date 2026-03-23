import React from 'react';
import { 
  DollarSign, 
  TrendingUp,
  Zap
} from 'lucide-react';
import { UserProfile } from '../../lib/useAdminUsers';

interface AdminFinanceProps {
  users: UserProfile[];
}

export function AdminFinance({ users }: AdminFinanceProps) {
  const premiumUsers = users.filter(u => u.tier);
  const conversionRate = Math.round((premiumUsers.length / users.length) * 100) || 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-3 gap-6">
         <div className="bg-[#120D08] border border-honey/10 p-8 rounded-lg">
            <div className="text-[10px] uppercase tracking-widest text-honey/40 font-black mb-2">Annual Run Rate</div>
            <div className="text-3xl font-display text-white">€42,800</div>
            <div className="flex items-center gap-1 text-green-400 text-[10px] font-bold mt-2">
               <TrendingUp size={12}/> +12.5% this season
            </div>
         </div>
         <div className="bg-[#120D08] border border-honey/10 p-8 rounded-lg">
            <div className="text-[10px] uppercase tracking-widest text-honey/40 font-black mb-2">Active Subscriptions</div>
            <div className="text-3xl font-display text-white">{premiumUsers.length}</div>
            <div className="text-[10px] text-honey/40 font-bold mt-2">
               {conversionRate}% Conversion Rate
            </div>
         </div>
         <div className="bg-[#120D08] border border-honey/10 p-8 rounded-lg">
            <div className="text-[10px] uppercase tracking-widest text-honey/40 font-black mb-2">Maintenance Overhead</div>
            <div className="text-3xl font-display text-red-400/80">€3,200</div>
            <div className="text-[10px] text-white/20 font-bold mt-2">
               Incl. hive sensor repairs
            </div>
         </div>
      </div>
      
      <div className="bg-[#120D08] border border-honey/10 rounded-lg p-10 flex flex-col items-center justify-center text-center space-y-6">
        <DollarSign size={48} className="text-honey" />
        <div className="space-y-2">
          <h2 className="text-3xl font-display text-white">Stripe Integration Vault</h2>
          <p className="text-sm text-honey/40 max-w-md mx-auto">Redirect to Stripe Dashboard for detailed invoicing and historical tax records.</p>
        </div>
        <a 
          href="https://dashboard.stripe.com" 
          target="_blank" 
          rel="noreferrer"
          className="px-10 py-4 bg-honey text-[#0A0704] text-[10px] uppercase font-black tracking-widest rounded-lg"
        >
          Open External Stripe Dashboard
        </a>
      </div>
    </div>
  );
}
