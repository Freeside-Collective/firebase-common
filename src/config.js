import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { initializeFirestore, getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';

export const getDefaultConfig = () => ({
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'demo-key',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'localhost',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'adventures-admin-util',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'adventures-admin-util.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '000000000000',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:000000000000:web:000000000000',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-XXXXXXXXXX',
});

let app;
let auth;
let db;
let storage;
let functions;

export function initFirebase(config = getDefaultConfig()) {
  if (!app) {
    app = initializeApp(config);
    auth = getAuth(app);
    
    const isEmulator = import.meta.env.DEV && !import.meta.env.VITE_USE_PRODUCTION_FIREBASE;
    
    db = isEmulator 
      ? initializeFirestore(app, { experimentalAutoDetectLongPolling: true }) 
      : getFirestore(app);
    
    storage = getStorage(app);
    functions = getFunctions(app, 'us-central1');

    if (isEmulator) {
      console.log('[Firebase] Connecting to local emulators...');
      connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
      connectFirestoreEmulator(db, '127.0.0.1', 8080);
      connectStorageEmulator(storage, '127.0.0.1', 9199);
      connectFunctionsEmulator(functions, '127.0.0.1', 5001);
    }
  }
  return { app, auth, db, storage, functions };
}

export { app, auth, db, storage, functions };
