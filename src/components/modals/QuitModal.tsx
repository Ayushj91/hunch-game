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
      <div className="modal-title">Leave this game?</div>
      <p className="modal-text">
        {isDaily
          ? "Your progress on this puzzle will be saved — you can pick it back up later today."
          : "This is a custom practice game — leaving will abandon it and the word won't come back."}
      </p>
      <div className="modal-actions">
        <button type="button" className="btn" onClick={onStay}>
          Keep playing
        </button>
        <button type="button" className="btn primary" onClick={onLeave}>
          Leave
        </button>
      </div>
    </Modal>
  );
}
