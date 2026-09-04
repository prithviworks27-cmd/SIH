/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        /* Editorial minimalism palette */
        canvas: "#FBFBFA",
        bone: "#F7F6F3",
        ink: "#111111",
        charcoal: "#2F3437",
        muted: "#787774",
        hairline: "#EAEAEA",
        "pastel-red": "#FDEBEC",
        "pastel-red-ink": "#9F2F2D",
        "pastel-blue": "#E1F3FE",
        "pastel-blue-ink": "#1F6C9F",
        "pastel-green": "#EDF3EC",
        "pastel-green-ink": "#346538",
        "pastel-yellow": "#FBF3DB",
        "pastel-yellow-ink": "#956400",
        /* Single confident accent for focus states and interactive emphasis
           — reuses pastel-blue-ink rather than introducing a new hue. */
        accent: "#1F6C9F",
      },
      borderRadius: {
        DEFAULT: "0.125rem",
        lg: "0.25rem",
        xl: "0.5rem",
      },
      boxShadow: {
        hairline: "0 1px 2px rgba(17, 17, 17, 0.03)",
        lift: "0 2px 8px rgba(17, 17, 17, 0.04)",
        /* Replaces Tailwind's stock heavy double-shadow with one soft,
           restrained shadow for overlays/modals. */
        xl: "0 12px 32px rgba(17, 17, 17, 0.10)",
      },
      fontFamily: {
        editorial: ["Newsreader", "serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/container-queries")],
};
