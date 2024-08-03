/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.html',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Nunito', 'sans-serif'],
      },
      fontWeight: {
        normal: 400,
        bold: 700,
        light: 300,
      },
      colors: {
        primary: '#43a047',
        accent: '#ffc107',
        warn: '#e64a19',
      },
    },
  },
  plugins: [],
}

