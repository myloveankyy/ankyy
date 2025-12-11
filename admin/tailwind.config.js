/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        glass: "rgba(255, 255, 255, 0.7)",
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'), // Optional: for nice blog preview
  ],
}