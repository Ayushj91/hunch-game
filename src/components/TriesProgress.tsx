"use client";

import { useGameStore } from "@/hooks/useGameState";

export function TriesProgress() {
  const { guesses, max, over } = useGameStore();

  return (
    <div className="mb-4 px-1">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-bold uppercase tracking-widest text-ink-soft">
          Attempts
        </span>
        <span className="text-sm font-bold tabular-nums">
          <span className="text-accent">{guesses.length}</span>
          <span className="text-ink-soft"> / {max}</span>
        </span>
      </div>
      <div className="flex gap-1.5">
        {Array.from({ length: max }).map((_, i) => {
          const filled = i < guesses.length;
          const current = i === guesses.length && !over;
          return (
            <div
              key={i}
              className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                filled
                  ? "bg-gradient-to-r from-violet to-accent"
                  : current
                    ? "bg-accent/60 animate-pulse border border-accent"
                    : "progress-empty"
              }`}
            />
          );
        })}
      </div>
    </div>
  );
}
