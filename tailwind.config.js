/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors');

module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        grayDarker: 'var(--color-bg)',
        grayLight: 'var(--color-text)',
        blueLight: 'var(--color-primary)',
        greenLight: 'var(--color-secondary)',
        teal: 'var(--color-accent)',
      },
    },
  },
  plugins: [],
}
