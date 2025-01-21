import admin from "firebase-admin";

export default defineEventHandler(async (event) => {
  try {
    const { id } = getQuery(event); // Mengambil ID produk dari query (opsional)
    const db = admin.firestore();

    // Query koleksi produk dengan limit
    const productsCollection = db.collection("products");
    const snapshot = await productsCollection.limit(10).get();

    const products = [];
    snapshot.forEach((doc) => {
      if (doc.id !== id) { // Pastikan tidak mengambil produk yang sedang dilihat
        products.push({ id: doc.id, ...doc.data() });
      }
    });

    return { success: true, products: products.sort(() => Math.random() - 0.5).slice(0, 4) };
  } catch (error) {
    console.error("Error fetching other products:", error);
    return { success: false, error: error.message };
  }
});