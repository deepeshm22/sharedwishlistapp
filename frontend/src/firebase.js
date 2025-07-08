// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDhjSPgQZWlDctKyhvTu5QXWQr43eASV9I",
  authDomain: "full-stack-assg.firebaseapp.com",
  projectId: "full-stack-assg",
  storageBucket: "full-stack-assg.firebasestorage.app",
  messagingSenderId: "755540718097",
  appId: "1:755540718097:web:8188e510d4c234da8877b0",
  measurementId: "G-0Y2BWRDLCJ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics };
