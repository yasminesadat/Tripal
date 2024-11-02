// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCY4m7D4cGliaaYSNo9NqcP5SPEQvF1anc",
    authDomain: "tripal-upload-files.firebaseapp.com",
    projectId: "tripal-upload-files",
    storageBucket: "tripal-upload-files.appspot.com",
    messagingSenderId: "283832044036",
    appId: "1:283832044036:web:f84b5cee95c71dd3fac351",
    measurementId: "G-456QK05R2H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default app;