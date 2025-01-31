import { defineEventHandler, getQuery } from "h3";
import admin from "firebase-admin";

export default defineEventHandler(async (event) => {
  const db = admin.firestore();
  const query = getQuery(event);
  const page = parseInt(query.page as string) || 1;
  const perPage = parseInt(query.perPage as string) || 6;
  const lastVisible = query.lastVisible as string || null; // Untuk cursor-based pagination

  try {
    let productsRef = db.collection("products").orderBy("createdAt", "desc");
    const totalDocs = await productsRef.get();
    const totalProducts = totalDocs.size;
    const totalPages = Math.ceil(totalProducts / perPage);

    // Jika ada lastVisible, gunakan sebagai cursor
    if (lastVisible) {
      const lastDoc = await db.collection("products").doc(lastVisible).get();
      productsRef = productsRef.startAfter(lastDoc);
    }

    const querySnapshot = await productsRef.limit(perPage).get();

    const products = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Ambil ID terakhir untuk cursor-based pagination
    const lastDocId = querySnapshot.docs[querySnapshot.docs.length - 1]?.id || null;

    return {
      success: true,
      products,
      totalProducts,
      totalPages,
      currentPage: page,
      lastVisible: lastDocId, // Kirim last document ID untuk pagination
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    return { success: false, error: error.message };
  }
});