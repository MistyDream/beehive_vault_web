// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  srcDir: 'src/',

  runtimeConfig: {
    public: {
      apiBase: process.env.API_BASE_URL,
    },
  },

  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/image',
    '@nuxtjs/i18n',
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    'nuxt-lucide-icons',
  ],

  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
  ],

  css: ['~/assets/css/main.css'],

  // Font config
  fonts: {
    families: [
      {
        name: 'Poppins',
        provider: 'google',
        weights: [300, 400, 500, 600, 700],
      },
      {
        name: 'Nunito',
        provider: 'google',
        weights: [300, 400, 600, 700],
      },
      {
        name: 'Space Mono',
        provider: 'google',
        weights: [400, 700],
      },
    ],
  },

  // I18n config
  i18n: {
    defaultLocale: 'fr',
    locales: [
      { code: 'fr', name: 'Français', file: 'fr-FR.json' },
      { code: 'en', name: 'English', file: 'en-US.json' },
    ],
  },

  // Vite config
  vite: {
    server: {
      allowedHosts: ['beehive-vault.fr'],
    },
  },
});
