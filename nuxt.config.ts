// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  srcDir: 'src/',

  modules: ['@nuxtjs/tailwindcss', '@nuxt/eslint'],

  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
  ],

  // Vite config
  vite: {
    server: {
      allowedHosts: ['beehive-vault.fr'],
    },
  },
});
