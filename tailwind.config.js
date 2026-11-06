/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Dark "Carbon" palette sampled from the wireframes in docs/wireframes.
        canvas: '#161616', // page background
        nav: '#0f0f0f',    // top navigation bar
        layer: '#262626',  // cards and panels
        layer2: '#393939', // inputs and raised elements
        line: '#393939',   // dividers
        line2: '#8d8d8d',  // input borders
        fg: '#f4f4f4',     // primary text
        fg2: '#c6c6c6',    // secondary text
        fg3: '#a8a8a8',    // helper text
        link: '#78a9ff',   // links and active accents
        brand: { DEFAULT: '#0f62fe', hover: '#0353e9', active: '#002d9c' },
        ok: '#42be65',
        danger: '#fa4d56',
        warn: '#f1c21b',
      },
      fontFamily: {
        sans: ['"IBM Plex Sans"', 'Inter', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
