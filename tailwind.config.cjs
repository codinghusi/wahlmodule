/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: true,
    darkTheme: 'autumn'
  },
  plugins: [require("@tailwindcss/typography"), require('daisyui')],
}
