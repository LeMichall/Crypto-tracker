import { useState, useEffect } from "react";

export default function setDarkMode() {
  const [darkMode, setDarkMode] = useState(() => {
    const stored = localStorage.getItem("darkMode");
    if (stored !== null) {
      return stored === "true";
    }
  });
  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);
  const toggleDarkMode = () => setDarkMode((prev) => !prev);
  return [darkMode, toggleDarkMode];
}
