/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: "#2251f5", 50: "#e8edfe", 100: "#c5d2fc", 200: "#9eb4fa", 300: "#7796f7", 400: "#5a7ef5", 500: "#2251f5", 600: "#1a3fd6", 700: "#132fb7", 800: "#0c2098", 900: "#061479" },
      },
    },
  },
  plugins: [],
};
