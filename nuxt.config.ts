// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  srcDir: 'src/',

  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/image',
    '@nuxtjs/tailwindcss',
    '@vueuse/nuxt',
    'nuxt-echarts',
    'nuxt-lucide-icons',
  ],

  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
  ],

  css: ['animate.css/animate.min.css', '~/assets/css/main.css'],

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

  // Echart config
  echarts: {
    charts: ['LineChart', 'LinesChart', 'PieChart'],
    components: [
      'AxisPointerComponent',
      'GridComponent',
      'LegendComponent',
      'TitleComponent',
      'TooltipComponent',
    ],
  },

  // Vite config
  vite: {
    server: {
      allowedHosts: ['beehive-vault.fr'],
    },
  },
});
