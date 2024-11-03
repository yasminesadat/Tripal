import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyCY4m7D4cGliaaYSNo9NqcP5SPEQvF1anc",
    authDomain: "tripal-upload-files.firebaseapp.com",
    projectId: "tripal-upload-files",
    storageBucket: "tripal-upload-files.appspot.com",
    messagingSenderId: "283832044036",
    appId: "1:283832044036:web:f84b5cee95c71dd3fac351",
    measurementId: "G-456QK05R2H"
};

// Initialize Firebase and Storage
const firebaseInstance = initializeApp(firebaseConfig);
const storage = getStorage(firebaseInstance);

export { firebaseInstance, storage };
