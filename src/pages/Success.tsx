import React, { useEffect, useState, useCallback } from 'react';
import { CheckCircle, ArrowRight, Loader2, Package, AlertTriangle, RefreshCw } from 'lucide-react';
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
                : isAdditional 
                  ? "New Hive Added!" 
                  : "Welcome to the Hive!"}
          </h1>
          <p className="text-[#2A1B0A]/60 leading-relaxed font-light">
            {isFulfilling 
              ? "We are connecting your account to a specific apiary in Laconia, Greece..." 
              : error
                ? error
                : isAdditional
                  ? `Hive #${claimedId} has been added to your collection! You now have ${profile?.subscribedHives?.length || 0} hives.`
                  : `Your membership is now active! You've been assigned Hive #${claimedId}. Your Welcome Jar is being prepared.`
            }
          </p>
        </div>

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
