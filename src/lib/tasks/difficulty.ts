import { DailyRecord, Difficulty, TaskCategory } from "../types";
import { shiftDateISO, todayISO } from "../date";

const STREAK_TO_INCREASE = 3;
const STREAK_TO_DECREASE = 2;
const MAX_LOOKBACK_DAYS = 14;

/**
 * Difficulty walks backward day-by-day from yesterday (today is in-progress so
 * we never count it as missed). It only counts a category as completed/missed
 * on calendar-consecutive days — any missing day breaks the chain.
 */
export function computeCategoryDifficulty(
  history: DailyRecord[],
  category: TaskCategory
): Difficulty {
  const map = new Map(history.map((d) => [d.date, d]));
  let cursor = shiftDateISO(todayISO(), -1);

  let consecCompleted = 0;
  let consecMissed = 0;
  let lastSeenDifficulty: Difficulty = 1;
  let lookedAt = 0;

  while (lookedAt < MAX_LOOKBACK_DAYS) {
    const day = map.get(cursor);
    if (!day) break;

    const catTasks = day.tasks.filter((t) => t.category === category);
    if (catTasks.length > 0) {
      if (lastSeenDifficulty === 1) {
        const max = Math.max(...catTasks.map((t) => t.difficulty)) as Difficulty;
        lastSeenDifficulty = max;
      }
      const allDone = catTasks.every((t) => t.completed);
      const anyDone = catTasks.some((t) => t.completed);
      if (allDone) {
        consecCompleted++;
        consecMissed = 0;
      } else if (!anyDone) {
        consecMissed++;
        consecCompleted = 0;
      } else {
        break;
      }
    }

    cursor = shiftDateISO(cursor, -1);
    lookedAt++;
  }

  let next: Difficulty = lastSeenDifficulty;
  if (consecCompleted >= STREAK_TO_INCREASE && next < 3) {
    next = (next + 1) as Difficulty;
  } else if (consecMissed >= STREAK_TO_DECREASE && next > 1) {
    next = (next - 1) as Difficulty;
  }
  return next;
}

export function computeRecentExecutionRate(history: DailyRecord[]): number {
  const map = new Map(history.map((d) => [d.date, d]));
  let cursor = todayISO();
  let total = 0;
  let done = 0;
  let dayCount = 0;

  while (dayCount < 7) {
    const day = map.get(cursor);
    if (day) {
      total += day.tasks.length;
      done += day.tasks.filter((t) => t.completed).length;
    }
    cursor = shiftDateISO(cursor, -1);
    dayCount++;
  }
  return total === 0 ? 1 : done / total;
}
