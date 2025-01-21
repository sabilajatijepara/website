import { defineEventHandler, getQuery } from "h3";
import admin from "firebase-admin"

export default defineEventHandler(async (event) => {
  const db = admin.firestore(); // Ambil Firestore dari plugin
  const query = getQuery(event); // Ambil query parameter
  const page = parseInt(query.page as string) || 1;
  const perPage = parseInt(query.perPage as string) || 6;

  try {
    const offset = (page - 1) * perPage;
    const productsRef = db.collection("products").orderBy("createdAt", "desc");
    const totalDocs = await productsRef.get();

    const totalProducts = totalDocs.size;
    const querySnapshot = await productsRef.offset(offset).limit(perPage).get();

    const products = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return {
      success: true,
      products,
      totalProducts,
      totalPages: Math.ceil(totalProducts / perPage),
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    return { success: false, error: error.message };
  }
});