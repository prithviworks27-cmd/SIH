/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        /* Every token here reads a CSS custom property defined in
           styles/index.css — light-mode (":root") values are the original
           editorial-minimalism palette, dark-mode (".dark") values are the
           SIH_Website_Palette (RealtimeColors: Text #F0F1DF, Background
           #181A0A, Primary #D2D69A, Secondary #4B742F, Accent #6BBC5C).
           The rgb(var(...) / <alpha-value>) form keeps opacity modifiers
           (e.g. bg-canvas/50) working in both modes. */
        canvas: "rgb(var(--color-canvas) / <alpha-value>)",
        bone: "rgb(var(--color-bone) / <alpha-value>)",
        ink: "rgb(var(--color-ink) / <alpha-value>)",
        /* Hover state for solid bg-ink buttons/pills. */
        "ink-hover": "rgb(var(--color-ink-hover) / <alpha-value>)",
        /* Text/icon color for anything placed on top of an ink or
           ink-hover fill — white in light mode (ink is dark there), dark
           in dark mode (ink is light there). */
        "ink-contrast": "rgb(var(--color-ink-contrast) / <alpha-value>)",
        charcoal: "rgb(var(--color-charcoal) / <alpha-value>)",
        muted: "rgb(var(--color-muted) / <alpha-value>)",
        hairline: "rgb(var(--color-hairline) / <alpha-value>)",
        "pastel-red": "rgb(var(--color-pastel-red) / <alpha-value>)",
        "pastel-red-ink": "rgb(var(--color-pastel-red-ink) / <alpha-value>)",
        "pastel-blue": "rgb(var(--color-pastel-blue) / <alpha-value>)",
        "pastel-blue-ink": "rgb(var(--color-pastel-blue-ink) / <alpha-value>)",
        "pastel-green": "rgb(var(--color-pastel-green) / <alpha-value>)",
        "pastel-green-ink": "rgb(var(--color-pastel-green-ink) / <alpha-value>)",
        "pastel-yellow": "rgb(var(--color-pastel-yellow) / <alpha-value>)",
        "pastel-yellow-ink": "rgb(var(--color-pastel-yellow-ink) / <alpha-value>)",
        /* Single confident accent for focus states and interactive emphasis. */
        accent: "rgb(var(--color-accent) / <alpha-value>)",
      },
      borderRadius: {
        DEFAULT: "0.125rem",
        lg: "0.25rem",
        xl: "0.5rem",
      },
      boxShadow: {
        /* Shadow color/opacity are also CSS vars — dark mode needs more
           opacity than light mode since the card and page are closer in
           lightness there than white-on-white ever was. */
        hairline: "0 1px 2px rgb(var(--shadow-color) / var(--shadow-o1))",
        lift: "0 2px 10px rgb(var(--shadow-color) / var(--shadow-o2))",
        /* Replaces Tailwind's stock heavy double-shadow with one soft,
           restrained shadow for overlays/modals. */
        xl: "0 12px 32px rgb(var(--shadow-color) / var(--shadow-o3))",
      },
      fontFamily: {
        editorial: ["Newsreader", "serif"],
        mono: ["JetBrains Mono", "monospace"],
        /* Page-title headers only (the "Welcome back, ..." style h1/h2s) —
           big display numbers keep font-editorial. */
        geist: ["Geist Sans", "sans-serif"],
      },
    },
  },
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/container-queries")],
};
