"use client";

import { Modal } from "@/components/modals/Modal";

interface QuitModalProps {
  open: boolean;
  isDaily: boolean;
  onStay: () => void;
  onLeave: () => void;
}

export function QuitModal({ open, isDaily, onStay, onLeave }: QuitModalProps) {
  return (
    <Modal open={open} onClose={onStay}>
      <div className="font-display font-semibold text-[21px] text-ink mb-2 tracking-tight">
        Leave this game?
      </div>
      <p className="text-sm text-ink-soft leading-relaxed mb-5">
        {isDaily
          ? "Your progress on this puzzle will be saved — you can pick it back up later today."
          : "This is a custom practice game — leaving will abandon it and the word won't come back."}
      </p>
      <div className="flex gap-2.5 justify-center">
        <button type="button" className="btn flex-1" onClick={onStay}>
          Keep playing
        </button>
        <button type="button" className="btn primary flex-1" onClick={onLeave}>
          Leave
        </button>
      </div>
    </Modal>
  );
}
