import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default defineNuxtPlugin(async (nuxtApp) => {
  if (process.server) return; // Hanya jalan di client

  try {
    const { $db } = nuxtApp; // Ambil Firestore

    if (!$db) {
      console.error("🚨 Firestore belum terinisialisasi!");
      return;
    }
    
    const currentPage = window.location.pathname;

    // 🚨 Skip tracking jika halaman ada di /dashboard
    if (currentPage.startsWith("/dashboard")) {
      console.log("⏩ Skipping tracking for dashboard pages.");
      return;
    }

    // Fetch data IP dan lokasi dari API internal
    const ipRes = await fetch("/api/ip");
    const ipData = await ipRes.json();

    console.log(ipData); // Debugging

    // Data visitor yang akan disimpan
    const visitorInfo = {
      ip: ipData.ip,
      country: ipData.country || "Unknown",
      country_name: ipData.country_name || "Unknown",
      source: document.referrer || "Direct",
      browser: navigator.userAgent || "Unknown",
      page: window.location.pathname || "/",
      timestamp: serverTimestamp(), // Gunakan Firestore timestamp
    };

    // Simpan langsung ke Firestore menggunakan `addDoc()`
    await addDoc(collection($db, "analytics"), visitorInfo);
  } catch (error) {
    console.error("🚨 Error tracking visitor:", error);
  }
});