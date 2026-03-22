import React, { useState, useEffect } from 'react';
import { Loader2, Check, AlertTriangle, X, Trash2, LogOut, ArrowRight, ShoppingCart, Crown, Star, Package, Award, Type } from 'lucide-react';
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

const STARTER_PRICE_ID = 'price_1TDaerEhPXKoQqYJKuvCxiBR';
const PREMIUM_PRICE_ID = 'price_1TDafLEhPXKoQqYJa9nt3rEy';
const OIL_PRICE_ID = 'price_1TDanWEhPXKoQqYJY2gq1Fj0';

export default function Membership() {
  const navigate = useNavigate();
  const location = useLocation() as { state?: { tier?: string } };
  const { user, profile, logout } = useAuth();
  
  const [cartPlan, setCartPlan] = useState<CartPlan | null>(null);
  const [hasOliveOil, setHasOliveOil] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);
  const [debugLog, setDebugLog] = useState<string[]>([]);
  const [certName, setCertName] = useState('');

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
      // 1. Determine the correct price ID for the plan
      const priceId = cartPlan.id === 'premium' ? PREMIUM_PRICE_ID : STARTER_PRICE_ID;

      // 2. Build the checkout session doc
      const line_items = [{ price: priceId, quantity: 1 }];
      if (hasOliveOil) line_items.push({ price: OIL_PRICE_ID, quantity: 1 });

      addDebug('Adding document to Firestore...');
      
      const docRef = await addDoc(collection(db, 'customers', user.uid, 'checkout_sessions'), {
        line_items, // For newer versions
        prices: line_items, // For older versions (they use the same structure)
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

      onSnapshot(doc(db, 'customers', user.uid, 'checkout_sessions', docRef.id), (snap) => {
        const data = snap.data();
        if (data?.url) {
          clearTimeout(timeout);
          addDebug('URL found! Redirecting...');
          window.location.assign(data.url);
        } else if (data?.error) {
          clearTimeout(timeout);
          setIsRedirecting(false);
          setErrorStatus(data.error.message || 'Error from Stripe Extension');
          addDebug('Stripe error detected.');
        }
      });

    } catch (err: any) {
      console.error('Checkout error:', err);
      setIsRedirecting(false);
      setErrorStatus(err.message || 'Failed to initiate checkout.');
      addDebug('Critical error: ' + err.message);
    }
  };

  const CertificatePreview = ({ name, tier }: { name: string; tier: string }) => (
    <div className="relative aspect-[1.414/1] w-full bg-[#FCF8F1] border-[12px] border-[#C8860A] p-8 text-[#1A1208] shadow-2xl rounded-sm overflow-hidden group">
      {/* Ornate corners */}
      <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-[#C8860A]/30"></div>
      <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-[#C8860A]/30"></div>
      <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-[#C8860A]/30"></div>
      <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-[#C8860A]/30"></div>
      
      {/* Background Seal watermark */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none">
        <Award size={240} strokeWidth={1} />
      </div>

      <div className="h-full border border-[#C8860A]/20 flex flex-col items-center justify-center text-center p-6 bg-white/40">
        <div className="text-[10px] uppercase tracking-[0.4em] mb-4 text-[#C8860A] font-bold">Certificate of Adoption</div>
        <div className="w-12 h-[1px] bg-[#C8860A]/30 mb-6"></div>
        
        <div className="font-display text-sm italic mb-2">This official document confirms that</div>
        <div className="font-display text-3xl md:text-4xl mb-4 text-[#1A1208] border-b border-[#C8860A]/20 min-w-[200px] px-4 pb-1">
          {name || 'Your Name Here'}
        </div>
        <div className="font-display text-sm italic mb-6">is now a dedicated guardian of a honey bee colony in</div>
        
        <div className="text-lg font-display uppercase tracking-[0.2em] text-[#C8860A] mb-8">Lagia, Mani · Greece</div>
        
        <div className="grid grid-cols-2 w-full gap-8 pt-6 border-t border-[#C8860A]/10">
          <div className="text-left">
            <div className="text-[8px] uppercase tracking-widest text-black/40 mb-1">Membership Tier</div>
            <div className="text-[10px] font-bold uppercase">{tier}</div>
          </div>
          <div className="text-right">
            <div className="text-[8px] uppercase tracking-widest text-black/40 mb-1">Issue Date</div>
            <div className="text-[10px] font-bold uppercase">{new Date().getFullYear()} Season</div>
          </div>
        </div>
        
        {/* Decorative Seal */}
        <div className="absolute bottom-10 left-12 opacity-20 rotate-12">
          <div className="w-16 h-16 rounded-full border-4 border-double border-[#C8860A] flex items-center justify-center">
            <div className="text-[8px] font-bold tracking-tighter text-[#C8860A]">SPARTA</div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-hive-bg text-[#2A1B0A]/80 font-body selection:bg-honey selection:text-[#2A1B0A] flex flex-col relative overflow-hidden">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-honey/10 blur-[150px] rounded-full opacity-50"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-honey/10 blur-[150px] rounded-full opacity-50"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_rgba(200,134,10,0.05)_0%,_transparent_70%)]"></div>
      </div>

      <header className="border-b border-honey/10 bg-hive-bg/80 backdrop-blur-md sticky top-0 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="font-display text-2xl tracking-wide group flex items-center gap-2">
            <span className="text-[#2A1B0A] group-hover:text-honey transition-colors">Hive</span><span className="text-honey">Share</span>
          </Link>
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-end mr-4 hidden sm:flex">
              <span className="text-[9px] uppercase tracking-[0.2em] text-[#2A1B0A]/30 font-bold">Secure Checkout</span>
              <span className="text-[10px] text-honey font-medium">{user?.email}</span>
            </div>
            <button onClick={logout} className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#2A1B0A]/40 hover:text-[#2A1B0A] transition-all duration-300 group flex items-center gap-2">
              <LogOut className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pt-12 md:pt-20 pb-20 flex-1 w-full relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16">
          
          {/* Left Column: Plan Selection */}
          <div className="md:col-span-12 lg:col-span-7 space-y-12">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-honey mb-2 group">
                <div className="w-6 h-6 rounded-full border border-honey/30 flex items-center justify-center text-[10px] font-bold group-hover:border-honey transition-colors">02</div>
                <span className="text-[10px] uppercase tracking-[0.3em] font-bold">Select Your Membership Level</span>
              </div>
              <h1 className="font-display text-5xl text-[#2A1B0A]">Choose your connection</h1>
              <p className="text-[#2A1B0A]/60 max-w-lg leading-relaxed font-light">
                Select the tier that best matches your commitment to Laconia's bees. Both plans include pure harvests and real-time tracking.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { id: 'starter', name: 'Starter', price: 80, desc: 'Ideal for casual observers. Track weight and receive a yearly harvest.', icon: Star },
                { id: 'premium', name: 'Premium', price: 200, desc: 'The royal treatment. Full biometrics, custom labeling, and named hive.', icon: Crown },
              ].map((plan) => (
                <button
                  key={plan.id}
                  onClick={() => setCartPlan({ id: plan.id as any, name: plan.name + ' Membership', price: plan.price })}
                  className={`relative p-8 rounded-[2px] text-left border transition-all duration-500 group overflow-hidden ${
                    cartPlan?.id === plan.id 
                      ? 'bg-honey/10 border-honey/40 shadow-[0_20px_40px_rgba(200,134,10,0.1)]' 
                      : 'bg-hive-panel/40 border-white/5 hover:border-honey/30 hover:bg-hive-bg/60 hover:shadow-xl'
                  }`}
                >
                  {/* Subtle Grain Texture */}
                  <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay" style={{backgroundImage: 'url("https://www.transparenttextures.com/patterns/natural-paper.png")'}}></div>
                  
                  <div className="flex justify-between items-start mb-8 relative z-10">
                    <div className={`p-3 rounded-sm ${cartPlan?.id === plan.id ? 'bg-honey/20 text-honey' : 'bg-white/5 text-[#2A1B0A]/30 group-hover:text-honey/60 transition-colors'}`}>
                      <plan.icon size={20} />
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] uppercase tracking-widest text-[#2A1B0A]/80 font-bold mb-1">Yearly</div>
                      <div className="text-3xl font-display text-honey">€{plan.price}</div>
                      <div className="text-[10px] uppercase tracking-widest text-[#2A1B0A]/80 font-bold">Approx. €{plan.id === 'starter' ? '7' : '17'}/mo</div>
                    </div>
                  </div>

                  <div className="relative z-10">
                    <h3 className="text-xl font-display text-[#2A1B0A] mb-2">{plan.name}</h3>
                    <p className="text-xs text-[#2A1B0A]/60 leading-relaxed group-hover:text-[#2A1B0A]/80 transition-colors">
                      {plan.desc}
                    </p>
                  </div>

                  {cartPlan?.id === plan.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-honey shadow-[0_0_10px_rgba(200,134,10,0.5)]"></div>
                  )}
                </button>
              ))}
            </div>

            {/* Optional Ad-ons */}
            <div className="pt-8 border-t border-honey/10">
              <div className="text-[10px] uppercase tracking-[0.3em] text-[#2A1B0A]/30 font-bold mb-6">Optional Add-ons</div>
              <button 
                onClick={() => setHasOliveOil(!hasOliveOil)}
                className={`w-full flex items-center justify-between p-6 rounded-[2px] border transition-all duration-300 group ${
                  hasOliveOil ? 'bg-honey/5 border-honey/30' : 'bg-white/5 border-white/10 hover:border-honey/20'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-6 h-6 rounded flex items-center justify-center border transition-all ${
                    hasOliveOil ? 'bg-honey border-honey text-[#2A1B0A]' : 'border-white/20 text-transparent'
                  }`}>
                    <Check size={14} />
                  </div>
                  <div className="text-left">
                    <p className="text-sm text-[#2A1B0A] font-medium">Laconian Olive Oil (500ml)</p>
                    <p className="text-[10px] uppercase tracking-widest text-honey/60">+ €18.00</p>
                  </div>
                </div>
                <div className="text-[10px] uppercase tracking-widest text-[#2A1B0A]/20 group-hover:text-[#2A1B0A]/40 transition-colors">Pure harvest from our groves</div>
              </button>
            </div>

            {/* Certificate Name Input (Premium Only) */}
            {cartPlan?.id === 'premium' && (
              <div className="pt-8 border-t border-honey/10 animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="flex items-center gap-3 text-honey mb-6">
                  <Type size={14} />
                  <span className="text-[10px] uppercase tracking-[0.3em] font-bold">Personalize Your Certificate</span>
                </div>
                <div className="bg-white/5 border border-white/10 p-6 rounded-[2px] space-y-4">
                  <p className="text-xs text-[#2A1B0A]/50 leading-relaxed">
                    As a Premium member, your name will be hand-inscribed on your digital Certificate of Adoption and printed on your honey jar labels.
                  </p>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={certName}
                      onChange={(e) => setCertName(e.target.value)}
                      placeholder="Full name for certificate"
                      className="w-full bg-hive-bg border border-white/10 rounded-[2px] px-4 py-3 text-sm text-[#2A1B0A] focus:outline-none focus:border-honey/50 transition-colors pt-6"
                    />
                    <label className="absolute top-2 left-4 text-[8px] uppercase tracking-widest text-honey font-bold">Name on Certificate</label>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Order Summary */}
          <div className="md:col-span-12 lg:col-span-5 space-y-8">
            {/* Live Certificate Preview (Premium Only) */}
            {cartPlan?.id === 'premium' && (
              <div className="animate-in fade-in zoom-in duration-700">
                <div className="text-[10px] uppercase tracking-[0.3em] text-[#2A1B0A]/30 font-bold mb-4 flex items-center gap-2">
                  <Award size={12} />
                  Live Preview: Your Certificate
                </div>
                <CertificatePreview name={certName} tier="Premium Guardian" />
              </div>
            )}

            <div className="sticky top-32 p-10 bg-hive-panel/80 backdrop-blur-xl border border-honey/20 rounded-[2px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden">
              {/* Internal Glow */}
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-honey/10 blur-[80px] rounded-full pointer-events-none"></div>
              
              <div className="relative z-10">
                <div className="text-[10px] uppercase tracking-[0.3em] text-honey font-bold mb-8 flex items-center gap-3">
                  <ShoppingCart size={12} />
                  Order Summary
                </div>

                <div className="space-y-6 mb-10">
                  {!cartPlan ? (
                    <div className="py-10 text-center border border-dashed border-white/10 rounded-[2px]">
                      <p className="text-xs text-[#2A1B0A]/30 italic">No plan selected</p>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between text-sm group">
                        <div className="flex flex-col gap-1">
                          <span className="text-[#2A1B0A] font-medium">{cartPlan.name}</span>
                          <span className="text-[10px] uppercase tracking-widest text-[#2A1B0A]/30">Annual Subscription</span>
                        </div>
                        <span className="text-[#2A1B0A]">€{cartPlan.price}.00</span>
                      </div>

                      {hasOliveOil && (
                        <div className="flex justify-between text-sm animate-in fade-in slide-in-from-left-4 duration-300">
                          <div className="flex flex-col gap-1">
                            <span className="text-[#2A1B0A] font-medium group">Extra Olive Oil</span>
                            <span className="text-[10px] uppercase tracking-widest text-[#2A1B0A]/30">One-time addition</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-[#2A1B0A]">€18.00</span>
                            <button onClick={() => setHasOliveOil(false)} className="text-[#2A1B0A]/20 hover:text-red-400 transition-colors"><Trash2 size={14}/></button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>

                <div className="flex justify-between text-xs mb-8 text-honey font-medium animate-in fade-in duration-700">
                  <div className="flex items-center gap-2">
                    <Package size={14} />
                    <span>Free EU Shipping Included</span>
                  </div>
                  <span>€0.00</span>
                </div>

                <div className="h-[1px] bg-honey/10 mb-8"></div>

                <div className="flex justify-between items-end mb-10">
                  <div className="text-[10px] uppercase tracking-[0.3em] text-[#2A1B0A]/40 font-bold">Total (Inclusive of VAT)</div>
                  <div className="text-4xl font-display text-[#2A1B0A] italic">€{cartTotal.toFixed(2)}</div>
                </div>

                {errorStatus && (
                  <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-[2px] flex gap-3 text-red-100 text-[11px] leading-relaxed animate-in shake duration-500">
                    <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                    <div>
                      <p className="font-bold mb-1">Checkout Failed</p>
                      <p>{errorStatus}</p>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleCheckout}
                  disabled={!cartPlan || isRedirecting}
                  className={`w-full py-5 rounded-[2px] text-xs uppercase tracking-[0.3em] font-bold transition-all flex items-center justify-center gap-3 group overflow-hidden relative ${
                    cartPlan && !isRedirecting 
                      ? 'bg-honey text-[#2A1B0A] hover:bg-honey/90 hover:shadow-[0_10px_30px_rgba(200,134,10,0.3)] shadow-xl' 
                      : 'bg-white/5 text-[#2A1B0A]/20 border border-white/5 cursor-not-allowed'
                  }`}
                >
                  {isRedirecting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Connecting to your hive in Laconia...
                    </>
                  ) : (
                    <>
                      Complete Adoption
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>

                {isRedirecting && (
                  <div className="mt-8 space-y-3">
                    <div className="flex items-center gap-2 mb-2">
                       <span className="flex h-1.5 w-1.5 rounded-full bg-honey animate-ping"></span>
                       <span className="text-[9px] uppercase tracking-widest text-honey font-bold">System Status</span>
                    </div>
                    {debugLog.map((log, i) => (
                      <div key={i} className="text-[9px] text-[#2A1B0A]/30 font-mono tracking-tight animate-in fade-in slide-in-from-left-2 duration-300">
                        {`[${new Date().toLocaleTimeString('en-GB')}] > `}{log}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <p className="mt-8 text-[10px] text-[#2A1B0A]/20 text-center uppercase tracking-[0.2em] leading-loose max-w-xs mx-auto">
              Secure payments handled by <span className="text-[#2A1B0A]/40">Stripe</span>.<br/>
              By proceeding, you agree to our <Link to="/terms" className="text-honey/60 hover:text-honey underline">Terms of Service</Link>.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
