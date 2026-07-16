import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#7F77DD",
          hover: "#534AB7",
          light: "#EEEDFE",
          border: "#AFA9EC",
        },
        teal: {
          DEFAULT: "#1D9E75",
          light: "#E1F5EE",
        },
        amber: {
          DEFAULT: "#BA7517",
          light: "#FAEEDA",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "8px",
        card: "12px",
      },
    },
  },
  plugins: []
};

export default config;
