import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../lib/useAuth';

export default function Login() {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { signInWithGoogle, user, profile } = useAuth();

  if (user && profile) {
    if (profile.role === 'admin') {
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  const handleLogin = async () => {
    setError('');
    setIsLoading(true);
    try {
      await signInWithGoogle();
      // Navigation is handled by the redirect above once user state updates
    } catch (err) {
      setError('Failed to sign in. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-hive-dark text-cream font-body flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(200,134,10,0.15)_0%,_transparent_60%)]"></div>
      
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-12">
          <div className="font-display text-4xl tracking-wide mb-2">
            Hive<span className="text-honey">Share</span>
          </div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-white/40">
            Member Portal
          </div>
        </div>

        <div className="bg-[#110C05] border border-honey/20 p-8 rounded-[2px] shadow-2xl text-center">
          <h2 className="text-xl font-display text-white mb-6">Welcome Back</h2>
          
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs p-3 mb-6 rounded">
              {error}
            </div>
          )}

          <button 
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full bg-honey text-white py-4 text-xs uppercase tracking-wider font-medium hover:bg-honey/90 transition-colors rounded-[2px] flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {isLoading ? 'Signing in...' : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Continue with Google
              </>
            )}
          </button>
          
          <div className="mt-8 text-xs text-white/40">
            By continuing, you agree to our <a href="/terms" className="text-honey hover:underline">Terms of Service</a> and <a href="/privacy" className="text-honey hover:underline">Privacy Policy</a>.
          </div>
        </div>
        
        <div className="mt-8 text-center text-xs text-white/30">
          <a href="/" className="hover:text-honey transition-colors">← Back to home</a>
        </div>
      </div>
    </div>
  );
}
