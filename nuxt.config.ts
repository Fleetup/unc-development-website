import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  ssr: true,
  nitro: {
    // Removed: preset: 'static'
    // Pure-static preset can't run server/api/* at request time, which the
    // contact form needs. Without a preset, Nitro auto-detects the deploy
    // target (Vercel/Netlify/Cloudflare/Node) and uses serverless functions
    // for /api/* while still prerendering the marketing pages.
    prerender: {
      routes: ['/'],
      crawlLinks: true,
    },
  },

  // Server-only config (auto-bound from NUXT_* env vars at runtime; the
  // process.env fallbacks below are read at build time and embedded as
  // defaults for local development).
  runtimeConfig: {
    resendApiKey:     process.env.RESEND_API_KEY ?? '',
    contactToEmail:   process.env.CONTACT_TO     ?? 'developmentteam@uncdevelopment.com',
    contactFromEmail: process.env.CONTACT_FROM   ?? 'UNC Development <contact@uncdevelopment.com>',
  },

  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      htmlAttrs: { lang: 'en' },
      link: [
        // Favicon — ICO for legacy browsers, SVG for modern
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'icon', type: 'image/svg+xml', href: '/Log-UNC-Development.svg' },
        // Apple home screen icon (iOS Safari)
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        // Preload above-the-fold font weights to eliminate FOUT on LCP text
        {
          rel: 'preload',
          as: 'font',
          type: 'font/woff2',
          href: '/fonts/Geist-Regular.woff2',
          crossorigin: 'anonymous',
        },
        {
          rel: 'preload',
          as: 'font',
          type: 'font/woff2',
          href: '/fonts/Geist-Medium.woff2',
          crossorigin: 'anonymous',
        },
        {
          rel: 'preload',
          as: 'font',
          type: 'font/woff2',
          href: '/fonts/GeistMono-Regular.woff2',
          crossorigin: 'anonymous',
        },
        // Preconnect to Resend API so the contact form POST starts faster
        { rel: 'preconnect', href: 'https://api.resend.com' },
      ],
    },
  },

  modules: [
    '@nuxt/image',
    '@vueuse/nuxt',
  ],

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
