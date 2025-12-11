/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-black': '#050505', // Almost pure black, very deep
        'brand-grey': '#888888',  // A perfect mid-tone grey
        'brand-silver': '#E5E5E5', // Very light grey for subtle lines
        'brand-teal': '#00F5C4',   // Electric teal for accents/buttons
      },
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
        mono: ['Space Mono', ...defaultTheme.fontFamily.mono],
      },
      animation: {
        'bounce-subtle': 'bounce-subtle 2s ease-in-out infinite',
      },
      keyframes: {
        'bounce-subtle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(10px)' },
        }
      }
    },
  },
  plugins: [],
}