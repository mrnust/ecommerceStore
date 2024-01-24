import { initializeApp } from "firebase/app";
import { getDatabase } from 'firebase/database';
import { getAuth, GoogleAuthProvider,signInWithRedirect ,getRedirectResult,signInWithPopup } from 'firebase/auth'; // Import Auth related functions

const firebaseConfig = {
  apiKey: "AIzaSyDovV-spuggUOdwQPPIhJa28avr2THdZTk",
  authDomain: "ecommercestore-7733c.firebaseapp.com",
  databaseURL: "https://ecommercestore-7733c-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "ecommercestore-7733c",
  storageBucket: "ecommercestore-7733c.appspot.com",
  messagingSenderId: "342851368891",
  appId: "1:342851368891:web:7b19ea17be2a6b1b9db69e",
  measurementId: "G-9D05LX75XZ"
};

// const firebaseConfig = {
//   apiKey: "AIzaSyDhLcfpZk2a-D_cWwnG1qvixROmYbT6_sE",
//   authDomain: "scproject-360ca.firebaseapp.com",
//   databaseURL: "https://scproject-360ca-default-rtdb.firebaseio.com/",
//   projectId: "scproject-360ca",
//   storageBucket: "scproject-360ca.appspot.com",
//   messagingSenderId: "543470443664",
//   appId: "1:543470443664:web:82effab544c149e3108c15"
// };


const firebaseApp = initializeApp(firebaseConfig);
const database = getDatabase(firebaseApp);
const auth = getAuth(firebaseApp); // Add this line for Auth
const googleProvider = new GoogleAuthProvider(firebaseApp); // Add this line for GoogleAuthProvider

export { firebaseApp, database, auth, googleProvider,signInWithRedirect,getRedirectResult ,signInWithPopup};
