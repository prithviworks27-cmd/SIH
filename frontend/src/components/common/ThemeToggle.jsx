import { Sun, Moon } from "@phosphor-icons/react";
import useDarkMode from "../../hooks/useDarkMode";

export default function ThemeToggle({ className = "" }) {
  const [isDark, setIsDark] = useDarkMode();

  return (
    <button
      type="button"
      onClick={() => setIsDark((v) => !v)}
      className={`icon-btn p-2 ${className}`}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
