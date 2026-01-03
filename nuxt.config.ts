// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  // Vercel deployment
  nitro: {
    preset: 'vercel',
  },

  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxt/icon',
  ],

  components: [
    { path: '~/components/ui' },
    { path: '~/components/common', prefix: 'App' },
    { path: '~/components/game' },
    { path: '~/components/search' },
    { path: '~/components/category' },
    { path: '~/components/section' },
  ],

  app: {
    head: {
      title: 'PlayZone - Free Online Games',
      meta: [
        { name: 'description', content: 'Play free online games instantly. No downloads, no signup required.' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#0a0b10' },
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap' },
      ],
    },
    pageTransition: {
      name: 'page',
      mode: 'out-in',
    },
    layoutTransition: {
      name: 'layout',
      mode: 'out-in',
    },
  },

  tailwindcss: {
    cssPath: '~/assets/css/main.css',
  },

  typescript: {
    strict: true,
  },
})
