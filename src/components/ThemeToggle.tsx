import { useTheme, type Theme } from "../hooks/useTheme";

const OPTIONS: { value: Theme; icon: string; label: string }[] = [
  { value: "system", icon: "🖥️", label: "Тема як у системі" },
  { value: "light", icon: "☀️", label: "Світла тема" },
  { value: "dark", icon: "🌙", label: "Темна тема" },
];

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="theme-toggle" role="group" aria-label="Тема оформлення">
      {OPTIONS.map((o) => (
        <button
          key={o.value}
          type="button"
          aria-label={o.label}
          title={o.label}
          aria-pressed={theme === o.value}
          onClick={() => setTheme(o.value)}
        >
          {o.icon}
        </button>
      ))}
    </div>
  );
}