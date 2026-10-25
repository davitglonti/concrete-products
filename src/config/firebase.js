import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCYzyoeEBTocZaORaYceQ2kcaC4En_L8gY",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "concreteproducts-46cf3.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "concreteproducts-46cf3",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "concreteproducts-46cf3.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "112387655478",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:112387655478:web:937a20eec0a485330ed597",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-5MZ73SX57L"
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.apiKey !== "YOUR_API_KEY"
);

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export default app;
