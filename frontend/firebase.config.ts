import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';

const firebaseConfig = {
  apiKey: "your-api-key-here",
  authDomain: "spin-the-wheel-app-83562.firebaseapp.com",
  projectId: "spin-the-wheel-app-83562",
  storageBucket: "spin-the-wheel-app-83562.appspot.com",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app);

export default app;
