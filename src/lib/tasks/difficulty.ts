import { DailyRecord, Difficulty, TaskCategory } from "../types";

const STREAK_TO_INCREASE = 3;
const STREAK_TO_DECREASE = 2;

export function computeCategoryDifficulty(
  history: DailyRecord[],
  category: TaskCategory
): Difficulty {
  const recent = [...history]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 7);

  let consecCompleted = 0;
  let consecMissed = 0;
  let lastSeenDifficulty: Difficulty = 1;

  for (const day of recent) {
    const catTasks = day.tasks.filter((t) => t.category === category);
    if (catTasks.length === 0) continue;

    const allDone = catTasks.every((t) => t.completed);
    const anyDone = catTasks.some((t) => t.completed);

    if (lastSeenDifficulty === 1) {
      const max = Math.max(...catTasks.map((t) => t.difficulty)) as Difficulty;
      lastSeenDifficulty = max;
    }

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

  let next: Difficulty = lastSeenDifficulty;
  if (consecCompleted >= STREAK_TO_INCREASE && next < 3) {
    next = (next + 1) as Difficulty;
  } else if (consecMissed >= STREAK_TO_DECREASE && next > 1) {
    next = (next - 1) as Difficulty;
  }
  return next;
}

export function computeRecentExecutionRate(history: DailyRecord[]): number {
  const recent = [...history]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 7);
  if (recent.length === 0) return 1;

  let total = 0;
  let done = 0;
  for (const day of recent) {
    total += day.tasks.length;
    done += day.tasks.filter((t) => t.completed).length;
  }
  return total === 0 ? 1 : done / total;
}
