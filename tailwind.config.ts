import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#faf7f2",
        amber: {
          DEFAULT: "#d4a843",
          light: "#e8c06a",
          dark: "#b8922a",
        },
        blue: {
          DEFAULT: "#1a3a5c",
          light: "#2a5a8c",
          dark: "#0f2438",
        },
        charcoal: "#2c2c2c",
      },
      fontFamily: {
        cairo: ["Cairo", "sans-serif"],
        playfair: ["Playfair Display", "serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};

export default config;
