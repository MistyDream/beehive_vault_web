import { THEME_DEFAULT, THEME_STORAGE_KEY } from './src/constants/theme';

const antiFlashScript = `(function(){try{var k='${THEME_STORAGE_KEY}';var t=localStorage.getItem(k);var d=t?t==='dark':${THEME_DEFAULT === 'dark'};var h=document.documentElement;h.classList.toggle('dark',d);h.classList.toggle('light',!d);}catch(e){document.documentElement.classList.add('${THEME_DEFAULT}');}})();`;

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  srcDir: 'src/',

  runtimeConfig: {
    apiBase: '',
  },

  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      script: [
        {
          tagPosition: 'head',
          children: antiFlashScript,
        },
      ],
    },
  },

  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/image',
    '@nuxt/test-utils/module',
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

  fonts: {
    families: [
      {
        name: 'Manrope',
        provider: 'google',
        weights: [400, 500],
      },
    ],
  },

  i18n: {
    defaultLocale: 'fr',
    locales: [
      { code: 'fr', name: 'Français', file: 'fr-FR.json' },
      { code: 'en', name: 'English', file: 'en-US.json' },
    ],
  },

  $development: {
    vite: {
      server: {
        allowedHosts: ['beehive-vault.fr'],
      },
    },
  },

  routeRules: {
    '/**': {
      headers: {
        'Strict-Transport-Security':
          'max-age=63072000; includeSubDomains; preload',
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Permissions-Policy':
          'camera=(), microphone=(), geolocation=(), interest-cohort=()',
        'Cross-Origin-Opener-Policy': 'same-origin',
        'Cross-Origin-Resource-Policy': 'same-origin',
      },
    },
  },
});
