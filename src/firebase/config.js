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

import { initializeApp }        from "firebase/app";
import { getAuth }              from "firebase/auth";
import { getFirestore }         from "firebase/firestore";

const firebaseConfig = {
  apiKey:            "YOUR_API_KEY",
  authDomain:        "YOUR_PROJECT_ID.firebaseapp.com",
  projectId:         "YOUR_PROJECT_ID",
  storageBucket:     "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId:             "YOUR_APP_ID",
};

// Initialize once — safe to import in multiple modules
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db   = getFirestore(app);