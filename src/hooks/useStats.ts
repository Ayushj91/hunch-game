"use client";

import { create } from "zustand";
import { loadStats, saveStats } from "@/lib/storage";
import type { StatsState } from "@/types/game";

interface StatsStore {
  stats: StatsState;
  hydrated: boolean;
  hydrate: () => void;
  setStats: (stats: StatsState) => void;
  updateStats: (updater: (stats: StatsState) => StatsState) => void;
}

export const useStatsStore = create<StatsStore>((set, get) => ({
  stats: freshEmpty(),
  hydrated: false,
  hydrate: () => {
    const stats = loadStats();
    set({ stats, hydrated: true });
  },
  setStats: (stats) => {
    saveStats(stats);
    set({ stats });
  },
  updateStats: (updater) => {
    const next = updater(get().stats);
    saveStats(next);
    set({ stats: next });
  },
}));

function freshEmpty(): StatsState {
  return {
    daily: {
      streak: 0,
      maxStreak: 0,
      wins: 0,
      played: 0,
      lastDay: null,
      sessions: {},
    },
    custom: { played: 0, solved: 0, bestMs: null },
  };
}

export function useStats() {
  const stats = useStatsStore((s) => s.stats);
  const hydrated = useStatsStore((s) => s.hydrated);
  const hydrate = useStatsStore((s) => s.hydrate);
  const updateStats = useStatsStore((s) => s.updateStats);
  return { stats, hydrated, hydrate, updateStats };
}
