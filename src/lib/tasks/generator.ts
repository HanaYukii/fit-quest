import {
  AppSettings,
  DailyRecord,
  DailyTask,
  TaskCategory,
  TaskTemplate,
  UserProfile,
} from "../types";
import { TASK_LIBRARY } from "./library";
import {
  computeCategoryDifficulty,
  computeRecentExecutionRate,
} from "./difficulty";

function pickRandom<T>(arr: T[]): T | undefined {
  if (arr.length === 0) return undefined;
  return arr[Math.floor(Math.random() * arr.length)];
}

function filterByProfile(
  templates: TaskTemplate[],
  profile: UserProfile
): TaskTemplate[] {
  return templates.filter((t) => {
    if (!t.excludeFor) return true;
    return !t.excludeFor.some((c) => profile.constraints.includes(c));
  });
}

function recentlyUsedTemplateIds(history: DailyRecord[], days: number): Set<string> {
  const recent = [...history]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, days);
  const ids = new Set<string>();
  for (const day of recent) {
    for (const t of day.tasks) ids.add(t.templateId);
  }
  return ids;
}

function pickForCategory(
  category: TaskCategory,
  pool: TaskTemplate[],
  history: DailyRecord[],
  recentlyUsed: Set<string>
): TaskTemplate | undefined {
  const targetDiff = computeCategoryDifficulty(history, category);

  const candidates = pool.filter((t) => t.category === category);
  if (candidates.length === 0) return undefined;

  const exact = candidates.filter(
    (t) => t.difficulty === targetDiff && !recentlyUsed.has(t.id)
  );
  if (exact.length > 0) return pickRandom(exact);

  const exactAny = candidates.filter((t) => t.difficulty === targetDiff);
  if (exactAny.length > 0) return pickRandom(exactAny);

  const sortedByDistance = [...candidates].sort(
    (a, b) =>
      Math.abs(a.difficulty - targetDiff) - Math.abs(b.difficulty - targetDiff)
  );
  return sortedByDistance[0];
}

export function generateDailyTasks(
  profile: UserProfile,
  history: DailyRecord[],
  settings: AppSettings
): DailyTask[] {
  const pool = filterByProfile(TASK_LIBRARY, profile);
  const rate = computeRecentExecutionRate(history);

  let count = settings.taskCount;
  const hasEnoughHistory = history.some((d) => d.tasks.length > 0);
  if (hasEnoughHistory) {
    if (rate < 0.4) {
      count = 3;
    } else if (rate > 0.85 && settings.taskCount < 5) {
      count = (settings.taskCount + 1) as 4 | 5;
    }
  }

  const recentlyUsed = recentlyUsedTemplateIds(history, 2);

  const required: TaskCategory[] = ["movement", "hydration", "sleep"];
  const optional: TaskCategory[] = ["diet", "mental", "reflection"];

  const chosenTemplates: TaskTemplate[] = [];
  const usedIds = new Set<string>();

  for (const cat of required) {
    if (chosenTemplates.length >= count) break;
    const tmpl = pickForCategory(cat, pool, history, recentlyUsed);
    if (tmpl && !usedIds.has(tmpl.id)) {
      chosenTemplates.push(tmpl);
      usedIds.add(tmpl.id);
    }
  }

  const optionalShuffled = [...optional].sort(() => Math.random() - 0.5);
  for (const cat of optionalShuffled) {
    if (chosenTemplates.length >= count) break;
    const tmpl = pickForCategory(cat, pool, history, recentlyUsed);
    if (tmpl && !usedIds.has(tmpl.id)) {
      chosenTemplates.push(tmpl);
      usedIds.add(tmpl.id);
    }
  }

  while (chosenTemplates.length < count) {
    const remaining = pool.filter((t) => !usedIds.has(t.id));
    if (remaining.length === 0) break;
    const t = pickRandom(remaining)!;
    chosenTemplates.push(t);
    usedIds.add(t.id);
  }

  return chosenTemplates.map((t) => ({
    instanceId: `${t.id}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    templateId: t.id,
    title: t.title,
    description: t.description,
    emoji: t.emoji,
    category: t.category,
    difficulty: t.difficulty,
    completed: false,
  }));
}
