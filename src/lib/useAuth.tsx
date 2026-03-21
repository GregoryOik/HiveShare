import { useState, useEffect, createContext, useContext } from 'react';
import { auth, db } from './firebase';
import {
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

interface UserProfile {
  uid: string;
  email: string;
  role: 'subscriber' | 'admin';
  subscribedHives: string[];
  customLabel?: string;
  shippingAddress?: string;
  nextHarvestDate?: string;
}

interface AuthContextType {
  user: FirebaseUser | null;
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (newData: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      setError('Firebase not configured. Please check environment variables.');
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        setError(null);
        try {
          const userDocRef = doc(db, 'users', currentUser.uid);

          // Timeout wrapper to prevent hanging promise
          const withTimeout = <T,>(promise: Promise<T>, ms: number = 5000) => {
            return Promise.race([
              promise,
              new Promise<never>((_, reject) =>
                setTimeout(() => reject(new Error('Firestore operation timed out. Is the database created?')), ms)
              )
            ]);
          };

          const userDoc = await withTimeout(getDoc(userDocRef));

          if (userDoc.exists()) {
            setProfile(userDoc.data() as UserProfile);
          } else {
            // Check if this is the default admin
            const isDefaultAdmin = currentUser.email === 'gregorygate46@gmail.com' && currentUser.emailVerified;

            const newProfile: UserProfile = {
              uid: currentUser.uid,
              email: currentUser.email || '',
              role: isDefaultAdmin ? 'admin' : 'subscriber',
              subscribedHives: [] // No default hives for new users
            };

            await withTimeout(setDoc(userDocRef, newProfile));
            setProfile(newProfile);
          }
        } catch (err: any) {
          console.error('Error fetching/creating user profile:', err);
          setError(err.message || 'Failed to load user profile');
          // Sign out if profile creation fails so they aren't stuck in a half-logged-in state
          await signOut(auth);
          setUser(null);
          setProfile(null);
        }
      } else {
        setProfile(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Error signing in with Google', error);
      throw error;
    }
  };
  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out', error);
      throw error;
    }
  };

  const updateProfile = async (newData: Partial<UserProfile>) => {
    if (!user) return;
    try {
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, newData);
      setProfile(prev => prev ? { ...prev, ...newData } : null);
    } catch (error) {
      console.error('Error updating profile', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, error, signInWithGoogle, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
