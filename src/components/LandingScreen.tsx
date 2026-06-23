"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import { BASE_TRIES, DAILY_CFG } from "@/lib/constants";
import { fmtTime } from "@/lib/gameLogic";
import { useStats } from "@/hooks/useStats";
import { useGameStore } from "@/hooks/useGameState";
import type { GameMode, GameType } from "@/types/game";

interface LandingScreenProps {
  onStart: () => void;
}

export function LandingScreen({ onStart }: LandingScreenProps) {
  const { mode, customConfig, setMode, setCustomConfig } = useGameStore();
  const { stats } = useStats();

  const heroRef = useRef<HTMLDivElement>(null);
  const tilesRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!heroRef.current || !tilesRef.current || !panelRef.current) return;

    if (toggleRef.current && pillRef.current) {
      const btn = toggleRef.current.querySelector(
        mode === "daily" ? "button:first-of-type" : "button:last-of-type"
      ) as HTMLElement | null;
      if (btn) {
        gsap.set(pillRef.current, {
          x: btn.offsetLeft - 6,
          width: btn.offsetWidth,
        });
      }
    }

    gsap.from(heroRef.current.children, {
      y: 40,
      opacity: 0,
      duration: 0.7,
      stagger: 0.12,
      ease: "power3.out",
    });

    const tiles = tilesRef.current.querySelectorAll(".hero-tile");
    gsap.from(tiles, {
      y: 50,
      opacity: 0,
      rotation: -8,
      scale: 0.7,
      duration: 0.55,
      stagger: 0.1,
      delay: 0.25,
      ease: "back.out(2)",
    });

    gsap.from(panelRef.current, {
      y: 40,
      opacity: 0,
      duration: 0.6,
      delay: 0.45,
      ease: "power2.out",
    });
  }, []);

  const movePill = (targetMode: GameMode) => {
    if (!toggleRef.current || !pillRef.current) return;
    const buttons = toggleRef.current.querySelectorAll("button");
    const index = targetMode === "daily" ? 0 : 1;
    const btn = buttons[index] as HTMLElement;
    if (!btn) return;
    gsap.to(pillRef.current, {
      x: btn.offsetLeft - 6,
      width: btn.offsetWidth,
      duration: 0.28,
      ease: "power3.inOut",
    });
  };

  const handleMode = (m: GameMode) => {
    setMode(m);
    movePill(m);
  };

  const cfg = mode === "daily" ? DAILY_CFG : customConfig;
  const isWord = cfg.type === "letters";
  const daily = stats.daily;
  const custom = stats.custom;

  return (
    <section className="screen-shell">
      <div ref={heroRef} className="text-center mb-8 pt-2">
        <h2 className="font-display font-bold text-[38px] leading-[1.1] tracking-tight max-[440px]:text-[28px]">
          Crack the{" "}
          <span className="gradient-text italic">secret code</span>
        </h2>
        <p className="text-sm text-ink-soft mt-3 max-w-xs mx-auto leading-relaxed">
          Bulls &amp; Cows daily puzzle — decode the hidden word with clue pegs. Eight tries. One shot at glory.
        </p>
      </div>

      <div ref={tilesRef} className="flex justify-center gap-2.5 mb-8">
        {["?", "?", "?", "?"].map((ch, i) => (
          <div
            key={i}
            className="hero-tile tile w-14 h-16 max-[440px]:w-11 max-[440px]:h-13 text-2xl max-[440px]:text-xl text-ink-faint"
            style={{
              animationDelay: `${i * 0.1}s`,
              transform: `rotate(${(i - 1.5) * 4}deg)`,
            }}
          >
            {ch}
          </div>
        ))}
      </div>

      <div ref={panelRef} className="rounded-2xl p-6 max-[440px]:p-5" style={{ background: "var(--card-solid)", border: "1.5px solid var(--line-bold)", boxShadow: "var(--shadow)" }}>
        <div
          ref={toggleRef}
          className="relative grid grid-cols-2 gap-1 rounded-xl p-1 mb-5"
          style={{ background: "var(--tile-ghost-bg)", border: "1.5px solid var(--line-bold)" }}
        >
          <div
            ref={pillRef}
            className="absolute top-1 left-1 h-[calc(100%-8px)] rounded-lg pointer-events-none"
            style={{ width: "calc(50% - 4px)", background: "var(--card-solid)", border: "1px solid var(--line-bold)", boxShadow: "var(--shadow)" }}
          />
          <button
            type="button"
            className={`relative z-10 font-body font-bold text-sm py-3 px-2 rounded-xl border-0 cursor-pointer transition-colors ${
              mode === "daily" ? "text-accent" : "text-ink-soft hover:text-ink"
            }`}
            onClick={() => handleMode("daily")}
          >
            Daily
            <small className={`block font-medium text-[10px] mt-0.5 ${mode === "daily" ? "text-accent/70" : "text-ink-faint"}`}>
              today&apos;s puzzle
            </small>
          </button>
          <button
            type="button"
            className={`relative z-10 font-body font-bold text-sm py-3 px-2 rounded-xl border-0 cursor-pointer transition-colors ${
              mode === "custom" ? "text-accent" : "text-ink-soft hover:text-ink"
            }`}
            onClick={() => handleMode("custom")}
          >
            Custom
            <small className={`block font-medium text-[10px] mt-0.5 ${mode === "custom" ? "text-accent/70" : "text-ink-faint"}`}>
              your settings
            </small>
          </button>
        </div>

        {mode === "daily" ? (
          <p className="text-sm text-ink-soft text-center leading-relaxed mb-5">
            One fresh <b className="text-ink font-bold">4-letter word</b> a day.
            Same puzzle for everyone.
          </p>
        ) : (
          <>
            <div className="mb-4">
              <div className="text-[10px] font-bold tracking-widest text-ink-faint mb-2 uppercase">
                Code type
              </div>
              <div className="grid grid-cols-2 gap-2">
                {(["numbers", "letters"] as GameType[]).map((t) => (
                  <button
                    key={t}
                    type="button"
                    className={`seg-btn ${customConfig.type === t ? "sel" : ""}`}
                    onClick={() => setCustomConfig({ type: t })}
                  >
                    {t === "numbers" ? "Numbers" : "Words"}
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-5">
              <div className="text-[10px] font-bold tracking-widest text-ink-faint mb-2 uppercase">
                Length
              </div>
              <div className="grid grid-cols-2 gap-2">
                {([4, 5] as const).map((l) => (
                  <button
                    key={l}
                    type="button"
                    className={`seg-btn text-2xl font-display ${customConfig.len === l ? "sel" : ""}`}
                    onClick={() => setCustomConfig({ len: l })}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        <button type="button" className="start-btn" onClick={onStart}>
          Play Now
        </button>
        <p className="text-xs text-ink-faint text-center mt-3">
          {mode === "daily"
            ? `4-letter word · ${BASE_TRIES} tries · resets at midnight`
            : `${isWord ? `${cfg.len}-letter word` : `${cfg.len} digits`} · no repeats`}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3 mt-6">
        {mode === "daily" ? (
          <>
            <StatCard label="Streak" value={String(daily.streak)} highlight />
            <StatCard label="Solved" value={String(daily.wins)} />
            <StatCard
              label="Win %"
              value={
                daily.played
                  ? `${Math.round((daily.wins / daily.played) * 100)}%`
                  : "—"
              }
            />
          </>
        ) : (
          <>
            <StatCard label="Played" value={String(custom.played)} />
            <StatCard label="Solved" value={String(custom.solved)} />
            <StatCard label="Best" value={fmtTime(custom.bestMs)} />
          </>
        )}
      </div>
    </section>
  );
}

function StatCard({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="glass rounded-2xl p-4 text-center">
      <div className="text-[10px] font-bold uppercase tracking-wider text-ink-faint mb-1">
        {label}
      </div>
      <div
        className={`font-display font-bold text-2xl max-[440px]:text-xl ${
          highlight ? "gradient-text" : "text-ink"
        }`}
      >
        {value}
      </div>
    </div>
  );
}
