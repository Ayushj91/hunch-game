"use client";

import { useGameStore } from "@/hooks/useGameState";

export function ModeBar() {
  const { gameMode, len, type, guesses, max } = useGameStore();

  return (
    <div className="flex justify-center gap-1.5 flex-wrap">
      <span className="text-xs font-medium text-ink-soft bg-bg border border-line rounded-full px-3 py-1">
        {gameMode}
      </span>
      <span className="text-xs font-medium text-ink-soft bg-bg border border-line rounded-full px-3 py-1">
        <b className="text-accent font-semibold">{len}</b>{" "}
        {type === "letters" ? "word" : "numbers"}
      </span>
      <span className="text-xs font-medium text-ink-soft bg-bg border border-line rounded-full px-3 py-1">
        <b className="text-accent font-semibold">{guesses.length}</b>/{max} tries
      </span>
    </div>
  );
}
