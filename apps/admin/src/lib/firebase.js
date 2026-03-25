import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBITDXk98A3tctDhL4UGxIOTl4EEn8NKlI",
  authDomain: "news-editorial-44963.firebaseapp.com",
  projectId: "news-editorial-44963",
  storageBucket: "news-editorial-44963.firebasestorage.app",
  messagingSenderId: "281688681609",
  appId: "1:281688681609:web:cf1be954360d26162d6a58",
  measurementId: "G-TYC94QT2G6"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };