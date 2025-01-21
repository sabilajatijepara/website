import admin from "firebase-admin";

export default defineEventHandler(async (event) => {
  try {
    const { id } = event.context.params; // Mendapatkan ID produk dari URL
    const db = admin.firestore();
    const productDoc = await db.collection("products").doc(id).get();

    if (!productDoc.exists) {
      return { success: false, error: "Product not found" };
    }

    const productData = {
      id: productDoc.id,
      ...productDoc.data(),
    };

    return { success: true, product: productData };
  } catch (error) {
    console.error("Error fetching product:", error);
    return { success: false, error: error.message };
  }
});