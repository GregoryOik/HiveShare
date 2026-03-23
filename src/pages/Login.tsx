import React, { useState } from 'react';
import { useNavigate, Navigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../lib/useAuth';
import { 
  Mail, 
  Lock, 
  ArrowRight, 
  Loader2, 
  Eye, 
  EyeOff, 
  User, 
  MapPin, 
  Package, 
  CheckCircle,
  Globe
} from 'lucide-react';
import OnboardingStepper from '../components/OnboardingStepper';

export default function Login() {
  const [localError, setLocalError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedMarketing, setAcceptedMarketing] = useState(false);
  
  // Email/password state
  const [mode, setMode] = useState<'login' | 'signup' | 'reset'>('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [country, setCountry] = useState('Greece');
  const [isZipValid, setIsZipValid] = useState<boolean | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation() as { state: { from?: { pathname: string }, tier?: string } };
  const { signInWithGoogle, signUp, signInWithEmail, resetPassword, user, profile, error: authError } = useAuth();
  
  const selectedTier = location.state?.tier;

  React.useEffect(() => {
    if (authError) {
      setIsLoading(false);
      setLocalError(authError);
    }
  }, [authError]);

  if (user && profile) {
    const from = location.state?.from?.pathname || '/dashboard';
    if (profile.role === 'admin' && from === '/dashboard') {
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to={from} replace />;
  }

  const handleGoogleLogin = async () => {
    if (!acceptedTerms) {
      setLocalError('You must accept the Terms & Conditions and Privacy Policy to continue.');
      return;
    }
    setLocalError('');
    setIsLoading(true);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      setLocalError('Firebase Error: ' + (err.message || 'Failed to sign in with Google.'));
      setIsLoading(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptedTerms && mode !== 'reset') {
      setLocalError('You must accept the Terms & Conditions and Privacy Policy to continue.');
      return;
    }
    if (!email) {
      setLocalError('Please enter your email address.');
      return;
    }

    setLocalError('');
    setIsLoading(true);

    try {
      if (mode === 'reset') {
        await resetPassword(email);
        setResetSent(true);
        setIsLoading(false);
        return;
      }
      if (mode === 'signup') {
        if (password.length < 6) {
          setLocalError('Password must be at least 6 characters.');
          setIsLoading(false);
          return;
        }
        if (!fullName || !shippingAddress || !isZipValid) {
          setLocalError('Please provide your full name and a valid EU shipping address (including postcode).');
          setIsLoading(false);
          return;
        }
        await signUp(email, password, acceptedMarketing, fullName, `${shippingAddress}, ${zipCode}, ${country}`);
      } else {
        await signInWithEmail(email, password);
      }
    } catch (err: any) {
      const code = err?.code || '';
      if (code === 'auth/user-not-found') {
        setLocalError('No account found with this email. Try signing up instead.');
      } else if (code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
        setLocalError('Incorrect password. Try again or reset it below.');
      } else if (code === 'auth/email-already-in-use') {
        setLocalError('This email is already registered. Try logging in instead.');
      } else if (code === 'auth/invalid-email') {
        setLocalError('Please enter a valid email address.');
      } else {
        setLocalError(err.message || 'Authentication failed. Please try again.');
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-hive-bg text-cream font-body flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(200,134,10,0.15)_0%,_transparent_60%)]"></div>
      
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="font-display text-4xl tracking-wide mb-6">
            Hive<span className="text-honey">Share</span>
          </div>

          {mode === 'signup' && (
            <div className="mb-10">
              <OnboardingStepper steps={[
                { label: 'Sign Up', completed: false, active: true },
                { label: 'Choose Plan', completed: false, active: false },
                { label: 'Payment', completed: false, active: false },
                { label: 'Hive Assigned', completed: false, active: false },
                { label: 'Apiary Journal', completed: false, active: false },
              ]} />
            </div>
          )}

          <div className="text-[10px] uppercase tracking-[0.2em] text-[#2A1B0A]/40">
            {mode === 'login' ? 'Member Portal' : 'New Member Registration'}
          </div>

          {selectedTier && mode === 'signup' && (
            <div className="mt-8 p-4 bg-honey/10 border border-honey/20 rounded-[2px] text-left">
              <p className="text-[9px] text-honey font-bold uppercase tracking-[0.2em] mb-1">Plan Selected</p>
              <p className="text-sm text-[#2A1B0A]/90 leading-relaxed">
                Ready to adopt your <span className="text-honey font-bold capitalize">{selectedTier}</span> hive? Create your account below to continue.
              </p>
            </div>
          )}
        </div>

        <div className="bg-hive-panel border border-honey/20 p-8 rounded-[2px] shadow-[0_0_50px_rgba(200,134,10,0.05)]">
          <h2 className="text-xl font-display text-[#2A1B0A] mb-6 text-center">
            {mode === 'login' ? 'Welcome Back' : mode === 'signup' ? 'Create Account' : 'Reset Password'}
          </h2>
          
          {localError && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs p-3 mb-6 rounded text-left">
              {localError}
            </div>
          )}

          {resetSent && mode === 'reset' && (
            <div className="bg-green-500/10 border border-green-500/30 text-green-400 text-xs p-3 mb-6 rounded text-center">
              Password reset email sent! Check your inbox.
            </div>
          )}

          {/* Email/Password Form */}
          <form onSubmit={handleEmailSubmit} className="space-y-4 mb-6">
            {mode === 'signup' && (
              <>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#2A1B0A]/30" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Full Name"
                    className="w-full bg-hive-bg border border-honey/20 pl-10 pr-4 py-3.5 text-sm text-[#2A1B0A] focus:outline-none focus:border-honey transition-colors rounded-[2px] placeholder:text-[#2A1B0A]/20"
                    required={mode === 'signup'}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#2A1B0A]/30" />
                    <input
                      type="text"
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      placeholder="Street & City"
                      className="w-full bg-hive-bg border border-honey/20 pl-10 pr-4 py-3.5 text-sm text-[#2A1B0A] focus:outline-none focus:border-honey transition-colors rounded-[2px] placeholder:text-[#2A1B0A]/20"
                      required={mode === 'signup'}
                    />
                  </div>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#2A1B0A]/30" />
                    <select
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full bg-hive-bg border border-honey/20 pl-10 pr-4 py-3.5 text-sm text-[#2A1B0A] focus:outline-none focus:border-honey transition-colors rounded-[2px] appearance-none"
                    >
                      {['Austria', 'Belgium', 'Bulgaria', 'Croatia', 'Cyprus', 'Czech Republic', 'Denmark', 'Estonia', 'Finland', 'France', 'Germany', 'Greece', 'Hungary', 'Ireland', 'Italy', 'Latvia', 'Lithuania', 'Luxembourg', 'Malta', 'Netherlands', 'Poland', 'Portugal', 'Romania', 'Slovakia', 'Slovenia', 'Spain', 'Sweden'].map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="relative">
                  <Package className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#2A1B0A]/30" />
                  <input
                    type="text"
                    value={zipCode}
                    onChange={(e) => {
                      const val = e.target.value.toUpperCase();
                      setZipCode(val);
                      // EU Zip codes vary, but generally 3-10 alphanumeric characters
                      setIsZipValid(val.length >= 3);
                    }}
                    placeholder="Postcode / ZIP"
                    className={`w-full bg-hive-bg border pl-10 pr-12 py-3.5 text-sm text-[#2A1B0A] focus:outline-none transition-all rounded-[2px] placeholder:text-[#2A1B0A]/20 ${
                      isZipValid === true ? 'border-green-500/50 bg-green-500/[0.02]' : 
                      isZipValid === false && zipCode.length > 0 ? 'border-red-500/50' : 'border-honey/20'
                    }`}
                    required={mode === 'signup'}
                  />
                  {isZipValid === true && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 animate-in fade-in zoom-in">
                       <span className="text-[7px] font-black text-green-500 uppercase tracking-widest">Proofed EU</span>
                       <CheckCircle className="w-4 h-4 text-green-500" />
                    </div>
                  )}
                </div>
              </>
            )}
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#2A1B0A]/30" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full bg-hive-bg border border-honey/20 pl-10 pr-4 py-3.5 text-sm text-[#2A1B0A] focus:outline-none focus:border-honey transition-colors rounded-[2px] placeholder:text-[#2A1B0A]/20"
              />
            </div>

            {mode !== 'reset' && (
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#2A1B0A]/30" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full bg-hive-bg border border-honey/20 pl-10 pr-10 py-3.5 text-sm text-[#2A1B0A] focus:outline-none focus:border-honey transition-colors rounded-[2px] placeholder:text-[#2A1B0A]/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#2A1B0A]/30 hover:text-[#2A1B0A]/60 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            )}

            {mode !== 'reset' && (
              <div className="text-left space-y-3 pt-2">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center mt-0.5">
                    <input 
                      type="checkbox" 
                      className="peer appearance-none w-4 h-4 border border-white/20 rounded-[2px] bg-transparent checked:bg-honey checked:border-honey transition-colors cursor-pointer"
                      checked={acceptedTerms}
                      onChange={(e) => setAcceptedTerms(e.target.checked)}
                    />
                    <svg className="absolute w-3 h-3 text-[#2A1B0A] opacity-0 peer-checked:opacity-100 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <span className="text-xs text-[#2A1B0A]/70 group-hover:text-[#2A1B0A]/90 transition-colors leading-relaxed">
                    I accept the <Link to="/terms" className="text-honey hover:underline">Terms & Conditions</Link> and <Link to="/privacy" className="text-honey hover:underline">Privacy Policy</Link>. *
                  </span>
                </label>

                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center mt-0.5">
                    <input 
                      type="checkbox" 
                      className="peer appearance-none w-4 h-4 border border-white/20 rounded-[2px] bg-transparent checked:bg-honey checked:border-honey transition-colors cursor-pointer"
                      checked={acceptedMarketing}
                      onChange={(e) => setAcceptedMarketing(e.target.checked)}
                    />
                    <svg className="absolute w-3 h-3 text-[#2A1B0A] opacity-0 peer-checked:opacity-100 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <span className="text-xs text-[#2A1B0A]/70 group-hover:text-[#2A1B0A]/90 transition-colors leading-relaxed">
                    Keep me updated about my hive and honey harvests + promotional offers.
                  </span>
                </label>
              </div>
            )}

            <button 
              type="submit"
              disabled={isLoading || (!acceptedTerms && mode !== 'reset')}
              className="w-full bg-honey text-[#2A1B0A] py-3.5 text-xs uppercase tracking-wider font-medium hover:bg-honey/90 transition-colors rounded-[2px] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <ArrowRight className="w-4 h-4" />
              )}
              {mode === 'login' ? 'Sign In' : mode === 'signup' ? 'Create Account' : 'Send Reset Link'}
            </button>
          </form>

          {/* Mode Switching Links */}
          <div className="text-center space-y-2 mb-6">
            {mode === 'login' && (
              <>
                <button onClick={() => { setMode('signup'); setLocalError(''); }} className="text-xs text-[#2A1B0A]/50 hover:text-honey transition-colors block w-full">
                  Don't have an account? <span className="text-honey">Sign up</span>
                </button>
                <button onClick={() => { setMode('reset'); setLocalError(''); setResetSent(false); }} className="text-xs text-[#2A1B0A]/50 hover:text-honey transition-colors block w-full">
                  Forgot your password?
                </button>
              </>
            )}
            {mode === 'signup' && (
              <button onClick={() => { setMode('login'); setLocalError(''); }} className="text-xs text-[#2A1B0A]/50 hover:text-honey transition-colors block w-full">
                Already have an account? <span className="text-honey">Sign in</span>
              </button>
            )}
            {mode === 'reset' && (
              <button onClick={() => { setMode('login'); setLocalError(''); setResetSent(false); }} className="text-xs text-[#2A1B0A]/50 hover:text-honey transition-colors block w-full">
                ← Back to sign in
              </button>
            )}
          </div>

          {/* Divider */}
          {mode !== 'reset' && (
            <>
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-1 h-px bg-white/10"></div>
                <span className="text-[10px] uppercase tracking-widest text-[#2A1B0A]/30">or</span>
                <div className="flex-1 h-px bg-white/10"></div>
              </div>

              {/* Google Button */}
              <button 
                onClick={handleGoogleLogin}
                disabled={isLoading || !acceptedTerms}
                className="w-full bg-white/5 border border-white/10 text-[#2A1B0A] py-3.5 text-xs uppercase tracking-wider font-medium hover:bg-white/10 transition-colors rounded-[2px] flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Continue with Google
              </button>
            </>
          )}
        </div>
        
        <div className="mt-8 text-center text-xs text-[#2A1B0A]/30">
          <a href={window.location.hostname.startsWith('dashboard.') ? 'https://oikonomakos.gr/' : '/'} className="hover:text-honey transition-colors">← Back to home</a>
        </div>
      </div>
    </div>
  );
}
