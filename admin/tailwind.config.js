/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      gridTemplateColumns:{
        'auto':'repeat(auto-fill, minmax(200px, 1fr))'
      },
      backgroundImage:{
        'primary':'linear-gradient(to bottom right, #1e3a8a, #6b21a8, #db2777)'
      }
    },
  },
  plugins: [],
}