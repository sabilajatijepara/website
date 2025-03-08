import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth"

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();
  
  // Inisialisasi Firebase Admin hanya jika belum diinisialisasi
  if (!getApps().length) {
    initializeApp({
      credential: cert({
        projectId: config.firebaseAdmin.projectId,
        privateKey: config.firebaseAdmin.privateKey,
        clientEmail: config.firebaseAdmin.clientEmail,
      }),
    });
  }

  // Dapatkan instance Firestore
  const firestore = getFirestore();
  const aauth = getAuth();

  // Provide Firestore agar bisa diakses melalui useNuxtApp()
  return {
    provide: {
      adminDb: firestore,
      adminAuth: aauth,
    },
  };
});