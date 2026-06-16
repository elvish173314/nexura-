import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        nexora: {
          50: '#eef2ff', 100: '#e0e7ff', 300: '#a5b4fc',
          500: '#6366f1', 600: '#4f46e5', 700: '#4338ca', 900: '#312e81'
        }
      },
      fontFamily: { sans: ['var(--font-sans)', 'system-ui', 'sans-serif'] },
      backdropBlur: { xs: '2px' },
      keyframes: {
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-12px)' } },
        shimmer: { '100%': { transform: 'translateX(100%)' } }
      },
      animation: { float: 'float 6s ease-in-out infinite' }
    }
  },
  plugins: []
};
export default config;
