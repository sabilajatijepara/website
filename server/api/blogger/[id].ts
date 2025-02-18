import { defineEventHandler } from 'h3';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const { id } = event.context.params; // Ambil ID dari URL

  if (!id) {
    return { success: false, message: "Post ID tidak ditemukan" };
  }

  try {
    const blogId = config.BLOGGER_ID;
    const apiKey = config.BLOGGER_API_KEY;

    const url = `https://www.googleapis.com/blogger/v3/blogs/${blogId}/posts/${id}?key=${apiKey}`;
    const response = await $fetch(url);

    if (!response || !response.title) {
      return { success: false, message: "Post tidak ditemukan" };
    }

    // Buat slug dari title (opsional)
    const slug = response.title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')  // Hapus karakter spesial
      .replace(/\s+/g, '-')         // Ganti spasi dengan "-"
      .replace(/-+/g, '-');         // Hapus "-" yang berlebihan

    return {
      success: true,
      post: {
        id: response.id,
        title: response.title,
        slug: slug,
        content: response.content,
        author: {
          name: response.author.displayName,
          profileImage: response.author.image || "",
        },
        published: new Intl.DateTimeFormat("id-ID", {
          weekday: "long", day: "2-digit", month: "long", year: "numeric"
        }).format(new Date(response.published)),
        updated: new Intl.DateTimeFormat("id-ID", {
          weekday: "long", day: "2-digit", month: "long", year: "numeric"
        }).format(new Date(response.updated)),
        url: response.url
      }
    };
  } catch (error) {
    console.error("Error fetching post:", error);
    return { success: false, message: "Terjadi kesalahan saat mengambil postingan" };
  }
});