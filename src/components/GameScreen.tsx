"use client";

import { useEffect, useRef } from "react";
import { GameGrid } from "@/components/GameGrid";
import { Keyboard } from "@/components/Keyboard";
import { ModeBar } from "@/components/ModeBar";
import { OutOfTriesPrompt } from "@/components/OutOfTriesPrompt";
import { ResultOverlay } from "@/components/ResultOverlay";
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
  const midRef = useRef<HTMLDivElement>(null);

  // Always scroll to top of board when a new game starts
  useEffect(() => {
    midRef.current?.scrollTo(0, 0);
  }, [gameMode, type]);

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
    <section className="flex flex-col h-dvh w-full max-w-full">
      <div className="gtopbar">
        <button
          type="button"
          className="icon-btn"
          aria-label="Back to menu"
          onClick={requestHome}
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        <div className="gtop-center">
          <ModeBar />
          <div className="legend">
            <span className="lg">
              <span className="dot bull" />
              bull · right &amp; in place
            </span>
            <span className="lg">
              <span className="dot cow" />
              cow · right, wrong place
            </span>
          </div>
        </div>

        <button
          type="button"
          className="icon-btn"
          aria-label="How to play"
          onClick={() => setShowHelpModal(true)}
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="9" />
            <path d="M9.5 9.2a2.5 2.5 0 0 1 4.5 1.4c0 1.6-2 1.9-2 3.4" />
            <circle cx="12" cy="17.2" r="0.6" fill="currentColor" stroke="none" />
          </svg>
        </button>
      </div>

      <div ref={midRef} className={`gmiddle ${over ? "done" : ""}`}>
        <div className="board">
          <GameGrid />
        </div>

        <OutOfTriesPrompt
          show={showOutPrompt && !over}
          onKeepGoing={keepGoing}
          onReveal={revealCode}
        />

        <ResultOverlay onAgain={onAgain} />
      </div>

      {!over && !showOutPrompt && (
        <div className="gbottom">
          <p
            className={`msg ${
              messageKind === "bad"
                ? "bad"
                : messageKind === "good"
                  ? "good"
                  : ""
            }`}
          >
            {message || "enter your first guess"}
          </p>
          <Keyboard type={type} />
          <button
            type="button"
            className="giveup"
            onClick={() => setShowGiveUpModal(true)}
          >
            Give up &amp; reveal the code
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
