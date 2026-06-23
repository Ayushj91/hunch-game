"use client";

import { Modal } from "@/components/modals/Modal";

interface GiveUpModalProps {
  open: boolean;
  type: "letters" | "numbers";
  isDaily: boolean;
  scored: boolean;
  onStay: () => void;
  onConfirm: () => void;
}

export function GiveUpModal({
  open,
  type,
  isDaily,
  scored,
  onStay,
  onConfirm,
}: GiveUpModalProps) {
  const noun = type === "letters" ? "word" : "code";
  const extra =
    isDaily && !scored
      ? " It'll count as today's miss and reset your streak."
      : "";

  return (
    <Modal open={open} onClose={onStay}>
      <div className="font-display font-semibold text-[21px] text-ink mb-2 tracking-tight">
        Give up?
      </div>
      <p className="text-sm text-ink-soft leading-relaxed mb-5">
        {`This reveals the ${noun} and ends the game.`}
        {extra}
      </p>
      <div className="flex gap-2.5 justify-center">
        <button type="button" className="btn flex-1" onClick={onStay}>
          Keep trying
        </button>
        <button type="button" className="btn primary flex-1" onClick={onConfirm}>
          Reveal code
        </button>
      </div>
    </Modal>
  );
}
