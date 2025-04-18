/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        login: "rgb(255, 245, 157)",
        register: "rgb(144, 202, 249)",
        primary: "#251e3e",
        secondary: "#5b5d8d",
        navbg: "rgba(0, 0, 0, .2)",
        dodger: "#1e90ff",
      },
      fontFamily: {
        heading: "cursive",
      },
      screens: {
        mobile: { max: "550px" },
      },
    },
  },
  plugins: [],
} 