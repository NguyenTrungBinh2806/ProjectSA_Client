// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// import firestore
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDnika_vFxp2HrKMhPpHkz8Bed8FCtqHK8",
  authDomain: "sa-2231.firebaseapp.com",
  projectId: "sa-2231",
  storageBucket: "sa-2231.appspot.com",
  messagingSenderId: "1098696324348",
  appId: "1:1098696324348:web:ab26da2b04893ea36d1379",
  measurementId: "G-GL659FJYRT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export default db;
// export { storage };