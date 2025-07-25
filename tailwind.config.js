/** @type {import('tailwindcss').Config} */
export default {
  content: {
    files: [
      './src/assets/css/**/*.css',
      './src/components/**/*.vue',
      './src/layouts/**/*.vue',
      './src/pages/**/*.vue',
    ],
  },
  theme: {
    extend: {
      colors: {
        'golden-yellow': {
          100: '#FFF9E6',
          200: '#FFEDBF',
          300: '#FFE199',
          400: '#FFD272',
          500: '#EAB64E',
          600: '#C8963D',
          700: '#A3782F',
          800: '#7F5B23',
          900: '#5C4018',
        },
        'deep-blue': {
          100: '#E9F3F7',
          200: '#C6DFE8',
          300: '#A3CAD8',
          400: '#87B4E7',
          500: '#4A8AA0',
          600: '#37414D',
          // 600: '#3B7182',
          700: '#2D5865',
          800: '#1F3F48',
          900: '#11262B',
        },
        'dark-gray': {
          100: '#EAEAEA',
          200: '#D4D4D4',
          300: '#BEBEBE',
          400: '#A0A0A0',
          450: '#374151',
          500: '#212121',
          600: '#1A1A1A',
          700: '#161616',
          800: '#121212',
          900: '#0E0E0E',
        },
        'light-gray': {
          100: '#FCFCFC',
          200: '#F8F8F8',
          300: '#F3F3F3',
          400: '#ECECEC',
          500: '#D9D9D9',
          600: '#C0C0C0',
          700: '#A8A8A8',
          800: '#909090',
          900: '#787878',
        },
        'warm-white': {
          100: '#FFFFFF',
          200: '#FBFBFB',
          300: '#F5F5F5',
          400: '#EFEFEF',
          500: '#E8E8E8',
        },
        'mint-green': {
          100: '#F0FDF4',
          200: '#DCFCE7',
          300: '#BBF7D0',
          400: '#86EFAC',
          500: '#22C55E',
          600: '#16A34A',
          700: '#15803D',
          800: '#166534',
          900: '#14532D',
        },
        'filter-orange': {
          100: '#FFF7ED',
          200: '#FFEDD5',
          300: '#FED7AA',
          400: '#FDBA74',
          500: '#F97316',
          600: '#EA580C',
          700: '#C2410C',
          800: '#9A3412',
          900: '#7C2D12',
        },
        'filter-red': {
          100: '#FEF2F2',
          200: '#FECACA',
          300: '#FCA5A5',
          400: '#F87171',
          500: '#EF4444',
          600: '#DC2626',
          700: '#B91C1C',
          800: '#991B1B',
          900: '#7F1D1D',
        },
        // Couleurs utilitaires standardisées
        background: {
          primary: '#1A1A1A',
          secondary: '#161616',
          card: '#212121',
          dark: '#1A1A1A', // Rétrocompatibilité
        },
        text: {
          primary: '#F5F5F5',
          secondary: '#A0A0A0',
          dark: '#0E0E0E', // Rétrocompatibilité
        },
        border: {
          primary: '#292929',
          secondary: '#374151',
          dark: '#292929', // Rétrocompatibilité
        },
        // Couleurs d'état sémantiques
        status: {
          success: '#22C55E',
          warning: '#F97316',
          error: '#EF4444',
          info: '#4A8AA0',
        },
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        nunito: ['Nunito', 'sans-serif'],
        space: ['Space Mono', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
