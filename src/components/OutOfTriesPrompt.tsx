"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";

gsap.registerPlugin(useGSAP);

interface OutOfTriesPromptProps {
  show: boolean;
  onKeepGoing: () => void;
  onReveal: () => void;
}

export function OutOfTriesPrompt({
  show,
  onKeepGoing,
  onReveal,
}: OutOfTriesPromptProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!ref.current || !show) return;
      gsap.fromTo(
        ref.current,
        { opacity: 0, y: 24, scale: 0.92 },
        { opacity: 1, y: 0, scale: 1, duration: 0.45, ease: "back.out(1.6)" }
      );
    },
    { dependencies: [show] }
  );

  if (!show) return null;

  return (
    <div
      ref={ref}
      className="w-full max-w-[420px] mx-auto mt-5 glass-strong rounded-2xl px-5 py-5 text-center"
    >
      <div className="text-3xl mb-2">😤</div>
      <div className="font-display font-bold text-xl text-ink mb-2 tracking-tight">
        Out of tries!
      </div>
      <p className="text-sm text-ink-soft leading-relaxed mb-4">
        You&apos;ve used all 8 attempts. Keep pushing for glory, or reveal the answer.
      </p>
      <div className="flex gap-2.5">
        <button type="button" className="btn primary flex-1" onClick={onKeepGoing}>
          Keep going
        </button>
        <button type="button" className="btn flex-1" onClick={onReveal}>
          Reveal
        </button>
      </div>
    </div>
  );
}
