module.exports = {
  purge: ["./**/*.tsx"],
  theme: {
    fontFamily: {
      sans: ["Inter", "sans-serif"],
      cursive: ["Nanum Pen Script"],
    },
    extend: {
      colors: {
        twitter: "#00acee",
        grey: {
          100: "#fbfbfb",
          200: "#f3f3f3",
          300: "#ececec",
          400: "#dfdfdf",
          600: "#616161",
        },
      },
      borderRadius: {
        "10": "10px",
        xl: "1rem",
        "2xl": "1.5rem",
      },
      boxShadow: {
        ask: "0px 3px 15px 0px rgba(0,0,0,0.15)",
      },
    },
    variants: {
      backgroundColor: ["responsive", "hover", "focus", "active"],
      scale: ["hover", "focus", "active"],
    },
  },
};
