import type { GameConfig, GameType } from "@/types/game";

export const ALPHA = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
export const BASE_TRIES = 8;
export const DAILY_CFG: GameConfig = { len: 4, type: "letters" };
export const STATS_KEY = "decrypt.v5";
export const THEME_KEY = "hunch.theme";

export const DEFAULT_CUSTOM_CONFIG: GameConfig = {
  len: 4,
  type: "numbers",
};

export function getPool(type: GameType): string[] {
  return type === "letters" ? ALPHA.split("") : "0123456789".split("");
}

export const LETTER_ROWS = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"] as const;
export const NUMBER_ROWS = ["12345", "67890"] as const;

export function revealDuration(len: number): number {
  return len * 70 + Math.max(len, 1) * 60 + 260;
}
