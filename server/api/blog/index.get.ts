import { defineEventHandler } from "h3";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  
  const apiKey = config.BLOGGER_API_KEY;
  const blogId = config.BLOGGER_ID;

  try {
    const response = await $fetch(
      `https://www.googleapis.com/blogger/v3/blogs/${blogId}/posts?key=${apiKey}`
    );
    // Format tanggal untuk setiap post
    const postsWithFormattedDate = response.items.map((post) => {
      return {
        ...post,
        formattedDate: formatDate(post.published)
      };
    });
    return { success: true, posts: postsWithFormattedDate };
  } catch (error) {
    console.error("Error fetching Blogger posts:", error);
    return { success: false, error: "Gagal mengambil data" };
  }
});

// Fungsi untuk memformat tanggal
function formatDate(publishedDate: string): string {
  const date = new Date(publishedDate);
  const months = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
}