import { defineEventHandler, getRequestURL } from "h3";

export default defineEventHandler(async (event) => {
  const { $adminDb } = useNuxtApp(); // Ambil Firestore dari Nuxt Plugin
  const url = getRequestURL(event);
  const ip = event.req.headers["x-forwarded-for"] || event.req.socket.remoteAddress;
  const userAgent = event.req.headers["user-agent"] || "Unknown";
  const referrer = event.req.headers.referer || "Direct";

  // 🔹 Ambil data negara dari ipapi
  let country = "Unknown";
  try {
    const ipData = await $fetch(`https://ipapi.co/json/`);
    country = ipData?.country_name || "Unknown";
  } catch (error) {
    console.error("Gagal mendapatkan lokasi IP:", error);
  }

  // 🔹 Identifikasi browser dari User-Agent
  const browser = /chrome/i.test(userAgent)
    ? "Chrome"
    : /firefox/i.test(userAgent)
    ? "Firefox"
    : /safari/i.test(userAgent)
    ? "Safari"
    : /edge/i.test(userAgent)
    ? "Edge"
    : /opera|opr/i.test(userAgent)
    ? "Opera"
    : "Unknown";

  // 🔹 Simpan data analytics ke Firestore
  await $adminDb.collection("analytics").add({
    page: url.pathname,
    country,
    browser,
    referrer,
    timestamp: new Date(),
  });

  return { message: "Analytics recorded" };
});