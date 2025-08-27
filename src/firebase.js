import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyCjtKQ7UoV3j4taDn6bNi3ONRlMsBaijBU",
  authDomain: "wordsearch-6f3e1.firebaseapp.com",
  projectId: "ejowordsearch",
  storageBucket: "ejowordsearch.firebasestorage.app",
  messagingSenderId: "29577044517",
  appId: "1:29577044517:web:98ab30b2969d5fea0c55cc",
  measurementId: "G-DQRLWF0FWC"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);