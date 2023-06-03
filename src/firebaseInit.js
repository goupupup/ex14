// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCq1S_ha66ilxSwiUSVyw-ofdbcYRarIL0",
  authDomain: "ex11-10270.firebaseapp.com",
  databaseURL: "https://ex11-10270-default-rtdb.firebaseio.com",
  projectId: "ex11-10270",
  storageBucket: "ex11-10270.appspot.com",
  messagingSenderId: "80378684107",
  appId: "1:80378684107:web:75b966850f8dedf8ff314e",
  measurementId: "G-SCTZLCW7QR"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);