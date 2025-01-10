import { defineNuxtPlugin } from "#app";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

export default defineNuxtPlugin(() => {
  const firebaseConfig = {
    apiKey: "AIzaSyB5fMnpazeCCNA0lYn8pJhsKqo3UAwbw8k",
    authDomain: "sabilajati-jepara.firebaseapp.com",
    projectId: "sabilajati-jepara",
    storageBucket: "sabilajati-jepara.firebasestorage.app",
    messagingSenderId: "750945819003",
    appId: "1:750945819003:web:2e0925a0978319f66685de",
    measurementId: "G-09Z0NWWTVW",
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const auth = getAuth(app);
  const analytics = getAnalytics(app);

  // Inject Firebase services globally
  return {
    provide: {
      firebase: app,
      db,
      auth,
      analytics,
    },
  };
});