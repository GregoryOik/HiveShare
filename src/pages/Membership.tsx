import React, { useState, useEffect } from 'react';
import { Loader2, Check, AlertTriangle, X, Trash2, LogOut, ArrowRight, ShoppingCart, Crown, Star, Package, Award, Type, ShieldCheck, Gift, RefreshCw } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../lib/useAuth';
import { useLanguage } from '../lib/useLanguage';
import { db } from '../lib/firebase';
import { collection, addDoc, onSnapshot, doc } from 'firebase/firestore';
import Footer from '../components/Footer';

interface CartPlan {
  id: 'starter' | 'premium' | 'corporate';
  name: string;
  price: number;
}

const STARTER_PRICE_ID = 'price_1TDaerEhPXKoQqYJKuvCxiBR';
const PREMIUM_PRICE_ID = 'price_1TDafLEhPXKoQqYJa9nt3rEy';
const OIL_PRICE_ID = 'price_1TDanWEhPXKoQqYJY2gq1Fj0';

export default function Membership() {
  const navigate = useNavigate();
  const location = useLocation() as { state?: { tier?: string } };
  const { user, profile, logout } = useAuth();
  const { language } = useLanguage();
  const isEl = language === 'el';
  
  const [cartPlan, setCartPlan] = useState<CartPlan | null>(null);
  const [hasOliveOil, setHasOliveOil] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);
  const [debugLog, setDebugLog] = useState<string[]>([]);
  const [certName, setCertName] = useState('');
  const [isGift, setIsGift] = useState(false);

  const addDebug = (msg: string) => setDebugLog(prev => [...prev.slice(-4), msg]);

  useEffect(() => {
    if (location.state?.tier && !cartPlan) {
      const tierId = location.state.tier;
      if (tierId === 'starter') {
        setCartPlan({ id: 'starter', name: isEl ? 'Βασική Αναδοχή' : 'Starter Guardianship', price: 140 });
      } else if (tierId === 'premium') {
        setCartPlan({ id: 'premium', name: isEl ? 'Επίτιμος Προστάτης' : 'Premium Patron', price: 340 });
      }
      window.history.replaceState({}, document.title);
    }
  }, [location.state, cartPlan, isEl]);

  const cartTotal = (cartPlan?.price || 0) + (hasOliveOil ? 18 : 0);

  const handleCheckout = async () => {
    if (!user || !cartPlan) return;
    
    setIsRedirecting(true);
    setErrorStatus(null);
    addDebug('Starting checkout session...');
    
    try {
      const priceId = cartPlan.id === 'premium' ? PREMIUM_PRICE_ID : STARTER_PRICE_ID;
      const line_items = [{ price: priceId, quantity: 1 }];
      if (hasOliveOil) line_items.push({ price: OIL_PRICE_ID, quantity: 1 });

      addDebug('Adding document to Firestore...');
      
      const docRef = await addDoc(collection(db, 'customers', user.uid, 'checkout_sessions'), {
        line_items,
        success_url: `${window.location.origin}/success?tier=${cartPlan.id}&is_gift=${isGift}&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: window.location.origin + '/membership',
        allow_promotion_codes: true,
        metadata: {
          tier: cartPlan.id,
          hasOliveOil: hasOliveOil.toString(),
          isGift: isGift.toString()
        }
      });

      addDebug('Document created. ID: ' + docRef.id);
      addDebug('Waiting for Stripe Extension URL...');

      const timeout = setTimeout(() => {
        setIsRedirecting(false);
        setErrorStatus('The Stripe Extension is taking too long to respond. Check configuration.');
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
    <div className="relative aspect-[1.414/1] w-full bg-[#FCF8F1] border-[6px] sm:border-[12px] border-[#C8860A] p-3 sm:p-8 text-[#1A1208] shadow-2xl rounded-sm overflow-hidden group">
      <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-[#C8860A]/30"></div>
      <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-[#C8860A]/30"></div>
      <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-[#C8860A]/30"></div>
      <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-[#C8860A]/30"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none">
        <Award size={240} strokeWidth={1} />
      </div>
      <div className="h-full border border-[#C8860A]/20 flex flex-col items-center justify-center text-center p-3 sm:p-6 bg-white/40">
        <div className="text-[8px] sm:text-[10px] uppercase tracking-[0.3em] sm:tracking-[0.4em] mb-2 sm:mb-4 text-[#C8860A] font-bold">Certificate of Adoption</div>
        <div className="w-10 sm:w-12 h-[1px] bg-[#C8860A]/30 mb-3 sm:mb-6"></div>
        <div className="font-display text-xs sm:text-sm italic mb-1 sm:mb-2">This official document confirms that</div>
        <div className="font-display text-xl sm:text-3xl md:text-4xl mb-2 sm:mb-4 text-[#1A1208] border-b border-[#C8860A]/20 min-w-[160px] sm:min-w-[200px] px-2 sm:px-4 pb-1">
          {name || 'Your Name Here'}
        </div>
        <div className="font-display text-xs sm:text-sm italic mb-3 sm:mb-6">is now a dedicated guardian of a honey bee colony in</div>
        <div className="text-sm sm:text-lg font-display uppercase tracking-[0.15em] sm:tracking-[0.2em] text-[#C8860A] mb-4 sm:mb-8">Lagia, Mani · Greece</div>
        <div className="grid grid-cols-2 w-full gap-4 sm:gap-8 pt-3 sm:pt-6 border-t border-[#C8860A]/10">
          <div className="text-left">
            <div className="text-[7px] sm:text-[8px] uppercase tracking-widest text-black/40 mb-0.5 sm:mb-1">Membership Tier</div>
            <div className="text-[9px] sm:text-[10px] font-bold uppercase">{tier}</div>
          </div>
          <div className="text-right">
            <div className="text-[7px] sm:text-[8px] uppercase tracking-widest text-black/40 mb-0.5 sm:mb-1">Issue Date</div>
            <div className="text-[9px] sm:text-[10px] font-bold uppercase">{new Date().getFullYear()} Season</div>
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
      </div>

      <header className="border-b border-honey/10 bg-hive-bg/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-4">
          <Link to="/" className="font-display text-2xl tracking-wide group flex items-center gap-1">
            <span className="text-[#2A1B0A] group-hover:text-honey transition-colors">Hive</span><span className="text-honey">Share</span>
          </Link>
          <div className="flex items-center gap-3 sm:gap-6">
            <div className="hidden sm:flex flex-col items-end mr-2">
              <span className="text-[9px] uppercase tracking-[0.2em] text-[#2A1B0A]/30 font-bold">Secure Checkout</span>
              <span className="text-[10px] text-honey font-medium">{user?.email}</span>
            </div>
            {user ? (
              <button onClick={logout} className="text-[9px] sm:text-[10px] uppercase tracking-[0.25em] font-bold text-[#2A1B0A]/50 hover:text-[#2A1B0A] transition-all flex items-center gap-1.5 p-1">
                <LogOut className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Sign Out</span>
              </button>
            ) : (
              <Link to="/login" className="text-[9px] sm:text-[10px] uppercase tracking-[0.25em] font-bold text-honey hover:text-[#2A1B0A] transition-all border border-honey/30 px-3 py-1 rounded-[2px]">
                Sign In
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12 md:pt-20 pb-16 sm:pb-20 flex-1 w-full relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 sm:gap-12 lg:gap-16">
          
          <div className="md:col-span-12 lg:col-span-7 space-y-8 sm:space-y-12">
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center gap-3 text-honey mb-1 sm:mb-2 group">
                <div className="w-6 h-6 rounded-full border border-honey/30 flex items-center justify-center text-[10px] font-bold">02</div>
                <span className="text-[10px] uppercase tracking-[0.3em] font-bold">
                  {isEl ? 'Επιλογή Επιπέδου Αναδοχής' : 'Select Your Guardianship Level'}
                </span>
              </div>
              <h1 className="font-display text-3xl sm:text-4xl md:text-5xl text-[#2A1B0A]">
                {isEl ? 'Συνδεθείτε με το Μελισσοκομείο' : 'Choose your connection'}
              </h1>
              <p className="text-xs sm:text-sm text-[#2A1B0A]/60 max-w-lg leading-relaxed font-light">
                {isEl
                  ? 'Επιλέξτε το επίπεδο αναδοχής που ταιριάζει στη δική σας σχέση με τα μελισσοκομεία της Λακωνίας.'
                  : "Select the tier that best matches your commitment to Laconia's living colonies."}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {[
                { 
                  id: 'starter', 
                  name: isEl ? 'Βασική Αναδοχή' : 'Starter Guardianship', 
                  price: 140, 
                  desc: isEl ? '2,5 kg αγνό μέλι (~56€/kg). Πρόσβαση σε τηλεμετρία και 3 εποχιακές παραδόσεις.' : '2.5 kg raw honey (~€56/kg). Track hive telemetry and receive 3 seasonal deliveries.', 
                  icon: Star 
                },
                { 
                  id: 'premium', 
                  name: isEl ? 'Επίτιμος Προστάτης' : 'Premium Patron', 
                  price: 340, 
                  desc: isEl ? '5 kg αγνό μέλι (~68€/kg). Αποκλειστική επώνυμη κυψέλη, προσωποποιημένες ετικέτες, επίσημο πιστοποιητικό και πρόσκληση στη Μάνη.' : '5 kg raw honey (~€68/kg). Dedicated named hive, custom labels, framed certificate, and Mani apiary visit invitation.', 
                  icon: Crown 
                },
              ].map((plan) => (
                <button
                  key={plan.id}
                  onClick={() => setCartPlan({ id: plan.id as any, name: plan.name, price: plan.price })}
                  className={`relative p-5 sm:p-8 rounded-[2px] text-left border transition-all duration-500 group overflow-hidden active:scale-[0.99] ${
                    cartPlan?.id === plan.id 
                      ? 'bg-honey/10 border-honey/40 shadow-[0_20px_40px_rgba(200,134,10,0.1)]' 
                      : 'bg-white/5 border-white/5 hover:border-honey/30 hover:bg-white/10'
                  }`}
                >
                  <div className="flex justify-between items-start mb-6 sm:mb-8 relative z-10">
                    <div className={`p-2.5 sm:p-3 rounded-sm ${cartPlan?.id === plan.id ? 'bg-honey/20 text-honey' : 'bg-white/5 text-[#2A1B0A]/30 group-hover:text-honey/60'}`}>
                      <plan.icon size={20} />
                    </div>
                    <div className="text-right">
                      <div className="text-[9px] sm:text-[10px] uppercase tracking-widest text-[#2A1B0A]/80 font-bold mb-1">
                        {isEl ? 'Ετήσια' : 'Yearly'}
                      </div>
                      <div className="text-2xl sm:text-3xl font-display text-honey">€{plan.price}</div>
                    </div>
                  </div>
                  <div className="relative z-10">
                    <h3 className="text-lg sm:text-xl font-display text-[#2A1B0A] mb-1.5 sm:mb-2">{plan.name}</h3>
                    <p className="text-xs text-[#2A1B0A]/60 leading-relaxed">{plan.desc}</p>
                  </div>
                  {cartPlan?.id === plan.id && <div className="absolute bottom-0 left-0 right-0 h-1 bg-honey"></div>}
                </button>
              ))}
            </div>

            <div className="pt-6 sm:pt-8 border-t border-honey/10 space-y-3 sm:space-y-4">
              <div className="text-[10px] uppercase tracking-[0.3em] text-[#2A1B0A]/40 font-bold">
                {isEl ? 'Πρόσθετες Επιλογές' : 'Enhance Your Membership'}
              </div>
              <button 
                onClick={() => setHasOliveOil(!hasOliveOil)}
                className={`w-full flex items-center justify-between p-4 sm:p-6 rounded-[2px] border transition-all duration-300 ${
                  hasOliveOil ? 'bg-honey/5 border-honey/30' : 'bg-white/5 border-white/10 hover:border-honey/20'
                }`}
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className={`w-5 sm:w-6 h-5 sm:h-6 rounded flex items-center justify-center border transition-all ${
                    hasOliveOil ? 'bg-honey border-honey text-[#2A1B0A]' : 'border-white/20'
                  }`}><Check size={14} /></div>
                  <div className="text-left">
                    <p className="text-xs sm:text-sm text-[#2A1B0A] font-medium">
                      {isEl ? 'Εξαιρετικό Παρθένο Ελαιόλαδο Λακωνίας (500ml)' : 'Laconian Olive Oil (500ml)'}
                    </p>
                    <p className="text-[9px] sm:text-[10px] uppercase tracking-widest text-honey/60">+ €18.00</p>
                  </div>
                </div>
              </button>

              <button 
                onClick={() => setIsGift(!isGift)}
                className={`w-full flex items-center justify-between p-4 sm:p-6 rounded-[2px] border transition-all duration-300 ${
                  isGift ? 'bg-honey/5 border-honey/30' : 'bg-white/5 border-white/10 hover:border-honey/20'
                }`}
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className={`w-5 sm:w-6 h-5 sm:h-6 rounded flex items-center justify-center border transition-all ${
                    isGift ? 'bg-honey border-honey text-[#2A1B0A]' : 'border-white/20'
                  }`}><Check size={14} /></div>
                  <div className="text-left">
                    <p className="text-xs sm:text-sm text-[#2A1B0A] font-medium">
                      {isEl ? 'Αγορά ως Δώρο' : 'Purchase as a Gift'}
                    </p>
                    <p className="text-[9px] sm:text-[10px] uppercase tracking-widest text-honey/60">
                      {isEl ? 'Περιλαμβάνει Ψηφιακή Κάρτα Αναδοχής' : 'Digital Adoption Card Included'}
                    </p>
                  </div>
                </div>
              </button>
            </div>

            {cartPlan?.id === 'premium' && (
              <div className="pt-6 sm:pt-8 border-t border-honey/10 animate-in fade-in slide-in-from-top-4 duration-500 space-y-4">
                <div className="bg-white/40 border border-honey/20 p-4 sm:p-6 rounded-[2px] space-y-4">
                  <div>
                    <div className="text-[9px] uppercase tracking-widest text-honey font-bold mb-1">
                      {isEl ? 'Προσωποποίηση Επίτιμου Προστάτη' : 'Premium Patron Personalization'}
                    </div>
                    <p className="text-xs text-[#2A1B0A]/70">
                      {isEl ? 'Πληκτρολογήστε το όνομα που θα τυπωθεί στο επίσημο πιστοποιητικό και τις ετικέτες.' : 'Personalize your framable certificate and custom jar labels.'}
                    </p>
                  </div>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={certName}
                      onChange={(e) => setCertName(e.target.value)}
                      placeholder={isEl ? 'π.χ. Δημήτριος Βασιλείου' : 'Full name for certificate'}
                      className="w-full bg-hive-bg border border-honey/30 rounded-[2px] px-4 py-3 text-base sm:text-sm text-[#2A1B0A] focus:outline-none focus:border-honey pt-6"
                    />
                    <label className="absolute top-2 left-4 text-[8px] uppercase tracking-widest text-honey font-bold">
                      {isEl ? 'Όνομα Αναδόχου' : 'Recipient Name'}
                    </label>
                  </div>

                  {/* Real-time Certificate Rendering */}
                  <div className="pt-2">
                    <CertificatePreview name={certName} tier={cartPlan.name} />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="md:col-span-12 lg:col-span-5 space-y-6 sm:space-y-8">
            <div className="p-5 sm:p-8 md:p-10 bg-white/5 backdrop-blur-xl border border-honey/20 rounded-[2px] shadow-2xl static lg:sticky lg:top-28">
              <div className="text-[10px] uppercase tracking-[0.3em] text-honey font-bold mb-6 sm:mb-8 flex items-center gap-3">
                <ShoppingCart size={12} /> {isEl ? 'Σύνοψη Παραγγελίας' : 'Order Summary'}
              </div>

              <div className="space-y-5 sm:space-y-6 mb-8 sm:mb-10">
                {!cartPlan ? (
                  <div className="py-10 text-center border border-dashed border-white/10 rounded-[2px]">
                    <p className="text-xs text-[#2A1B0A]/40 italic">
                      {isEl ? 'Επιλέξτε ένα επίπεδο αναδοχής για να συνεχίσετε' : 'Select a plan to continue'}
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between text-sm">
                      <div className="flex flex-col gap-1">
                        <span className="text-[#2A1B0A] font-medium">{cartPlan.name}</span>
                        <span className="text-[10px] uppercase tracking-widest text-[#2A1B0A]/40">
                          {isEl ? 'Ετήσια Συνδρομή' : 'Annual Guardianship'}
                        </span>
                      </div>
                      <span className="text-[#2A1B0A]">€{cartPlan.price}.00</span>
                    </div>

                    {hasOliveOil && (
                      <div className="flex justify-between text-sm animate-in fade-in slide-in-from-left-4">
                        <span className="text-[#2A1B0A] font-medium">
                          {isEl ? 'Ελαιόλαδο Λακωνίας (500ml)' : 'Laconian Olive Oil (500ml)'}
                        </span>
                        <span className="text-[#2A1B0A]">€18.00</span>
                      </div>
                    )}

                    <div className="flex justify-between text-xs text-honey font-medium">
                      <span>{isEl ? 'Δωρεάν Αποστολή στην Ε.Ε.' : 'Free EU Shipping'}</span>
                      <span>€0.00</span>
                    </div>

                    <div className="h-[1px] bg-honey/10"></div>

                    <div className="flex justify-between items-end">
                      <div className="text-[10px] uppercase tracking-[0.3em] text-[#2A1B0A]/40 font-bold">
                        {isEl ? 'Σύνολο' : 'Total'}
                      </div>
                      <div className="text-4xl font-display text-[#2A1B0A] italic">€{cartTotal.toFixed(2)}</div>
                    </div>

                    {errorStatus && (
                      <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-[2px] text-red-500 text-[11px] flex gap-2">
                        <AlertTriangle size={14} className="shrink-0" />
                        <p>{errorStatus}</p>
                      </div>
                    )}

                    <button
                      onClick={handleCheckout}
                      disabled={isRedirecting}
                      className={`w-full py-5 rounded-[2px] text-xs uppercase tracking-[0.3em] font-bold transition-all flex items-center justify-center gap-3 relative overflow-hidden ${
                        !isRedirecting ? 'bg-honey text-[#2A1B0A] hover:bg-honey/90' : 'bg-white/5 text-[#2A1B0A]/20 cursor-not-allowed'
                      }`}
                    >
                      {isRedirecting ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <>
                          {isEl ? 'Ολοκλήρωση Αναδοχής' : 'Complete Adoption'} <ArrowRight size={16} />
                        </>
                      )}
                    </button>
                    
                    {isRedirecting && (
                      <div className="mt-4 space-y-2">
                        {debugLog.map((log, i) => (
                          <div key={i} className="text-[9px] text-[#2A1B0A]/30 font-mono italic">
                            {`> `}{log}
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
              
              <div className="flex items-center justify-center gap-4 text-[10px] text-[#2A1B0A]/40 uppercase tracking-widest">
                <ShieldCheck size={14} /> {isEl ? 'Ασφαλής Πληρωμή μέσω Stripe' : 'Secure Stripe Payment'}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
