import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
    apiKey: "AIzaSyCu2e5cvHql99fmHQzarYbvAv3tSD9MbgA",
    authDomain: "bookeez-cc00c.firebaseapp.com",
    projectId: "bookeez-cc00c",
    storageBucket: "bookeez-cc00c.firebasestorage.app",
    messagingSenderId: "898260163246",
    appId: "1:898260163246:web:b69d712ba62e47be3a6b3f"
};

export const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);