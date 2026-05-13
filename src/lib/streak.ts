import { DailyRecord } from "./types";
import { shiftDateISO, todayISO } from "./date";

const MIN_RATE = 0.6;

/**
 * A day counts toward the streak only if BOTH conditions hold (excluding skips):
 *   1. ≥60% of non-skipped tasks completed
 *   2. At least one nutrition OR movement task completed (anchor rule)
 *
 * The anchor rule prevents accumulating streaks purely on hydration and
 * journaling without engaging the two biggest weight-loss levers.
 */
function isStreakDay(day: DailyRecord): boolean {
  const active = day.tasks.filter((t) => !t.skipped);
  if (active.length === 0) return false;

  const completed = active.filter((t) => t.completed);
  if (completed.length / active.length < MIN_RATE) return false;

  const hasAnchor = completed.some(
    (t) => t.pillar === "nutrition" || t.pillar === "movement"
  );
  return hasAnchor;
}

export function computeCurrentStreak(history: DailyRecord[]): number {
  const map = new Map(history.map((d) => [d.date, d]));
  const today = todayISO();
  let cursor = today;
  let streak = 0;

  // Today is in progress — allow skipping past it to yesterday if not yet a streak day.
  const todayDay = map.get(today);
  if (!todayDay || !isStreakDay(todayDay)) {
    cursor = shiftDateISO(today, -1);
  }

  while (true) {
    const day = map.get(cursor);
    if (!day || !isStreakDay(day)) break;
    streak++;
    cursor = shiftDateISO(cursor, -1);
  }
  return streak;
}

export function computeLongestStreak(history: DailyRecord[]): number {
  const sorted = [...history].sort((a, b) => a.date.localeCompare(b.date));
  let best = 0;
  let cur = 0;
  let prevDate: string | null = null;

  for (const day of sorted) {
    if (!isStreakDay(day)) {
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
