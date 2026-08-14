/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        sage: {
          50: "#EEF3EF",
          100: "#DCE7DE",
          400: "#8AAA8F",
          500: "#6B8F71",
          600: "#597960",
          700: "#4A6550",
        },
        deepblue: {
          50: "#E8ECF1",
          400: "#3A5A82",
          500: "#1F3A5F",
          600: "#17293F",
          900: "#101E33",
        },
      },
    },
  },
  plugins: [],
};