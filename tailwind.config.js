/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic":
                    "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
            },
            fontFamily: {
                mono: ["Victor Mono", "monospace"],
                farro: ["Farro", "sans-serif"],
            },
            boxShadow: {
                "neo-brutalism-xs": "2px 2px 0px black",
                "neo-brutalism-sm": "5px 5px 0px black",
                "neo-brutalism-lg": "12px 12px 0px black",
            },
            screens: {
                "3xl": "1792px ",
                "4xl": "2048px",
            },
        },
    },
    plugins: [require("tailwind-scrollbar")],
};
