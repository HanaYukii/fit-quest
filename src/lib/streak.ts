import { DailyRecord } from "./types";
import { shiftDateISO, todayISO } from "./date";

const MIN_RATE = 0.6;

function isComplete(day: DailyRecord): boolean {
  if (day.tasks.length === 0) return false;
  const rate = day.tasks.filter((t) => t.completed).length / day.tasks.length;
  return rate >= MIN_RATE;
}

/**
 * Current streak counts consecutive calendar-day completions ending at today
 * (or yesterday, if today is not complete yet). A missing day or a day below
 * the completion threshold breaks the streak — no carry-over across gaps.
 */
export function computeCurrentStreak(history: DailyRecord[]): number {
  const map = new Map(history.map((d) => [d.date, d]));
  const today = todayISO();
  let cursor = today;
  let streak = 0;

  const todayDay = map.get(today);
  if (!todayDay || !isComplete(todayDay)) {
    cursor = shiftDateISO(today, -1);
  }

  while (true) {
    const day = map.get(cursor);
    if (!day || !isComplete(day)) break;
    streak++;
    cursor = shiftDateISO(cursor, -1);
  }
  return streak;
}

/**
 * Longest streak across all history — calendar-consecutive only. Any date gap
 * (missing day or below-threshold day) resets the running count.
 */
export function computeLongestStreak(history: DailyRecord[]): number {
  const sorted = [...history].sort((a, b) => a.date.localeCompare(b.date));
  let best = 0;
  let cur = 0;
  let prevDate: string | null = null;

  for (const day of sorted) {
    if (!isComplete(day)) {
      cur = 0;
      prevDate = null;
      continue;
    }
    if (prevDate === null || shiftDateISO(prevDate, 1) === day.date) {
      cur++;
    } else {
      cur = 1;
    }
    best = Math.max(best, cur);
    prevDate = day.date;
  }
  return best;
}
