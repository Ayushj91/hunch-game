"use client";

import { useEffect, useRef } from "react";
import type { GuessResult } from "@/types/game";

interface GameRowProps {
  index: number;
  len: number;
  guess?: string;
  current?: string;
  result?: GuessResult;
  isActive: boolean;
  isEmpty: boolean;
  animate: boolean;
  shake: boolean;
}

export function GameRow({
  index,
  len,
  guess,
  current,
  result,
  isActive,
  isEmpty,
  animate,
  shake,
}: GameRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const charRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const pegRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const chPx = len >= 6 ? 22 : len >= 5 ? 25 : 28;
  const chGap = len >= 6 ? 12 : len >= 5 ? 16 : 20;

  useEffect(() => {
    if (!animate || !guess) return;

    for (let i = 0; i < len; i++) {
      const el = charRefs.current[i];
      if (!el) continue;
      el.classList.add("reveal");
      el.style.animationDelay = `${i * 70}ms`;
      window.setTimeout(() => {
        el.classList.remove("reveal");
        el.style.animationDelay = "";
      }, i * 70 + 360);
    }

    const pegDelayBase = len * 70 + 60;
    let pi = 0;
    if (result) {
      for (let k = 0; k < result.b; k++) {
        const peg = pegRefs.current[pi++];
        if (peg) peg.style.animationDelay = `${pegDelayBase + k * 60}ms`;
      }
      for (let k = 0; k < result.c; k++) {
        const peg = pegRefs.current[pi++];
        if (peg) peg.style.animationDelay = `${pegDelayBase + (result.b + k) * 60}ms`;
      }
    }
  }, [animate, guess, result, len]);

  useEffect(() => {
    if (!shake || !rowRef.current) return;
    rowRef.current.classList.add("err");
    const t = window.setTimeout(() => {
      rowRef.current?.classList.remove("err");
    }, 350);
    return () => window.clearTimeout(t);
  }, [shake]);

  const renderChars = () => {
    if (guess) {
      return guess.split("").map((ch, i) => (
        <span
          key={i}
          ref={(el) => {
            charRefs.current[i] = el;
          }}
          className="ch"
          style={{ fontSize: chPx, minWidth: Math.round(chPx * 0.7) }}
        >
          {ch}
        </span>
      ));
    }

    if (isActive) {
      return Array.from({ length: len }).map((_, i) => {
        const val = current?.[i];
        const isCursor = i === (current?.length ?? 0);
        return (
          <span
            key={i}
            ref={(el) => {
              charRefs.current[i] = el;
            }}
            className={`ch ${val ? "" : `empty${isCursor ? " cursor" : ""}`}`}
            style={{ fontSize: chPx, minWidth: Math.round(chPx * 0.7) }}
          >
            {val || "·"}
          </span>
        );
      });
    }

    return Array.from({ length: len }).map((_, i) => (
      <span
        key={i}
        className="ch empty"
        style={{ fontSize: chPx, minWidth: Math.round(chPx * 0.7) }}
      >
        ·
      </span>
    ));
  };

  const pegs: ("bull" | "cow" | "empty")[] = [];
  if (result) {
    for (let i = 0; i < result.b; i++) pegs.push("bull");
    for (let i = 0; i < result.c; i++) pegs.push("cow");
    while (pegs.length < len) pegs.push("empty");
  } else {
    for (let i = 0; i < len; i++) pegs.push("empty");
  }

  return (
    <div
      ref={rowRef}
      className={`gridrow ${isActive ? "active" : ""} ${guess ? "guessed" : ""} ${isEmpty ? "empty" : ""}`}
    >
      <div className="gnum">{String(index + 1).padStart(2, "0")}</div>
      <div className="gword" style={{ gap: chGap }}>
        {renderChars()}
      </div>
      <div className="result-pegs">
        {pegs.map((kind, i) => (
          <span
            key={i}
            ref={(el) => {
              pegRefs.current[i] = el;
            }}
            className={kind === "empty" ? "peg" : `peg ${kind}`}
          />
        ))}
      </div>
    </div>
  );
}
