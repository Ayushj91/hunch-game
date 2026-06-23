"use client";

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
  if (!show) return null;

  return (
    <div className="out-prompt">
      <div className="out-title">Out of tries</div>
      <div className="out-text">
        You&apos;ve used your 8 tries. Keep going just for the satisfaction, or
        reveal the answer.
      </div>
      <div className="out-actions">
        <button type="button" className="btn primary" onClick={onKeepGoing}>
          Keep going
        </button>
        <button type="button" className="btn" onClick={onReveal}>
          Reveal code
        </button>
      </div>
    </div>
  );
}
