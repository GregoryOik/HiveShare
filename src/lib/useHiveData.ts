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
  lastDiaryEntryTimestamp?: string;
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
    status: 'available'
  }
];

export function useHiveData() {
  const [hives, setHives] = useState<HiveData[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, profile } = useAuth();

  useEffect(() => {
    if (!user || !profile) {
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
    if (profile?.role !== 'admin') return;
    try {
      await updateDoc(doc(db, 'hives', id), newData);
    } catch (error) {
      console.error('Error updating hive:', error);
    }
  };

  const addHive = async () => {
    if (profile?.role !== 'admin') return '';
    
    const newId = Math.floor(Math.random() * 900 + 100).toString();
    const newHive: HiveData = {
      ...DEFAULT_HIVES[0],
      id: newId,
      location: 'New Location',
      weight: 20.0,
      history: [
        { day: 'Mon', weight: 19.5 },
        { day: 'Tue', weight: 19.6 },
        { day: 'Wed', weight: 19.7 },
        { day: 'Thu', weight: 19.8 },
        { day: 'Fri', weight: 19.9 },
        { day: 'Sat', weight: 20.0 },
        { day: 'Sun', weight: 20.0 },
      ]
    };
    
    try {
      await setDoc(doc(db, 'hives', newId), newHive);
      return newId;
    } catch (error) {
      console.error('Error adding hive:', error);
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
    if (!user || !profile) return null;
    
    try {
      // 1. Fetch current available hives
      const snapshot = await getDocs(collection(db, 'hives'));
      const availableHives = snapshot.docs
        .map(doc => doc.data() as HiveData)
        .filter(h => h.status === 'available');

      if (availableHives.length === 0) {
        console.error('No available hives to claim');
        return null;
      }

      // 2. Pick a random one
      const randomHive = availableHives[Math.floor(Math.random() * availableHives.length)];
      
      // 3. Update Hive Status
      await updateDoc(doc(db, 'hives', randomHive.id), {
        status: 'assigned'
      });

      // 4. Update User Profile
      const currentHives = profile.subscribedHives || [];
      if (!currentHives.includes(randomHive.id)) {
        await updateDoc(doc(db, 'users', user.uid), {
          subscribedHives: [...currentHives, randomHive.id],
          role: 'subscriber',
          tier // Set the member's tier
        });
      }

      return randomHive.id;
    } catch (error) {
      console.error('Error claiming random hive:', error);
      return null;
    }
  };

  return { hives, loading, updateHive, addHive, removeHive, claimRandomHive };
}
