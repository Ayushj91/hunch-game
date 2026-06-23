"use client";

import { useEffect, useRef } from "react";
import { GameGrid } from "@/components/GameGrid";
import { Keyboard } from "@/components/Keyboard";
import { OutOfTriesPrompt } from "@/components/OutOfTriesPrompt";
import { ResultOverlay } from "@/components/ResultOverlay";
import { TriesProgress } from "@/components/TriesProgress";
import { GiveUpModal } from "@/components/modals/GiveUpModal";
import { HelpModal } from "@/components/modals/HelpModal";
import { QuitModal } from "@/components/modals/QuitModal";
import { getPool } from "@/lib/constants";
import { useGameStore } from "@/hooks/useGameState";

interface GameScreenProps {
  onHome: () => void;
  onAgain: () => void;
}

export function GameScreen({ onHome, onAgain }: GameScreenProps) {
  const {
    type,
    len,
    over,
    guesses,
    message,
    messageKind,
    showOutPrompt,
    showQuitModal,
    showGiveUpModal,
    showHelpModal,
    gameMode,
    scored,
    addChar,
    deleteChar,
    submit,
    keepGoing,
    revealCode,
    giveUp,
    setShowQuitModal,
    setShowGiveUpModal,
    setShowHelpModal,
  } = useGameStore();

  const pool = getPool(type);
  const inProgress = !over && guesses.length > 0;
  const scrollRef = useRef<HTMLDivElement>(null);

  // Always start at row 01
  useEffect(() => {
    scrollRef.current?.scrollTo(0, 0);
  }, [len, gameMode]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const state = useGameStore.getState();
      if (state.over) return;
      const k = e.key.toUpperCase();
      if (pool.includes(k)) {
        if (state.current.length < state.len && !state.current.includes(k)) {
          addChar(k);
        }
      } else if (e.key === "Backspace") {
        deleteChar();
      } else if (e.key === "Enter") {
        submit();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [pool, addChar, deleteChar, submit]);

  const requestHome = () => {
    if (inProgress) {
      setShowQuitModal(true);
    } else {
      onHome();
    }
  };

  return (
    <section className="relative flex flex-col h-dvh w-full overflow-hidden">
      <header className="flex-shrink-0 z-10 mx-3 mt-3 glass rounded-2xl px-3 py-2.5">
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="icon-btn !w-9 !h-9 !rounded-xl"
            aria-label="Back to menu"
            onClick={requestHome}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          <div className="flex-1 text-center min-w-0">
            <div className="font-display font-bold text-base tracking-tight">
              Hunch<span className="text-accent">.</span>
            </div>
            <div className="flex items-center justify-center gap-2 mt-0.5">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-violet-soft text-violet">
                {gameMode}
              </span>
              <span className="text-[10px] text-ink-soft font-semibold">
                {len} {type === "letters" ? "letters" : "digits"}
              </span>
            </div>
          </div>

          <button
            type="button"
            className="icon-btn !w-9 !h-9 !rounded-xl"
            aria-label="How to play"
            onClick={() => setShowHelpModal(true)}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="9" />
              <path d="M9.5 9.2a2.5 2.5 0 0 1 4.5 1.4c0 1.6-2 1.9-2 3.4" />
              <circle cx="12" cy="17.2" r="0.6" fill="currentColor" stroke="none" />
            </svg>
          </button>
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-5 mt-2 pt-2 border-t border-line-bold">
          <span className="flex items-center gap-1.5 text-[11px] font-bold text-ink-soft uppercase tracking-wide">
            <span className="w-3 h-3 rounded-full peg-glow bull" />
            Bull
          </span>
          <span className="flex items-center gap-1.5 text-[11px] font-bold text-ink-soft uppercase tracking-wide">
            <span className="w-3 h-3 rounded-full peg-glow cow" />
            Cow
          </span>
        </div>
      </header>

      {/* Board — scrollable from top so row 01 is always visible */}
      <div
        ref={scrollRef}
        className={`flex-1 overflow-y-auto overflow-x-hidden min-h-0 px-4 pt-3 pb-2 ${
          over ? "[&_.board]:hidden" : ""
        }`}
      >
        <div className="board w-full max-w-[480px] mx-auto">
          <TriesProgress />
          <GameGrid />
        </div>

        <OutOfTriesPrompt
          show={showOutPrompt && !over}
          onKeepGoing={keepGoing}
          onReveal={revealCode}
        />

        <ResultOverlay onAgain={onAgain} />
      </div>

      {/* Keyboard dock */}
      {!over && !showOutPrompt && (
        <div className="flex-shrink-0 z-10 mx-3 mb-3 glass rounded-2xl px-3 pt-3 pb-[calc(12px+env(safe-area-inset-bottom))]">
          <p
            className={`text-sm text-center font-semibold min-h-5 mb-2.5 ${
              messageKind === "bad"
                ? "text-accent"
                : messageKind === "good"
                  ? "text-bull"
                  : "text-ink"
            }`}
          >
            {message || "Type your guess below"}
          </p>
          <Keyboard type={type} />
          <button
            type="button"
            className="block mx-auto mt-2.5 bg-transparent border-0 font-body text-xs text-ink-faint cursor-pointer px-3 py-1.5 rounded-lg hover:text-accent transition-colors"
            onClick={() => setShowGiveUpModal(true)}
          >
            Reveal answer
          </button>
        </div>
      )}

      <QuitModal
        open={showQuitModal}
        isDaily={gameMode === "daily"}
        onStay={() => setShowQuitModal(false)}
        onLeave={() => {
          setShowQuitModal(false);
          onHome();
        }}
      />
      <GiveUpModal
        open={showGiveUpModal}
        type={type}
        isDaily={gameMode === "daily"}
        scored={scored}
        onStay={() => setShowGiveUpModal(false)}
        onConfirm={() => {
          setShowGiveUpModal(false);
          giveUp();
        }}
      />
      <HelpModal
        open={showHelpModal}
        type={type}
        onClose={() => setShowHelpModal(false)}
      />
    </section>
  );
}
