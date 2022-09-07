import firebase from "firebase/app";

import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD0yaydjIL4b9WniGSt6H8J9Z1zjDrp3Ic",
  authDomain: "videochat-9c65d.firebaseapp.com",
  projectId: "videochat-9c65d",
  storageBucket: "videochat-9c65d.appspot.com",
  messagingSenderId: "597017536024",
  appId: "1:597017536024:web:e62681919e5e402b1a856d",
  measurementId: "G-WE1RXEGFG1",
};

const initFirebase = () => {
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
  return firebase.firestore();
  
};

export { initFirebase };
