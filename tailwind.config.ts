
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#FF6056", // Vibrant red from stndrd app
          light: "#FF8C8C",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#2D3142", // Deep navy from fitness blender
          foreground: "#FFFFFF",
        },
        accent: {
          DEFAULT: "#4DA1A9", // Teal color from stndrd app
          foreground: "#FFFFFF",
        },
        neutral: {
          DEFAULT: "#8E9196",
          foreground: "#FFFFFF",
        },
        muted: {
          DEFAULT: "#F5F5F7", // Light gray background
          foreground: "#64748b",
        },
        card: {
          DEFAULT: "#FFFFFF",
          foreground: "#2D3142",
        },
      },
      keyframes: {
        "slide-up": {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        "slide-up": "slide-up 0.3s ease-out",
        "fade-in": "fade-in 0.4s ease-out",
      },
      borderRadius: {
        "xl": "1rem",
        "2xl": "1.5rem",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
