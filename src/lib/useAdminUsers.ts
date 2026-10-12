import { useState, useEffect } from 'react';
import { collection, onSnapshot, doc, updateDoc, deleteDoc, addDoc } from 'firebase/firestore';
import { db } from './firebase';

export interface UserProfile {
  uid: string;
  email: string;
  fullName?: string;
  phone?: string;
  role: 'subscriber' | 'admin';
  subscribedHives: string[];
  customLabel?: string;
  shippingAddress?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  tier?: 'none' | 'starter' | 'premium';
  subscriptionTier?: string;
  subscriptionStartDate?: string;
  lastSubscriptionAt?: string;
  nextHarvestDate?: string;
  adminNotes?: string;
  courierNotes?: string;
  customHoneyName?: string;
  userHarvestStatus?: 'PENDING' | 'PACKED' | 'DISPATCHED' | 'DELIVERED';
  trackingNumber?: string;
  carrier?: string;
  metadata?: { key: string; value: string }[];
  dob?: string;
  hasSeenTour?: boolean;
}

export interface JarOrder {
  id: string;
  orderRef: string;
  variety: string;
  size: string;
  weightKg: number;
  pricePerKg: number;
  quantity: number;
  subtotal: number;
  shipping: number;
  grandTotal: number;
  isGift?: boolean;
  giftNote?: string;
  customLabel?: string;
  customer: {
    fullName: string;
    email: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
    phone?: string;
  };
  status: 'pending' | 'packed' | 'shipped' | 'delivered';
  trackingNumber?: string;
  carrier?: string;
  createdAt: string;
}

// Initial demonstration clients to make sure Gregory can instantly explore all CRM tools
const INITIAL_DEMO_CLIENTS: UserProfile[] = [
  {
    uid: 'demo-client-1',
    email: 'elena.mueller@berlin-mail.de',
    fullName: 'Dr. Elena Müller',
    phone: '+49 170 8821943',
    role: 'subscriber',
    tier: 'premium',
    subscribedHives: ['HS-701'],
    customLabel: 'Dr. Elena Müller',
    customHoneyName: 'Elena’s Taygetos Reserve',
    shippingAddress: 'Kastanienallee 14, Apt 3B',
    city: 'Berlin',
    postalCode: '10119',
    country: 'Germany',
    subscriptionStartDate: '2026-03-12',
    nextHarvestDate: '2026-06-20',
    userHarvestStatus: 'PACKED',
    trackingNumber: 'DHL-DE-94810284',
    carrier: 'DHL Express EU',
    adminNotes: 'Requested early batch extraction. Visited Peloponnese in 2025. VIP Patron.',
  },
  {
    uid: 'demo-client-2',
    email: 'marcus.vance@londonbridge.co.uk',
    fullName: 'Marcus Vance',
    phone: '+44 7911 123456',
    role: 'subscriber',
    tier: 'starter',
    subscribedHives: ['HS-702'],
    customLabel: 'Vance Family',
    shippingAddress: '24 Holland Park Road',
    city: 'London',
    postalCode: 'W14 8HN',
    country: 'United Kingdom',
    subscriptionStartDate: '2026-02-18',
    nextHarvestDate: '2026-06-20',
    userHarvestStatus: 'PENDING',
    adminNotes: 'Starter guardian. Send extra wild thyme honey flyer.',
  },
  {
    uid: 'demo-client-3',
    email: 'sophie.becker@brussels-law.be',
    fullName: 'Sophie Becker',
    phone: '+32 470 123 456',
    role: 'subscriber',
    tier: 'premium',
    subscribedHives: ['HS-703'],
    customLabel: 'Sophie & Henri Becker',
    customHoneyName: 'Mani Gold Edition',
    shippingAddress: 'Avenue Louise 240, Boîte 4',
    city: 'Brussels',
    postalCode: '1050',
    country: 'Belgium',
    subscriptionStartDate: '2026-03-01',
    nextHarvestDate: '2026-06-20',
    userHarvestStatus: 'DISPATCHED',
    trackingNumber: 'DPD-BE-7719280',
    carrier: 'DPD International',
    adminNotes: 'Gift for her father’s 70th birthday. Include handwritten card.',
  },
];

const INITIAL_DEMO_ORDERS: JarOrder[] = [
  {
    id: 'demo-order-1',
    orderRef: 'HS-JAR-948102',
    variety: 'Black Fir Honey (Grand Cru)',
    size: '1 kg',
    weightKg: 1.0,
    pricePerKg: 88,
    quantity: 1,
    subtotal: 88,
    shipping: 0,
    grandTotal: 88,
    isGift: true,
    giftNote: 'Happy Anniversary darling, straight from Mount Taygetos!',
    customer: {
      fullName: 'Hendrik Van Der Bilt',
      email: 'hendrik.vdb@amsterdam.nl',
      address: 'Keizersgracht 421',
      city: 'Amsterdam',
      postalCode: '1016 EK',
      country: 'Netherlands',
      phone: '+31 6 12345678',
    },
    status: 'packed',
    trackingNumber: 'POSTNL-NL-389104',
    carrier: 'PostNL Global',
    createdAt: '2026-03-24T10:14:00.000Z',
  },
  {
    id: 'demo-order-2',
    orderRef: 'HS-JAR-948199',
    variety: 'Thyme & Mountain Sage',
    size: '500g',
    weightKg: 0.5,
    pricePerKg: 104,
    quantity: 2,
    subtotal: 104,
    shipping: 0,
    grandTotal: 104,
    customer: {
      fullName: 'Claire Fontaine',
      email: 'claire.fontaine@paris.fr',
      address: '18 Rue de la Paix',
      city: 'Paris',
      postalCode: '75002',
      country: 'France',
      phone: '+33 6 98765432',
    },
    status: 'pending',
    createdAt: '2026-03-24T12:30:00.000Z',
  },
];

