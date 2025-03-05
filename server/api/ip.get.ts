import { defineEventHandler } from "h3";

export default defineEventHandler(async () => {
  try {
    const ipRes = await fetch("https://ipapi.co/json", {
      headers: { "User-Agent": "Mozilla/5.0" },
    });

    if (!ipRes.ok) throw new Error(`HTTP error! Status: ${ipRes.status}`);

    const ipData = await ipRes.json();
    return ipData;
  } catch (error) {
    console.error("🚨 Error fetching IP:", error);
    return { error: "Failed to fetch IP data" };
  }
});