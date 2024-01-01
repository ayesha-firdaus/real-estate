// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA46ijDaxd9xP8V2TaWGOJDjMDDmlsbe7s",
  authDomain: "mern-estate-f55ff.firebaseapp.com",
  projectId: "mern-estate-f55ff",
  storageBucket: "mern-estate-f55ff.appspot.com",
  messagingSenderId: "409092457541",
  appId: "1:409092457541:web:02a60e066f410f8f1b4f2c"
};
console.log(import.meta.env.VITE_FIREBASE_API_KEY)
// Initialize Firebase
export const app = initializeApp(firebaseConfig);