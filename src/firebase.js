import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDhqhLJmO5vlxsCS11IvacaNvAYV_y9ffE",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "app-contabilidad-ivnmtz.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "app-contabilidad-ivnmtz",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "app-contabilidad-ivnmtz.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1029297287784",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1029297287784:web:9cfab93d538623aaac81dd",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-JMQENL4LZW"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const db = getFirestore(app);

export { auth, provider, db };
