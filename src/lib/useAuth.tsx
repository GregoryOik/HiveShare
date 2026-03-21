import { useState, useEffect, createContext, useContext } from 'react';
import { auth, db } from './firebase';
import {
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, onSnapshot as onFirestoreSnapshot } from 'firebase/firestore';

interface UserProfile {
  uid: string;
  email: string;
  role: 'subscriber' | 'admin';
  subscribedHives: string[];
  customLabel?: string;
  shippingAddress?: string;
  nextHarvestDate?: string;
  tier?: 'starter' | 'premium';
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

    let profileUnsubscribe: (() => void) | null = null;

    const authUnsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);

      // Clean up previous listener if it exists
      if (profileUnsubscribe) {
        profileUnsubscribe();
        profileUnsubscribe = null;
      }

      if (currentUser) {
        setError(null);
        const userDocRef = doc(db, 'users', currentUser.uid);
        
        profileUnsubscribe = onFirestoreSnapshot(userDocRef, async (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data() as UserProfile;
            
            // SUPER ADMIN FALLBACK: Ensure the owner is ALWAYS an admin
            if (user?.email === 'gregorygate46@gmail.com' && data.role !== 'admin') {
              console.warn('Super Admin Override: Restoring admin role for owner.');
              data.role = 'admin';
              // Automatically repair the document in Firestore
              updateDoc(userDocRef, { role: 'admin' }).catch(e => console.error('Failed to auto-repair role:', e));
            }
            
            setProfile(data);
            setLoading(false);
          } else {
            const newProfile: UserProfile = {
              uid: currentUser.uid,
              email: currentUser.email || '',
              role: 'subscriber',
              subscribedHives: []
            };
            try {
              await setDoc(userDocRef, newProfile);
            } catch (err) {
              console.error('Error creating profile:', err);
              setError('Failed to initialize user profile');
              setLoading(false);
            }
          }
        }, (err) => {
          console.error('Profile snapshot error:', err);
          setError('Failed to listen to profile updates');
          setLoading(false);
        });
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => {
      authUnsubscribe();
      if (profileUnsubscribe) profileUnsubscribe();
    };
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
      // No need to setProfile manually, onFirestoreSnapshot will handle it!
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
