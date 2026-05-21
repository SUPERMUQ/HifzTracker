// src/firebase/config.js
// ─────────────────────────────────────────────────────────────────────────────
// Firebase v10+ (modular SDK) initialization
//
// HOW TO SET UP:
//   1. Go to https://console.firebase.google.com → your project → Project Settings
//   2. Under "Your apps", copy the firebaseConfig object
//   3. Replace every placeholder value below with your real values
//
// SECURITY:
//   Never commit real keys to version control.
//   Store them in a .env file and reference via import.meta.env (Vite) instead:
//
//     apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
//     ...etc
// ─────────────────────────────────────────────────────────────────────────────

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from "firebase/firestore";

// Reference keys dynamically using Vite's environment injector
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services
export const auth = getAuth(app);

// Export Firestore with robust offline persistence enabled
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager()
  })
});