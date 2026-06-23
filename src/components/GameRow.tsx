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

      const tiles = tileRefs.current.filter(Boolean) as HTMLElement[];
      const pegs = pegRefs.current.filter(Boolean) as HTMLElement[];

      const tl = gsap.timeline();

      // Tiles: sequential fade-up, smooth and quick
      tl.fromTo(
        tiles,
        { y: 7, opacity: 0, scale: 0.88 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.28,
          stagger: 0.055,
          ease: "power2.out",
        }
      );

      // Row: very subtle acknowledgment pulse after last tile lands
      if (rowRef.current) {
        tl.to(rowRef.current, { scale: 1.012, duration: 0.1, ease: "power1.out" }, ">-0.04")
          .to(rowRef.current, { scale: 1, duration: 0.22, ease: "power2.inOut" });
      }

      // Pegs: all fade in together as a calm group, slightly after tiles
      if (pegs.length) {
        tl.fromTo(
          pegs,
          { scale: 0.55, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.22,
            stagger: 0.06,
            ease: "power2.out",
          },
          ">"
        );
      }
    },
    { dependencies: [animate, guess, result, len] }
  );

  useEffect(() => {
    if (!shake || !rowRef.current) return;
    const tl = gsap.timeline({
      onComplete: () => {
        if (rowRef.current) gsap.set(rowRef.current, { x: 0 });
      },
    });
    // Short, crisp bump — not a prolonged rattle
    tl.to(rowRef.current, { x: 6, duration: 0.06, ease: "power2.out" })
      .to(rowRef.current, { x: -5, duration: 0.09, ease: "power2.inOut" })
      .to(rowRef.current, { x: 4, duration: 0.09, ease: "power2.inOut" })
      .to(rowRef.current, { x: 0, duration: 0.12, ease: "power2.out" });
  }, [shake]);

  // Subtle tile stamp when a letter is typed
  useGSAP(
    () => {
      if (!isActive || !current) return;
      const idx = current.length - 1;
      const el = tileRefs.current[idx];
      if (!el) return;
      gsap.fromTo(el, { scale: 0.78 }, { scale: 1, duration: 0.16, ease: "power2.out" });
    },
    { dependencies: [current, isActive] }
  );

  useGSAP(
    () => {
      if (!rowRef.current) return;
      if (!isActive) {
        gsap.set(rowRef.current, { boxShadow: "none" });
        return;
      }
      gsap.set(rowRef.current, { boxShadow: "0 0 0 1.5px var(--accent)" });
      return () => {
        if (rowRef.current) {
          gsap.killTweensOf(rowRef.current);
          gsap.set(rowRef.current, { boxShadow: "none" });
        }
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
