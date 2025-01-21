import { defineEventHandler } from "h3";

import admin from "firebase-admin"

export default defineEventHandler(async () => {
  const db = admin.firestore();

  try {
    const categoriesSnapshot = await db.collection("categories").get();

    const categories = categoriesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return { success: true, categories };
  } catch (error) {
    console.error("Error fetching categories:", error);
    return { success: false, error: error.message };
  }
});