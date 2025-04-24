export default defineEventHandler(async (event) => {
  try {
    // Fetch data dari API Blogger dan Produk
    const [blogRes, productRes] = await Promise.all([
      $fetch("https://sabilajatimebeljepara.vercel.app/api/blogger/sitemap"),
      $fetch("https://sabilajati.com/api/products/sitemap"),
    ]);
    
    // **🔹 Daftar Halaman Statis**
    const staticRoutes = [
      { loc: "https://sabilajati.com/", priority: 1.0, lastmod: new Date().toISOString(), changefreq: "weekly" },
      { loc: "https://sabilajati.com/blog", priority: 1.0, lastmod: new Date().toISOString(), changefreq: "weekly" },
      { loc: "https://sabilajati.com/about", priority: 0.9, lastmod: new Date().toISOString(), changefreq: "weekly" },
      { loc: "https://sabilajati.com/contact", priority: 0.9, lastmod: new Date().toISOString(), changefreq: "weekly" },
      { loc: "https://sabilajati.com/howorder", priority: 0.8, lastmod: new Date().toISOString(), changefreq: "weekly" },
      { loc: "https://sabilajati.com/faq", priority: 0.8, lastmod: new Date().toISOString(), changefreq: "weekly" },
      { loc: "https://sabilajati.com/search", priority: 0.8, lastmod: new Date().toISOString(), changefreq: "weekly" },
    ];

    // Format URL untuk sitemap
    const blogRoutes = blogRes.map((post: any) => ({
      loc: `https://sabilajati.com/blog/${post.id}/${post.slug}`,
      lastmod: post.lastmod || new Date().toISOString(),
      changefreq: "weekly",
      priority: 0.8,
    }));

    // Akan diaktifkan ketika deploy API Terpisah
    const productRoutes = productRes.map((product: any) => ({
      loc: `https://sabilajati.com/products/${product.id}`,
      lastmod: new Date().toISOString(),
      changefreq: "weekly",
      priority: 0.9,
    }));

    // Gabungkan semua route
    /*const routes = [ ...staticRoutes, ...blogRoutes];*/
    
    // Ketika Products API Tidak Error
    const routes = [ ...staticRoutes, ...blogRoutes, ...productRoutes];

    // Generate XML Sitemap
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (route) => `<url>
  <loc>${route.loc}</loc>
  <lastmod>${route.lastmod}</lastmod>
  <changefreq>${route.changefreq}</changefreq>
  <priority>${route.priority}</priority>
</url>`
  )
  .join("\n")}
</urlset>`;

    // Set response sebagai XML
    event.node.res.setHeader("Content-Type", "application/xml");
    return sitemap;
  } catch (error) {
    console.error("❌ Error generating sitemap:", error);
    return "Error generating sitemap";
  }
});