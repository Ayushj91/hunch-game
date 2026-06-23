"use client";

import { Modal } from "@/components/modals/Modal";
import type { GameType } from "@/types/game";

interface HelpModalProps {
  open: boolean;
  type: GameType;
  onClose: () => void;
}

export function HelpModal({ open, type, onClose }: HelpModalProps) {
  const ex =
    type === "letters"
      ? { secret: "CARD", guess: "DARK" }
      : { secret: "3179", guess: "3751" };
  const { secret, guess } = ex;
  const L = secret.length;
  const status = new Array<"bull" | "cow" | "none">(L).fill("none");
  const rem: Record<string, number> = {};
  for (let i = 0; i < L; i++) {
    if (guess[i] === secret[i]) status[i] = "bull";
    else rem[secret[i]] = (rem[secret[i]] || 0) + 1;
  }
  for (let i = 0; i < L; i++) {
    if (status[i] === "bull") continue;
    if (rem[guess[i]] > 0) {
      status[i] = "cow";
      rem[guess[i]]--;
    }
  }
  const nb = status.filter((s) => s === "bull").length;
  const nc = status.filter((s) => s === "cow").length;
  const noun = type === "letters" ? "word" : "code";

  return (
    <Modal open={open} onClose={onClose} className="help !max-w-[420px] !text-left">
      <div className="modal-title">How to play</div>
      <div className="help-body mb-5">
        <p className="text-[14.5px] text-ink-soft leading-relaxed mb-3.5">
          Guess the secret code in the fewest tries. After each guess, the pegs
          beside your row tell you how close you were:
        </p>
        <div className="flex items-start gap-2.5 text-[14.5px] text-ink-soft leading-snug mb-2.5">
          <span className="w-3.5 h-3.5 rounded-full bg-bull flex-shrink-0 mt-0.5" />
          <span>
            <b className="text-ink font-semibold">Bull</b> — a correct symbol in
            the correct spot.
          </span>
        </div>
        <div className="flex items-start gap-2.5 text-[14.5px] text-ink-soft leading-snug mb-3.5">
          <span className="w-3.5 h-3.5 rounded-full bg-cow flex-shrink-0 mt-0.5" />
          <span>
            <b className="text-ink font-semibold">Cow</b> — a correct symbol,
            but in the wrong spot.
          </span>
        </div>
        <div className="bg-bg rounded p-4">
          <div className="text-[13.5px] text-ink-soft text-center mb-3">
            If the secret {noun} is{" "}
            <b className="text-ink font-semibold font-display tracking-wide">
              {secret.split("").join(type === "numbers" ? " " : "")}
            </b>
            …
          </div>
          <div className="flex items-center justify-between gap-3 bg-card border border-line rounded-xl px-4 py-3">
            <div className="flex gap-3.5">
              {guess.split("").map((ch, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <span className="font-display font-semibold text-2xl text-ink uppercase">
                    {ch}
                  </span>
                  <span
                    className={`text-[9px] font-bold tracking-wide uppercase px-1 rounded-full ${
                      status[i] === "bull"
                        ? "bg-bull text-white"
                        : status[i] === "cow"
                          ? "bg-cow text-white"
                          : "text-ink-faint"
                    }`}
                  >
                    {status[i] === "bull"
                      ? "bull"
                      : status[i] === "cow"
                        ? "cow"
                        : "·"}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex gap-1.5">
              {Array.from({ length: nb }).map((_, i) => (
                <span key={`b${i}`} className="w-[15px] h-[15px] rounded-full bg-bull" />
              ))}
              {Array.from({ length: nc }).map((_, i) => (
                <span key={`c${i}`} className="w-[15px] h-[15px] rounded-full bg-cow" />
              ))}
              {Array.from({ length: L - nb - nc }).map((_, i) => (
                <span
                  key={`x${i}`}
                  className="w-[15px] h-[15px] rounded-full border-[1.5px] border-line-bold"
                />
              ))}
            </div>
          </div>
          <div className="text-[13.5px] text-ink-soft text-center mt-3">
            …this guess scores <b className="text-ink font-semibold">{nb} bull{nb !== 1 ? "s" : ""}</b> and{" "}
            <b className="text-ink font-semibold">{nc} cow{nc !== 1 ? "s" : ""}</b>.
          </div>
        </div>
        <p className="text-[14.5px] text-ink-soft leading-relaxed mt-3.5">
          The pegs don&apos;t say <em>which</em> symbol is a bull or cow — that&apos;s
          the puzzle. There&apos;s a fresh code every day, and your streak grows each
          day you solve it.
        </p>
      </div>
      <div className="modal-actions">
        <button type="button" className="btn primary" onClick={onClose}>
          Got it
        </button>
      </div>
    </Modal>
  );
}
