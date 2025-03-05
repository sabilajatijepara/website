import { defineEventHandler, readBody } from "h3";
import admin from "firebase-admin"

export default defineEventHandler(async (event) => {
  try {
    const db = admin.firestore();
    const now = new Date();

    if (event.req.method === "POST") {
      const body = await readBody(event);

      if (!body.ip || !body.page) {
        throw new Error("Missing required fields (ip, page)");
      }

      await db.collection("analytics").add({
        ip: body.ip,
        country: body.country || "Unknown",
        source: body.source || "Direct",
        browser: body.browser || "Unknown",
        page: body.page || "/",
        timestamp: now,
      });

      return { success: true, message: "Visitor recorded" };
    }

    const today = new Date(now);
    today.setHours(0, 0, 0, 0);

    const weekAgo = new Date(now);
    weekAgo.setDate(weekAgo.getDate() - 7);
    weekAgo.setHours(0, 0, 0, 0);

    const monthAgo = new Date(now);
    monthAgo.setDate(monthAgo.getDate() - 30);
    monthAgo.setHours(0, 0, 0, 0);

    const analyticsRef = db.collection("analytics");

    const [totalVisitors, todayVisitors, weeklyVisitors, monthlyVisitors, countryStats, sourceStats, pageStats, browserStats] = await Promise.all([
      analyticsRef.get(),
      analyticsRef.where("timestamp", ">=", today).get(),
      analyticsRef.where("timestamp", ">=", weekAgo).get(),
      analyticsRef.where("timestamp", ">=", monthAgo).get(),
      analyticsRef.get(),
      analyticsRef.get(),
      analyticsRef.get(),
      analyticsRef.get(),
    ]);

    const processStats = (snapshot: any, field: string) => {
      const counts: { [key: string]: number } = {};
      snapshot.forEach((doc: any) => {
        const value = doc.data()[field];
        counts[value] = (counts[value] || 0) + 1;
      });
      return Object.entries(counts).map(([key, count]) => ({ name: key, count })).sort((a, b) => b.count - a.count);
    };

    return {
      totalVisitors: totalVisitors.size,
      todayVisitors: todayVisitors.size,
      weeklyVisitors: weeklyVisitors.size,
      monthlyVisitors: monthlyVisitors.size,
      topCountries: processStats(countryStats, "country_name").slice(0, 5),
      allCountries: processStats(countryStats, "country_name"),
      topSources: processStats(sourceStats, "source").slice(0, 5),
      allSources: processStats(sourceStats, "source"),
      topPages: processStats(pageStats, "page").slice(0, 5),
      allPages: processStats(pageStats, "page"),
      topBrowsers: processStats(browserStats, "browser").slice(0, 5),
      allBrowsers: processStats(browserStats, "browser"),
    };
  } catch (error: any) {
    console.error("API Error:", error);
    return { error: "Internal Server Error", details: error.message };
  }
});