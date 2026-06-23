import { STATS_KEY } from "@/lib/constants";
import type { StatsState } from "@/types/game";

export function freshStats(): StatsState {
  return {
    daily: {
      streak: 0,
      maxStreak: 0,
      wins: 0,
      played: 0,
      lastDay: null,
      sessions: {},
    },
    custom: {
      played: 0,
      solved: 0,
      bestMs: null,
    },
  };
}

export function loadStats(): StatsState {
  if (typeof window === "undefined") return freshStats();
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as StatsState;
      if (parsed?.daily && parsed?.custom) return parsed;
    }
  } catch {
    // ignore
  }

  const stats = freshStats();
  try {
    const oldRaw = localStorage.getItem("decrypt.v4");
    if (oldRaw) {
      const old = JSON.parse(oldRaw) as {
        streak?: number;
        maxStreak?: number;
        wins?: number;
        played?: number;
        lastDay?: number | null;
        sessions?: StatsState["daily"]["sessions"];
      };
      stats.daily.streak = old.streak || 0;
      stats.daily.maxStreak = old.maxStreak || 0;
      stats.daily.wins = old.wins || 0;
      stats.daily.played = old.played || 0;
      stats.daily.lastDay = old.lastDay ?? null;
      stats.daily.sessions = old.sessions || {};
    }
  } catch {
    // ignore
  }
  return stats;
}

export function saveStats(stats: StatsState): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch {
    // ignore
  }
}
