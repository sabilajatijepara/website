import { useNuxtApp } from "#app";
import { onAuthStateChanged } from "firebase/auth";

export default defineNuxtRouteMiddleware((to, from) => {
  const { user } = useNuxtApp().$user;  // Mengakses informasi pengguna yang sudah login

  if (!user) {
    return navigateTo("/masuk");  // Jika tidak ada user, redirect ke halaman login
  } else {
    return navigateTo("/dashboard/products")
  }
});
