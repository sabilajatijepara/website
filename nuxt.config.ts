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
