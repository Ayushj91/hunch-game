"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useEffect, useRef } from "react";
import { BgDecor } from "@/components/BgDecor";
import { GameScreen } from "@/components/GameScreen";
import { Header } from "@/components/Header";
import { LandingScreen } from "@/components/LandingScreen";
import { useStats } from "@/hooks/useStats";
import { useGameStore } from "@/hooks/useGameState";

gsap.registerPlugin(useGSAP);

export function Game() {
  const { screen, startGame, goHome } = useGameStore();
  const { hydrate } = useStats();
  const playing = screen === "game";

  const landingRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<HTMLDivElement>(null);
  const prevScreen = useRef(screen);

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

  useGSAP(
    () => {
      if (prevScreen.current === screen) return;
      const fromLanding = prevScreen.current === "landing" && screen === "game";
      const toLanding = prevScreen.current === "game" && screen === "landing";

      if (fromLanding && landingRef.current && gameRef.current) {
        gsap.set(gameRef.current, { display: "block" });
        gsap.timeline()
          .to(landingRef.current, {
            x: -80,
            opacity: 0,
            scale: 0.95,
            duration: 0.4,
            ease: "power3.in",
            onComplete: () => gsap.set(landingRef.current, { display: "none" }),
          })
          .fromTo(
            gameRef.current,
            { x: 100, opacity: 0, scale: 1.02 },
            { x: 0, opacity: 1, scale: 1, duration: 0.45, ease: "power3.out" },
            "-=0.1"
          );
      } else if (toLanding && landingRef.current && gameRef.current) {
        gsap.set(landingRef.current, { display: "block" });
        gsap.timeline()
          .to(gameRef.current, {
            x: 100,
            opacity: 0,
            duration: 0.35,
            ease: "power3.in",
            onComplete: () => gsap.set(gameRef.current, { display: "none" }),
          })
          .fromTo(
            landingRef.current,
            { x: -80, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.4, ease: "power3.out" },
            "-=0.1"
          );
      }

      prevScreen.current = screen;
    },
    { dependencies: [screen] }
  );

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
    <div className="relative w-full flex-1 flex flex-col max-w-screen mx-auto">
      <BgDecor />

      {!playing && <Header onHome={handleHome} />}

      <div className="w-full flex-1 relative overflow-hidden">
        <div
          ref={landingRef}
          className="w-full px-[18px]"
          style={{ display: playing ? "none" : "block" }}
        >
          <LandingScreen onStart={handleStart} />
        </div>
        <div
          ref={gameRef}
          className="w-full"
          style={{ display: playing ? "block" : "none" }}
        >
          <GameScreen onHome={goHome} onAgain={handleAgain} />
        </div>
      </div>

      {!playing && (
        <footer className="mt-8 mb-4 text-xs text-ink-faint text-center relative z-10">
          New puzzle every midnight UTC · streak saves automatically
        </footer>
      )}
    </div>
  );
}
