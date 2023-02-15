import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyDTbcsjj0Dcs2wWf4F9aP0zQ9RDTXHJkrw",
  authDomain: "group01-9791a.firebaseapp.com",
  projectId: "group01-9791a",
  storageBucket: "group01-9791a.appspot.com",
  messagingSenderId: "488791718145",
  appId: "1:488791718145:web:c9457e20daaf84fc9d8300",
  measurementId: "G-4RGY8GNYTZ",
};

firebase.initializeApp(firebaseConfig);

var db = firebase.firestore();
export default db;
//users
