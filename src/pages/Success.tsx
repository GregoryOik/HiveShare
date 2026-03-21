import React, { useEffect, useState } from 'react';
import { CheckCircle, ArrowRight, Loader2, Package } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { useHiveData } from '../lib/useHiveData';
import { useAuth } from '../lib/useAuth';

export default function Success() {
  const [searchParams] = useSearchParams();
  const { claimRandomHive } = useHiveData();
  const { profile, loading } = useAuth();
  const [isFulfilling, setIsFulfilling] = useState(true);
  const [claimedId, setClaimedId] = useState<string | null>(null);

  useEffect(() => {
    const fulfill = async () => {
      const tier = (searchParams.get('tier') as 'starter' | 'premium') || 'starter';
      const isNewHive = searchParams.get('new_hive') === 'true';
      
      // Claim a new hive if: no hives yet OR explicitly buying an additional hive
      const hasNoHives = !profile?.subscribedHives || profile.subscribedHives.length === 0;
      
      if (profile && (hasNoHives || isNewHive)) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        const newId = await claimRandomHive(tier);
        if (newId) setClaimedId(newId);
      } else if (profile?.subscribedHives?.length > 0) {
        // Already has hives and not a new purchase — just show existing
        setClaimedId(profile.subscribedHives[profile.subscribedHives.length - 1]);
      }
      setIsFulfilling(false);
    };
    if (!loading) fulfill();
  }, [loading]);

  const isAdditional = (profile?.subscribedHives?.length || 0) > 1;

  return (
    <div className="min-h-screen bg-[#1A1208] text-white flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 mx-auto bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center">
          {isFulfilling ? (
            <Loader2 className="w-10 h-10 text-honey animate-spin" />
          ) : (
            <CheckCircle className="w-10 h-10 text-green-500" />
          )}
        </div>
        
        <div className="space-y-4">
          <h1 className="font-display text-4xl text-white">
            {isFulfilling ? "Assigning Your Hive..." : isAdditional ? "New Hive Added!" : "Welcome to the Hive!"}
          </h1>
          <p className="text-white/60 leading-relaxed font-light">
            {isFulfilling 
              ? "We are connecting your account to a specific apiary in Laconia, Greece..." 
              : isAdditional
                ? `Hive #${claimedId || 'Pending'} has been added to your collection! You now have ${profile?.subscribedHives?.length || 0} hives.`
                : `Your membership is now active! You've been assigned Hive #${claimedId || 'Pending'}. Your Welcome Jar is being prepared.`
            }
          </p>
        </div>

        {!isFulfilling && (
          <>
            <div className="bg-[#110C05] border border-honey/10 p-6 rounded-[2px] text-left space-y-3">
              <div className="flex items-center gap-2 mb-2">
                <Package className="w-4 h-4 text-honey" />
                <p className="text-[10px] uppercase tracking-widest text-honey font-bold">What happens next?</p>
              </div>
              <ul className="text-sm text-white/70 space-y-2 font-light">
                <li>• Your Welcome Jar ships within 2 weeks.</li>
                <li>• Download your Adoption Certificate in the dashboard.</li>
                <li>• Live data is now streaming to your dashboard.</li>
              </ul>
            </div>

            <div className="pt-6">
              <Link 
                to="/dashboard" 
                className="inline-flex items-center gap-2 bg-honey text-white px-10 py-4 text-xs uppercase tracking-widest font-medium hover:bg-honey/90 transition-all hover:shadow-[0_0_20px_rgba(200,134,10,0.3)] rounded-sm group"
              >
                Go to My Dashboard
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
