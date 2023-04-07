import React from 'react'
import ReactDOM, { createRoot } from 'react-dom/client'
import App from './App'
import { initializeApp } from "firebase/app";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { connectFirestoreEmulator, enableIndexedDbPersistence, getFirestore } from "firebase/firestore";
import { getStorage, ref, getDownloadURL, connectStorageEmulator } from "firebase/storage";
import { getAnalytics, setConsent } from "firebase/analytics";
import { useCookieConsent } from '@use-cookie-consent/core';

const { consent } = useCookieConsent();
const toConsent = (consented?: boolean) => consented ? 'granted' : 'denied';


const firebaseConfig = {
  apiKey: "AIzaSyA7eQSAHlXxxkmcNjfXGLaIE1GHREnbBHY",
  authDomain: "print-manage.firebaseapp.com",
  projectId: "print-manage",
  storageBucket: "print-manage.appspot.com",
  messagingSenderId: "40847904689",
  appId: "1:40847904689:web:6c17647aa92b05ef0df790",
  measurementId: "G-RPLJFD59CC"
};

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
