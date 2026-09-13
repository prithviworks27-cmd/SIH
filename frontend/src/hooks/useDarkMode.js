import { useEffect, useState } from "react";

const STORAGE_KEY = "skillbridge-theme";

function getInitialDark() {
  try {
    return localStorage.getItem(STORAGE_KEY) === "dark";
  } catch {
    return false;
  }
}

// Defaults to light mode (the original editorial-minimalism theme) unless
// the user has explicitly switched to dark before — never follows OS
// preference, since dark mode here is an opt-in alternate palette rather
// than a system-matching accessibility mode.
export default function useDarkMode() {
  const [isDark, setIsDark] = useState(getInitialDark);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    try {
      localStorage.setItem(STORAGE_KEY, isDark ? "dark" : "light");
    } catch {
      // ignore storage errors (private browsing, quota, etc.)
    }
  }, [isDark]);

  return [isDark, setIsDark];
}
