"use client";

import { create } from "zustand";
import {
  BASE_TRIES,
  DAILY_CFG,
  DEFAULT_CUSTOM_CONFIG,
  revealDuration,
} from "@/lib/constants";
import {
  dailyCodeSeed,
  getDayNum,
  makeCode,
  score,
  sessionId,
} from "@/lib/gameLogic";
import { ACCEPT } from "@/lib/words";
import { useStatsStore } from "@/hooks/useStats";
import type {
  GameConfig,
  GameMode,
  GameState,
  MessageKind,
} from "@/types/game";

type GameStore = GameState & {
  dayNum: number;
  setMode: (mode: GameMode) => void;
  setCustomConfig: (partial: Partial<GameConfig>) => void;
  startGame: () => void;
  goHome: () => void;
  addChar: (ch: string) => void;
  deleteChar: () => void;
  submit: () => number | null;
  giveUp: () => void;
  keepGoing: () => void;
  revealCode: () => void;
  setShowQuitModal: (show: boolean) => void;
  setShowGiveUpModal: (show: boolean) => void;
  setShowHelpModal: (show: boolean) => void;
  clearAnimateRow: () => void;
  clearShakeRow: () => void;
  getAbsentSet: () => Set<string>;
};

const initialState: GameState = {
  screen: "landing",
  mode: "daily",
  gameMode: "daily",
  customConfig: DEFAULT_CUSTOM_CONFIG,
  code: "",
  len: 4,
  type: "letters",
  max: BASE_TRIES,
  guesses: [],
  current: "",
  over: false,
  won: false,
  scored: false,
  revealed: false,
  extended: false,
  sessionKey: null,
  startMs: 0,
  message: "",
  messageKind: null,
  showOutPrompt: false,
  showQuitModal: false,
  showGiveUpModal: false,
  showHelpModal: false,
  animateRow: null,
  shakeRow: false,
};

function activeCfg(
  mode: GameMode,
  customConfig: GameConfig
): GameConfig {
  return mode === "daily" ? DAILY_CFG : customConfig;
}

function recomputeUsed(guesses: string[], code: string) {
  const usedSet = new Set<string>();
  const absentSet = new Set<string>();
  guesses.forEach((g) => {
    g.split("").forEach((ch) => usedSet.add(ch));
    const { b, c } = score(g, code);
    if (b === 0 && c === 0) {
      g.split("").forEach((ch) => absentSet.add(ch));
    }
  });
  return { usedSet, absentSet };
}

function persistSession(state: GameState) {
  if (state.gameMode !== "daily" || !state.sessionKey) return;
  const stats = useStatsStore.getState().stats;
  const next = {
    ...stats,
    daily: {
      ...stats.daily,
      sessions: {
        ...stats.daily.sessions,
        [state.sessionKey]: {
          guesses: state.guesses.slice(),
          over: state.over,
          won: state.won,
          scored: state.scored,
          revealed: state.revealed,
          extended: state.extended,
        },
      },
    },
  };
  useStatsStore.getState().setStats(next);
}

function settleStreak(won: boolean, dayNum: number) {
  useStatsStore.getState().updateStats((stats) => {
    const D = { ...stats.daily };
    D.played++;
    if (won) {
      D.wins++;
      if (D.lastDay === null || D.lastDay >= dayNum - 2) {
        D.streak = D.lastDay === dayNum ? D.streak : D.streak + 1;
      } else {
        D.streak = 1;
      }
      if (D.streak > D.maxStreak) D.maxStreak = D.streak;
    } else if (D.lastDay !== dayNum) {
      D.streak = 0;
    }
    D.lastDay = dayNum;
    return { ...stats, daily: D };
  });
}

function settleCustom(won: boolean, startMs: number) {
  useStatsStore.getState().updateStats((stats) => {
    const C = { ...stats.custom };
    C.played++;
    if (won) {
      C.solved++;
      const ms = Date.now() - startMs;
      if (C.bestMs == null || ms < C.bestMs) C.bestMs = ms;
    }
    return { ...stats, custom: C };
  });
}

function endGameInternal(
  state: GameState,
  won: boolean,
  dayNum: number
): Partial<GameState> {
  const next: Partial<GameState> = {
    over: true,
    won,
    showOutPrompt: false,
    message: "",
    messageKind: null,
  };

  if (!state.scored) {
    if (state.gameMode === "daily") {
      settleStreak(won && state.guesses.length <= BASE_TRIES, dayNum);
    } else {
      settleCustom(won && state.guesses.length <= BASE_TRIES, state.startMs);
    }
    next.scored = true;
  }

  return next;
}

