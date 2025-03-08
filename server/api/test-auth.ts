export default defineEventHandler(async (event) => {
  const { $adminAuth, $adminDb } = useNuxtApp();

  return {
    adminAuthExists: !!$adminAuth,
    adminDbExists: !!$adminDb,
  };
});