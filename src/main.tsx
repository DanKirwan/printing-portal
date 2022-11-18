import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { connectFirestoreEmulator, enableIndexedDbPersistence, getFirestore } from "firebase/firestore";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

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



ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
