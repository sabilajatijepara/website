import { defineEventHandler } from "h3";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const { slug } = event.context.params; // Ambil slug dari URL
  
  const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
};

  try {
    const blogId = config.BLOGGER_ID; // Simpan di runtime config
    const apiKey = config.BLOGGER_API_KEY;
    
    // Fetch data dari Blogger API
    const response = await $fetch(`https://www.googleapis.com/blogger/v3/blogs/${blogId}/posts?key=${apiKey}`);
    const posts = response.items || [];

    // Cari postingan berdasarkan slug (judul sebagai slug)
    const post = posts.find((p) => p.title.toLowerCase().replace(/\s+/g, "-") === slug);

    if (!post) {
      throw createError({ statusCode: 404, statusMessage: "Artikel tidak ditemukan" });
    }

    return {
      id: post.id,
      title: post.title,
      content: post.content,
      published: formatDate(post.published),
      updated: formatDate(post.updated),
      slug,
      author: response.author.displayName,
      pp: response.author.image,
    };
  } catch (error) {
    console.error("Error fetching blog post:", error);
    throw createError({ statusCode: 500, statusMessage: "Internal Server Error" });
  }
});