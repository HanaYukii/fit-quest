import { DailyRecord, DailyTask, Family, Level } from "../types";
import { shiftDateISO, todayISO } from "../date";

const STREAK_TO_INCREASE = 3;
const STREAK_TO_DECREASE = 2;
const MAX_LOOKBACK_DAYS = 14;

function activeTasks(day: DailyRecord, family: Family): DailyTask[] {
  return day.tasks.filter((t) => t.family === family && !t.skipped);
}

/**
 * Level walks backward day-by-day from yesterday, counting consecutive completed
 * or fully-missed days for this specific family. Skipped tasks are ignored
 * (a skip ≠ a miss). Missing a day breaks the chain.
 */
export function computeFamilyLevel(
  history: DailyRecord[],
  family: Family
): Level {
  const map = new Map(history.map((d) => [d.date, d]));
  let cursor = shiftDateISO(todayISO(), -1);

  let consecCompleted = 0;
  let consecMissed = 0;
  let lastSeenLevel: Level = 1;
  let looked = 0;

  while (looked < MAX_LOOKBACK_DAYS) {
    const day = map.get(cursor);
    if (!day) break;

    const tasks = activeTasks(day, family);
    if (tasks.length > 0) {
      if (lastSeenLevel === 1) {
        lastSeenLevel = Math.max(...tasks.map((t) => t.level)) as Level;
      }
      const allDone = tasks.every((t) => t.completed);
      const anyDone = tasks.some((t) => t.completed);
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
    looked++;
  }

  let next: Level = lastSeenLevel;
  if (consecCompleted >= STREAK_TO_INCREASE && next < 3) {
    next = (next + 1) as Level;
  } else if (consecMissed >= STREAK_TO_DECREASE && next > 1) {
    next = (next - 1) as Level;
  }
  return next;
}

/**
 * Recent execution rate (last 7 days). Skipped tasks excluded from both
 * numerator and denominator — they're "not applicable today," not failures.
 */
export function computeRecentExecutionRate(history: DailyRecord[]): number {
  const map = new Map(history.map((d) => [d.date, d]));
  let cursor = todayISO();
  let total = 0;
  let done = 0;
  let day = 0;

  while (day < 7) {
    const rec = map.get(cursor);
    if (rec) {
      for (const t of rec.tasks) {
        if (t.skipped) continue;
        total++;
        if (t.completed) done++;
      }
    }
    cursor = shiftDateISO(cursor, -1);
    day++;
  }
  return total === 0 ? 1 : done / total;
}
