import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  ssr: true,
  nitro: {
    preset: 'static',
  },

  modules: [
    '@nuxtjs/google-fonts',
    '@nuxt/image',
    '@vueuse/nuxt',
  ],

  googleFonts: {
    families: {
      Inter: {
        wght: [400, 500, 600],
      },
      'Instrument Serif': {
        wght: [400],
        ital: [400],
      },
    },
    display: 'swap',
    preconnect: true,
  },

  image: {
    quality: 85,
    format: ['webp', 'avif'],
  },

  css: ['~/assets/css/main.css'],

  vite: {
    plugins: [tailwindcss()],
  },

  typescript: {
    strict: true,
    typeCheck: false,
  },

  experimental: {
    payloadExtraction: false,
  },
})
