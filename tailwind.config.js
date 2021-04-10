const colors = require("tailwindcss/colors");
module.exports = {
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        blueGray: colors.blueGray,
        primary: "#1a365c",
        "primary-light": "#407cca",
        "primary-dark": "#2867b9",
        secondary: "#d9780b",
        "secondary-dark": "#d97809",
      },
    },
  },
  variants: {
    extend: {
      backgroundColor: ["odd"],
      opacity: ["disabled"],
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
