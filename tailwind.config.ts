import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        almarai: ["Almarai", "sans-serif"],
      },
      colors: {
        primary: "#000000",
        secondary: "#ffffff",
        accent: "#c8a96e",
        gray: {
          50: "#f9f9f9",
          100: "#f3f3f3",
          200: "#e8e8e8",
          300: "#d1d1d1",
          400: "#a0a0a0",
          500: "#717171",
          600: "#4a4a4a",
          700: "#333333",
          800: "#1e1e1e",
          900: "#111111",
        },
      },
    },
  },
  plugins: [],
};

export default config;
