import { useRuntimeConfig } from "#imports";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const blogId = config.BLOGGER_ID; // Ganti dengan Blog ID yang benar
  const apiKey = config.BLOGGER_API_KEY;
  
  try {
    const response = await $fetch(
      `https://www.googleapis.com/blogger/v3/blogs/${blogId}/posts?key=${apiKey}`
    );
    
    return response.items.map((post) => {
      const postId = post.id;
      const titleSlug = post.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-") // Ubah judul menjadi slug
        .replace(/^-+|-+$/g, ""); // Hapus strip di awal & akhir

      return {
        id: postId,
        title: post.title,
        slug: titleSlug,
        url: `/blog/${postId}/${titleSlug}`, // Ganti URL Blogspot ke domain sendiri
        lastmod: post.updated || new Date().toISOString(),
      };
    });
  } catch (error) {
    console.error("🚨 Error fetching blog data:", error);
    return [];
  }
});