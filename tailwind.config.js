const { fontFamily } = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  purge: [
    './src/app/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/lib/**/*.{js,ts,jsx,tsx}',
  ],
  // content: [
  //   './app/**/*.{js,ts,jsx,tsx}',
  //   './components/**/*.{js,ts,jsx,tsx}',
  //   './lib/**/*.{js,ts,jsx,tsx}',
  // ],
  theme: {
    container: {
      center: true,
      padding: '1.5rem',
      screens: {
        '2xl': '1440px',
      },
    },
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', ...fontFamily.sans],
      },
      colors: {
        primary: {
          DEFAULT: '#005b79',
          light: '#f1f5fd',
        },
        secondary: {
          DEFAULT: '#aab315',
        },
        hover: {
          DEFAULT: '#E0F2E8',
        },
        active: {
          DEFAULT: '#ede3fd',
        },
      },
    },
  },
  plugins: [],
}
