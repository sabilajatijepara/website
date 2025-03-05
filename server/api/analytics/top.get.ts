import { defineEventHandler } from "h3";
import admin from "firebase-admin"

export default defineEventHandler(async () => {
  const db = admin.firestore();

  // 🔹 Query semua data
  const snapshot = await db.collection("analytics").get();
  const analyticsData = snapshot.docs.map((doc) => doc.data());

  // 🔹 Fungsi untuk menghitung top 5
  const countTop = (key: string) => {
    const count: Record<string, number> = {};
    analyticsData.forEach((item) => {
      count[item[key]] = (count[item[key]] || 0) + 1;
    });
    return Object.entries(count)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  };

  return {
    topCountries: countTop("country"),
    topReferrers: countTop("referrer"),
    topBrowsers: countTop("browser"),
    topPages: countTop("page"),
  };
});