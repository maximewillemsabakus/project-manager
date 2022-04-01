const colors = require('tailwindcss/colors')

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        stone: "#101218"
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
