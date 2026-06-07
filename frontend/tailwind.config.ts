import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Semantic tokens driven by CSS variables (see globals.css).
        background: "hsl(var(--background) / <alpha-value>)",
        foreground: "hsl(var(--foreground) / <alpha-value>)",
        card: "hsl(var(--card) / <alpha-value>)",
        muted: "hsl(var(--muted) / <alpha-value>)",
        "muted-foreground": "hsl(var(--muted-foreground) / <alpha-value>)",
        border: "hsl(var(--border) / <alpha-value>)",
        primary: {
          DEFAULT: "hsl(var(--primary) / <alpha-value>)",
          foreground: "hsl(var(--primary-foreground) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "hsl(var(--accent) / <alpha-value>)",
          foreground: "hsl(var(--accent-foreground) / <alpha-value>)",
        },
        warning: "hsl(var(--warning) / <alpha-value>)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 4px)",
        sm: "calc(var(--radius) - 8px)",
      },
      maxWidth: {
        container: "1200px",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-14px)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.5", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.06)" },
        },
        beam: {
          "0%, 100%": { opacity: "0.7", transform: "scaleY(1)" },
          "50%": { opacity: "1", transform: "scaleY(1.08)" },
        },
        comet: {
          "0%, 72%": { opacity: "0", transform: "translate3d(0, 0, 0) rotate(-24deg)" },
          "78%": { opacity: "0.9" },
          "100%": { opacity: "0", transform: "translate3d(-420px, 170px, 0) rotate(-24deg)" },
        },
        "data-rain": {
          "0%": { transform: "translate3d(0, -4%, 0)" },
          "100%": { transform: "translate3d(0, 8%, 0)" },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        scanline: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(400%)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        shine: {
          "0%": { "background-position": "0% 0%" },
          "50%": { "background-position": "100% 100%" },
          to: { "background-position": "0% 0%" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s ease-out forwards",
        float: "float 7s ease-in-out infinite",
        "pulse-glow": "pulse-glow 6s ease-in-out infinite",
        beam: "beam 5s ease-in-out infinite",
        comet: "comet 13s ease-in-out infinite",
        "data-rain": "data-rain 18s linear infinite alternate",
        scanline: "scanline 4s linear infinite",
        shimmer: "shimmer 2.5s ease-in-out infinite",
        shine: "shine var(--duration) infinite linear",
      },
      backgroundImage: {
        "accent-gradient":
          "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--accent)) 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
