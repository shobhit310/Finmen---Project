import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Replace these with your Firebase project credentials
const firebaseConfig = {
    apiKey: "AIzaSyAO2OjVFbZMqUBBmC8ltOLVvsanCnyfDjw",
    authDomain: "gamedashboard-d30e3.firebaseapp.com",
    projectId: "gamedashboard-d30e3",
    storageBucket: "gamedashboard-d30e3.firebasestorage.app",
    messagingSenderId: "900103165899",
    appId: "1:900103165899:web:37b249374059586dc2084e",
    measurementId: "G-0Y4340710Y"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;