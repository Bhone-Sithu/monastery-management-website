// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCLZzbAI0FPn84SYU-O5U1-tIpro32FJBI",
    authDomain: "monastery-management-website.firebaseapp.com",
    projectId: "monastery-management-website",
    storageBucket: "monastery-management-website.appspot.com",
    messagingSenderId: "435619495619",
    appId: "1:435619495619:web:8cc508588f7281ddee6c76",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);