import { getFirestore, doc, getDoc } from "firebase-admin/firestore";

export default defineNuxtMiddleware(async (context) => {
  const { req, res, params } = context;
  const productId = params?.id;

  if (!productId) {
    console.warn("productId tidak ditemukan dalam route params.");
    return;
  }

  try {
    // Inisialisasi Firebase Admin jika belum diinisialisasi
    if (!getFirestore) {
      throw new Error("Firebase Admin belum diinisialisasi.");
    }

    const db = getFirestore();
    const productRef = doc(db, "products", productId);
    const productDoc = await getDoc(productRef);

    if (!productDoc.exists) {
      console.warn(`Produk dengan ID ${productId} tidak ditemukan.`);
      return;
    }

    const productData = productDoc.data();

    // Atur meta tags secara dinamis menggunakan `useHead`
    useHead({
      title: `${productData.name} — CV. Sabilajati Mebel Jepara`,
      meta: [
        { name: "description", content: productData.description || "" },
        { property: "og:title", content: productData.name || "" },
        { property: "og:description", content: productData.description || "" },
        { property: "og:image", content: productData.imageURL[0] || "" },
      ],
    });
  } catch (error) {
    console.error("Gagal memproses meta tags:", error);
  }
});