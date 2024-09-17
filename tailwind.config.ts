import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class', // Enables dark mode through a 'dark' class
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Add any custom colors here if needed
      },
    },
  },
  plugins: [],
};

export default config;
