/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
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
        // ─── Theme-aware semantic colors (switch via .dark class) ───
        // CSS variables hold RGB channels; rgb() + <alpha-value> enables
        // opacity modifiers like bg-theme-accent-primary/25
        'theme-bg': {
          primary: 'rgb(var(--color-bg-primary) / <alpha-value>)',
          secondary: 'rgb(var(--color-bg-secondary) / <alpha-value>)',
          card: 'rgb(var(--color-bg-card) / <alpha-value>)',
          elevated: 'rgb(var(--color-bg-elevated) / <alpha-value>)',
          'elevated-strong':
            'rgb(var(--color-bg-elevated-strong) / <alpha-value>)',
        },
        'theme-text': {
          primary: 'rgb(var(--color-text-primary) / <alpha-value>)',
          secondary: 'rgb(var(--color-text-secondary) / <alpha-value>)',
          muted: 'rgb(var(--color-text-muted) / <alpha-value>)',
          'on-accent-primary':
            'rgb(var(--color-text-on-accent-primary) / <alpha-value>)',
          'on-accent-secondary':
            'rgb(var(--color-text-on-accent-secondary) / <alpha-value>)',
          'on-danger': 'rgb(var(--color-text-on-danger) / <alpha-value>)',
        },
        'theme-border': {
          primary: 'rgb(var(--color-border-primary) / <alpha-value>)',
          secondary: 'rgb(var(--color-border-secondary) / <alpha-value>)',
        },
        'theme-status': {
          success: 'rgb(var(--color-status-success) / <alpha-value>)',
          'success-strong':
            'rgb(var(--color-status-success-strong) / <alpha-value>)',
          warning: 'rgb(var(--color-status-warning) / <alpha-value>)',
          'warning-strong':
            'rgb(var(--color-status-warning-strong) / <alpha-value>)',
          error: 'rgb(var(--color-status-error) / <alpha-value>)',
          'error-strong':
            'rgb(var(--color-status-error-strong) / <alpha-value>)',
          info: 'rgb(var(--color-status-info) / <alpha-value>)',
          'info-strong': 'rgb(var(--color-status-info-strong) / <alpha-value>)',
        },
        'theme-accent': {
          primary: 'rgb(var(--color-accent-primary) / <alpha-value>)',
          'primary-strong':
            'rgb(var(--color-accent-primary-strong) / <alpha-value>)',
          secondary: 'rgb(var(--color-accent-secondary) / <alpha-value>)',
          'secondary-strong':
            'rgb(var(--color-accent-secondary-strong) / <alpha-value>)',
        },
        'theme-sidebar': {
          DEFAULT: 'rgb(var(--color-sidebar-bg) / <alpha-value>)',
          selected: 'rgb(var(--color-sidebar-selected) / <alpha-value>)',
          text: 'rgb(var(--color-sidebar-text) / <alpha-value>)',
          muted: 'rgb(var(--color-sidebar-muted) / <alpha-value>)',
        },
        'theme-overlay': 'rgb(var(--color-overlay) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['Manrope', 'sans-serif'],
        manrope: ['Manrope', 'sans-serif'],
        // Temporary aliases keep legacy components on Manrope until they are migrated.
        poppins: ['Manrope', 'sans-serif'],
        nunito: ['Manrope', 'sans-serif'],
        space: ['Manrope', 'sans-serif'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.875rem' }],
      },
      transitionDuration: {
        250: '250ms',
      },
      borderRadius: {
        control: 'var(--radius-control)',
        surface: 'var(--radius-surface)',
      },
      boxShadow: {
        surface: 'var(--shadow-surface)',
      },
    },
  },
  plugins: [],
};
