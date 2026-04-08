/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        panel: "#0f172a",
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(148, 163, 184, 0.15), 0 8px 24px rgba(2, 6, 23, 0.55)",
      },
    },
  },
  plugins: [],
};
