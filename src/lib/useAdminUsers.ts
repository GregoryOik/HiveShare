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
  customHoneyName?: string;
  userHarvestStatus?: string;
  metadata?: { key: string; value: string }[];
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
    } catch (error: any) {
      console.error("[useAdminUsers] Error assigning hive:", error);
      throw error;
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
    } catch (error: any) {
      console.error("[useAdminUsers] Error removing hive:", error);
      throw error;
    }
  };

  const updateUser = async (userId: string, data: Partial<UserProfile>) => {
    try {
      await updateDoc(doc(db, 'users', userId), data);
    } catch (error: any) {
      console.error("[useAdminUsers] Error updating user:", error);
      throw error;
    }
  };

  const batchUpdateUsers = async (uids: string[], data: Partial<UserProfile>) => {
    try {
      await Promise.all(uids.map(uid => updateDoc(doc(db, 'users', uid), data)));
    } catch (error: any) {
      console.error("[useAdminUsers] Error batch updating users:", error);
      throw error;
    }
  };

  return { users, loading, assignHiveToUser, removeHiveFromUser, updateUser, batchUpdateUsers };
}
