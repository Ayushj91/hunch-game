"use client";

import { useEffect, useRef } from "react";
import { GameRow } from "@/components/GameRow";
import { score } from "@/lib/gameLogic";
import { useGameStore } from "@/hooks/useGameState";

export function GameGrid() {
  const {
    max,
    len,
    guesses,
    current,
    over,
    code,
    animateRow,
    shakeRow,
    clearAnimateRow,
    clearShakeRow,
  } = useGameStore();
  const activeRef = useRef<HTMLDivElement>(null);
  const prevGuesses = useRef(0);

  useEffect(() => {
    if (animateRow == null) return;
    const t = window.setTimeout(
      () => clearAnimateRow(),
      len * 70 + len * 60 + 400
    );
    return () => window.clearTimeout(t);
  }, [animateRow, len, clearAnimateRow]);

  useEffect(() => {
    if (!shakeRow) return;
    const t = window.setTimeout(() => clearShakeRow(), 420);
    return () => window.clearTimeout(t);
  }, [shakeRow, clearShakeRow]);

  useEffect(() => {
    if (over) return;
    if (guesses.length === 0) {
      prevGuesses.current = 0;
      return;
    }
    if (guesses.length > prevGuesses.current) {
      prevGuesses.current = guesses.length;
      const target = activeRef.current;
      if (target) {
        window.requestAnimationFrame(() => {
          target.scrollIntoView({ behavior: "smooth", block: "nearest" });
        });
      }
    }
  }, [guesses.length, over]);

  return (
    <div className="grid">
      {Array.from({ length: max }).map((_, r) => {
        const guess = guesses[r];
        const isActive = r === guesses.length && !over;
        const isEmpty = r > guesses.length;
        return (
          <div key={r} ref={isActive ? activeRef : undefined}>
            <GameRow
              index={r}
              len={len}
              guess={guess}
              current={isActive ? current : undefined}
              result={guess ? score(guess, code) : undefined}
              isActive={isActive}
              isEmpty={isEmpty}
              animate={animateRow === r}
              shake={shakeRow && isActive}
            />
          </div>
        );
      })}
    </div>
  );
}
