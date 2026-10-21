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
        primary: {
          DEFAULT: "#b20019",
          hover: "#880010",
          bright: "#dc2626",
          soft: "#fef2f2",
          border: "#fca5a5",
        },
        surface: {
          bg: "#ffffff",
          subtle: "#f8fafc",
          container: "#f1f5f9",
        },
        slate: {
          850: "#152033",
          950: "#0b121e",
        },
        border: {
          clean: "#e2e8f0",
          dark: "#1e293b",
        },
      },
      fontFamily: {
        headline: ["var(--font-space-grotesk)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
      boxShadow: {
        hard: "4px 4px 0px #1e293b",
        "hard-red": "4px 4px 0px #b20019",
      },
    },
  },
  plugins: [],
};

export default config;
