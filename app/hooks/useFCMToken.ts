import { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCu2e5cvHql99fmHQzarYbvAv3tSD9MbgA",
  authDomain: "bookeez-cc00c.firebaseapp.com",
  projectId: "bookeez-cc00c",
  storageBucket: "bookeez-cc00c.appspot.com",
  messagingSenderId: "898260163246",
  appId: "1:898260163246:web:b69d712ba62e47be3a6b3f",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get Firebase Messaging instance
const messaging = getMessaging(app);

interface FcmTokenState {
  fcmToken: string | null;
}

const useFCMToken = () => {
  const [fcmToken, setFcmToken] = useState<FcmTokenState>({ fcmToken: null });

  useEffect(() => {
    const getTokenAndSend = async () => {
      try {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
          const currentToken = await getToken(messaging, {
            vapidKey: "BObxjEwiHyJAJk1USqiCcYj5jceWgfPxaUmBqEFQhcdPsCyJhh41756pk_Ne-5BbHOOaJvySKE_fwuPAISf6Tlc",
          });
          if (currentToken) {
            // Correctly setting the state with an object
            setFcmToken({ fcmToken: currentToken });  
          } else {
            console.log("No registration token available.");
          }
        } else {
          console.warn("Notification permission denied.");
        }
      } catch (error) {
        console.error("Error while retrieving token: ", error);
      }
    };

    getTokenAndSend();
  }, []);  // Only run on initial render

  return fcmToken;  // Return the FCM token
};

export default useFCMToken;
