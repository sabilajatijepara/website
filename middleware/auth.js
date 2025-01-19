import { useNuxtApp } from "#app";
import { onAuthStateChanged } from "firebase/auth";

export default defineNuxtRouteMiddleware((to, from) => {
  const { $auth } = useNuxtApp();

  if (!$auth) {
    console.error("Firebase auth is not initialized.");
    return navigateTo("/masuk");
  }

  return new Promise((resolve) => {
    const unsubscribe = $auth.onAuthStateChanged((user) => {
      if (!user) {
        console.log("No user logged in, redirecting to /masuk.");
        return navigateTo("/masuk");
      }
      unsubscribe(); // Hentikan listener
      resolve();
    });
  });
});