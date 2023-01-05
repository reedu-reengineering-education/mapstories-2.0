/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#005b79',
          light: '#f1f5fd',
        },
        secondary: {
          DEFAULT: '#aab315',
        },
      },
    },
  },
  plugins: [],
}
