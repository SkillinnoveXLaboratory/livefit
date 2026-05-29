/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark': '#0a0a0a',
        'dark-secondary': '#1a1a1a',
        'light': '#f7f7f7',
        'accent': '#e0e0e0',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'hero': ['4rem', { lineHeight: '1.2' }],
        'hero-mobile': ['2rem', { lineHeight: '1.2' }],
        'section': ['3rem', { lineHeight: '1.3' }],
        'body': ['1rem', { lineHeight: '1.6' }],
      },
      spacing: {
        '128': '32rem',
      },
    },
  },
  plugins: [],
}
