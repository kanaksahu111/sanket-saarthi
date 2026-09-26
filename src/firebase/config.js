// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCDL4ucYkmzSeA3iYUNnKSme7D0NeAblhU",
  authDomain: "sanket-saarthi.firebaseapp.com",
  projectId: "sanket-saarthi",
  storageBucket: "sanket-saarthi.firebasestorage.app",
  messagingSenderId: "621430603920",
  appId: "1:621430603920:web:45b0417badc60d6350d815",
  measurementId: "G-GY288PNDCZ"
};

// Initialize Firebase
// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export default app;