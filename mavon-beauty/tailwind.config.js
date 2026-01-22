/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./Components/**/*.{js,ts,jsx,tsx}",
    "./Layout/**/*.{js,ts,jsx,tsx}",
    "./Sections/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      height: {
        "100": "25rem",      // 400px
        "112.5": "28.125rem", // 450px
        "125": "31.25rem",   // 500px
        "225": "56.25rem",   // 900px
      },
      spacing: {
        "7.5": "1.875rem",   // 30px
      },
    },
  },
  plugins: [],
};
