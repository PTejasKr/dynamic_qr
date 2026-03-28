/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "var(--primary)",
        "glass-bg": "var(--glass-bg)",
        "glass-border": "var(--glass-border)",
      },
      animation: {
        "fade-in": "fadeIn 0.6s cubic-bezier(0.25, 0.8, 0.25, 1) forwards",
        "pulse-glow": "pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "1", filter: "brightness(1) blur(0px)" },
          "50%": { opacity: "0.8", filter: "brightness(1.5) blur(2px)" },
        },
      },
    },
  },
  plugins: [],
};
