"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function Header({ onHome }: { onHome: () => void }) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = mounted && (resolvedTheme === "dark" || theme === "dark");

  return (
    <header className="w-full max-w-screen mx-auto mb-6 relative z-10 grid grid-cols-[1fr_auto] items-center gap-4">
      <button
        type="button"
        className="flex items-center gap-2.5 cursor-pointer bg-transparent border-0 p-0 justify-self-start"
        onClick={onHome}
        aria-label="Go home"
      >
        <span className="text-2xl leading-none drop-shadow-sm">🐮</span>
        <h1 className="font-display font-bold text-2xl tracking-tight">
          <span className="gradient-text">Hunch</span>
          <span className="text-accent">.</span>
        </h1>
      </button>

      <button
        type="button"
        className="icon-btn justify-self-end flex-shrink-0"
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
