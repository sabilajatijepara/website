// server/api/blog/[id].ts
import { defineEventHandler } from "h3";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  
  const postId = event.context.params.id; // Ambil ID dari URL
  const apiKey = config.BLOGGER_API_KEY;
  const blogId = config.BLOGGER_ID;

  try {
    // Request ke Blogger API berdasarkan ID postingan
    const response = await fetch(
      `https://www.googleapis.com/blogger/v3/blogs/${blogId}/posts/${postId}?key=${apiKey}`
    );
    const data = await response.json();
    
    // Format tanggal published ke format dd MMMM yyyy (contoh: 04 Februari 2025)
    const formattedPublished = formatDate(data.published);
    data.formattedPublished = formattedPublished;
    
    // Mengambil deskripsi dari konten (hapus HTML tags)
    /*const description = extractTextFromHtml(data.content);
    data.description = description;*/

    if (!data || data.error) {
      return { error: "Artikel tidak ditemukan" };
    }

    return data;
  } catch (error) {
    return { error: "Terjadi kesalahan saat mengambil data" };
  }
  
  // Fungsi untuk format tanggal
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

// Fungsi untuk menghapus HTML tags dari konten dan hanya mengambil teks
/*function extractTextFromHtml(content: string): string {
  const doc = new DOMParser().parseFromString(content, 'text/html');
  
  // Hapus elemen gambar atau elemen lain yang tidak relevan dalam deskripsi
  const images = doc.querySelectorAll('img');
  images.forEach(img => img.remove());

  // Mengambil hanya teks tanpa HTML dan elemen lainnya
  return doc.body.textContent || ''; // Mengambil hanya teks tanpa HTML
}*/
});