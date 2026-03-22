import { useState, useEffect } from 'react';
import { collection, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';

export interface UserProfile {
  uid: string;
  email: string;
  role: 'subscriber' | 'admin';
  subscribedHives: string[];
  customLabel?: string;
  shippingAddress?: string;
  tier?: 'starter' | 'premium';
  subscriptionStartDate?: string;
  nextHarvestDate?: string;
  adminNotes?: string;
}

export function useAdminUsers() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db) {
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(collection(db, 'users'), (snapshot) => {
      const usersData = snapshot.docs.map(doc => doc.data() as UserProfile);
      setUsers(usersData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching users:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const assignHiveToUser = async (userId: string, hiveId: string) => {
    try {
      const user = users.find(u => u.uid === userId);
      if (!user) return;
      
      const currentHives = user.subscribedHives || [];
      if (!currentHives.includes(hiveId)) {
        await updateDoc(doc(db, 'users', userId), {
          subscribedHives: [...currentHives, hiveId]
        });
      }
    } catch (error) {
      console.error("Error assigning hive:", error);
    }
  };

  const removeHiveFromUser = async (userId: string, hiveId: string) => {
    try {
      const user = users.find(u => u.uid === userId);
      if (!user) return;
      
      const currentHives = user.subscribedHives || [];
      await updateDoc(doc(db, 'users', userId), {
        subscribedHives: currentHives.filter(id => id !== hiveId)
      });
    } catch (error) {
      console.error("Error removing hive:", error);
    }
  };

  const updateUser = async (userId: string, data: Partial<UserProfile>) => {
    try {
      await updateDoc(doc(db, 'users', userId), data);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  return { users, loading, assignHiveToUser, removeHiveFromUser, updateUser };
}
