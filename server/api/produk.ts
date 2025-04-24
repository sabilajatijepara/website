export default defineEventHandler(async (event) => {
  try {
    // Fetch data dari API Blogger dan Produk
    const [productRes] = await Promise.all([
      $fetch("https://sabilajati.com/api/products/sitemap"),
    ]);
    


    // Akan diaktifkan ketika deploy API Terpisah
    const productRoutes = productRes.map((product: any) => ({
      loc: `https://sabilajati.com/products/${product.id}`,
      lastmod: new Date().toISOString(),
      changefreq: "weekly",
      priority: 0.9,
    }));
    
    // Ketika Products API Tidak Error
    const routes = [ ...productRoutes];

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