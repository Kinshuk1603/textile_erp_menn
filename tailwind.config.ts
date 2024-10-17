import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/login/**/*.{js,ts,jsx,tsx,mdx}", // If you have any components in login
    "./src/style/**/*.{js,ts,jsx,tsx,mdx}", // If you have any components in style
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)", // Ensure these CSS variables are defined
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
};

export default config;
