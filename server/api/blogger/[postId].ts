import { defineEventHandler } from 'h3';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const { postId } = event.context.params; // Ambil ID dari URL

  // Format tanggal
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("id-ID", {
      weekday: "long", day: "2-digit", month: "long", year: "numeric"
    }).format(date);
  };

  if (!postId) {
    return { success: false, message: "Post ID tidak ditemukan" };
  }

  try {
    const blogId = config.BLOGGER_ID;
    const apiKey = config.BLOGGER_API_KEY;
    
    const url = `https://www.googleapis.com/blogger/v3/blogs/${blogId}/posts/${postId}?key=${apiKey}`;
    const response = await $fetch(url);
    
    if (!response || !response.title) {
      return { success: false, message: "Post tidak ditemukan" };
    }

    return {
      success: true,
      post: {
        id: response.id,
        title: response.title,
        slug: response.url.split("/").pop(), // Ambil slug dari URL post
        content: response.content,
        author: {
          name: response.author.displayName,
          profileImage: response.author.image?.url || "", // Pastikan ini bukan objek kosong
        },
        published: formatDate(response.published),
        updated: formatDate(response.updated),
        url: response.url
      }
    };
  } catch (error) {
    console.error("Error fetching post:", error);
    return { success: false, message: "Terjadi kesalahan saat mengambil postingan" };
  }
});