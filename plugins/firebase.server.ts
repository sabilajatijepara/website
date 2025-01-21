import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

export default defineNuxtPlugin(() => {
  // Inisialisasi Firebase Admin hanya jika belum diinisialisasi
  if (!getApps().length) {
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      }),
    });
  }

  // Dapatkan instance Firestore
  const firestore = getFirestore();

  // Provide Firestore agar bisa diakses melalui useNuxtApp()
  return {
    provide: {
      adminDb: firestore,
    },
  };
});