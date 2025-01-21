// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxt/icon',
    '@nuxtjs/google-fonts',
    '@nuxtjs/i18n',
    '@nuxtjs/ngrok',
  ],
  
  ssr: true,
  target: "server",
  
  runtimeConfig: {
    // Variabel yang hanya tersedia di server (private)
    firebaseAdmin: {
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    },
    // Jika perlu, tambahkan public runtime config
    public: {
      // Tambahkan variabel yang ingin diakses di client
    },
  },
  
  app: {
    head: {
      keywords: 'mebel jepara, kursi impres, meja kursi impres, cv sabilajati, cv sabilajati jepara, furniture jepara, kursi meja cafe'
    }
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

  ngrok: {
    authtoken: '2rYSwu3l6MDDCMLGp456MYW0mvq_69Zxm8jWuMpnAKzTeNjDP',
  },
  
  tailwindcss: {
    cssPath: "~/assets/css/main.css",
  },

  googleFonts: {
    families: {
      "Plus+Jakarta+Sans": true,
      Poppins: true,
    },
  },
})
