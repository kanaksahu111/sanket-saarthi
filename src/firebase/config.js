// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAZCMOHc0FCIm8YRqnbTP4sIGGnN3VT07g",
  authDomain: "sanket-sarthi-bnb.firebaseapp.com",
  projectId: "sanket-sarthi-bnb",
  storageBucket: "sanket-sarthi-bnb.firebasestorage.app",
  messagingSenderId: "543126102860",
  appId: "1:543126102860:web:f1568831f0b7db089d25e9"
};

// Initialize Firebase
// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export default app;