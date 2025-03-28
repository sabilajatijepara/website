import { useRuntimeConfig } from "#imports";

// Halaman Statis (Misalnya: Home, About, Contact)
const staticRoutes = [
  { url: "/", lastmod: new Date().toISOString() },
  { url: "/about", lastmod: new Date().toISOString() },
  { url: "/contact", lastmod: new Date().toISOString() },
];

// Ambil data produk dari `/api/products`
/*async function fetchProducts() {
  try {
    const products = await $fetch("/api/products"); // Ambil produk dari API
    return products.map((product) => ({
      url: `/products/${product.id}`, // Bentuk URL produk
      lastmod: new Date().toISOString(),
    }));
  } catch (error) {
    console.error("Error fetching product data:", error);
    return [];
  }
}
*/
// Ambil data blog dari `/api/blogger`
async function fetchBlogPosts() {
  try {
    const blogPosts = await $fetch("/api/blogger/sitemap");
    return blogPosts.map((post) => ({
      url: post.url,
      lastmod: post.lastmod,
    }));
  } catch (error) {
    console.error("Error fetching blog data:", error);
    return [];
  }
}

// API untuk Sitemap
export default defineEventHandler(async (event) => {
  const [blogPosts] = await Promise.all([
    //fetchProducts(),
    fetchBlogPosts(),
  ]);

  return [...staticRoutes, ...blogPosts];
});