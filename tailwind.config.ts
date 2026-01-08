import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        "brand-blue": "#1f4ba5",
        "brand-slate": "#0f172a"
      }
    }
  },
  plugins: []
};

export default config;
