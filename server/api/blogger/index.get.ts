import { defineEventHandler, getQuery } from 'h3';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const currentPage = parseInt(query.page as string) || 1;
  const limit = parseInt(query.limit as string) || 5;

  // API Key dan Blog ID Blogger (Gantilah dengan milikmu)
  const config = useRuntimeConfig();
  const apiKey = config.BLOGGER_API_KEY;
  const blogId = config.BLOGGER_ID;

  try {
    // Fetch semua post dari Blogger API (tanpa paginasi API)
    const response = await fetch(
      `https://www.googleapis.com/blogger/v3/blogs/${blogId}/posts?key=${apiKey}`
    );
    const data = await response.json();

    if (!data.items) {
      return { posts: [], totalPages: 1, totalPosts: 0, currentPage, limit, success: true };
    }

    // Fungsi membuat slug dari title
    const generateSlug = (title: string) => {
      return title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '') // Hapus karakter khusus
        .replace(/\s+/g, '-') // Ganti spasi dengan "-"
        .replace(/-+/g, '-'); // Hilangkan tanda "-" ganda
    };

    // Fungsi format tanggal "Hari, dd Bulan YYYY"
    const formatDate = (dateStr: string) => {
      const date = new Date(dateStr);
      return date.toLocaleDateString('id-ID', {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      });
    };

    // Format data postingan
    const allPosts = data.items.map((post: any) => ({
      id: post.id,
      title: post.title,
      slug: generateSlug(post.title),
      published: formatDate(post.published),
      url: post.url, // URL asli Blogger jika dibutuhkan
    }));

    // Hitung total postingan dan halaman
    const totalPosts = allPosts.length;
    const totalPages = Math.ceil(totalPosts / limit);

    // Ambil postingan sesuai halaman saat ini
    const posts = allPosts.slice((currentPage - 1) * limit, currentPage * limit);

    return {
      success: true,
      posts, // Induk array diubah dari paginatedPost → posts
      totalPosts,
      totalPages,
      currentPage,
      limit,
    };
  } catch (error) {
    console.error('Error fetching Blogger API:', error);
    return { posts: [], totalPages: 1, totalPosts: 0, currentPage, limit, success: false };
  }
});