export const useGameStore = create<GameStore>((set, get) => ({
  ...initialState,
  dayNum: getDayNum(),

  setMode: (mode) => set({ mode }),

  setCustomConfig: (partial) =>
    set((s) => ({
      customConfig: { ...s.customConfig, ...partial },
    })),

  startGame: () => {
    const state = get();
    const cfg = activeCfg(state.mode, state.customConfig);
    const dayNum = getDayNum();
    const len = cfg.len;
    const type = cfg.type;
    let code = "";
    let guesses: string[] = [];
    let over = false;
    let won = false;
    let scored = false;
    let revealed = false;
    let extended = false;
    let max = BASE_TRIES;
    let sessionKey: string | null = null;
    let startMs = 0;

    if (state.mode === "daily") {
      code = makeCode(dailyCodeSeed(dayNum, len, type), len, type);
      sessionKey = sessionId(dayNum, len, type);
      const saved = useStatsStore.getState().stats.daily.sessions[sessionKey];
      if (saved) {
        guesses = saved.guesses.slice();
        over = saved.over;
        won = saved.won;
        scored = saved.scored;
        revealed = !!saved.revealed;
        extended = !!saved.extended;
        max = Math.max(BASE_TRIES, guesses.length + (over ? 0 : 1));
      }
    } else {
      code = makeCode(Math.floor(Math.random() * 2147483646) + 1, len, type);
      startMs = Date.now();
    }

    set({
      screen: "game",
      gameMode: state.mode,
      code,
      len,
      type,
      max,
      guesses,
      current: "",
      over,
      won,
      scored,
      revealed,
      extended,
      sessionKey,
      startMs,
      dayNum,
      message: guesses.length
        ? `${max - guesses.length} ${max - guesses.length === 1 ? "try" : "tries"} left`
        : "enter your first guess",
      messageKind: null,
      showOutPrompt: false,
      showQuitModal: false,
      showGiveUpModal: false,
      animateRow: null,
      shakeRow: false,
    });
  },

  goHome: () => {
    set({
      screen: "landing",
      showQuitModal: false,
      showGiveUpModal: false,
      showHelpModal: false,
      showOutPrompt: false,
      animateRow: null,
      shakeRow: false,
    });
  },

  addChar: (ch) => {
    const { over, current, len } = get();
    if (over || current.length >= len || current.includes(ch)) return;
    set({ current: current + ch });
  },

  deleteChar: () => {
    const { over, current } = get();
    if (over) return;
    set({ current: current.slice(0, -1) });
  },

  submit: () => {
    const state = get();
    if (state.over) return null;

    const { current, len, type, guesses, code } = state;
    const setError = (message: string) => {
      set({
        message,
        messageKind: "bad" as MessageKind,
        shakeRow: true,
      });
      return null;
    };

    if (current.length !== len) {
      return setError(`need all ${len}${type === "letters" ? " letters" : " digits"}`);
    }
    if (new Set(current).size !== len) {
      return setError(
        type === "letters"
          ? "letters must all be different"
          : "digits must all be different"
      );
    }
    if (type === "letters" && !ACCEPT[len].has(current.toLowerCase())) {
      return setError(`"${current}" isn't an English word`);
    }
    if (guesses.includes(current)) {
      return setError("already tried that code");
    }

    const nextGuesses = [...guesses, current];
    const landedRow = nextGuesses.length - 1;
    const { b } = score(current, code);

    set({
      guesses: nextGuesses,
      current: "",
      animateRow: landedRow,
      message: "",
      messageKind: null,
      shakeRow: false,
    });

    const nextState = { ...get(), guesses: nextGuesses };
    persistSession(nextState);

    if (b === len) {
      const delay = revealDuration(len);
      window.setTimeout(() => {
        const ended = endGameInternal(get(), true, get().dayNum);
        set(ended);
        persistSession({ ...get(), ...ended });
      }, delay);
      return delay;
    }

    if (state.extended) {
      const delay = revealDuration(len);
      if (nextGuesses.length >= state.max) {
        set({ max: nextGuesses.length + 1 });
      }
      set({ message: "keep going — no pressure", messageKind: null });
      return delay;
    }

    if (nextGuesses.length >= state.max) {
      const delay = revealDuration(len);
      window.setTimeout(() => {
        const s = get();
        if (s.gameMode === "daily" && !s.scored) {
          settleStreak(false, s.dayNum);
          set({ scored: true });
          persistSession({ ...get(), scored: true });
        }
        if (s.extended) {
          get().keepGoing();
        } else {
          set({ showOutPrompt: true, message: "", messageKind: null });
        }
      }, delay);
      return delay;
    }

    const left = state.max - nextGuesses.length;
    set({
      message: `${left} ${left === 1 ? "try" : "tries"} left`,
      messageKind: null,
    });
    return revealDuration(len);
  },

  giveUp: () => {
    const state = get();
    if (state.over) return;
    const ended = endGameInternal({ ...state, revealed: true }, false, state.dayNum);
    set({ ...ended, revealed: true });
    persistSession({ ...get(), ...ended, revealed: true });
  },

  keepGoing: () => {
    const state = get();
    set({
      extended: true,
      max: state.guesses.length + 1,
      showOutPrompt: false,
      message: "keep going — no pressure",
      messageKind: null,
    });
    persistSession(get());
  },

  revealCode: () => {
    const state = get();
    if (state.over) return;
    const ended = endGameInternal({ ...state, revealed: true }, false, state.dayNum);
    set({ ...ended, revealed: true, showOutPrompt: false });
    persistSession({ ...get(), ...ended, revealed: true });
  },

  setShowQuitModal: (show) => set({ showQuitModal: show }),
  setShowGiveUpModal: (show) => set({ showGiveUpModal: show }),
  setShowHelpModal: (show) => set({ showHelpModal: show }),
  clearAnimateRow: () => set({ animateRow: null }),
  clearShakeRow: () => set({ shakeRow: false }),

  getAbsentSet: () => {
    const { guesses, code } = get();
    return recomputeUsed(guesses, code).absentSet;
  },
}));

export function useGameState() {
  return useGameStore();
}
