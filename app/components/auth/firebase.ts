// firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyATrunObXt0B85nwNK3hrk1esrlmRdy2uU",
  authDomain: "wholesalebd-2509b.firebaseapp.com",
  projectId: "wholesalebd-2509b",
  storageBucket: "wholesalebd-2509b.firebasestorage.app",
  messagingSenderId: "872270973773",
  appId: "1:872270973773:web:358dbf854761de78c60504",
  measurementId: "G-3Q6YPY7H1W",
};

const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);
const auth = getAuth(app);

export { auth };
