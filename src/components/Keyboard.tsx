"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import { LETTER_ROWS, NUMBER_ROWS } from "@/lib/constants";
import { useGameStore } from "@/hooks/useGameState";
import type { GameType } from "@/types/game";

interface KeyboardProps {
  type: GameType;
}

export function Keyboard({ type }: KeyboardProps) {
  const padRef = useRef<HTMLDivElement>(null);
  const { current, len, over, addChar, deleteChar, submit, getAbsentSet } =
    useGameStore();
  const absentSet = getAbsentSet();

  useGSAP(
    () => {
      if (!padRef.current) return;
      const keys = padRef.current.querySelectorAll(".key-btn");
      gsap.from(keys, {
        y: 10,
        opacity: 0,
        duration: 0.3,
        stagger: 0.01,
        ease: "power2.out",
      });
    },
    { dependencies: [type], scope: padRef }
  );

  const pressKey = (el: HTMLElement) => {
    gsap.fromTo(
      el,
      { scale: 0.92 },
      { scale: 1, duration: 0.12, ease: "power2.out" }
    );
  };

  const renderKey = (ch: string, className = "") => {
    const gone = absentSet.has(ch);
    const used = !gone && current.includes(ch);
    return (
      <button
        key={ch}
        type="button"
        className={`key-btn flex-1 ${className} ${gone ? "gone" : used ? "used" : ""}`}
        disabled={over}
        onClick={(e) => {
          pressKey(e.currentTarget);
          addChar(ch);
        }}
      >
        {ch}
      </button>
    );
  };

  const rowClass = "flex gap-1 max-[440px]:gap-0.5 justify-center items-stretch";

  return (
    <div
      ref={padRef}
      className={`flex flex-col gap-1.5 max-[440px]:gap-1 max-w-[560px] mx-auto ${
        type === "numbers" ? "numpad" : "letpad"
      }`}
    >
      {type === "numbers" ? (
        <>
          <div className={rowClass}>
            {NUMBER_ROWS[0].split("").map((ch) => renderKey(ch))}
          </div>
          <div className={rowClass}>
            {NUMBER_ROWS[1].split("").map((ch) => renderKey(ch))}
          </div>
          <div className={rowClass}>
            <button
              type="button"
              className="key-btn enter flex-[3] text-xs max-[440px]:text-[11px]"
              disabled={over}
              onClick={(e) => {
                pressKey(e.currentTarget);
                submit();
              }}
            >
              ENTER
            </button>
            <button
              type="button"
              className="key-btn fn flex-[2] text-xs text-ink-soft"
              disabled={over}
              onClick={(e) => {
                pressKey(e.currentTarget);
                deleteChar();
              }}
            >
              ⌫
            </button>
          </div>
        </>
      ) : (
        <>
          <div className={rowClass}>
            {LETTER_ROWS[0].split("").map((ch) => renderKey(ch))}
          </div>
          <div className={`${rowClass} px-4 max-[440px]:px-2`}>
            {LETTER_ROWS[1].split("").map((ch) => renderKey(ch))}
          </div>
          <div className={rowClass}>
            <button
              type="button"
              className="key-btn enter flex-[1.4] text-xs max-[440px]:text-[11px]"
              disabled={over}
              onClick={(e) => {
                pressKey(e.currentTarget);
                submit();
              }}
            >
              ENTER
            </button>
            {LETTER_ROWS[2].split("").map((ch) => renderKey(ch))}
            <button
              type="button"
              className="key-btn fn flex-[1.4] text-xs text-ink-soft"
              disabled={over}
              onClick={(e) => {
                pressKey(e.currentTarget);
                deleteChar();
              }}
            >
              ⌫
            </button>
          </div>
        </>
      )}
    </div>
  );
}
