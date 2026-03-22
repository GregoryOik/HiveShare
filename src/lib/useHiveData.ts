import { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, doc, onSnapshot, setDoc, updateDoc, deleteDoc, getDocs } from 'firebase/firestore';
import { useAuth } from './useAuth';

export interface HiveData {
  id: string;
  location: string;
  weight: number;
  temp: number;
  humidity: number;
  activity: string;
  history: { day: string; weight: number }[];
  activeHarvest: string;
  nextHarvestDate: string;
  photoUrl: string;
  beeSpecies: string;
  installationDate: string;
  status: string;
  currentSubscribers?: number;
  lastDiaryEntryTimestamp?: string;
  videoUrl?: string;
  lastAdminNote?: string;
  journal?: { id: string; date: string; content: string; type: string }[];
}

const DEFAULT_HIVES: HiveData[] = [
  {
    id: '247',
    location: 'Lagia, Mani',
    weight: 38.2,
    temp: 34.8,
    humidity: 62,
    activity: 'High',
    history: [
      { day: 'Mon', weight: 36.5 },
      { day: 'Tue', weight: 36.8 },
      { day: 'Wed', weight: 37.1 },
      { day: 'Thu', weight: 37.4 },
      { day: 'Fri', weight: 37.6 },
      { day: 'Sat', weight: 37.9 },
      { day: 'Sun', weight: 38.2 },
    ],
    activeHarvest: 'Summer Wildflower',
    nextHarvestDate: '14 July',
    photoUrl: '/beekeeper.jpg',
    beeSpecies: 'Apis mellifera macedonica',
    installationDate: '2025-04-12',
    status: 'available',
    videoUrl: '',
    lastAdminNote: 'Initial setup',
    journal: [
      { id: 'init', date: '2025-05-20T10:00:00Z', content: 'Hive established in Lagia. Queen is healthy and colony is building out frames.', type: 'Note' }
    ]
  }
];

