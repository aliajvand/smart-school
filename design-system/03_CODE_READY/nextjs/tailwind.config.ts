import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans-fa)", "Vazirmatn", "IRANSansX", "sans-serif"],
        mono: ["var(--font-mono-ltr)", "JetBrains Mono", "monospace"],
      },
      colors: {
        canvas: "rgb(var(--color-canvas-rgb) / <alpha-value>)",
        surface: "rgb(var(--color-surface-rgb) / <alpha-value>)",
        "surface-raised": "rgb(var(--color-surface-raised-rgb) / <alpha-value>)",
        "surface-elevated": "rgb(var(--color-surface-elevated-rgb) / <alpha-value>)",
        border: "rgb(var(--color-border-rgb) / <alpha-value>)",
        "border-strong": "rgb(var(--color-border-strong-rgb) / <alpha-value>)",
        "text-primary": "rgb(var(--color-text-primary-rgb) / <alpha-value>)",
        "text-secondary": "rgb(var(--color-text-secondary-rgb) / <alpha-value>)",
        "text-muted": "rgb(var(--color-text-muted-rgb) / <alpha-value>)",
        "text-disabled": "rgb(var(--color-text-disabled-rgb) / <alpha-value>)",
        ai: {
          violet: "rgb(var(--color-ai-violet-rgb) / <alpha-value>)",
          indigo: "rgb(var(--color-ai-indigo-rgb) / <alpha-value>)",
          cyan: "rgb(var(--color-ai-cyan-rgb) / <alpha-value>)",
        },
        success: "rgb(var(--color-success-rgb) / <alpha-value>)",
        warning: "rgb(var(--color-warning-rgb) / <alpha-value>)",
        danger: "rgb(var(--color-danger-rgb) / <alpha-value>)",
        math: "rgb(var(--color-math-rgb) / <alpha-value>)",
        focus: "rgb(var(--color-focus-rgb) / <alpha-value>)",
      },
      borderRadius: {
        xs: "var(--radius-xs)",
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        panel: "var(--radius-xl)",
        "2xl": "var(--radius-2xl)",
        pill: "var(--radius-pill)",
      },
      boxShadow: {
        panel: "var(--shadow-panel)",
        ai: "var(--shadow-ai)",
        success: "var(--shadow-success)",
        warning: "var(--shadow-warning)",
        danger: "var(--shadow-danger)",
      },
      backdropBlur: {
        glass: "var(--blur-glass)",
      },
      transitionDuration: {
        fast: "var(--motion-fast)",
        base: "var(--motion-base)",
        slow: "var(--motion-slow)",
      },
      transitionTimingFunction: {
        standard: "var(--ease-standard)",
        emphasized: "var(--ease-emphasized)",
      },
      keyframes: {
        "agent-pulse": {
          "0%, 100%": { opacity: "0.72", transform: "scale(0.985)" },
          "50%": { opacity: "1", transform: "scale(1)" },
        },
        "aura-sweep": {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "200% 50%" },
        },
      },
      animation: {
        "agent-pulse": "agent-pulse 1.8s ease-in-out infinite",
        "aura-sweep": "aura-sweep 4s linear infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
