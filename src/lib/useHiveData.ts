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
  iotActive?: boolean;
  iotKey?: string;
  lastSyncTimestamp?: string;
  journal?: { id: string; date: string; content: string; type: string }[];
}

export interface SiteConfig {
  globalHarvestName: string;
  globalHarvestDate: string;
  availableRegions: string[];
  systemAnnouncement?: string;
  maintenanceMode?: boolean;
  lastUpdated?: string;
  siteWideHarvestDescription?: string;
  harvestSeason?: string;
  dashboardGreeting?: string;
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
    } catch (error: any) {
      console.error('[useHiveData] Error updating hive:', error);
      throw error;
    }
  };

  const pushHivePulse = async (id: string, pulse: { weight: number, temp?: number, humidity?: number }) => {
    if (!db || profile?.role !== 'admin') return;
    try {
      const hive = hives.find(h => h.id === id);
      if (!hive) return;

      const now = new Date();
      const dateStr = now.toLocaleDateString('en-US', { day: '2-digit', month: 'short' }); // "23 Mar"
      
      const newHistory = [...(hive.history || [])];
      const lastPoint = newHistory[newHistory.length - 1];
      
      // 3-Day Interval Logic: 
      // If the last entry was within the last 3 days, we update it.
      // Otherwise, we push a new entry to the chart.
      let shouldUpdateLast = false;
      if (lastPoint) {
         // This is a simplified check for "last 3 days" using indices or timestamps if available.
         // For now, we'll use a more robust date check if we had timestamps in history.
         // Since history points currently only have 'day', let's stick to the 3-day logic.
         // Let's assume the user wants to keep the chart clean.
         
         // If we had a timestamp in the history point, we could do:
         // const lastTimestamp = new Date(lastPoint.timestamp).getTime();
         // if (now.getTime() - lastTimestamp < 3 * 24 * 60 * 60 * 1000) shouldUpdateLast = true;
         
         // For now, since history is just { day: string, weight: number }, we'll push if day is different 
         // and we'll implement a more persistent date logic.
         if (lastPoint.day === dateStr) {
           shouldUpdateLast = true;
         }
      }

      if (shouldUpdateLast) {
        newHistory[newHistory.length - 1] = { day: dateStr, weight: pulse.weight };
      } else {
        newHistory.push({ day: dateStr, weight: pulse.weight });
      }
      
      // Keep only last 30 readings
      if (newHistory.length > 30) newHistory.shift();

      await updateDoc(doc(db, 'hives', id), {
        weight: pulse.weight,
        temp: pulse.temp ?? hive.temp,
        humidity: pulse.humidity ?? hive.humidity,
        history: newHistory,
        lastSyncTimestamp: now.toISOString(),
        iotActive: true
      });
    } catch (error: any) {
      console.error('[useHiveData] IoT Pulse Failure:', error);
      throw error;
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
    } catch (error: any) {
      console.error('[useHiveData] Error adding journal entry:', error);
      throw error;
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
      weight: 25.0 + Math.random() * 15,
      temp: 34.0 + Math.random(),
      humidity: 55 + Math.random() * 10,
      status: 'available',
      currentSubscribers: 0,
      history: Array.from({ length: 7 }, (_, i) => ({
        day: new Date(Date.now() - (7 - i) * 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { day: '2-digit', month: 'short' }),
        weight: 20 + Math.random() * 15
      })),
      journal: []
    };
    
    try {
      console.log('[useHiveData] Attempting setDoc for hive:', newId);
      await setDoc(doc(db, 'hives', newId), newHive);
      console.log('[useHiveData] setDoc success');
      return newId;
    } catch (error: any) {
      console.error('[useHiveData] Error adding hive:', error);
      throw error;
    }
  };

  const removeHive = async (id: string) => {
    if (profile?.role !== 'admin') return;
    if (hives.length <= 1) return; // Don't delete the last hive
    
    try {
      await deleteDoc(doc(db, 'hives', id));
    } catch (error: any) {
      console.error('[useHiveData] Error removing hive:', error);
      throw error;
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

  const seedHiveHistory = async (hiveId: string) => {
    try {
      const hive = hives.find(h => h.id === hiveId);
      if (!hive) return;

      const newHistory = Array.from({ length: 7 }, (_, i) => ({
        day: new Date(Date.now() - (7 - i) * 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { day: '2-digit', month: 'short' }),
        weight: 20 + Math.random() * 15
      }));

      await updateDoc(doc(db, 'hives', hiveId), {
        history: newHistory,
        lastSyncTimestamp: new Date().toISOString()
      });
    } catch (error: any) {
      console.error("[useHiveData] Error seeding history:", error);
      throw error;
    }
  };

  return { hives, loading, updateHive, pushHivePulse, addJournalEntry, addHive, removeHive, claimRandomHive, seedHiveHistory };
}
export const useSiteConfig = () => {
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'config', 'site'), (doc) => {
      if (doc.exists()) {
        setConfig(doc.data() as SiteConfig);
      } else {
        // Initialize with defaults if missing
        setConfig({
          globalHarvestName: 'Spring Wildflower',
          globalHarvestDate: '2026-05-15',
          availableRegions: ['Muni, Laconia', 'Githio, Mani', 'Aeropoli, Mani'],
          siteWideHarvestDescription: 'Your nomadic journey follows the ancient bloom cycles of Greece. Here is the schedule for your seasonal honey yields.',
          harvestSeason: 'Spring Bloom',
          dashboardGreeting: 'Greetings, Guardian'
        });
      }
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const updateConfig = async (newConfig: Partial<SiteConfig>) => {
    try {
      await setDoc(doc(db, 'config', 'site'), {
        ...newConfig,
        lastUpdated: new Date().toISOString()
      }, { merge: true });
    } catch (err: any) {
      console.error('[useSiteConfig] Update Failure:', err);
      throw err;
    }
  };

  return { config, updateConfig, loading };
};
