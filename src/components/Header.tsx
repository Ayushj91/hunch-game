"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function Header({ onHome }: { onHome: () => void }) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = mounted && (resolvedTheme === "dark" || theme === "dark");

  return (
    <header className="w-full max-w-screen flex justify-between items-center mb-[30px]">
      <button type="button" className="brand" onClick={onHome} aria-label="Go home">
        <div className="dot text-[22px] leading-none">🐮</div>
        <h1>
          Hunch<span className="text-accent">.</span>
        </h1>
      </button>

      <button
        type="button"
        className="theme-btn"
        aria-label="Toggle dark mode"
        onClick={() => setTheme(isDark ? "light" : "dark")}
      >
        {!mounted ? (
          <span className="w-[19px] h-[19px]" />
        ) : isDark ? (
          <MoonIcon />
        ) : (
          <SunIcon />
        )}
      </button>
    </header>
  );
}

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 14.5A8 8 0 1 1 9.5 4a6.3 6.3 0 0 0 10.5 10.5z" />
    </svg>
  );
}
