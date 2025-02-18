import { defineEventHandler, getQuery } from "h3";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const apiKey = config.BLOGGER_API_KEY;
  const blogId = config.BLOGGER_ID;

  // Ambil query parameter untuk pagination
  const query = getQuery(event);
  const page = parseInt(query.page as string) || 1; // Default page = 1
  const limit = parseInt(query.limit as string) || 5; // Default limit = 5
  const startIndex = (page - 1) * limit;

  try {
    const response = await $fetch(
      `https://www.googleapis.com/blogger/v3/blogs/${blogId}/posts?key=${apiKey}`
    );

    if (!response.items) {
      return { success: false, error: "Tidak ada postingan ditemukan" };
    }

    // Format tanggal
    const postsWithFormattedDate = response.items.map((post) => ({
      ...post,
      formattedDate: formatDate(post.published),
    }));

    // Ambil hanya sesuai pagination
    const paginatedPosts = postsWithFormattedDate.slice(startIndex, startIndex + limit);
    
    return {
      success: true,
      posts: paginatedPosts,
      totalPosts: response.items.length,
      totalPages: Math.ceil(response.items.length / limit),
      currentPage: page,
    };
  } catch (error) {
    console.error("Error fetching Blogger posts:", error);
    return { success: false, error: "Gagal mengambil data" };
  }
});

// Fungsi untuk memformat tanggal
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long", // Hari dalam bahasa Indonesia (Senin, Selasa, dll.)
    day: "2-digit",  // Tanggal (01, 02, dst.)
    month: "long",   // Nama bulan (Januari, Februari, dst.)
    year: "numeric", // Tahun (2025, 2026, dst.)
  }).format(date);
}