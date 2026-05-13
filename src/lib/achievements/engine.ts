import { AppState, UnlockedAchievement } from "../types";
import { ACHIEVEMENTS } from "./definitions";

export interface AchievementStatus {
  id: string;
  unlocked: boolean;
  unlockedAt?: string;
  progress: number;
  goal: number;
}

export function evaluateAchievements(state: AppState): AchievementStatus[] {
  return ACHIEVEMENTS.map((def) => {
    const { unlocked, progress, goal } = def.check(state);
    const existing = state.unlockedAchievements.find((u) => u.id === def.id);
    return {
      id: def.id,
      unlocked,
      unlockedAt: existing?.unlockedAt,
      progress,
      goal,
    };
  });
}

export function findNewlyUnlocked(state: AppState): UnlockedAchievement[] {
  const now = new Date().toISOString();
  const alreadyUnlocked = new Set(state.unlockedAchievements.map((u) => u.id));
  const newly: UnlockedAchievement[] = [];
  for (const def of ACHIEVEMENTS) {
    if (alreadyUnlocked.has(def.id)) continue;
    const { unlocked } = def.check(state);
    if (unlocked) newly.push({ id: def.id, unlockedAt: now });
  }
  return newly;
}
