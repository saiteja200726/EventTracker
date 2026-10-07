import { useTheme } from "../context/ThemeContext";

function SunIcon(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 2.5v2.4M12 19.1v2.4M4.93 4.93l1.7 1.7M17.37 17.37l1.7 1.7M2.5 12h2.4M19.1 12h2.4M4.93 19.07l1.7-1.7M17.37 6.63l1.7-1.7" />
    </svg>
  );
}

function MoonIcon(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M20.5 13.6A8.5 8.5 0 1 1 10.4 3.5a6.8 6.8 0 0 0 10.1 10.1Z" />
    </svg>
  );
}

/**
 * variant="icon" -> compact circular icon button (desktop navbar)
 * variant="full" -> plain text+icon row matching the mobile menu's existing buttons
 */
function ThemeToggle({ variant = "icon" }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const label = isDark ? "Switch to light mode" : "Switch to dark mode";

  if (variant === "full") {
    return (
      <button onClick={toggleTheme} type="button">
        {isDark ? "☀️ Light Mode" : "🌙 Dark Mode"}
      </button>
    );
  }

  return (
    <button
      className="theme-toggle"
      onClick={toggleTheme}
      type="button"
      title={label}
      aria-label={label}
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}

export default ThemeToggle;
