/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  // darkMode: "class", // enable dark mode

  theme: {
    extend: {
      colors: {
        "primary-light": "#F5F5F5",
        "primary-dark": "#232B2B",
        accent: "#D07A25",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontFamily: {
        mono: ["Victor Mono", "monospace"],
        farro: ["Farro", "sans-serif"],
        "space-mono": ["Space Mono", "monospace"],
      },
      boxShadow: {
        "home-shadow": "-4px 4px 0px 0px #D07A25",
        "home-shadow-lg": "-12px 12px 0px 0px #D07A25",
        "home-shadow-lg-reverse": "12px 12px 0px 0px #D07A25",
        "neo-brutalism-xs": "2px 2px 0px black",
        "neo-brutalism-sm": "5px 5px 0px black",
        "neo-brutalism-lg": "12px 12px 0px black",
        "inside-neo-brutalism-xs":
          "inset 0px 8px 15px -6px rgba(50, 50, 93, 0.25), inset 0px 4px 9px -9px rgba(0, 0, 0, 0.3)",
        "inner-2": "inset 0 6px 12px 0 rgb(0 0 0 / 0.05);",
      },
      screens: {
        "3xl": "1792px ",
        "4xl": "2048px",
      },
    },
  },
  plugins: [require("tailwind-scrollbar")],
};
