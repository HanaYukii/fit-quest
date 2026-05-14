import {
  AppSettings,
  DailyRecord,
  DailyTask,
  FAMILY_PILLAR,
  Family,
  Level,
  Pillar,
  TaskTemplate,
  UserProfile,
} from "../types";
import { TASK_LIBRARY } from "./library";
import { computeFamilyLevel, computeRecentExecutionRate } from "./difficulty";

function pickRandom<T>(arr: T[]): T | undefined {
  if (arr.length === 0) return undefined;
  return arr[Math.floor(Math.random() * arr.length)];
}

function filterForProfile(
  templates: TaskTemplate[],
  profile: UserProfile
): TaskTemplate[] {
  return templates.filter((t) => {
    if (!t.excludeFor) return true;
    return !t.excludeFor.some((c) => profile.constraints.includes(c));
  });
}

function recentlyUsedFamilies(history: DailyRecord[], days: number): Set<Family> {
  const recent = [...history]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, days);
  const set = new Set<Family>();
  for (const d of recent) {
    for (const t of d.tasks) set.add(t.family);
  }
  return set;
}

function pickFamilyForPillar(
  pillar: Pillar,
  pool: TaskTemplate[],
  recent: Set<Family>,
  alreadyPicked: Set<Family>
): Family | undefined {
  const families = Array.from(
    new Set(
      pool.filter((t) => t.pillar === pillar).map((t) => t.family)
    )
  ).filter((f) => !alreadyPicked.has(f));
  if (families.length === 0) return undefined;

  const fresh = families.filter((f) => !recent.has(f));
  if (fresh.length > 0) return pickRandom(fresh);
  return pickRandom(families);
}

function pickTemplateForFamily(
  family: Family,
  level: Level,
  pool: TaskTemplate[]
): TaskTemplate | undefined {
  const sameFamily = pool.filter((t) => t.family === family);
  if (sameFamily.length === 0) return undefined;
  const exact = sameFamily.filter((t) => t.level === level);
  if (exact.length > 0) return pickRandom(exact);
  // Fall back to nearest level (e.g., requested L3 but only L2 exists for this family)
  return sameFamily.sort(
    (a, b) => Math.abs(a.level - level) - Math.abs(b.level - level)
  )[0];
}

