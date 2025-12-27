// // Import the functions you need from the SDKs you need
// //import { initializeApp } from "firebase/app";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration


// // Initialize Firebase
// // const app = initializeApp(firebaseConfig);

// import { initializeApp, getApps } from "firebase/app";
// import { getAuth } from "firebase/auth";
// import { getFirestore } from "firebase/firestore";

// const firebaseConfig = {
//   apiKey: "AIzaSyAQArelL-JrTMiToput0QTtDikJibZEEzw",
//   authDomain: "challenge3-f5dd9.firebaseapp.com",
//   projectId: "challenge3-f5dd9",
//   storageBucket: "challenge3-f5dd9.firebasestorage.app",
//   messagingSenderId: "136731579362",
//   appId: "1:136731579362:web:f9b37902d0dcca01ae9fbb"
// };

// const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

// export const auth = getAuth(app);
// export const db = getFirestore(app);

import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAQArelL-JrTMiToput0QTtDikJibZEEzw",
  authDomain: "challenge3-f5dd9.firebaseapp.com",
  projectId: "challenge3-f5dd9",
  storageBucket: "challenge3-f5dd9.firebasestorage.app",
  messagingSenderId: "136731579362",
  appId: "1:136731579362:web:f9b37902d0dcca01ae9fbb"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db = getFirestore(app);
