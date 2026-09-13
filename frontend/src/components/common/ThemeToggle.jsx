import { Sun, Moon } from "@phosphor-icons/react";
import useDarkMode from "../../hooks/useDarkMode";

// `floating` pins this to the top-right corner of the viewport with its own
// bone-colored backdrop + shadow, so it stays visible and reachable from
// every page (public or authenticated) instead of living inside one page's
// own nav/sidebar chrome.
export default function ThemeToggle({ className = "", floating = false }) {
  const [isDark, setIsDark] = useDarkMode();

  return (
    <button
      type="button"
      onClick={() => setIsDark((v) => !v)}
      className={`icon-btn p-2 ${
        floating ? "fixed top-4 right-4 z-50 bg-bone hover:bg-bone shadow-lift rounded-full" : ""
      } ${className}`}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
