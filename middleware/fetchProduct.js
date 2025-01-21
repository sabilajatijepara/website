import { useNuxtApp } from "#app";
import { doc, getDoc } from "firebase/firestore";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const productId = to.params.id;
  const { $db } = useNuxtApp();
  
  const productDoc = await getDoc(doc($db, "products", productId));
  if (!productDoc.exists()) {
    return navigateTo("/404"); // Arahkan ke halaman 404 jika produk tidak ditemukan
  }
});