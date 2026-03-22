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
        setIsFulfilling(false);
      } catch (err: any) {
        setError(err.message);
        setIsFulfilling(false);
      }
    };
    fulfill();
  }, [user, tier, hasAttempted, isGift]);

  return (
    <div className="min-h-screen bg-hive-bg flex flex-col font-body selection:bg-honey selection:text-[#2A1B0A]">
      <header className="border-b border-honey/10 bg-hive-bg/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-honey flex items-center justify-center">
              <span className="text-sm font-bold text-[#2A1B0A]">H</span>
            </div>
            <span className="font-display text-lg tracking-wide text-[#2A1B0A]">HiveShare <span className="text-honey">Adoption</span></span>
          </Link>
        </div>
      </header>

      <div className="max-w-xl mx-auto px-6 pt-16 pb-20 text-center flex-1 space-y-12 w-full">
        <div className="space-y-6">
          <div className="w-24 h-24 rounded-full bg-honey/10 border border-honey/20 flex items-center justify-center mx-auto mb-8 animate-in zoom-in duration-1000">
            <CheckCircle className="w-10 h-10 text-honey" />
          </div>
          <h1 className="font-display text-5xl md:text-6xl text-[#2A1B0A] leading-tight mb-4">
            Welcome home, <br/>
            <span className="italic text-pale-honey ml-4">Guardian</span>
          </h1>
          <p className="text-sm md:text-base text-[#2A1B0A]/60 leading-relaxed font-light max-w-sm mx-auto">
            {isFulfilling ? "Connecting to our apiary in Laconia..." : (isGift ? "Gift ready! Tell us who it's for." : `Active! Assigned Hive #${claimedId}.`)}
          </p>
        </div>

        {isGift && !isFulfilling && !error && (
          <div className="bg-hive-panel/50 border border-honey/20 p-8 rounded-[2px] text-left space-y-6 animate-in slide-in-from-bottom-4">
            <div className="flex items-center gap-3 text-honey"><Star size={20}/><span className="text-[10px] uppercase tracking-[0.3em] font-bold">Personalize Gift</span></div>
            {!giftSaved ? (
              <form onSubmit={handleSaveGift} className="space-y-4">
                <input type="text" placeholder="Recipient's Name" required value={giftData.recipientName} onChange={e => setGiftData({...giftData, recipientName: e.target.value})} className="w-full bg-hive-bg border border-honey/20 px-4 py-3 text-sm rounded-[2px] focus:border-honey outline-none" />
                <textarea placeholder="Message (optional)" rows={3} value={giftData.customMessage} onChange={e => setGiftData({...giftData, customMessage: e.target.value})} className="w-full bg-hive-bg border border-honey/20 px-4 py-3 text-sm rounded-[2px] focus:border-honey outline-none resize-none" />
                <button type="submit" className="w-full py-3 bg-honey text-[#2A1B0A] text-[10px] uppercase font-bold tracking-widest hover:bg-honey/90 transition-all">Save Details</button>
              </form>
            ) : (
              <div className="py-4 text-center"><CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2"/><p className="text-sm font-bold">Details Saved!</p></div>
            )}
          </div>
        )}

        {!isFulfilling && !error && (
          <div className="space-y-8">
            <div className="bg-hive-panel border border-honey/10 p-6 rounded-[2px] text-left space-y-3">
              <div className="flex items-center gap-2 mb-2"><Package size={16} className="text-honey"/><p className="text-[10px] uppercase tracking-widest text-honey font-bold">Next Steps</p></div>
              <ul className="text-sm text-[#2A1B0A]/70 space-y-2 font-light"><li>• Welcome Jar ships within 2 weeks.</li><li>• Journal is now active.</li></ul>
            </div>
            <Link to="/dashboard" className="inline-flex items-center gap-2 bg-[#2A1B0A] text-white px-10 py-5 text-xs uppercase tracking-widest font-bold hover:bg-[#1A1208] transition-all rounded-[2px] group">
              Go to Journal <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
