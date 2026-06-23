"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import { Confetti } from "@/components/Confetti";
import { BASE_TRIES } from "@/lib/constants";
import { fmtTime, score, solvedInAllotment } from "@/lib/gameLogic";
import { useCountdown } from "@/hooks/useCountdown";
import { useStats } from "@/hooks/useStats";
import { useGameStore } from "@/hooks/useGameState";

interface ResultOverlayProps {
  onAgain: () => void;
}

export function ResultOverlay({ onAgain }: ResultOverlayProps) {
  const {
    over,
    won,
    revealed,
    guesses,
    code,
    len,
    gameMode,
    startMs,
    dayNum,
  } = useGameStore();
  const { stats } = useStats();
  const countdown = useCountdown(over && gameMode === "daily");
  const ref = useRef<HTMLDivElement>(null);
  const [shareLabel, setShareLabel] = useState("Share");
  const [showConfetti, setShowConfetti] = useState(false);

  const visible = over;

  useGSAP(
    () => {
      if (!visible || !ref.current) return;
      gsap.fromTo(
        ref.current,
        { opacity: 0, y: 20, scale: 0.94 },
        { opacity: 1, y: 0, scale: 1, duration: 0.45, ease: "back.out(1.5)" }
      );
      const verdict = ref.current.querySelector(".verdict");
      if (verdict && won) {
        gsap.fromTo(
          verdict,
          { scale: 0.85, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.5, ease: "elastic.out(1, 0.6)" }
        );
      }
    },
    { dependencies: [visible, won] }
  );

  useEffect(() => {
    if (visible && won) {
      setShowConfetti(true);
      const t = window.setTimeout(() => setShowConfetti(false), 2000);
      return () => window.clearTimeout(t);
    }
    setShowConfetti(false);
  }, [visible, won]);

  if (!visible) return null;

  const inAllotment = solvedInAllotment(won, guesses.length, BASE_TRIES);
  const n = guesses.length;
  const isDaily = gameMode === "daily";

  let verdict = "";
  let subHtml = "";

  if (won) {
    if (inAllotment) {
      verdict =
        n <= Math.ceil(BASE_TRIES * 0.4)
          ? "Brilliant"
          : n <= Math.ceil(BASE_TRIES * 0.7)
            ? "Nicely done"
            : "Solved";
      if (isDaily) {
        subHtml = `solved in ${n} ${n === 1 ? "try" : "tries"} · streak ${stats.daily.streak}`;
      } else {
        const ms = Date.now() - startMs;
        const best =
          stats.custom.bestMs != null && ms <= stats.custom.bestMs;
        subHtml = `solved in ${n} ${n === 1 ? "try" : "tries"} · ${fmtTime(ms)}${best ? " · new best!" : ""}`;
      }
    } else {
      verdict = "Got there";
      subHtml = isDaily
        ? `cracked in ${n} tries · today's streak result was already set`
        : `cracked in ${n} tries · beyond the ${BASE_TRIES}-try mark`;
    }
  } else {
    verdict = revealed ? "Revealed" : "So close";
    subHtml = `the secret was ${code}`;
  }

  const shareText = () => {
    const mark = useGameStore.getState().type === "letters" ? "L" : "N";
    const solvedDaily = inAllotment;
    const resultTok = solvedDaily ? `${guesses.length}/${BASE_TRIES}` : "X";
    const head = `Hunch #${dayNum % 1000} ${len}${mark} — ${resultTok}`;
    const shown = guesses.slice(0, BASE_TRIES);
    const body = shown
      .map((g) => {
        const { b, c } = score(g, code);
        return "🟩".repeat(b) + "🟨".repeat(c) + "⬛".repeat(len - b - c);
      })
      .join("\n");
    const tail = solvedDaily ? `\n🔥${stats.daily.streak}` : "";
    return `${head}\n${body}${tail}`;
  };

  const handleShare = async () => {
    const text = shareText();
    try {
      if (navigator.share) {
        await navigator.share({ text });
      } else {
        await navigator.clipboard.writeText(text);
        setShareLabel("Copied!");
        window.setTimeout(() => setShareLabel("Share"), 1500);
      }
    } catch {
      try {
        await navigator.clipboard.writeText(text);
        setShareLabel("Copied!");
        window.setTimeout(() => setShareLabel("Share"), 1500);
      } catch {
        // ignore
      }
    }
  };

  return (
    <>
      <Confetti active={showConfetti} />
      <div ref={ref} className="text-center w-full max-w-[420px] mx-auto mt-4 glass-strong rounded-2xl p-6">
        <div
          className={`verdict font-display font-bold text-4xl mb-2 tracking-tight ${
            won ? "gradient-text" : "text-ink-soft"
          }`}
        >
          {verdict}
        </div>
        <p className="text-[15px] text-ink-soft mb-5">
          {subHtml.split(/(\d+|[A-Z]+)/).map((part, i) =>
            /^\d+$/.test(part) || part === code ? (
              <b key={i} className="text-ink font-semibold">
                {part}
              </b>
            ) : (
              part
            )
          )}
        </p>
        <div className="inline-flex flex-col gap-1.5 mb-6">
          {guesses.map((g, gi) => {
            const { b, c } = score(g, code);
            const cells: string[] = [];
            for (let k = 0; k < b; k++) cells.push("b");
            for (let k = 0; k < c; k++) cells.push("c");
            for (let k = 0; k < len - b - c; k++) cells.push("x");
            return (
              <div key={gi} className="flex gap-1.5 justify-center">
                {cells.map((kind, i) => (
                  <span
                    key={i}
                    className={`w-5 h-5 rounded-lg ${
                      kind === "b"
                        ? "peg-glow bull"
                        : kind === "c"
                          ? "peg-glow cow"
                          : "bg-line"
                    }`}
                  />
                ))}
              </div>
            );
          })}
        </div>
        <div className="flex gap-2.5 justify-center flex-wrap">
          {isDaily && (
            <button type="button" className="btn primary" onClick={handleShare}>
              {shareLabel}
            </button>
          )}
          <button type="button" className="btn" onClick={onAgain}>
            {isDaily ? "Back to menu" : "Play again"}
          </button>
        </div>
        {isDaily && countdown && (
          <p className="text-[13px] text-ink-faint mt-5 tabular-nums">
            NEXT CODE IN <b className="text-ink-soft font-semibold">{countdown}</b>
          </p>
        )}
      </div>
    </>
  );
}
