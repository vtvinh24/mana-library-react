/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./index.html"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: "#FF5500",
        secondary: "#00AAFF",
      },
      fontFamily: {
        mono: ["JetBrains Mono", "monospace"],
        sans: ["Inter", "sans-serif"],
        sansSerif: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
