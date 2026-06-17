import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: "#2563eb",
        ink: "#101828",
        muted: "#667085",
        soft: "#f6f8fb",
        line: "#e6ebf2"
      },
      boxShadow: {
        panel: "0 10px 28px rgba(16, 24, 40, 0.06)"
      }
    }
  },
  plugins: []
};

export default config;
