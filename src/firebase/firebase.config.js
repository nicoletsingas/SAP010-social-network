
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBiQD2J4rvaKGVhAMv-2-Yiy0NmR3wb0Es",
  authDomain: "gamee-97311.firebaseapp.com",
  projectId: "gamee-97311",
  storageBucket: "gamee-97311.appspot.com",
  messagingSenderId: "204739084657",
  appId: "1:204739084657:web:85d2c53eabdaa8ea7fb6d0"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export {
  app, auth, db, collection, addDoc,
};