function materialize(template: TaskTemplate, profile: UserProfile): DailyTask {
  const title = template.buildTitle ? template.buildTitle(profile) : template.title;
  const description = template.buildDescription
    ? template.buildDescription(profile)
    : template.description;
  const tally = template.buildTally
    ? template.buildTally(profile)
    : template.tally;
  return {
    instanceId: `${template.id}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    templateId: template.id,
    title,
    description,
    emoji: template.emoji,
    family: template.family,
    pillar: template.pillar,
    level: template.level,
    friction: template.friction,
    verification: template.verification,
    tally,
    tallyCount: tally ? 0 : undefined,
    completed: false,
    skipped: false,
  };
}

/**
 * Pillar quotas decide the shape of the day. Nutrition leads because diet is
 * the largest lever for weight management; hydration sits in the "bonus" pool
 * so it can support the day without crowding out anchors.
 */
function pillarSlots(count: 3 | 4 | 5): Pillar[] {
  if (count === 3) return ["nutrition", "movement", "recovery"];
  if (count === 4) return ["nutrition", "movement", "recovery", "bonus"];
  return ["nutrition", "movement", "recovery", "nutrition", "bonus"];
}

export function generateDailyTasks(
  profile: UserProfile,
  history: DailyRecord[],
  settings: AppSettings
): DailyTask[] {
  const pool = filterForProfile(TASK_LIBRARY, profile);
  const pinned = settings.pinnedFamilies ?? [];

  const out: DailyTask[] = [];
  const picked = new Set<Family>();

  // 1) Pinned families always come first and don't count against the rotating quota.
  for (const family of pinned) {
    const level = computeFamilyLevel(history, family);
    const tmpl = pickTemplateForFamily(family, level, pool);
    if (tmpl) {
      out.push(materialize(tmpl, profile));
      picked.add(family);
    }
  }

  // 2) Decide rotating count from execution rate (only after we have real signal).
  let count: 3 | 4 | 5 = settings.taskCount;
  const hasEnoughHistory = history.some((d) => d.tasks.length > 0);
  if (hasEnoughHistory) {
    const rate = computeRecentExecutionRate(history);
    if (rate < 0.4) count = 3;
    else if (rate > 0.85 && settings.taskCount < 5)
      count = (settings.taskCount + 1) as 4 | 5;
  }

  const slots = pillarSlots(count);
  const recent = recentlyUsedFamilies(history, 2);
  const rotatingTargetLength = out.length + count;

  for (const pillar of slots) {
    if (out.length >= rotatingTargetLength) break;
    const family = pickFamilyForPillar(pillar, pool, recent, picked);
    if (!family) continue;
    picked.add(family);
    const level = computeFamilyLevel(history, family);
    const tmpl = pickTemplateForFamily(family, level, pool);
    if (!tmpl) continue;
    out.push(materialize(tmpl, profile));
  }

  while (out.length < rotatingTargetLength) {
    const remaining = Array.from(
      new Set(pool.map((t) => t.family).filter((f) => !picked.has(f)))
    );
    if (remaining.length === 0) break;
    const family = pickRandom(remaining)!;
    picked.add(family);
    const level = computeFamilyLevel(history, family);
    const tmpl = pickTemplateForFamily(family, level, pool);
    if (!tmpl) continue;
    out.push(materialize(tmpl, profile));
  }

  return out;
}

/**
 * If the user pinned a family AFTER today's tasks were already generated,
 * `ensureTodayTasks` calls this to backfill — appends the missing pinned
 * families to today's list without disturbing existing progress.
 */
export function pickMissingPinnedTasks(
  profile: UserProfile,
  history: DailyRecord[],
  existing: DailyTask[],
  pinned: Family[]
): DailyTask[] {
  if (pinned.length === 0) return [];
  const presentFamilies = new Set(existing.map((t) => t.family));
  const missing = pinned.filter((f) => !presentFamilies.has(f));
  if (missing.length === 0) return [];

  const pool = filterForProfile(TASK_LIBRARY, profile);
  const out: DailyTask[] = [];
  for (const family of missing) {
    const level = computeFamilyLevel(history, family);
    const tmpl = pickTemplateForFamily(family, level, pool);
    if (tmpl) out.push(materialize(tmpl, profile));
  }
  return out;
}

/**
 * Pick one additional task that's NOT in the existing list — used by the
 * "加一個任務" refresh button on the home page. Prefers a family from a pillar
 * not yet represented today, falls back to any unused family.
 */
export function pickAdditionalTask(
  profile: UserProfile,
  history: DailyRecord[],
  existing: DailyTask[]
): DailyTask | null {
  const pool = filterForProfile(TASK_LIBRARY, profile);
  const usedFamilies = new Set(existing.map((t) => t.family));
  const remainingFamilies = Array.from(
    new Set(pool.map((t) => t.family).filter((f) => !usedFamilies.has(f)))
  );
  if (remainingFamilies.length === 0) return null;

  const usedPillars = new Set(existing.map((t) => t.pillar));
  const preferred = remainingFamilies.filter(
    (f) => !usedPillars.has(FAMILY_PILLAR[f])
  );
  const candidateFamilies = preferred.length > 0 ? preferred : remainingFamilies;
  const family = pickRandom(candidateFamilies);
  if (!family) return null;

  const level = computeFamilyLevel(history, family);
  const template = pickTemplateForFamily(family, level, pool);
  if (!template) return null;
  return materialize(template, profile);
}

// Re-export for backward references that may import from generator
export { FAMILY_PILLAR };
