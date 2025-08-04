import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult, signOut, onAuthStateChanged } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

console.log('🔍 Firebase Config:', firebaseConfig);

// Initialize Firebase
const app = initializeApp(firebaseConfig);
console.log('🔍 Firebase App initialized:', app);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);
console.log('🔍 Firebase Auth initialized:', auth);

// Initialize Google Auth Provider
const provider = new GoogleAuthProvider();
provider.addScope('email');
provider.addScope('profile');
provider.setCustomParameters({
  prompt: 'select_account'
});
console.log('🔍 Google Auth Provider initialized:', provider);

export { auth, provider, signInWithPopup, signInWithRedirect, getRedirectResult, signOut, onAuthStateChanged };
