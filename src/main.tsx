import React from 'react'
import ReactDOM, { createRoot } from 'react-dom/client'
import App from './App'
import { initializeApp } from "firebase/app";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { connectFirestoreEmulator, enableIndexedDbPersistence, getFirestore } from "firebase/firestore";
import { getStorage, ref, getDownloadURL, connectStorageEmulator } from "firebase/storage";
import { getAnalytics, setConsent } from "firebase/analytics";
import { useCookieConsent } from '@use-cookie-consent/core';
import { createCookieConsentContext } from '@use-cookie-consent/react';


const consent = {
  statistics: false,
  necessary: true
};
// TODO (Dan) this isn't actually working 

const toConsent = (consented?: boolean) => consented ? 'granted' : 'denied';


const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
  measurementId: import.meta.env.VITE_MEASUREMENT_ID,
};


console.log(firebaseConfig);

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const auth = getAuth(app);
export const fireStore = getFirestore(app);
export const analytics = getAnalytics(app);


setConsent({
  ad_storage: 'denied',
  analytics_storage: toConsent(consent.statistics),
  functionality_storage: toConsent(consent.necessary)
});

if (import.meta.env.VITE_USE_EMULATORS) {
  connectFirestoreEmulator(fireStore, 'localhost', 5050);
  // connectAuthEmulator(auth, 'localhost:9099');
  connectStorageEmulator(storage, 'localhost', 9199);
}



let createdRoot = false;
document.addEventListener('DOMContentLoaded', () => {
  if (createdRoot) return;
  createRoot(document.getElementById('root')!).render(<App />);
  createdRoot = true;
});
