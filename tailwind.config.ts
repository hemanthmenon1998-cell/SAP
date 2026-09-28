import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: { extend: { colors: { brand: { 50: "#eef4ff", 100: "#dbe7ff", 500: "#2f5fd0", 600: "#2449a8", 700: "#1c3a86" } } } },
  plugins: [],
};
export default config;