export function useAdminUsers() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [jarOrders, setJarOrders] = useState<JarOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db) {
      setUsers(INITIAL_DEMO_CLIENTS);
      setJarOrders(INITIAL_DEMO_ORDERS);
      setLoading(false);
      return;
    }

    // Listen to users collection
    const unsubUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
      const usersData = snapshot.docs.map(docSnap => ({
        uid: docSnap.id,
        ...docSnap.data()
      } as UserProfile));

      if (usersData.length > 0) {
        setUsers(usersData);
      } else {
        setUsers(INITIAL_DEMO_CLIENTS);
      }
      setLoading(false);
    }, (error) => {
      console.warn("Could not fetch users directly, using baseline CRM profiles:", error);
      setUsers(INITIAL_DEMO_CLIENTS);
      setLoading(false);
    });

    // Listen to jar_orders collection
    const unsubOrders = onSnapshot(collection(db, 'jar_orders'), (snapshot) => {
      const ordersData = snapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data()
      } as JarOrder));

      if (ordersData.length > 0) {
        setJarOrders(ordersData);
      } else {
        setJarOrders(INITIAL_DEMO_ORDERS);
      }
    }, (error) => {
      console.warn("Could not fetch jar orders directly, using baseline order registry:", error);
      setJarOrders(INITIAL_DEMO_ORDERS);
    });

    return () => {
      unsubUsers();
      unsubOrders();
    };
  }, []);

  const assignHiveToUser = async (userId: string, hiveId: string) => {
    try {
      const user = users.find(u => u.uid === userId);
      if (!user) return;
      
      const currentHives = user.subscribedHives || [];
      const updatedHives = currentHives.includes(hiveId) ? currentHives : [...currentHives, hiveId];

      setUsers(prev => prev.map(u => u.uid === userId ? { ...u, subscribedHives: updatedHives } : u));
      if (db && !userId.startsWith('demo-')) {
        await updateDoc(doc(db, 'users', userId), { subscribedHives: updatedHives });
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
      const updatedHives = currentHives.filter(id => id !== hiveId);

      setUsers(prev => prev.map(u => u.uid === userId ? { ...u, subscribedHives: updatedHives } : u));
      if (db && !userId.startsWith('demo-')) {
        await updateDoc(doc(db, 'users', userId), { subscribedHives: updatedHives });
      }
    } catch (error: any) {
      console.error("[useAdminUsers] Error removing hive:", error);
      throw error;
    }
  };

  const updateUser = async (userId: string, data: Partial<UserProfile>) => {
    try {
      setUsers(prev => prev.map(u => u.uid === userId ? { ...u, ...data } : u));
      if (db && !userId.startsWith('demo-')) {
        await updateDoc(doc(db, 'users', userId), data);
      }
    } catch (error: any) {
      console.error("[useAdminUsers] Error updating user:", error);
      throw error;
    }
  };

  const batchUpdateUsers = async (uids: string[], data: Partial<UserProfile>) => {
    try {
      setUsers(prev => prev.map(u => uids.includes(u.uid) ? { ...u, ...data } : u));
      if (db) {
        await Promise.all(
          uids.filter(id => !id.startsWith('demo-')).map(uid => updateDoc(doc(db, 'users', uid), data))
        );
      }
    } catch (error: any) {
      console.error("[useAdminUsers] Error batch updating users:", error);
      throw error;
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      setUsers(prev => prev.filter(u => u.uid !== userId));
      if (db && !userId.startsWith('demo-')) {
        await deleteDoc(doc(db, 'users', userId));
      }
    } catch (error: any) {
      console.error("[useAdminUsers] Error deleting user:", error);
      throw error;
    }
  };

  const updateJarOrder = async (orderId: string, data: Partial<JarOrder>) => {
    try {
      setJarOrders(prev => prev.map(o => o.id === orderId ? { ...o, ...data } : o));
      if (db && !orderId.startsWith('demo-')) {
        await updateDoc(doc(db, 'jar_orders', orderId), data);
      }
    } catch (error: any) {
      console.error("[useAdminUsers] Error updating jar order:", error);
      throw error;
    }
  };

  const deleteJarOrder = async (orderId: string) => {
    try {
      setJarOrders(prev => prev.filter(o => o.id !== orderId));
      if (db && !orderId.startsWith('demo-')) {
        await deleteDoc(doc(db, 'jar_orders', orderId));
      }
    } catch (error: any) {
      console.error("[useAdminUsers] Error deleting jar order:", error);
      throw error;
    }
  };

  return {
    users,
    jarOrders,
    loading,
    assignHiveToUser,
    removeHiveFromUser,
    updateUser,
    batchUpdateUsers,
    deleteUser,
    updateJarOrder,
    deleteJarOrder,
  };
}