export function useHiveData() {
  const [hives, setHives] = useState<HiveData[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, profile } = useAuth();

  useEffect(() => {
    if (!user || !profile || !db) {
      setHives([]);
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(collection(db, 'hives'), (snapshot) => {
      const fetchedHives = snapshot.docs.map(doc => doc.data() as HiveData);
      
      // If no hives exist, initialize with default
      if (fetchedHives.length === 0 && profile.role === 'admin') {
        DEFAULT_HIVES.forEach(hive => {
          setDoc(doc(db, 'hives', hive.id), hive);
        });
      } else {
        // Filter hives based on user role
        if (profile.role === 'admin') {
          setHives(fetchedHives);
        } else {
          setHives(fetchedHives.filter(h => profile.subscribedHives.includes(h.id)));
        }
      }
      setLoading(false);
    }, (error) => {
      console.error('Error fetching hives:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, profile]);

  const updateHive = async (id: string, newData: Partial<HiveData>) => {
    if (!db || profile?.role !== 'admin') return;
    try {
      await updateDoc(doc(db, 'hives', id), newData);
    } catch (error) {
      console.error('Error updating hive:', error);
    }
  };

  const addJournalEntry = async (hiveId: string, content: string, type: string = 'Observation') => {
    if (!db || profile?.role !== 'admin') return;
    try {
      const { arrayUnion } = await import('firebase/firestore');
      const entry = { 
        id: Math.random().toString(36).substr(2, 9), 
        date: new Date().toISOString(), 
        content, 
        type 
      };
      await updateDoc(doc(db, 'hives', hiveId), {
        journal: arrayUnion(entry)
      });
      return true;
    } catch (error) {
      console.error('Error adding journal entry:', error);
      return false;
    }
  };

  const addHive = async () => {
    console.log('[useHiveData] addHive called, profile role:', profile?.role);
    if (profile?.role !== 'admin') {
      console.warn('[useHiveData] addHive blocked: not admin');
      return '';
    }
    
    const newId = Math.floor(Math.random() * 900 + 100).toString();
    const newHive: HiveData = {
      ...DEFAULT_HIVES[0],
      id: newId,
      location: 'New Location',
      weight: 20.0,
      status: 'available',
      currentSubscribers: 0,
      history: [
        { day: 'Mon', weight: 19.5 },
        { day: 'Tue', weight: 19.6 },
        { day: 'Wed', weight: 19.7 },
        { day: 'Thu', weight: 19.8 },
        { day: 'Fri', weight: 19.9 },
        { day: 'Sat', weight: 20.0 },
        { day: 'Sun', weight: 20.0 },
      ],
      journal: []
    };
    
    try {
      console.log('[useHiveData] Attempting setDoc for hive:', newId);
      await setDoc(doc(db, 'hives', newId), newHive);
      console.log('[useHiveData] setDoc success');
      return newId;
    } catch (error) {
      console.error('[useHiveData] Error adding hive:', error);
      return '';
    }
  };

  const removeHive = async (id: string) => {
    if (profile?.role !== 'admin') return;
    if (hives.length <= 1) return; // Don't delete the last hive
    
    try {
      await deleteDoc(doc(db, 'hives', id));
    } catch (error) {
      console.error('Error removing hive:', error);
    }
  };

  const claimRandomHive = async (tier: 'starter' | 'premium' = 'starter') => {
    if (!user || !profile) {
      console.error('[claimRandomHive] No user or profile');
      throw new Error('You must be logged in to claim a hive.');
    }
    
    // 1. Fetch current hives
    const snapshot = await getDocs(collection(db, 'hives'));
    const allHives = snapshot.docs.map(d => ({ ...d.data(), id: d.id }) as HiveData);
    
    console.log('[claimRandomHive] Total hives:', allHives.length);
    
    // 2. Filter eligible hives
    // Premium: Only 'available' (0 users)
    // Starter: 'available' OR 'shared' with < 3 users
    let eligibleHives = tier === 'premium'
      ? allHives.filter(h => h.status === 'available')
      : allHives.filter(h => h.status === 'available' || (h.status === 'shared' && (h.currentSubscribers || 0) < 3));

    // Fallback for Starter: if no available/shared, and user wants to "assign more", 
    // we could potentially allow joining an 'assigned' hive if the user really wants,
    // but the rule "Premium its 1, Basic its 3" suggests strict limits.
    // However, if we are completely out, we'll throw the same error as before.

    console.log(`[claimRandomHive] Eligible hives for ${tier}:`, eligibleHives.length);

    if (eligibleHives.length === 0) {
      throw new Error(`No available hives for ${tier} tier. (Premium capacity: 1, Basic capacity: 3)`);
    }

    // 3. Pick a random one
    // Prioritize 'shared' hives for Starters to fill them up first
    let selectedHive: HiveData;
    if (tier === 'starter') {
      const sharedWithSpace = eligibleHives.filter(h => h.status === 'shared');
      selectedHive = sharedWithSpace.length > 0 
        ? sharedWithSpace[Math.floor(Math.random() * sharedWithSpace.length)]
        : eligibleHives[Math.floor(Math.random() * eligibleHives.length)];
    } else {
      selectedHive = eligibleHives[Math.floor(Math.random() * eligibleHives.length)];
    }

    console.log('[claimRandomHive] Selected hive:', selectedHive.id);
    
    // 4. Update Hive Status & Count
    const newCount = (selectedHive.currentSubscribers || 0) + 1;
    let newStatus = selectedHive.status;

    if (tier === 'premium') {
      newStatus = 'assigned';
    } else {
      // It's a Starter
      newStatus = 'shared';
      // If it reaches 3, it's effectively "full shared" but still status 'shared'
    }

    await updateDoc(doc(db, 'hives', selectedHive.id), { 
      status: newStatus,
      currentSubscribers: newCount
    });
    
    console.log(`[claimRandomHive] Update: status=${newStatus}, count=${newCount}`);

    // 5. Update User Profile
    const currentHives = profile.subscribedHives || [];
    if (!currentHives.includes(selectedHive.id)) {
      const isAlreadyAdmin = profile.role === 'admin';
      await updateDoc(doc(db, 'users', user.uid), {
        subscribedHives: [...currentHives, selectedHive.id],
        role: isAlreadyAdmin ? 'admin' : 'subscriber',
        tier,
        subscriptionStartDate: new Date().toISOString()
      });
      console.log('[claimRandomHive] User profile updated');
    }

    return selectedHive.id;
  };

  return { hives, loading, updateHive, addJournalEntry, addHive, removeHive, claimRandomHive };
}
