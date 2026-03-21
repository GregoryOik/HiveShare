import React, { useState } from 'react';
import { Save, User, MapPin, Calendar, ArrowLeft, Loader2, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../lib/useAuth';

export default function Settings() {
  const { profile, updateProfile } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    customLabel: profile?.customLabel || '',
    shippingAddress: profile?.shippingAddress || ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      await updateProfile(formData);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to update profile', error);
    } finally {
      setIsSaving(false);
    }
  };

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
            <p className="text-sm text-white/50">Manage your subscription details and shipping preferences.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Membership Status (Read Only) */}
            <div className="bg-[#110C05] border border-honey/10 p-6 rounded-[2px] space-y-4">
              <div className="flex items-center gap-3 text-honey">
                <Calendar className="w-4 h-4" />
                <span className="text-[10px] uppercase tracking-widest font-bold">Subscription Info</span>
              </div>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-white/30 mb-1">Status</p>
                  <p className="text-white font-medium capitalize">{profile?.role || 'User'}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-white/30 mb-1">Next Harvest</p>
                  <p className="text-white font-medium">{profile?.nextHarvestDate || 'TBD (Seasonal)'}</p>
                </div>
              </div>
            </div>

            {/* Editable Fields */}
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
                  Profile Updated
                </div>
              )}
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
