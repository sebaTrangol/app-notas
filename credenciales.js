

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB_VeVlkltunl8n3VNxiJXMa0z_y43e_Nk",
  authDomain: "appnotes-29a0e.firebaseapp.com",
  projectId: "appnotes-29a0e",
  storageBucket: "appnotes-29a0e.firebasestorage.app",
  messagingSenderId: "1046107485946",
  appId: "1:1046107485946:web:fcc4bf1c0ca3be33f3fb43"
};

// Initialize Firebase
const appFirebase = initializeApp(firebaseConfig);
export default appFirebase;