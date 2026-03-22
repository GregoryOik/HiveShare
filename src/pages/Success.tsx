import React, { useEffect, useState, useCallback } from 'react';
import { CheckCircle, ArrowRight, Loader2, Package, AlertTriangle, RefreshCw, Star, ShieldCheck } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { useHiveData } from '../lib/useHiveData';
import { useAuth } from '../lib/useAuth';
import OnboardingStepper from '../components/OnboardingStepper';

export default function Success() {
  const [searchParams] = useSearchParams();
  const { claimRandomHive } = useHiveData();
  const { profile, loading } = useAuth();
  const [isFulfilling, setIsFulfilling] = useState(true);
  const [claimedId, setClaimedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasAttempted, setHasAttempted] = useState(false);
  const [giftSaved, setGiftSaved] = useState(false);
  const [giftData, setGiftData] = useState({ recipientName: '', customMessage: '' });

  const fulfill = useCallback(async () => {
    if (!profile) return;
    if (hasAttempted && claimedId) return;
    
    setIsFulfilling(true);
    setError(null);
    
    const tier = (searchParams.get('tier') as 'starter' | 'premium') || 'starter';
    const isNewHive = searchParams.get('new_hive') === 'true';
    const hasNoHives = !profile.subscribedHives || profile.subscribedHives.length === 0;

    console.log('[Success] Fulfillment starting:', { tier, isNewHive, hasNoHives, currentHives: profile.subscribedHives });

    try {
      if (hasNoHives || isNewHive) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        const newId = await claimRandomHive(tier);
        console.log('[Success] claimRandomHive result:', newId);
        if (newId) {
          setClaimedId(newId);
          // Trigger assignment email
          const { sendEmail, emailTemplates } = await import('../lib/email');
          sendEmail(emailTemplates.assignment(profile.email, newId)).catch(console.error);
        } else {
          setError('No available hives found. Please contact support at gregory@oikonomakos.gr');
        }
      } else if (profile.subscribedHives.length > 0) {
        setClaimedId(profile.subscribedHives[profile.subscribedHives.length - 1]);
      }
    } catch (err: any) {
      console.error('[Success] Fulfillment error:', err);
      setError(err.message || 'Failed to assign hive. Please try again.');
    } finally {
      setIsFulfilling(false);
      setHasAttempted(true);
    }
  }, [profile, hasAttempted, claimedId, searchParams, claimRandomHive]);

  useEffect(() => {
    if (!loading && profile && !hasAttempted) {
      fulfill();
    }
  }, [loading, profile, hasAttempted, fulfill]);

  const isAdditional = (profile?.subscribedHives?.length || 0) > 1;
  const isGift = searchParams.get('is_gift') === 'true';

  const handleSaveGift = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    try {
      const { updateDoc, doc } = await import('firebase/firestore');
      const { db } = await import('../lib/firebase');
      await updateDoc(doc(db, 'users', profile.uid), {
        giftDetails: giftData
      });
      setGiftSaved(true);
    } catch (err) {
      console.error('Failed to save gift details:', err);
    }
  };

  return (
    <div className="min-h-screen bg-hive-bg text-[#2A1B0A] flex items-center justify-center p-6 text-center">
      <div className="max-w-2xl w-full text-center space-y-8 animate-in fade-in zoom-in duration-500">
        {/* Onboarding Stepper */}
        <OnboardingStepper steps={[
          { label: 'Sign Up', completed: true, active: false },
          { label: 'Choose Plan', completed: true, active: false },
          { label: 'Payment', completed: true, active: false },
          { label: 'Hive Assigned', completed: !isFulfilling && !error && !!claimedId, active: isFulfilling },
          { label: 'Apiary Journal', completed: false, active: !isFulfilling && !error && !!claimedId },
        ]} />

        <div className="w-20 h-20 mx-auto bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center">
          {isFulfilling ? (
            <Loader2 className="w-10 h-10 text-honey animate-spin" />
          ) : error ? (
            <AlertTriangle className="w-10 h-10 text-red-400" />
          ) : (
            <CheckCircle className="w-10 h-10 text-green-500" />
          )}
        </div>
        
        <div className="space-y-4">
          <h1 className="font-display text-4xl text-[#2A1B0A]">
            {isFulfilling 
              ? "Assigning Your Hive..." 
              : error 
                ? "Something Went Wrong"
                : isGift
                  ? "Your Gift is Ready!"
                  : isAdditional 
                    ? "New Hive Added!" 
                    : "Welcome to the Hive!"}
          </h1>
          <p className="text-[#2A1B0A]/60 leading-relaxed font-light">
            {isFulfilling 
              ? "We are connecting your account to a specific apiary in Laconia, Greece..." 
              : error
                ? error
                : isGift
                  ? "You've successfully adopted a hive as a gift. Tell us who it's for, and we'll prepare their digital card."
                  : isAdditional
                    ? `Hive #${claimedId} has been added to your collection! You now have ${profile?.subscribedHives?.length || 0} hives.`
                    : `Your membership is now active! You've been assigned Hive #${claimedId}. Your Welcome Jar is being prepared.`
            }
          </p>
        </div>

        {isGift && !isFulfilling && !error && (
          <div className="bg-hive-panel/50 border border-honey/20 p-8 rounded-[2px] text-left space-y-6 animate-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center gap-3 text-honey">
              <Star className="w-5 h-5" />
              <span className="text-[10px] uppercase tracking-[0.3em] font-bold">Personalize the Gift</span>
            </div>
            {!giftSaved ? (
              <form onSubmit={handleSaveGift} className="space-y-4">
                <div className="space-y-2">
                  <input 
                    type="text" 
                    placeholder="Recipient's Name" 
                    required
                    value={giftData.recipientName}
                    onChange={(e) => setGiftData({ ...giftData, recipientName: e.target.value })}
                    className="w-full bg-hive-bg border border-honey/20 px-4 py-3 text-sm rounded-[2px] focus:outline-none focus:border-honey transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <textarea 
                    placeholder="Message for the digital card (optional)" 
                    rows={3}
                    value={giftData.customMessage}
                    onChange={(e) => setGiftData({ ...giftData, customMessage: e.target.value })}
                    className="w-full bg-hive-bg border border-honey/20 px-4 py-3 text-sm rounded-[2px] focus:outline-none focus:border-honey transition-colors resize-none"
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full py-3 bg-honey text-[#2A1B0A] text-[10px] uppercase tracking-widest font-bold hover:bg-honey/90 transition-all rounded-[2px]"
                >
                  Save Gift Details
                </button>
              </form>
            ) : (
              <div className="py-4 text-center">
                <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-3" />
                <p className="text-sm text-[#2A1B0A] font-bold">Gift Details Saved!</p>
                <p className="text-[10px] text-[#2A1B0A]/40 uppercase tracking-widest mt-1">We'll include this on their adoption certificate.</p>
              </div>
            )}
          </div>
        )}

        {error && (
          <button 
            onClick={() => { setHasAttempted(false); setError(null); }}
            className="inline-flex items-center gap-2 bg-honey text-[#2A1B0A] px-8 py-3 text-xs uppercase tracking-widest rounded-sm hover:bg-honey/90 transition-colors"
          >
            <RefreshCw className="w-4 h-4" /> Try Again
          </button>
        )}

        {!isFulfilling && !error && (
          <>
            <div className="bg-hive-panel border border-honey/10 p-6 rounded-[2px] text-left space-y-3">
              <div className="flex items-center gap-2 mb-2">
                <Package className="w-4 h-4 text-honey" />
                <p className="text-[10px] uppercase tracking-widest text-honey font-bold">What happens next?</p>
              </div>
              <ul className="text-sm text-[#2A1B0A]/70 space-y-2 font-light">
                <li>• Your Welcome Jar ships within 2 weeks.</li>
                <li>• Download your Adoption Certificate in the journal.</li>
                <li>• Live vitality is now streaming to your journal.</li>
              </ul>
            </div>

            <div className="pt-6">
              <Link 
                to="/dashboard" 
                className="inline-flex items-center gap-2 bg-honey text-[#2A1B0A] px-10 py-4 text-xs uppercase tracking-widest font-medium hover:bg-honey/90 transition-all hover:shadow-[0_0_20px_rgba(200,134,10,0.3)] rounded-sm group"
              >
                Go to My Apiary Journal
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
