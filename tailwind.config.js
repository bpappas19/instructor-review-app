/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#3b82f6", 
        "background-light": "#ffffff",
        "background-dark": "#0A0A0A",
        "text-light-primary": "#1f2937",
        "text-light-secondary": "#4b5563",
        "text-dark-primary": "#F9FAFB",
        "text-dark-secondary": "#9CA3AF",
        "border-light": "#e5e7eb",
        "border-dark": "#374151",
        "surface-light": "#f3f4f6",
        "surface-dark": "#1F2937",
      },
      fontFamily: {
        display: ["Lexend", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        full: "9999px",
      },
    },
  },
  plugins: [],
}

