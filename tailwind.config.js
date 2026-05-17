/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#edf8f2',
          100: '#d8f0e1',
          200: '#b4e2c3',
          300: '#7ec79c',
          400: '#4aa76f',
          500: '#2d814c',
          600: '#236540',
          700: '#1b5134',
          800: '#163e29',
          900: '#112f20'
        },
        earth: {
          50: '#fbf4ed',
          100: '#f5e4d0',
          200: '#e7c7a9',
          300: '#d7a67d',
          400: '#c4784f',
          500: '#a85c39',
          600: '#924d2f',
          700: '#7b4128',
          800: '#663623',
          900: '#51301f'
        }
      },
      boxShadow: {
        soft: '0 20px 50px rgba(15, 23, 42, 0.12)'
      }
    }
  },
  plugins: []
};
