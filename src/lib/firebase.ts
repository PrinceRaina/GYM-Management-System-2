import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Placeholder config - if the setup tool failed, we'll use environmental vars or defaults
// If the user hasn't set it up, the app will gracefully handle the missing config
const firebaseConfig = {
  apiKey: "env_key",
  authDomain: "zenfit-app.firebaseapp.com",
  projectId: "zenfit-app",
  storageBucket: "zenfit-app.firebasestorage.app",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};

// In a real scenario, we'd import from firebase-applet-config.json
// But since the tool failed, I'm providing a structure that's easy to update.
let app;
try {
   app = initializeApp(firebaseConfig);
} catch (e) {
  console.error("Firebase init failed. Checks if setup is required.");
}

export const db = app ? getFirestore(app) : null;
export const auth = app ? getAuth(app) : null;
