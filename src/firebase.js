import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDhqhLJmO5vlxsCS11IvacaNvAYV_y9ffE",
  authDomain: "app-contabilidad-ivnmtz.firebaseapp.com",
  projectId: "app-contabilidad-ivnmtz",
  storageBucket: "app-contabilidad-ivnmtz.firebasestorage.app",
  messagingSenderId: "1029297287784",
  appId: "1:1029297287784:web:9cfab93d538623aaac81dd",
  measurementId: "G-JMQENL4LZW",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
