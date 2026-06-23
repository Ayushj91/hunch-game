"use client";

import { LETTER_ROWS, NUMBER_ROWS } from "@/lib/constants";
import { useGameStore } from "@/hooks/useGameState";
import type { GameType } from "@/types/game";

interface KeyboardProps {
  type: GameType;
}

export function Keyboard({ type }: KeyboardProps) {
  const { current, over, addChar, deleteChar, submit, getAbsentSet } =
    useGameStore();
  const absentSet = getAbsentSet();

  const renderKey = (ch: string) => {
    const gone = absentSet.has(ch);
    const used = !gone && current.includes(ch);
    return (
      <button
        key={ch}
        type="button"
        className={`key ${gone ? "gone" : used ? "used" : ""}`}
        disabled={over}
        onClick={() => addChar(ch)}
      >
        {ch}
      </button>
    );
  };

  return (
    <div className={`pad ${type === "numbers" ? "numpad" : "letpad"}`}>
      {type === "numbers" ? (
        <>
          <div className="krow">
            {NUMBER_ROWS[0].split("").map((ch) => renderKey(ch))}
          </div>
          <div className="krow">
            {NUMBER_ROWS[1].split("").map((ch) => renderKey(ch))}
          </div>
          <div className="krow">
            <button
              type="button"
              className="key enter"
              disabled={over}
              onClick={() => submit()}
            >
              ENTER
            </button>
            <button
              type="button"
              className="key fn"
              disabled={over}
              onClick={() => deleteChar()}
            >
              ⌫
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="krow">
            {LETTER_ROWS[0].split("").map((ch) => renderKey(ch))}
          </div>
          <div className="krow mid">
            {LETTER_ROWS[1].split("").map((ch) => renderKey(ch))}
          </div>
          <div className="krow">
            <button
              type="button"
              className="key enter"
              disabled={over}
              onClick={() => submit()}
            >
              ENTER
            </button>
            {LETTER_ROWS[2].split("").map((ch) => renderKey(ch))}
            <button
              type="button"
              className="key fn"
              disabled={over}
              onClick={() => deleteChar()}
            >
              ⌫
            </button>
          </div>
        </>
      )}
    </div>
  );
}
