// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxt/icon',
    '@nuxtjs/google-fonts',
    '@nuxtjs/i18n',
    '@nuxtjs/sitemap',
    '@nuxt/image',
    '@nuxtjs/cloudinary'
  ],
  
  sitemap: {
    path: "sitemap.xml",
    hostname: "https://sabilajati.com", // Ganti dengan domain asli
    gzip: true,
    xslTips: false,
    autoI18n: false,
    exclude: ["/dashboard/**", "/masuk", "/en/dashboard/**", "/en/masuk"], // Jangan tampilkan halaman admin
    sources: [
      'https://sabilajatimebeljepara.vercel.app/api/sitemap'
      ],
  },
  
  ssr: true,
  target: "server",
  
  routeRules: {
    '/contact-us': {
      redirect: '/contact'
    },
    "/sitemap.xml": { redirect: "/api/sitemap" },
  },
  
  runtimeConfig: {
    // Variabel yang hanya tersedia di server (private)
    firebaseAdmin: {
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    },
    BLOGGER_API_KEY: process.env.NUXT_BLOGGER_API_KEY, // Private (hanya di server)
    BLOGGER_ID: process.env.NUXT_BLOGGER_ID, // Private
    // Jika perlu, tambahkan public runtime config
    public: {
      BLOGGER_ID: process.env.NUXT_BLOGGER_ID,
      // Tambahkan variabel yang ingin diakses di client
    },
  },
  
  i18n: {
    locales: [
      { code: 'en', name: 'English', iso: 'en-US', file: 'en.json' },
      { code: 'id', name: 'Bahasa Indonesia', iso: 'id-ID', file: 'id.json' }
    ],
    defaultLocale: 'id',
    lazy: true,         // Memuat file bahasa secara dinamis
    strategy: 'prefix_except_default', // URL tanpa prefix untuk default locale
    detectBrowserLanguage: {    // Opsi deteksi bahasa browser
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root', // Mengarahkan ulang ke root berdasarkan bahasa
    },
  },

  tailwindcss: {
    cssPath: "~/assets/css/main.css",
  },

  googleFonts: {
    display: 'swap',
    base64: true,
    families: {
      "Plus+Jakarta+Sans": true,
      Poppins: true,
    },
  },
  
  image: {
    cloudinary: {
      baseURL: 'https://res.cloudinary.com/dj6we26m8/image/upload/'
    },
    provider: 'cloudinary',
    screens: {
      sm: 320,
      md: 640,
      lg: 1024,
      xl: 1280,
      xxl: 1536
    }
  },

  cloudinary: {
    cloudName: 'dj6we26m8'
  }
})