import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Package, 
  Truck, 
  CheckCircle2, 
  MapPin, 
  Calendar, 
  ChevronRight, 
  ArrowLeft,
  Clock,
  Sparkles,
  ShieldAlert,
  Info
} from 'lucide-react';
import { useAuth } from '../lib/useAuth';
import { useHiveData, useSiteConfig } from '../lib/useHiveData';
import Footer from '../components/Footer';

export default function Harvest() {
  const { profile } = useAuth();
  const { hives, loading } = useHiveData();
  const { config } = useSiteConfig();

  // Maintenance Mode Interceptor
  if (config?.maintenanceMode && profile?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-[#0A0704] flex items-center justify-center p-6 text-center">
        <div className="max-w-md space-y-8 animate-in fade-in zoom-in duration-1000">
           <ShieldAlert className="w-24 h-24 text-honey mx-auto opacity-50" strokeWidth={1} />
           <div className="space-y-4">
             <h2 className="font-display text-4xl text-white tracking-tight">HIVE_STASIS</h2>
             <p className="text-[10px] uppercase tracking-[0.3em] font-black text-honey">Logistics Temporarily Locked</p>
             <p className="text-sm text-white/40 leading-relaxed font-sans">
               We are updating the nomadic route maps. Access will be restored shortly.
             </p>
           </div>
        </div>
      </div>
    );
  }

  const selectedHiveId = profile?.subscribedHives?.[0];
  const activeHive = hives.find(h => h.id === selectedHiveId);

  // Multi-Level Inheritance Logic
  const currentHarvestName = profile?.customHoneyName || activeHive?.activeHarvest || config?.globalHarvestName || 'Spring Wildflower';
  const currentHarvestDate = profile?.userHarvestStatus || activeHive?.nextHarvestDate || config?.globalHarvestDate || 'April - May';

  const harvests = [
    {
      id: 'current',
      name: currentHarvestName,
      period: `Estimated Phase: ${currentHarvestDate}`,
      delivery: 'Shipping: Seasonal Flow',
      status: 'upcoming',
      description: 'Your primary nomadic yield, following the ancient bloom cycles of Greece.',
      varietal: activeHive?.beeSpecies || 'Mani Wildflower'
    },
    {
      id: 'summer',
      name: 'Summer Thyme',
      period: 'Harvest: July - August',
      delivery: 'Shipping: September',
      status: 'pending',
      description: 'Intense, aromatic honey from the high-altitude thyme fields.',
      varietal: 'Pure Cretan Thyme'
    },
    {
      id: 'autumn',
      name: 'Autumn Pine',
      period: 'Harvest: October - November',
      delivery: 'Shipping: December',
      status: 'pending',
      description: 'Rich, dark forest honey with low sweetness and high mineral content.',
      varietal: 'Black Pine Resin'
    }
  ];

  return (
    <div className="min-h-screen bg-hive-bg text-[#2A1B0A]/80 font-body selection:bg-honey selection:text-[#2A1B0A] flex flex-col relative overflow-hidden">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-honey/5 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-honey/5 blur-[120px] rounded-full"></div>
      </div>

      <header className="border-b border-honey/10 bg-hive-bg/80 backdrop-blur-md sticky top-0 z-50 relative">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between w-full">
          <div className="flex items-center gap-6">
            <Link to="/dashboard" className="p-2 hover:bg-honey/10 rounded-full transition-colors text-honey">
              <ArrowLeft size={20} />
            </Link>
            <Link to="/" className="font-display text-2xl tracking-wide text-[#2A1B0A]">
              Hive<span className="text-honey">Share</span>
            </Link>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="px-3 py-1 bg-honey/10 border border-honey/20 rounded-full text-[9px] uppercase font-bold text-honey tracking-widest">
               Logistics Active
             </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-16 relative z-10 w-full flex-1">
        <div className="mb-16 text-center space-y-4">
          <h1 className="font-display text-5xl text-[#2A1B0A]">Harvest <span className="italic text-pale-honey">{config?.harvestSeason || 'Timeline'}</span></h1>
          <p className="text-sm text-[#2A1B0A]/60 max-w-lg mx-auto leading-relaxed font-sans">
            {config?.siteWideHarvestDescription || 'Your nomadic journey follows the ancient bloom cycles of Greece. Here is the schedule for your seasonal honey yields.'}
          </p>
        </div>

        {/* Shipping Address Critical Check */}
        {!profile?.shippingAddress && (
          <div className="mb-12 bg-red-500/5 border border-red-500/20 p-8 rounded-lg flex flex-col md:flex-row items-center justify-between gap-8 backdrop-blur-sm animate-pulse">
            <div className="flex items-center gap-6 text-left">
              <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center shrink-0">
                <MapPin className="text-red-500 w-6 h-6" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-black text-[#2A1B0A] uppercase tracking-widest">Logistics Alert: No Address Found</p>
                <p className="text-xs text-[#2A1B0A]/70 leading-relaxed font-medium">We cannot fulfill your upcoming harvest deliveries without a verified shipping address.</p>
              </div>
            </div>
            <Link 
              to="/settings" 
              className="px-8 py-4 bg-[#2A1B0A] text-white text-[10px] uppercase tracking-widest font-black hover:bg-honey hover:text-[#2A1B0A] transition-all rounded-sm flex items-center gap-2"
            >
              Update Shipping Coordinates <ChevronRight size={14} />
            </Link>
          </div>
        )}

        {/* Harvest Cards */}
        <div className="space-y-8">
          {harvests.map((harvest, index) => (
            <div 
              key={harvest.id}
              className={`relative bg-white border rounded-lg p-8 transition-all duration-500 group overflow-hidden ${
                harvest.status === 'upcoming' 
                  ? 'border-honey/40 shadow-xl shadow-honey/5' 
                  : 'border-[#2A1B0A]/5 opacity-80'
              }`}
            >
              {/* Seasonal Accents */}
              <div className={`absolute top-0 right-0 w-32 h-32 blur-[60px] rounded-full -translate-y-1/2 translate-x-1/2 opacity-20 pointer-events-none ${
                index === 0 ? 'bg-green-400' : index === 1 ? 'bg-honey' : 'bg-red-400'
              }`}></div>

              <div className="flex flex-col lg:flex-row gap-10 relative z-10">
                <div className="lg:w-1/3 space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      {harvest.status === 'upcoming' ? (
                        <div className="px-3 py-0.5 bg-honey/10 border border-honey/20 text-honey text-[8px] font-black uppercase tracking-widest rounded-full flex items-center gap-1.5">
                          <Sparkles size={10} /> Next In Cycle
                        </div>
                      ) : (
                        <div className="px-3 py-0.5 bg-black/5 border border-black/10 text-black/40 text-[8px] font-black uppercase tracking-widest rounded-full">
                          Scheduled
                        </div>
                      )}
                    </div>
                    <h2 className="text-3xl font-display text-[#2A1B0A]">{harvest.name}</h2>
                    <p className="text-[10px] text-honey font-black uppercase tracking-[0.2em]">{harvest.varietal}</p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-[#2A1B0A]/60">
                      <Calendar size={16} className="text-honey" />
                      <span className="text-xs font-medium">{harvest.period}</span>
                    </div>
                    <div className="flex items-center gap-3 text-[#2A1B0A]/60">
                      <Truck size={16} className="text-honey" />
                      <span className="text-xs font-bold">{harvest.delivery}</span>
                    </div>
                  </div>
                </div>

                <div className="flex-1 lg:border-l lg:border-black/5 lg:pl-10 flex flex-col justify-between">
                  <div className="space-y-4">
                    <p className="text-sm text-[#2A1B0A]/70 leading-relaxed italic">
                      "{harvest.description}"
                    </p>
                    <div className="p-4 bg-honey/5 border border-honey/10 rounded-md flex items-start gap-3">
                      <Info size={14} className="text-honey mt-0.5" />
                      <p className="text-[10px] text-[#2A1B0A]/50 font-medium leading-relaxed">
                        Production status is estimated based on current apiary weights. Premium members receive 2x the standard yield for this varietal.
                      </p>
                    </div>
                  </div>

                  {/* Visual Tracker Bar */}
                  <div className="mt-8 space-y-4">
                    <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-[#2A1B0A]/40 mb-2">
                      <span>Bloom</span>
                      <span>Extraction</span>
                      <span>Jars</span>
                      <span>Transit</span>
                    </div>
                    <div className="h-1.5 w-full bg-black/5 rounded-full relative">
                      <div 
                        className={`h-full bg-honey rounded-full transition-all duration-1000 ${
                          harvest.status === 'upcoming' ? 'w-[25%]' : 'w-0'
                        }`}
                      />
                      {/* Dots */}
                      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-3 h-3 bg-honey border-2 border-white rounded-full"></div>
                      <div className="absolute top-1/2 left-[33%] -translate-y-1/2 w-2 h-2 bg-white border border-black/10 rounded-full"></div>
                      <div className="absolute top-1/2 left-[66%] -translate-y-1/2 w-2 h-2 bg-white border border-black/10 rounded-full"></div>
                      <div className="absolute top-1/2 left-full -translate-y-1/2 w-2 h-2 bg-white border border-black/10 rounded-full -translate-x-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-[#1A1208] text-white p-10 rounded-lg text-center space-y-6 relative overflow-hidden">
           <div className="absolute inset-0 bg-honey/5 pointer-events-none"></div>
           <Package className="w-12 h-12 text-honey mx-auto mb-4" />
           <h3 className="text-2xl font-display">Ready for the Honey Flow?</h3>
           <p className="text-sm text-white/60 max-w-lg mx-auto leading-relaxed font-sans">
             Each harvest yield is carefully jarred and wax-sealed in our facility in Laconia. You will receive an automated tracking link the moment your specific batch leaves the apiary.
           </p>
           <div className="pt-4">
              <Link to="/settings" className="text-[10px] uppercase tracking-[0.3em] text-honey font-black hover:text-white transition-colors">
                Contact Logistics Support
              </Link>
           </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
