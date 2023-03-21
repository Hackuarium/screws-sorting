/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [
    require('@zakodium/tailwind-config')({
      colors: {},
    }),
  ],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
};
