import { ANSWERS } from "@/lib/words";
import type { GameType } from "@/types/game";

export function getDayNum(date = new Date()): number {
  return Math.floor(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) /
      86400000
  );
}

export function rng(seed: number): () => number {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return s / 2147483647;
  };
}

const uniqLetters = (w: string) => new Set(w).size === w.length;

const UNIQ_ANSWERS: Record<number, string[]> = {
  4: Array.from(ANSWERS[4]).filter(uniqLetters),
  5: Array.from(ANSWERS[5]).filter(uniqLetters),
};

export function makeCode(seed: number, len: number, type: GameType): string {
  if (type === "letters") {
    const list = UNIQ_ANSWERS[len];
    const r = rng(seed);
    return list[Math.floor(r() * list.length)].toUpperCase();
  }
  const pool = "0123456789".split("");
  const r = rng(seed);
  const a = pool.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a.slice(0, len).join("");
}

export function score(
  guess: string,
  code: string
): { b: number; c: number } {
  let b = 0;
  let c = 0;
  const codeRem: Record<string, number> = {};
  const guessRem: string[] = [];
  for (let i = 0; i < guess.length; i++) {
    if (guess[i] === code[i]) {
      b++;
    } else {
      codeRem[code[i]] = (codeRem[code[i]] || 0) + 1;
      guessRem.push(guess[i]);
    }
  }
  for (const ch of guessRem) {
    if (codeRem[ch] > 0) {
      c++;
      codeRem[ch]--;
    }
  }
  return { b, c };
}

export function solvedInAllotment(
  won: boolean,
  guessesLength: number,
  baseTries: number
): boolean {
  return won && guessesLength <= baseTries;
}

export function sessionId(dayNum: number, len: number, type: GameType): string {
  return `${dayNum}|${len}|${type}`;
}

export function fmtTime(ms: number | null): string {
  if (ms == null) return "—";
  const s = Math.round(ms / 1000);
  const m = Math.floor(s / 60);
  const ss = s % 60;
  return m > 0 ? `${m}:${String(ss).padStart(2, "0")}` : `${ss}s`;
}

export function dailyCodeSeed(
  dayNum: number,
  len: number,
  type: GameType
): number {
  return dayNum * 7919 + len * 101 + (type === "letters" ? 500 : 0) + 13;
}
