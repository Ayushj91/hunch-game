"use client";

import { BASE_TRIES, DAILY_CFG } from "@/lib/constants";
import { useGameStore } from "@/hooks/useGameState";
import type { GameMode, GameType } from "@/types/game";

interface LandingScreenProps {
  onStart: () => void;
}

export function LandingScreen({ onStart }: LandingScreenProps) {
  const { mode, customConfig, setMode, setCustomConfig } = useGameStore();

  const cfg = mode === "daily" ? DAILY_CFG : customConfig;
  const isWord = cfg.type === "letters";

  return (
    <section className="screen-shell">
      <div className="hero text-center mb-[30px]">
        <h2>
          Guess the <em>secret code</em>
        </h2>
      </div>

      <div className="lockmark">
        {["?", "?", "?", "?"].map((ch, i) => (
          <div key={i} className="cell">
            {ch}
          </div>
        ))}
      </div>

      <div className={`panel ${mode === "daily" ? "daily-mode" : ""}`}>
        <div className="modetoggle">
          <button
            type="button"
            className={mode === "daily" ? "sel" : ""}
            onClick={() => setMode("daily" as GameMode)}
          >
            Daily
            <small>today&apos;s puzzle</small>
          </button>
          <button
            type="button"
            className={mode === "custom" ? "sel" : ""}
            onClick={() => setMode("custom" as GameMode)}
          >
            Custom
            <small>your settings</small>
          </button>
        </div>

        {mode === "daily" ? (
          <p className="daily-note">
            One fresh <b>4-letter word</b> a day. Same puzzle for everyone — solve
            it, keep your streak.
          </p>
        ) : (
          <>
            <div className="mb-6">
              <div className="opt-label">
                <span>Code type</span>
                <span className="hintv">
                  {customConfig.type === "numbers" ? "digits 0–9" : "real words"}
                </span>
              </div>
              <div className="seg two">
                {(["numbers", "letters"] as GameType[]).map((t) => (
                  <button
                    key={t}
                    type="button"
                    className={customConfig.type === t ? "sel" : ""}
                    onClick={() => setCustomConfig({ type: t })}
                  >
                    {t === "numbers" ? "NUMBERS" : "WORDS"}
                    <small>{t === "numbers" ? "0–9" : "real words"}</small>
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <div className="opt-label">
                <span>Code length</span>
                <span className="hintv">no repeats</span>
              </div>
              <div className="seg two">
                {([4, 5] as const).map((l) => (
                  <button
                    key={l}
                    type="button"
                    className={customConfig.len === l ? "sel" : ""}
                    onClick={() => setCustomConfig({ len: l })}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        <button type="button" className="start-btn" onClick={onStart}>
          START
        </button>
        <div className="config-summary">
          {mode === "daily" ? (
            <>
              today · <b>4-letter word</b> · <b>{BASE_TRIES}</b> tries
            </>
          ) : (
            <>
              {isWord ? (
                <>
                  <b>{cfg.len}-letter word</b>
                </>
              ) : (
                <>
                  <b>{cfg.len} digits</b>
                </>
              )}{" "}
              · no repeats
            </>
          )}
        </div>
      </div>

    </section>
  );
}
