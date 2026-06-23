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
      <div className="modal-title">Give up?</div>
      <p className="modal-text">
        {`This reveals the ${noun} and ends the game.`}
        {extra}
      </p>
      <div className="modal-actions">
        <button type="button" className="btn" onClick={onStay}>
          Keep trying
        </button>
        <button type="button" className="btn primary" onClick={onConfirm}>
          Reveal code
        </button>
      </div>
    </Modal>
  );
}
