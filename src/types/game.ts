export type GameMode = "daily" | "custom";
export type GameType = "letters" | "numbers";
export type Screen = "landing" | "game";

export interface GameConfig {
  len: 4 | 5;
  type: GameType;
}

export interface GuessResult {
  b: number;
  c: number;
}

export interface SessionState {
  guesses: string[];
  over: boolean;
  won: boolean;
  scored: boolean;
  revealed: boolean;
  extended: boolean;
}

export interface DailyStats {
  streak: number;
  maxStreak: number;
  wins: number;
  played: number;
  lastDay: number | null;
  sessions: Record<string, SessionState>;
}

export interface CustomStats {
  played: number;
  solved: number;
  bestMs: number | null;
}

export interface StatsState {
  daily: DailyStats;
  custom: CustomStats;
}

export type MessageKind = "good" | "bad" | null;

export interface GameState {
  screen: Screen;
  mode: GameMode;
  gameMode: GameMode;
  customConfig: GameConfig;
  code: string;
  len: number;
  type: GameType;
  max: number;
  guesses: string[];
  current: string;
  over: boolean;
  won: boolean;
  scored: boolean;
  revealed: boolean;
  extended: boolean;
  sessionKey: string | null;
  startMs: number;
  message: string;
  messageKind: MessageKind;
  showOutPrompt: boolean;
  showQuitModal: boolean;
  showGiveUpModal: boolean;
  showHelpModal: boolean;
  animateRow: number | null;
  shakeRow: boolean;
}
