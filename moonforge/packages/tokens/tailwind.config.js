/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#00f0ff', // Portal cyan
          dark: '#00c0cc',
          light: '#33f3ff',
        },
        secondary: {
          DEFAULT: '#1a1a2e',
          dark: '#0f0f1a',
          light: '#2c2c4a',
        },
        accent: {
          DEFAULT: '#9c27b0',
          dark: '#7b1fa2',
          light: '#ba68c8',
        },
      },
      boxShadow: {
        glow: '0 0 15px rgba(0, 240, 255, 0.5)',
        'glow-md': '0 0 25px rgba(0, 240, 255, 0.6)',
        'glow-lg': '0 0 35px rgba(0, 240, 255, 0.7)',
      },
      borderWidth: {
        '3': '3px',
        '5': '5px',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
    },
  },
  plugins: [],
}
