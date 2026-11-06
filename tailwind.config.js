/** @type {import('tailwindcss').Config} */
// Colours resolve to CSS variables so the whole UI can switch between dark and light
// themes at runtime (see src/index.css). `<alpha-value>` keeps opacity utilities working.
const v = (name) => `rgb(var(--c-${name}) / <alpha-value>)`;

export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        canvas: v('canvas'),
        nav: v('nav'),
        layer: v('layer'),
        layer2: v('layer2'),
        line: v('line'),
        line2: v('line2'),
        fg: v('fg'),
        fg2: v('fg2'),
        fg3: v('fg3'),
        link: v('link'),
        brand: { DEFAULT: '#0f62fe', hover: '#0353e9', active: '#002d9c' },
        ok: '#24a148',
        danger: '#da1e28',
        warn: '#f1c21b',
      },
      fontFamily: {
        sans: ['"IBM Plex Sans"', 'Inter', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
      },
      keyframes: {
        shimmer: { '100%': { transform: 'translateX(100%)' } },
        aurora: {
          '0%, 100%': { transform: 'translate3d(0,0,0) scale(1)' },
          '50%': { transform: 'translate3d(4%, -6%, 0) scale(1.15)' },
        },
        spin360: { to: { transform: 'rotate(360deg)' } },
      },
      animation: {
        shimmer: 'shimmer 1.6s infinite',
        aurora: 'aurora 14s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
