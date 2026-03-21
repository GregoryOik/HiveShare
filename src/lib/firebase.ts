import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore } from 'firebase/firestore';

let app;
let auth: any;
let db: any;

try {
  // Use optional chaining just in case import.meta is missing or import.meta.env is undefined
  const env: any = (import.meta && import.meta.env) ? import.meta.env : {};

  const firebaseConfig = {
    apiKey: env.VITE_FIREBASE_API_KEY || "AIzaSyBGYzcgljqr92VRW9BCj2txh5YklZUIujY",
    authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || "hiveshare-f458a.firebaseapp.com",
    projectId: env.VITE_FIREBASE_PROJECT_ID || "hiveshare-f458a",
    storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || "hiveshare-f458a.firebasestorage.app",
    messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || "905885744950",
    appId: env.VITE_FIREBASE_APP_ID || "1:905885744950:web:24cc769c7878d75d79fd97",
    measurementId: env.VITE_FIREBASE_MEASUREMENT_ID || "G-EYDTXKCYT8"
  };

  if (firebaseConfig.apiKey) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = initializeFirestore(app, { experimentalForceLongPolling: true });
  } else {
    console.warn('Firebase config missing API key, skipping initialization to prevent crash.');
  }
} catch (error) {
  console.error('Firebase initialization error', error);
}

export { auth, db };