import { useState, useEffect, createContext, useContext } from 'react';
import { auth, db } from './firebase';
import {
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, collection, onSnapshot as onFirestoreSnapshot } from 'firebase/firestore';

interface UserProfile {
  uid: string;
  email: string;
  role: 'subscriber' | 'admin';
  subscribedHives: string[];
  customLabel?: string;
  shippingAddress?: string;
  nextHarvestDate?: string;
  tier?: 'starter' | 'premium';
  subscriptionStartDate?: string;
  adminNotes?: string;
  customHoneyName?: string;
  userHarvestStatus?: string;
  metadata?: { key: string; value: string }[];
  dob?: string;
  hasSeenTour?: boolean;
}

interface AuthContextType {
  user: FirebaseUser | null;
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  signInWithGoogle: () => Promise<void>;
  signUp: (email: string, password: string, acceptedMarketing?: boolean, fullName?: string, address?: string) => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (newData: Partial<UserProfile>) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
  deleteAccount: () => Promise<void>;
  cancelSubscription: () => Promise<void>;
  manageBilling: () => Promise<void>;
  forceSyncAdminRole: () => Promise<void>;
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
            
            // SUPER ADMIN FALLBACK
            if (currentUser?.email === 'gregorygate46@gmail.com' && data.role !== 'admin') {
              console.warn('Super Admin Override: Restoring admin role for owner.');
              data.role = 'admin';
              setDoc(userDocRef, { role: 'admin' }, { merge: true }).catch(e => console.error('Failed to auto-repair role:', e));
            }
            
            // STRIPE EXTENSION SYNC
            // Listen to subscriptions subcollection for the latest status
            const subCollectionRef = collection(db, 'customers', currentUser.uid, 'subscriptions');
            onFirestoreSnapshot(subCollectionRef, (subSnap) => {
              const activeSub = subSnap.docs.find(d => ['active', 'trialing'].includes(d.data().status));
              if (activeSub) {
                const subData = activeSub.data();
                const productId = subData.items?.[0]?.price?.product?.id || '';
                const tier = subData.metadata?.tier || 
                             (productId === 'prod_UBycQzivtGZfSb' ? 'premium' : 
                              productId === 'prod_UBycB7qVGfTjy2' ? 'starter' : 
                              (productId.toLowerCase().includes('premium') ? 'premium' : 'starter'));
                
                // IMPORTANT: Don't downgrade admin to subscriber
                setProfile(prev => {
                  if (!prev) return null;
                  const newRole = prev.role === 'admin' ? 'admin' : 'subscriber';
                  return { ...prev, tier, role: newRole };
                });
              }
            });

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

  const signUp = async (email: string, password: string, acceptedMarketing: boolean = false, fullName?: string, address?: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // We don't wait for email to finish, as it's secondary to account creation
      const { sendEmail, emailTemplates } = await import('./email');
      sendEmail(emailTemplates.welcome(email, fullName || 'Guardian')).catch(console.error);

      // Store marketing preference and identity metadata
      if (userCredential.user) {
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          uid: userCredential.user.uid,
          email,
          role: 'subscriber',
          subscribedHives: [],
          acceptedMarketing, // Store this for future promotional emails
          customLabel: fullName || null,
          shippingAddress: address || null
        }, { merge: true });
      }

    } catch (error) {
      console.error('Error creating account', error);
      throw error;
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Error signing in with email', error);
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error('Error sending password reset', error);
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

  const updatePassword = async (newPassword: string) => {
    if (!user) return;
    try {
      const { updatePassword: firebaseUpdatePassword } = await import('firebase/auth');
      await firebaseUpdatePassword(user, newPassword);
    } catch (error) {
      console.error('Error updating password', error);
      throw error;
    }
  };

  const deleteAccount = async () => {
    if (!user) return;
    try {
      const { deleteUser } = await import('firebase/auth');
      const userDocRef = doc(db, 'users', user.uid);
      await deleteUser(user);
    } catch (error) {
      console.error('Error deleting account', error);
      throw error;
    }
  };

  const updateProfile = async (newData: Partial<UserProfile>) => {
    if (!user) return;
    try {
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, newData);
    } catch (error) {
      console.error('Error updating profile', error);
      throw error;
    }
  };

  const cancelSubscription = async () => {
    if (!user) return;
    try {
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, {
        role: 'subscriber',
        tier: null,
        subscribedHives: []
      });
    } catch (error) {
      console.error('Error cancelling subscription', error);
      throw error;
    }
  };

  const manageBilling = async () => {
    if (!user) return;
    try {
      const { addDoc, collection, onSnapshot, doc } = await import('firebase/firestore');
      const docRef = await addDoc(collection(db, 'customers', user.uid, 'portal_sessions'), {
        return_url: window.location.origin + '/settings',
      });

      // Listen for the portal URL
      const unsubscribe = onSnapshot(doc(db, 'customers', user.uid, 'portal_sessions', docRef.id), (snap) => {
        const data = snap.data();
        if (data?.url) {
          unsubscribe();
          window.location.assign(data.url);
        }
      });
    } catch (error) {
      console.error('Error creating portal session', error);
      throw error;
    }
  };

  const forceSyncAdminRole = async () => {
    if (!user || user.email !== 'gregorygate46@gmail.com') return;
    try {
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, { role: 'admin' }, { merge: true });
      console.log('Admin role sync forced successfully.');
    } catch (error) {
      console.error('Error forcing admin role sync', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      profile, 
      loading, 
      error, 
      signInWithGoogle, 
      signUp, 
      signInWithEmail, 
      resetPassword, 
      logout, 
      updateProfile, 
      updatePassword, 
      deleteAccount, 
      cancelSubscription, 
      manageBilling, 
      forceSyncAdminRole 
    }}>
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
