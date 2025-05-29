import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Firebase configuration - Replace with your Firebase project config
const firebaseConfig = {
    apiKey: "AIzaSyAPFiYkJLb9mgIR9kYXi2Lfdq13I9d5LgM",
    authDomain: "kaabil-sewak-auth.firebaseapp.com",
    projectId: "kaabil-sewak-auth",
    storageBucket: "kaabil-sewak-auth.firebasestorage.app",
    messagingSenderId: "781734222971",
    appId: "1:781734222971:web:4e74fdf9008077882b16de",
    measurementId: "G-QJF6LXXG3E"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth - AsyncStorage will be used automatically in React Native environment
const auth = getAuth(app);

export { auth };
export default app; 