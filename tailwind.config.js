/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ['./src/**/*.html'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Nunito', 'sans-serif'],
      },
      fontSize: {
        base: '.875rem',
        sm: '.75rem',
        lg: '1.125rem',
        xl: '1.25rem',
      },
      fontWeight: {
        normal: 400,
        bold: 700,
        light: 300,
      },
      colors: {
        primary: 'var(--primary-color)',
        primaryDark: 'var(--primary-dark-color)',
        primaryDarker: 'var(--primary-darker-color)',
        secondary: 'var(--secondary-color)',
        secondaryDark: 'var(--secondary-dark-color)',
        secondaryHover: 'var(--secondary-hover-color)',
        extraLightSecondary: 'var(--extra-light-secondary-color)',
        accent: 'var(--accent-color)',
        warn: 'var(--warn-color)',
        danger: 'var(--danger-color)',
        tertiary: 'var(--tertiary-color)',
        text: 'var(--text-color)',
        buttonText: 'var(--button-text-color)',
        lightText: 'var(--light-text-color)',
        inputText: 'var(--input-text-color)',
        lightGrey: 'var(--light-grey-color)',
      },
    },
  },
  plugins: [],
};
