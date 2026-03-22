import React, { useState, useEffect } from 'react';
import { Loader2, Check, AlertTriangle, X, Trash2, LogOut, ArrowRight } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../lib/useAuth';
import { db } from '../lib/firebase';
import { collection, addDoc, onSnapshot, doc } from 'firebase/firestore';

interface CartPlan {
  id: 'starter' | 'premium' | 'corporate';
  name: string;
  price: number;
  link?: string;
}

export default function Membership() {
  const navigate = useNavigate();
  const location = useLocation() as { state?: { tier?: string } };
  const { user, profile, logout } = useAuth();
  
  const [cartPlan, setCartPlan] = useState<CartPlan | null>(null);
  const [hasOliveOil, setHasOliveOil] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);
  const [debugLog, setDebugLog] = useState<string[]>([]);

  const addDebug = (msg: string) => setDebugLog(prev => [...prev.slice(-4), msg]);

  // Pre-select plan if passed from landing/login
  useEffect(() => {
    if (location.state?.tier && !cartPlan) {
      const tierId = location.state.tier;
      if (tierId === 'starter') {
        setCartPlan({ id: 'starter', name: 'Starter Membership', price: 80 });
      } else if (tierId === 'premium') {
        setCartPlan({ id: 'premium', name: 'Premium Membership', price: 200 });
      }
      // Clear the state so it doesn't re-trigger
      window.history.replaceState({}, document.title);
    }
  }, [location.state, cartPlan]);

  const cartTotal = (cartPlan?.price || 0) + (hasOliveOil ? 18 : 0);

  const handleCheckout = async () => {
    if (!user || !cartPlan) return;
    
    setIsRedirecting(true);
    setErrorStatus(null);
    addDebug('Starting checkout session...');
    
    try {
      const priceId = cartPlan.id === 'premium' 
        ? 'price_1TDafLEhPXKoQqYJa9nt3rEy' 
        : 'price_1TDaerEhPXKoQqYJKuvCxiBR';
      
      const OIL_PRICE_ID = 'price_1TDanWEhPXKoQqYJY2gq1Fj0';

      const line_items = [{ price: priceId, quantity: 1 }];
      if (hasOliveOil) line_items.push({ price: OIL_PRICE_ID, quantity: 1 });

      addDebug('Adding document to Firestore...');
      
      const docRef = await addDoc(collection(db, 'users', user.uid, 'checkout_sessions'), {
        line_items,
        success_url: `${window.location.origin}/success?tier=${cartPlan.id}&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: window.location.origin + '/membership',
        allow_promotion_codes: true,
        metadata: {
          tier: cartPlan.id,
          hasOliveOil: hasOliveOil.toString()
        }
      });

      addDebug('Document created. ID: ' + docRef.id);
      addDebug('Waiting for Stripe Extension URL...');

      const timeout = setTimeout(() => {
        setIsRedirecting(false);
        setErrorStatus('The Stripe Extension is taking too long to respond. This usually means the API key is not configured correctly in the Firebase Console.');
      }, 15000);

      onSnapshot(doc(db, 'users', user.uid, 'checkout_sessions', docRef.id), (snap) => {
        const data = snap.data();
        if (data?.url) {
          clearTimeout(timeout);
          addDebug('Redirecting to Stripe!');
          window.location.assign(data.url);
        } else if (data?.error) {
          clearTimeout(timeout);
          setIsRedirecting(false);
          const errMsg = data.error.message || 'Unknown error from extension';
          setErrorStatus(`Stripe Extension Error: ${errMsg}`);
          console.error(data.error);
        }
      });

    } catch (err: any) {
      console.error('Error starting checkout:', err);
      setIsRedirecting(false);
      setErrorStatus(`Failed to initiate checkout: ${err.message || 'Permission denied'}.`);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0704] text-white/80 font-body selection:bg-honey selection:text-white flex flex-col">
      <header className="border-b border-honey/10 bg-[#0A0704]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between w-full">
          <Link to="/dashboard" className="font-display text-2xl tracking-wide text-white">
            Hive<span className="text-honey">Share</span>
          </Link>
          <div className="flex items-center gap-6">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-1">Authenticated as</span>
              <span className="text-xs font-medium text-honey">{user?.email}</span>
            </div>
            <button onClick={logout} className="p-2 text-white/20 hover:text-white transition-colors" title="Logout">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-12 md:py-20 lg:flex gap-12">
        {/* Left Column: Selection */}
        <div className="flex-1 space-y-12">
          <div>
            <div className="text-[10px] uppercase tracking-[0.4em] text-honey font-bold mb-4">Step 02 of 03</div>
            <h1 className="font-display text-4xl md:text-5xl text-white mb-6">Select Your Plan</h1>
            <p className="text-white/40 max-w-xl text-sm leading-relaxed">
              Your membership directly supports the ancient beekeeping tradition of Mani, Greece. Choose the level of connection that suits you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Starter Card */}
            <button 
              onClick={() => setCartPlan({ id: 'starter', name: 'Starter Membership', price: 80 })}
              className={`text-left p-8 rounded-[2px] border transition-all duration-300 relative overflow-hidden group ${
                cartPlan?.id === 'starter' 
                  ? 'bg-honey/10 border-honey shadow-[0_0_30px_rgba(200,134,10,0.1)]' 
                  : 'bg-[#110C05] border-honey/20 hover:border-honey/40'
              }`}
            >
              {cartPlan?.id === 'starter' && <div className="absolute top-4 right-4"><Check size={20} className="text-honey" /></div>}
              <div className="text-[10px] uppercase tracking-widest text-honey/60 mb-8">Basic Sponsorship</div>
              <h3 className="font-display text-2xl text-white mb-2">Starter</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-3xl font-display text-white">80</span>
                <span className="text-sm text-white/40 italic">€ / yr</span>
              </div>
              <ul className="space-y-3 text-[11px] uppercase tracking-wider text-white/50 group-hover:text-white/80 transition-colors">
                <li>— 2.5kg Annual Honey</li>
                <li>— Welcome Jar (250g)</li>
                <li>— Basic Telemetry</li>
              </ul>
            </button>

            {/* Premium Card */}
            <button 
              onClick={() => setCartPlan({ id: 'premium', name: 'Premium Membership', price: 200 })}
              className={`text-left p-8 rounded-[2px] border transition-all duration-300 relative overflow-hidden group ${
                cartPlan?.id === 'premium' 
                  ? 'bg-honey/15 border-honey shadow-[0_0_50px_rgba(200,134,10,0.15)]' 
                  : 'bg-[#110C05] border-honey/20 hover:border-honey/40'
              }`}
            >
              <div className="absolute top-0 right-0 bg-honey text-[#0A0704] text-[8px] font-bold px-3 py-1 uppercase tracking-widest">Recommended</div>
              {cartPlan?.id === 'premium' && <div className="absolute top-4 right-4"><Check size={20} className="text-honey" /></div>}
              <div className="text-[10px] uppercase tracking-widest text-honey/60 mb-8">Elite Sponsorship</div>
              <h3 className="font-display text-2xl text-white mb-2">Premium</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-3xl font-display text-white">200</span>
                <span className="text-sm text-white/40 italic">€ / yr</span>
              </div>
              <ul className="space-y-3 text-[11px] uppercase tracking-wider text-white/50 group-hover:text-white/80 transition-colors">
                <li>— 5kg Annual Honey</li>
                <li>— Named Jar & Certificate</li>
                <li>— Full Acoustic Data</li>
              </ul>
            </button>
          </div>

          <div className={`p-8 rounded-[2px] border transition-all duration-300 ${hasOliveOil ? 'bg-honey/5 border-honey/40' : 'bg-[#110C05] border-honey/10'}`}>
            <div className="flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="flex flex-col items-center md:items-start text-center md:text-left">
                <div className="text-[10px] uppercase tracking-widest text-honey mb-2 font-bold italic">Add-on Special</div>
                <h3 className="font-display text-2xl text-white mb-1">Laconian Olive Oil · 500ml</h3>
                <p className="text-xs text-white/40">Single-estate, cold-pressed (Autumn harvest)</p>
              </div>
              <div className="flex flex-col items-center md:items-end">
                <div className="text-2xl font-display text-honey mb-4">18 €</div>
                <button 
                  onClick={() => setHasOliveOil(!hasOliveOil)}
                  className={`px-8 py-3 text-[10px] uppercase tracking-widest font-bold transition-all rounded-[2px] ${
                    hasOliveOil 
                      ? 'bg-honey text-white border border-honey' 
                      : 'bg-white/5 text-white/40 border border-white/10 hover:border-honey/40 hover:text-honey'
                  }`}
                >
                  {hasOliveOil ? 'Remove from order' : 'Add to order'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <aside className="w-full lg:w-96 mt-12 lg:mt-0">
          <div className="bg-[#110C05] border border-honey/20 p-8 rounded-[2px] sticky top-32 shadow-2xl">
            <h2 className="font-display text-2xl text-white mb-8 border-b border-honey/10 pb-4">Order Summary</h2>
            
            <div className="space-y-6 mb-10">
              {cartPlan ? (
                <div className="flex justify-between items-start group text-left">
                  <div>
                    <div className="text-xs font-bold text-white uppercase tracking-widest mb-1">{cartPlan.name}</div>
                    <div className="text-[10px] text-white/30 uppercase tracking-widest italic">Annual Subscription</div>
                  </div>
                  <div className="text-lg font-display text-honey tracking-tighter">{cartPlan.price}€</div>
                </div>
              ) : (
                <div className="text-xs text-white/20 italic text-center py-4 border border-dashed border-white/10 rounded-sm">
                  Please select a plan to view your summary
                </div>
              )}

              {hasOliveOil && (
                <div className="flex justify-between items-start pt-4 border-t border-white/5 group text-left">
                  <div>
                    <div className="text-xs font-bold text-white uppercase tracking-widest mb-1">Laconian Olive Oil</div>
                    <div className="text-[10px] text-white/30 uppercase tracking-widest italic">500ml Add-on</div>
                  </div>
                  <div className="text-lg font-display text-honey tracking-tighter">18€</div>
                </div>
              )}
            </div>

            <div className="flex justify-between items-end mb-8 pt-6 border-t border-honey/20">
              <div className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-bold">Total Due Now</div>
              <div className="text-4xl font-display text-white transition-all duration-500 scale-110 origin-right">{cartTotal}€</div>
            </div>

            {errorStatus && (
              <div className="mb-6 p-4 bg-red-900/20 border border-red-500/50 rounded-sm text-left">
                <div className="flex gap-3 text-red-400">
                  <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                  <p className="text-[10px] leading-relaxed uppercase tracking-wider">{errorStatus}</p>
                </div>
              </div>
            )}

            <button 
              onClick={handleCheckout}
              disabled={!cartPlan || isRedirecting}
              className="w-full bg-honey text-white py-5 text-xs uppercase tracking-[0.3em] font-bold hover:bg-honey/90 transition-all rounded-[2px] shadow-[0_0_30px_rgba(200,134,10,0.2)] hover:shadow-[0_0_50px_rgba(200,134,10,0.4)] disabled:opacity-20 disabled:cursor-not-allowed group flex items-center justify-center gap-3"
            >
              {isRedirecting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  Complete Adoption
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            {isRedirecting && debugLog.length > 0 && (
              <div className="mt-6 p-3 bg-black/50 rounded-sm border border-white/5 text-left">
                <div className="text-[8px] uppercase tracking-widest text-white/20 mb-2">System Status</div>
                {debugLog.map((log, i) => (
                  <div key={i} className="text-[9px] text-honey/60 font-mono mb-1 truncate">→ {log}</div>
                ))}
              </div>
            )}

            <p className="mt-8 text-[9px] text-white/20 text-center uppercase tracking-widest leading-loose">
              Secure payments handled by Stripe.<br/>
              By proceeding, you agree to the <Link to="/terms" className="text-honey/40 hover:text-honey underline">Terms of Service</Link>.
            </p>
          </div>
        </aside>
      </main>
    </div>
  );
}
