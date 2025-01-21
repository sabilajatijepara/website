import { defineEventHandler } from "h3";

import admin from "firebase-admin"

export default defineEventHandler(async () => {
  const db = admin.firestore();

  try {
    const slidersSnapshot = await db.collection("sliders").orderBy("order").get();

    const slides = slidersSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return { success: true, slides };
  } catch (error) {
    console.error("Error fetching slides:", error);
    return { success: false, error: error.message };
  }
});