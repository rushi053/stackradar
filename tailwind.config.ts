import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0a0a0b",
        card: "#141416",
        primary: "#fafafa",
        secondary: "#a1a1aa",
        accent: "#3b82f6",
        accentGreen: "#10b981",
        accentPurple: "#8b5cf6",
        border: "#27272a",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-space-grotesk)", "monospace"],
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "fade-in-up": "fadeInUp 0.5s ease-out",
        "slide-in": "slideIn 0.3s ease-out",
        "scale-in": "scaleIn 0.2s ease-out",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
        "radar-sweep": "radarSweep 2s ease-in-out infinite",
        "gradient-shift": "gradientShift 8s ease infinite",
        "float": "float 3s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeInUp: {
          "0%": { 
            opacity: "0",
            transform: "translateY(20px)",
          },
          "100%": { 
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        slideIn: {
          "0%": { 
            opacity: "0",
            transform: "translateX(-10px)",
          },
          "100%": { 
            opacity: "1",
            transform: "translateX(0)",
          },
        },
        scaleIn: {
          "0%": { 
            opacity: "0",
            transform: "scale(0.95)",
          },
          "100%": { 
            opacity: "1",
            transform: "scale(1)",
          },
        },
        pulseGlow: {
          "0%, 100%": { 
            boxShadow: "0 0 20px rgba(59, 130, 246, 0.3)",
          },
          "50%": { 
            boxShadow: "0 0 30px rgba(59, 130, 246, 0.5)",
          },
        },
        radarSweep: {
          "0%": { 
            transform: "rotate(0deg)",
            opacity: "1",
          },
          "100%": { 
            transform: "rotate(360deg)",
            opacity: "1",
          },
        },
        gradientShift: {
          "0%, 100%": { 
            backgroundPosition: "0% 50%",
          },
          "50%": { 
            backgroundPosition: "100% 50%",
          },
        },
        float: {
          "0%, 100%": { 
            transform: "translateY(0px)",
          },
          "50%": { 
            transform: "translateY(-10px)",
          },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      boxShadow: {
        "glow-sm": "0 0 15px rgba(59, 130, 246, 0.2)",
        "glow-md": "0 0 25px rgba(59, 130, 246, 0.3)",
        "glow-lg": "0 0 35px rgba(59, 130, 246, 0.4)",
        "glow-purple": "0 0 25px rgba(139, 92, 246, 0.3)",
      },
    },
  },
  plugins: [],
} satisfies Config;
