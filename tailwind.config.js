import { nextui } from "@nextui-org/theme";
const flattenColorPalette =
  require("tailwindcss/lib/util/flattenColorPalette").default;

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      sans: ["Noto Sans Thai", "sans-serif"],
      prompt: ["Prompt", "serif"],
    },
    extend: {
      backgroundImage: {
        "custom-gradient":
          "linear-gradient(135deg, #FFFFFF 27%, #064469 130%);",
      },
      colors: {
        error: "#F44336",
        danger: "#F44336",
        "custom-redlogin": "#E23B3E",
        "custom-red": "#560000",
        "custom-redlogin-effect": "#F7BACE",
        "custom-blue": "#85D1EF",
        "custom-purple": "#6C4AC3",
        "custom-light-blue": "#89F5FF",
        "custom-menu": "#5891AC",
        "custom-menu-hover": "#E7F3F6",
        primary: "#006FEE",
        secondary: "#AE7EDE",
      },
      animation: {
        zoomNetflix: "zoomNetflix 1.5s ease-in-out forwards",
        float: "float 3s ease-in-out infinite",
        "slide-right": "slideRight 0.5s ease-in-out",
        "slide-left": "slideLeft 0.5s ease-in-out",
      },
      keyframes: {
        animation: {
          newsBlink: 'newsBlink 1s infinite',
        },
        newsBlink: {
          '0%, 100%': { backgroundColor: 'black' },
          '50%': { backgroundColor: 'red' },
        },
        zoomNetflix: {
          "0%": {
            transform: "scale(0.8)",
            opacity: "0",
          },
          "100%": {
            transform: "scale(1.05)",
            opacity: "1",
          },
          "150%": {
            transform: "scale(1.2)",
            opacity: "0",
          },
        },
        float: {
          "0%": {
            transform: "translatey(0px)",
          },
          "50%": {
            transform: "translatey(-15px)",
          },
          "100%": {
            transform: "translatey(0px)",
          },
        },
        slideRight: {
          "0%": {
            transform: "translateX(-100%)",
          },
          "100%": {
            transform: "translateX(0)",
          },
        },
        slideLeft: {
          "0%": {
            transform: "translateX(100%)",
          },
          "100%": {
            transform: "translateX(0)",
          },
        },
        zoomIn: {
          "0%": {
            transform: "scale(1)",
          },
          "100%": {
            transform: "scale(1.1)",
          },
        },
        slideOut: {
          "0%": {
            transform: "translateX(0)",
          },
          "100%": {
            transform: "translateX(-100%)",
          },
        },
        slideIn: {
          "0%": {
            transform: "translateX(-100%)",
          },
          "100%": {
            transform: "translateX(0)",
          },
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  darkMode: ["class", "class"],
  plugins: [
    require("@tailwindcss/typography"),
    addVariablesForColors,
    nextui({
      // addCommonColors: true,
      themes: {
        light: {
          // ...
          colors: {},
        },
        dark: {
          // ...
          colors: {},
        },
      },
    }),
    require("tailwindcss-animate"),
  ],
};

function addVariablesForColors({ addBase, theme }) {
  const allColors = flattenColorPalette(theme("colors"));
  const newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
  );

  addBase({
    ":root": newVars,
  });
}
