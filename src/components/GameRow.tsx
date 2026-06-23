"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
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
  const tileRefs = useRef<(HTMLDivElement | null)[]>([]);
  const pegRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const tileSize =
    len >= 5
      ? "w-10 h-10 text-lg max-[440px]:w-9 max-[440px]:h-9 max-[440px]:text-base"
      : "w-11 h-11 text-xl max-[440px]:w-10 max-[440px]:h-10 max-[440px]:text-lg";

  useGSAP(
    () => {
      if (!animate || !guess) return;
      tileRefs.current.forEach((el, i) => {
        if (!el) return;
        gsap.fromTo(
          el,
          { y: -20, scale: 0.4, rotationX: 90, opacity: 0 },
          {
            y: 0,
            scale: 1,
            rotationX: 0,
            opacity: 1,
            duration: 0.4,
            delay: i * 0.08,
            ease: "back.out(2.2)",
          }
        );
      });

      const pegDelayBase = len * 0.08 + 0.1;
      let pi = 0;
      if (result) {
        for (let k = 0; k < result.b; k++) {
          const peg = pegRefs.current[pi++];
          if (peg) {
            gsap.fromTo(
              peg,
              { scale: 0, opacity: 0 },
              {
                scale: 1,
                opacity: 1,
                duration: 0.35,
                delay: pegDelayBase + k * 0.07,
                ease: "elastic.out(1, 0.5)",
              }
            );
          }
        }
        for (let k = 0; k < result.c; k++) {
          const peg = pegRefs.current[pi++];
          if (peg) {
            gsap.fromTo(
              peg,
              { scale: 0, opacity: 0 },
              {
                scale: 1,
                opacity: 1,
                duration: 0.35,
                delay: pegDelayBase + (result.b + k) * 0.07,
                ease: "elastic.out(1, 0.5)",
              }
            );
          }
        }
      }
    },
    { dependencies: [animate, guess, result, len] }
  );

  useEffect(() => {
    if (!shake || !rowRef.current) return;
    gsap.fromTo(
      rowRef.current,
      { x: 0 },
      {
        x: 8,
        duration: 0.07,
        repeat: 5,
        yoyo: true,
        ease: "power1.inOut",
        onComplete: () => {
          if (rowRef.current) gsap.set(rowRef.current, { x: 0 });
        },
      }
    );
  }, [shake]);

  useGSAP(
    () => {
      if (!isActive || !rowRef.current) return;
      gsap.to(rowRef.current, {
        boxShadow: "0 0 0 2px var(--accent-soft), 0 8px 32px var(--accent-glow)",
        duration: 1.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
      return () => {
        if (rowRef.current) gsap.killTweensOf(rowRef.current);
      };
    },
    { dependencies: [isActive] }
  );

  const renderTiles = () => {
    if (guess) {
      return guess.split("").map((ch, i) => (
        <div
          key={i}
          ref={(el) => {
            tileRefs.current[i] = el;
          }}
          className={`tile filled ${tileSize}`}
        >
          {ch}
        </div>
      ));
    }
    if (isActive) {
      return Array.from({ length: len }).map((_, i) => {
        const val = current?.[i];
        const isCursor = i === (current?.length ?? 0);
        return (
          <div
            key={i}
            ref={(el) => {
              tileRefs.current[i] = el;
            }}
            className={`tile ${tileSize} ${
              val ? "filled" : isCursor ? "active" : "ghost"
            } ${isCursor && !val ? "text-accent" : "text-ink"}`}
          >
            {val || ""}
          </div>
        );
      });
    }
    return Array.from({ length: len }).map((_, i) => (
      <div key={i} className={`tile ghost ${tileSize}`} />
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

  const rowClass = isActive
    ? "glass-strong"
    : guess
      ? "glass"
      : isEmpty
        ? "row-pending"
        : "";

  const badgeClass = isActive
    ? "row-badge active"
    : guess
      ? "row-badge done"
      : "row-badge";

  return (
    <div
      ref={rowRef}
      className={`flex items-center gap-3 rounded-2xl px-3 py-2.5 transition-all duration-200 ${rowClass}`}
    >
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold tabular-nums ${badgeClass}`}
      >
        {index + 1}
      </div>

      <div className="flex gap-1.5 flex-1 justify-center">{renderTiles()}</div>

      <div className="flex flex-col gap-1 flex-shrink-0">
        {pegs.map((kind, i) => (
          <span
            key={i}
            ref={(el) => {
              pegRefs.current[i] = el;
            }}
            className={`w-3.5 h-3.5 rounded-full transition-all ${
              kind === "bull"
                ? "peg-glow bull"
                : kind === "cow"
                  ? "peg-glow cow"
                  : "peg-empty"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
