import { defineNuxtPlugin } from "#app";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

export default defineNuxtPlugin((nuxtApp) => {
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
  nuxtApp.provide("firebase", app);
  nuxtApp.provide("db", db);
  nuxtApp.provide("auth", auth);
  nuxtApp.provide("analytics", analytics);

  // Listen to auth state changes and inject user globally
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is logged in
      console.log("User is logged in:", user);
      nuxtApp.provide("user", user); // Inject user globally
    } else {
      // User is logged out
      console.log("User is logged out");
      nuxtApp.provide("user", null); // Inject null when logged out
    }
  });
});