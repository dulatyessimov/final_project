// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBjGXrCdsT60LUEQ13HroHwl1Eq7feQVVs",
  authDomain: "backend-db821.firebaseapp.com",
  projectId: "backend-db821",
  storageBucket: "backend-db821.firebasestorage.app",
  messagingSenderId: "879413343549",
  appId: "1:879413343549:web:723dc2d6d1aa5422074154",
  measurementId: "G-ND9B7SW67C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export { auth, RecaptchaVerifier, signInWithPhoneNumber };