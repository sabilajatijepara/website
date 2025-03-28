
import admin from "firebase-admin";

export default defineEventHandler(async (event) => {
  const db = admin.firestore();
  const productsRef = db.collection("products").orderBy("createdAt", "desc");
  const totalDocs = await productsRef.get();

  return totalDocs.docs.map((doc) => ({
    id: doc.id, // ID produk yang digunakan dalam sitemap
    name: doc.data().name,
    image: doc.data().image,
    price: doc.data().price,
    description: doc.data().description,
    category: doc.data().category,
  }));
});