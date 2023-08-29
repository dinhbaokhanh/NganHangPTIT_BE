import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyDy-maAMCNgQCEifcPxpxpeu84LYLXKLr0",
  authDomain: "nganhangptit.firebaseapp.com",
  projectId: "nganhangptit",
  storageBucket: "nganhangptit.appspot.com",
  messagingSenderId: "267064586119",
  appId: "1:267064586119:web:3248634fe1251bfefb6d22",
  measurementId: "G-L7DH9WB9E3"
};

// Initialize Firebase
const firebase = () => initializeApp(firebaseConfig);

export default firebase;
