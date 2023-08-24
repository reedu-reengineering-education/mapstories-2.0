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
        black: {
          DEFAULT: '#38383a',
        },
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
          DEFAULT: 'var(--active-color-background)',
          border: 'var(--active-color-border)',
        },
        matisse: {
          DEFAULT: '#1B6AAA',
          50: '#8FC3ED',
          100: '#7EBAEA',
          200: '#5BA7E5',
          300: '#3794DF',
          400: '#2180CD',
          500: '#1B6AAA',
          600: '#134C7A',
          700: '#0C2E49',
          800: '#040F19',
          900: '#000000',
        },
        'button-color': 'var(--button-color)',
      },
    },
  },
  plugins: [],
}
