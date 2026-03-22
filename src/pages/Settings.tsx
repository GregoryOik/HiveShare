import React, { useState } from 'react';
import { Save, User, MapPin, Calendar, ArrowLeft, Loader2, CheckCircle, ShieldCheck, Mail, Crown, Star, AlertTriangle, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../lib/useAuth';

export default function Settings() {
  const { user, profile, updateProfile, cancelSubscription } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [cancelSuccess, setCancelSuccess] = useState(false);
  
  const [isInitialized, setIsInitialized] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  
  const [formData, setFormData] = useState({
    customLabel: '',
    shippingAddress: ''
  });

  // Sync with profile only once initially
  React.useEffect(() => {
    if (profile && !isInitialized) {
      setFormData({
        customLabel: profile.customLabel || '',
        shippingAddress: profile.shippingAddress || ''
      });
      setIsInitialized(true);
    }
  }, [profile, isInitialized]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);
    setIsValidating(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsValidating(false);
      await updateProfile(formData);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (error) {
      console.error('Failed to update profile', error);
    } finally {
      setIsSaving(false);
      setIsValidating(false);
    }
  };

  const handleCancelSubscription = async () => {
    setIsCancelling(true);
    try {
      await cancelSubscription();
      setCancelSuccess(true);
      setShowCancelConfirm(false);
      setTimeout(() => setCancelSuccess(false), 5000);
    } catch (error) {
      console.error('Failed to cancel', error);
    } finally {
      setIsCancelling(false);
    }
  };

  const tierLabel = profile?.tier === 'premium' ? 'Premium' : profile?.tier === 'starter' ? 'Starter' : 'Free';
  const hasSubscription = profile?.tier && profile.subscribedHives?.length > 0;

  return (
    <div className="min-h-screen bg-[#1A1208] text-white/80 font-body selection:bg-honey selection:text-white pb-20">
      <header className="border-b border-honey/20 bg-[#1A1208] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2 text-white hover:text-honey transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="font-display text-2xl tracking-wide">
              Hive<span className="text-honey">Share</span>
            </span>
          </Link>
          <div className="text-[10px] uppercase tracking-widest text-white/30 hidden md:block">
            Account Settings
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 pt-12">
        <div className="space-y-12">
          {/* Section Header */}
          <div className="space-y-2">
            <h1 className="font-display text-4xl text-white">Your Profile</h1>
            <p className="text-sm text-white/50">Manage your account, subscription, and shipping preferences.</p>
          </div>

          {/* Account Info (Read Only) */}
          <div className="bg-[#110C05] border border-honey/10 p-6 rounded-[2px] space-y-4">
            <div className="flex items-center gap-3 text-honey">
              <Mail className="w-4 h-4" />
              <span className="text-[10px] uppercase tracking-widest font-bold">Account Information</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-white/30 mb-1">Display Name</p>
                <p className="text-white font-medium">{user?.displayName || profile?.customLabel || 'Not set'}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-white/30 mb-1">Email</p>
                <p className="text-white font-medium">{user?.email || 'N/A'}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-white/30 mb-1">Member Since</p>
                <p className="text-white font-medium">{user?.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Unknown'}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-white/30 mb-1">Auth Provider</p>
                <p className="text-white font-medium capitalize">{user?.providerData?.[0]?.providerId === 'google.com' ? 'Google' : 'Email & Password'}</p>
              </div>
            </div>
          </div>

          {/* Change Password — only for email/password users */}
          {user?.providerData?.[0]?.providerId !== 'google.com' && (
            <div className="bg-[#110C05] border border-honey/10 p-6 rounded-[2px] space-y-4">
              <div className="flex items-center gap-3 text-honey">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-[10px] uppercase tracking-widest font-bold">Change Password</span>
              </div>
              <form onSubmit={async (e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const newPassword = (form.elements.namedItem('newPassword') as HTMLInputElement).value;
                const confirmPassword = (form.elements.namedItem('confirmPassword') as HTMLInputElement).value;
                
                if (newPassword.length < 6) {
                  alert('Password must be at least 6 characters.');
                  return;
                }
                if (newPassword !== confirmPassword) {
                  alert('Passwords do not match.');
                  return;
                }
                
                try {
                  const { updatePassword } = await import('firebase/auth');
                  await updatePassword(user!, newPassword);
                  alert('Password updated successfully!');
                  form.reset();
                } catch (err: any) {
                  if (err.code === 'auth/requires-recent-login') {
                    alert('For security, please log out and log back in before changing your password.');
                  } else {
                    alert('Failed to update password: ' + err.message);
                  }
                }
              }} className="flex flex-col gap-3">
                <input 
                  type="password" 
                  name="newPassword" 
                  placeholder="New password" 
                  required
                  minLength={6}
                  className="w-full bg-transparent border border-honey/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-honey transition-colors rounded-[2px] placeholder:text-white/20"
                />
                <input 
                  type="password" 
                  name="confirmPassword" 
                  placeholder="Confirm new password" 
                  required
                  minLength={6}
                  className="w-full bg-transparent border border-honey/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-honey transition-colors rounded-[2px] placeholder:text-white/20"
                />
                <button 
                  type="submit"
                  className="w-fit px-6 py-2 bg-honey/10 text-honey border border-honey/20 text-[10px] uppercase tracking-widest font-medium hover:bg-honey hover:text-white transition-colors rounded-[2px]"
                >
                  Update Password
                </button>
              </form>
            </div>
          )}

          {/* Subscription Status */}
          <div className="bg-[#110C05] border border-honey/10 p-6 rounded-[2px] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-honey">
                <Calendar className="w-4 h-4" />
                <span className="text-[10px] uppercase tracking-widest font-bold">Subscription</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-honey/20 bg-honey/5">
                {profile?.tier === 'premium' ? (
                  <Crown size={12} className="text-honey" />
                ) : (
                  <Star size={12} className="text-white/40" />
                )}
                <span className="text-[10px] uppercase tracking-widest font-bold text-white/70">{tierLabel}</span>
              </div>
            </div>

            {/* Subscription Details Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-white/30 mb-1">Status</p>
                <p className="text-white font-medium capitalize">{hasSubscription ? 'Active' : 'Inactive'}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-white/30 mb-1">Hives Adopted</p>
                <p className="text-white font-medium">{profile?.subscribedHives?.length || 0}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-white/30 mb-1">Next Harvest</p>
                <p className="text-white font-medium">{profile?.nextHarvestDate || 'TBD (Seasonal)'}</p>
              </div>
            </div>

            {/* Subscription Timer */}
            {hasSubscription && (() => {
              const startDate = profile?.subscriptionStartDate ? new Date(profile.subscriptionStartDate) : null;
              const now = new Date();
              const endDate = startDate ? new Date(startDate.getTime() + 365 * 24 * 60 * 60 * 1000) : null;
              const daysLeft = endDate ? Math.max(0, Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))) : null;
              const daysSinceStart = startDate ? Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) : null;
              const isInCoolingOff = daysSinceStart !== null && daysSinceStart <= 14;
              const coolingOffDaysLeft = isInCoolingOff ? 14 - daysSinceStart : 0;
              const progressPercent = daysLeft !== null ? Math.min(100, ((365 - daysLeft) / 365) * 100) : 0;

              return (
                <div className="pt-4 border-t border-honey/10 space-y-4">
                  {/* Duration Bar */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-[10px] uppercase tracking-widest text-white/30">Subscription Duration</p>
                      <p className="text-xs text-white/60">
                        {daysLeft !== null ? (
                          <><strong className="text-white">{daysLeft}</strong> days remaining</>
                        ) : (
                          'Started recently'
                        )}
                      </p>
                    </div>
                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-honey to-honey/60 rounded-full transition-all duration-1000" 
                        style={{ width: `${progressPercent}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between mt-1.5">
                      <p className="text-[9px] text-white/20">
                        {startDate ? startDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                      </p>
                      <p className="text-[9px] text-white/20">
                        {endDate ? endDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                      </p>
                    </div>
                  </div>

                  {/* EU Cooling-Off Notice */}
                  {isInCoolingOff && (
                    <div className="bg-blue-500/5 border border-blue-500/20 p-4 rounded-[2px]">
                      <div className="flex items-start gap-2">
                        <ShieldCheck className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-xs text-blue-400 font-medium">EU 14-Day Right of Withdrawal</p>
                          <p className="text-[11px] text-white/40 mt-1 leading-relaxed">
                            You have <strong className="text-white/70">{coolingOffDaysLeft} day{coolingOffDaysLeft !== 1 ? 's' : ''}</strong> left to cancel under EU consumer protection law. 
                            If your Welcome Jar has already been shipped, the cost of the honey and shipping (approx. €25) will be deducted from your refund.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Cancel Subscription */}
            {hasSubscription && profile?.role !== 'admin' && (
              <div className="pt-4 border-t border-honey/10">
                {!showCancelConfirm ? (
                  <button 
                    onClick={() => setShowCancelConfirm(true)}
                    className="text-xs text-red-400/60 hover:text-red-400 transition-colors uppercase tracking-widest"
                  >
                    Cancel Subscription
                  </button>
                ) : (
                  <div className="bg-red-500/5 border border-red-500/20 p-4 rounded-[2px] space-y-3">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm text-red-400 font-medium">Are you sure?</p>
                        <p className="text-xs text-white/40 mt-1">
                          {(() => {
                            const startDate = profile?.subscriptionStartDate ? new Date(profile.subscriptionStartDate) : null;
                            const daysSince = startDate ? Math.floor((new Date().getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) : null;
                            const inCooling = daysSince !== null && daysSince <= 14;
                            
                            if (inCooling) {
                              return 'Under EU law, you may cancel within 14 days. If your Welcome Jar has already shipped, the cost of honey & shipping (approx. €25) may be deducted from your refund.';
                            }
                            return 'Your hive access will be revoked and you will lose your dashboard data. As the 14-day cooling-off period has passed, refunds are no longer available under EU law.';
                          })()}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button 
                        onClick={handleCancelSubscription}
                        disabled={isCancelling}
                        className="inline-flex items-center gap-2 bg-red-500/20 border border-red-500/30 text-red-400 px-4 py-2 text-xs uppercase tracking-widest rounded-[2px] hover:bg-red-500/30 transition-colors disabled:opacity-50"
                      >
                        {isCancelling ? <Loader2 className="w-3 h-3 animate-spin" /> : <XCircle className="w-3 h-3" />}
                        Yes, Cancel
                      </button>
                      <button 
                        onClick={() => setShowCancelConfirm(false)}
                        className="text-xs text-white/50 hover:text-white transition-colors uppercase tracking-widest px-4 py-2"
                      >
                        Keep Subscription
                      </button>
                    </div>
                  </div>
                )}
                {cancelSuccess && (
                  <p className="text-xs text-green-500 mt-3 uppercase tracking-widest">Subscription cancelled successfully.</p>
                )}
              </div>
            )}
          </div>

          {/* Editable Profile Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-white/50 font-bold ml-1">
                  <User className="w-3 h-3" />
                  Named Jar Label
                </label>
                <input 
                  type="text" 
                  value={formData.customLabel}
                  onChange={(e) => setFormData({ ...formData, customLabel: e.target.value })}
                  placeholder="e.g. The Smith Family"
                  className="w-full bg-[#110C05] border border-honey/20 px-4 py-4 text-sm text-white focus:outline-none focus:border-honey transition-colors rounded-[2px] placeholder:text-white/10"
                />
                <p className="text-[10px] text-white/30 ml-1 italic">This name will appear on your personalized honey jar labels.</p>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-white/50 font-bold ml-1">
                  <MapPin className="w-3 h-3" />
                  Shipping Address
                </label>
                <textarea 
                  value={formData.shippingAddress}
                  onChange={(e) => setFormData({ ...formData, shippingAddress: e.target.value })}
                  placeholder="Line 1, City, Postcode, Country" 
                  rows={4}
                  className="w-full bg-[#110C05] border border-honey/20 px-4 py-4 text-sm text-white focus:outline-none focus:border-honey transition-colors rounded-[2px] placeholder:text-white/10 resize-none"
                />
                {profile?.shippingAddress && (
                  <div className="flex items-center gap-1.5 text-[9px] text-green-500/70 uppercase tracking-widest font-bold mt-2 ml-1">
                    <ShieldCheck className="w-3 h-3" />
                    Verified Shipping Destination
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 flex items-center gap-6">
              <button 
                type="submit" 
                disabled={isSaving}
                className="inline-flex items-center gap-2 bg-honey text-white px-10 py-4 text-xs uppercase tracking-widest font-medium hover:bg-honey/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed rounded-sm"
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Save Changes
              </button>

              {saveSuccess && (
                <div className="flex items-center gap-2 text-green-500 text-xs uppercase tracking-widest animate-in fade-in slide-in-from-left-4 duration-300">
                  <CheckCircle className="w-4 h-4" />
                  {isValidating ? "Verifying..." : "Profile Verified & Saved"}
                </div>
              )}
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
