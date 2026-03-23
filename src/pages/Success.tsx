import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, ArrowRight, Package, RefreshCw, Star } from 'lucide-react';
import { useAuth } from '../lib/useAuth';
import { db } from '../lib/firebase';
import { doc, updateDoc, arrayUnion, collection, query, where, getDocs } from 'firebase/firestore';
import Footer from '../components/Footer';

export default function Success() {
  const [searchParams] = useSearchParams();
  const { user, profile } = useAuth();
  const [isFulfilling, setIsFulfilling] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [claimedId, setClaimedId] = useState<string | null>(null);
  const [hasAttempted, setHasAttempted] = useState(false);
  const tier = searchParams.get('tier') || 'starter';
  const isGift = searchParams.get('is_gift') === 'true';
  const isAdditional = searchParams.get('is_additional') === 'true';

  const [giftSaved, setGiftSaved] = useState(false);
  const [giftData, setGiftData] = useState({ recipientName: '', customMessage: '' });

  const handleSaveGift = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !claimedId) return;
    try {
      await updateDoc(doc(db, 'hives', claimedId), {
        'metadata.isGift': true,
        'metadata.giftRecipient': giftData.recipientName,
        'metadata.giftMessage': giftData.customMessage,
        'metadata.giftPurchasedBy': user.uid
      });
      setGiftSaved(true);
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    if (!user || hasAttempted) return;
    const fulfill = async () => {
      setHasAttempted(true);
      try {
        const q = query(collection(db, 'hives'), where('status', '==', 'available'));
        const snap = await getDocs(q);
        if (snap.empty) {
          setError("No hives available. Our beekeeper will manually assign one soon.");
          setIsFulfilling(false);
          return;
        }
        const hiveId = snap.docs[0].id;
        setClaimedId(hiveId);
        await updateDoc(doc(db, 'hives', hiveId), {
          status: 'occupied',
          sponsorId: user.uid,
          sponsorEmail: user.email,
          tier: tier,
          assignedAt: new Date().toISOString(),
          'metadata.isGift': isGift
        });
        await updateDoc(doc(db, 'users', user.uid), {
          isSubscribed: true,
          subscriptionTier: tier,
          currentHiveId: hiveId,
          subscribedHives: arrayUnion(hiveId),
          lastSubscriptionAt: new Date().toISOString()
        });

        // Professional Email Dispatch
        const { sendEmail, emailTemplates } = await import('../lib/email');
        if (user.email) {
          sendEmail(emailTemplates.assignment(
            user.email, 
            hiveId, 
            'Peloponnese'
          )).catch(console.error);
        }

        setIsFulfilling(false);
      } catch (err: any) {
        setError(err.message);
        setIsFulfilling(false);
      }
    };
    fulfill();
  }, [user, tier, hasAttempted, isGift]);

  return (
    <div className="min-h-screen bg-[#0A0704] flex flex-col font-sans selection:bg-honey selection:text-black overflow-hidden relative">
      {/* Background nomadic texture */}
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#C8860A 0.5px, transparent 0.5px)', backgroundSize: '30px 30px' }}></div>
      </div>

      <header className="border-b border-honey/10 bg-[#0A0704]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center">
          <Link to="/" className="flex items-center gap-3">
             <div className="w-8 h-8 bg-honey rounded-full flex items-center justify-center">
               <span className="text-sm font-bold text-[#0A0704]">H</span>
             </div>
             <span className="font-display text-lg tracking-wide text-white">HiveShare <span className="text-honey">Authority</span></span>
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto px-6 pt-12 pb-24 w-full relative z-10 text-center">
        <div className="animate-in fade-in zoom-in duration-1000 space-y-12">
          {/* Main Certificate Ornament */}
          <div className="relative inline-block px-12 py-16 md:px-24 md:py-24 border border-honey/30 bg-[#120D08] shadow-[0_40px_100px_rgba(0,0,0,0.8)] overflow-hidden group">
             {/* Corner Accents */}
             <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-honey/40"></div>
             <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-honey/40"></div>
             <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-honey/40"></div>
             <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-honey/40"></div>

             <div className="relative z-10 space-y-8">
               <div className="w-20 h-20 rounded-full bg-honey/5 border border-honey/20 flex items-center justify-center mx-auto mb-4">
                 <CheckCircle className="w-10 h-10 text-honey animate-pulse" />
               </div>
               
               <div className="space-y-4">
                  <h2 className="text-[10px] uppercase tracking-[0.5em] text-honey font-black">Official_Affiliation_Protocol</h2>
                  <h1 className="font-display italic text-6xl md:text-8xl text-honey tracking-tight leading-none">
                    Guardian <br/>
                    <span className="not-italic text-white">Confirmed</span>
                  </h1>
               </div>

               <div className="pt-8 border-t border-honey/10 max-w-md mx-auto">
                 <p className="text-sm text-white/60 leading-relaxed font-light italic">
                   "You are now linked to the Mani apiary grid. Your support bolsters a nomadic colony of Apis mellifera macedonica in the rugged slopes of Laconia."
                 </p>
               </div>

               {!isFulfilling && !error && (
                 <div className="pt-10 flex flex-col md:flex-row items-center justify-center gap-12 font-mono">
                    <div className="text-center">
                       <span className="text-[8px] uppercase text-honey/40 block mb-1">Unit_ID</span>
                       <span className="text-xl text-white font-black tracking-widest">#{claimedId}</span>
                    </div>
                    <div className="hidden md:block w-[1px] h-10 bg-honey/10"></div>
                    <div className="text-center">
                       <span className="text-[8px] uppercase text-honey/40 block mb-1">Sector</span>
                       <span className="text-xl text-white font-black tracking-widest uppercase">Peloponnese</span>
                    </div>
                    <div className="hidden md:block w-[1px] h-10 bg-honey/10"></div>
                    <div className="text-center">
                       <span className="text-[8px] uppercase text-honey/40 block mb-1">Status</span>
                       <span className="text-xl text-green-400 font-black tracking-widest uppercase animate-pulse">Active</span>
                    </div>
                 </div>
               )}
             </div>

             {/* Background Watermark */}
             <Star size={300} className="absolute -right-20 -bottom-20 text-honey opacity-[0.02] rotate-12 pointer-events-none" />
          </div>

          <div className="max-w-xl mx-auto space-y-8">
            {isGift && !isFulfilling && !error && (
              <div className="bg-[#120D08] border border-honey/20 p-8 text-left space-y-6 animate-in slide-in-from-bottom-4 shadow-2xl">
                <div className="flex items-center gap-3 text-honey"><Star size={20}/><span className="text-[10px] uppercase tracking-[0.3em] font-black">Personalize Gift Payload</span></div>
                {!giftSaved ? (
                  <form onSubmit={handleSaveGift} className="space-y-4">
                    <input type="text" placeholder="Recipient's Name" required value={giftData.recipientName} onChange={e => setGiftData({...giftData, recipientName: e.target.value})} className="w-full bg-black border border-honey/20 px-4 py-4 text-sm text-white focus:border-honey outline-none" />
                    <textarea placeholder="Message (optional)" rows={3} value={giftData.customMessage} onChange={e => setGiftData({...giftData, customMessage: e.target.value})} className="w-full bg-black border border-honey/20 px-4 py-4 text-sm text-white focus:border-honey outline-none resize-none" />
                    <button type="submit" className="w-full py-4 bg-honey text-black text-[10px] uppercase font-black tracking-[0.2em] hover:bg-white transition-all">Serialize Metadata</button>
                  </form>
                ) : (
                  <div className="py-8 text-center bg-green-500/5 border border-green-500/20"><CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2"/><p className="text-[10px] uppercase font-black text-green-500 tracking-widest">Gift Payload Encrypted</p></div>
                )}
              </div>
            )}

            {!isFulfilling && !error && (
              <div className="space-y-12">
                <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
                   <div className="flex items-center gap-4 text-left">
                      <Package size={24} className="text-honey" />
                      <div>
                         <p className="text-[10px] uppercase tracking-widest text-honey font-black">Harvest Package</p>
                         <p className="text-xs text-white/40">Welcome jar ships within 14 units.</p>
                      </div>
                   </div>
                   <div className="hidden md:block w-[1px] h-8 bg-honey/10"></div>
                   <div className="flex items-center gap-4 text-left">
                      <RefreshCw size={24} className="text-honey animate-spin-slow" />
                      <div>
                         <p className="text-[10px] uppercase tracking-widest text-honey font-black">Data Stream</p>
                         <p className="text-xs text-white/40">Biometric link ready in dashboard.</p>
                      </div>
                   </div>
                </div>

                <Link to="/dashboard" className="inline-flex items-center gap-4 bg-honey text-black px-12 py-6 text-xs uppercase tracking-[0.3em] font-black hover:bg-white transition-all group shadow-[0_20px_40px_rgba(200,134,10,0.2)]">
                  Enter Command Journal <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
