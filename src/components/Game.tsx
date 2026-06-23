"use client";

import { useEffect } from "react";
import { GameScreen } from "@/components/GameScreen";
import { Header } from "@/components/Header";
import { LandingScreen } from "@/components/LandingScreen";
import { useStats } from "@/hooks/useStats";
import { useGameStore } from "@/hooks/useGameState";

export function Game() {
  const { screen, startGame, goHome } = useGameStore();
  const { hydrate } = useStats();
  const playing = screen === "game";

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    const body = document.body;
    if (playing) {
      body.classList.add("playing");
      body.style.height = "100dvh";
      body.style.minHeight = "0";
      body.style.padding = "0";
      body.style.overflow = "hidden";
      body.style.justifyContent = "flex-start";
    } else {
      body.classList.remove("playing");
      body.style.height = "";
      body.style.minHeight = "";
      body.style.padding = "";
      body.style.overflow = "";
      body.style.justifyContent = "";
    }
    return () => {
      body.classList.remove("playing");
      body.style.height = "";
      body.style.minHeight = "";
      body.style.padding = "";
      body.style.overflow = "";
      body.style.justifyContent = "";
    };
  }, [playing]);

  const handleHome = () => {
    const state = useGameStore.getState();
    if (state.screen === "game" && !state.over && state.guesses.length > 0) {
      state.setShowQuitModal(true);
      return;
    }
    goHome();
  };

  const handleStart = () => {
    startGame();
    window.scrollTo(0, 0);
  };

  const handleAgain = () => {
    const state = useGameStore.getState();
    if (state.gameMode === "custom") {
      startGame();
    } else {
      goHome();
    }
  };

  return (
    <div className="w-full flex-1 flex flex-col max-w-screen mx-auto">
      {!playing && <Header onHome={handleHome} />}

      <div className="w-full flex-1">
        {!playing ? (
          <LandingScreen onStart={handleStart} />
        ) : (
          <GameScreen onHome={goHome} onAgain={handleAgain} />
        )}
      </div>

    </div>
  );
}
