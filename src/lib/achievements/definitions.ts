import { AchievementDefinition, AppState, TASK_CATEGORIES, TaskCategory } from "../types";

function currentStreak(state: AppState): number {
  const sorted = [...state.history].sort((a, b) => b.date.localeCompare(a.date));
  let streak = 0;
  for (const day of sorted) {
    if (day.tasks.length === 0) break;
    const rate = day.tasks.filter((t) => t.completed).length / day.tasks.length;
    if (rate >= 0.6) streak++;
    else break;
  }
  return streak;
}

function totalCompleted(state: AppState): number {
  return state.history.reduce(
    (sum, d) => sum + d.tasks.filter((t) => t.completed).length,
    0
  );
}

function countByCategory(state: AppState, cat: TaskCategory): number {
  return state.history.reduce(
    (sum, d) =>
      sum + d.tasks.filter((t) => t.completed && t.category === cat).length,
    0
  );
}

function journalDayCount(state: AppState): number {
  return state.history.filter((d) => d.journal && (d.journal.text || d.journal.mood)).length;
}

function weightDropKg(state: AppState): number {
  const start = state.profile?.startWeightKg;
  if (!start) return 0;
  const weights = state.history
    .filter((d) => d.journal?.weightKg !== undefined)
    .map((d) => d.journal!.weightKg!);
  if (weights.length === 0) return 0;
  const latest = weights[weights.length - 1];
  return Math.max(0, start - latest);
}

function makeStreakAchievement(
  goal: number,
  title: string,
  emoji: string
): AchievementDefinition {
  return {
    id: `streak-${goal}`,
    title,
    description: `連續完成主要任務 ${goal} 天`,
    emoji,
    category: "streak",
    check: (s) => {
      const cur = currentStreak(s);
      return { unlocked: cur >= goal, progress: Math.min(cur, goal), goal };
    },
  };
}

function makeTotalAchievement(
  goal: number,
  title: string,
  emoji: string
): AchievementDefinition {
  return {
    id: `total-${goal}`,
    title,
    description: `累積完成 ${goal} 個任務`,
    emoji,
    category: "count",
    check: (s) => {
      const cur = totalCompleted(s);
      return { unlocked: cur >= goal, progress: Math.min(cur, goal), goal };
    },
  };
}

function makeCategoryAchievement(
  cat: TaskCategory,
  goal: number,
  title: string,
  emoji: string
): AchievementDefinition {
  return {
    id: `cat-${cat}-${goal}`,
    title,
    description: `${title}：完成 ${goal} 個任務`,
    emoji,
    category: "category",
    check: (s) => {
      const cur = countByCategory(s, cat);
      return { unlocked: cur >= goal, progress: Math.min(cur, goal), goal };
    },
  };
}

export const ACHIEVEMENTS: AchievementDefinition[] = [
  makeStreakAchievement(3, "三天上手", "🌱"),
  makeStreakAchievement(7, "一週堅持", "🔥"),
  makeStreakAchievement(14, "兩週習慣", "⚡"),
  makeStreakAchievement(30, "一個月鐵粉", "🏆"),
  makeStreakAchievement(60, "兩個月里程", "💎"),
  makeStreakAchievement(100, "百日不墜", "👑"),

  makeTotalAchievement(10, "起步走", "👣"),
  makeTotalAchievement(50, "半百任務", "🎯"),
  makeTotalAchievement(100, "破百達人", "💯"),
  makeTotalAchievement(300, "三百小成", "🥇"),
  makeTotalAchievement(500, "五百中關", "🥈"),
  makeTotalAchievement(1000, "千次行動", "🌟"),

  makeCategoryAchievement("movement", 30, "走動派", "🚶"),
  makeCategoryAchievement("diet", 30, "節制餐桌", "🥗"),
  makeCategoryAchievement("sleep", 30, "夜行終結者", "🌙"),
  makeCategoryAchievement("hydration", 30, "補水王", "💧"),
  makeCategoryAchievement("mental", 30, "心穩定者", "🧘"),
  makeCategoryAchievement("reflection", 15, "自省鏡", "🪞"),

  {
    id: "milestone-first-day",
    title: "踏出第一步",
    description: "完成今天任何一個任務",
    emoji: "🐣",
    category: "milestone",
    check: (s) => {
      const total = totalCompleted(s);
      return { unlocked: total >= 1, progress: Math.min(total, 1), goal: 1 };
    },
  },
  {
    id: "milestone-first-week",
    title: "撐過第一週",
    description: "使用 app 7 天以上",
    emoji: "🗓️",
    category: "milestone",
    check: (s) => {
      const days = s.history.length;
      return { unlocked: days >= 7, progress: Math.min(days, 7), goal: 7 };
    },
  },
  {
    id: "milestone-perfect-day",
    title: "完美一日",
    description: "單日完成所有任務",
    emoji: "🌈",
    category: "milestone",
    check: (s) => {
      const hasPerfect = s.history.some(
        (d) => d.tasks.length > 0 && d.tasks.every((t) => t.completed)
      );
      return { unlocked: hasPerfect, progress: hasPerfect ? 1 : 0, goal: 1 };
    },
  },
  {
    id: "milestone-perfect-week",
    title: "完美一週",
    description: "連續 7 天都至少完成一個任務",
    emoji: "🎖️",
    category: "milestone",
    check: (s) => {
      const sorted = [...s.history].sort((a, b) => b.date.localeCompare(a.date));
      let count = 0;
      for (const day of sorted) {
        if (day.tasks.some((t) => t.completed)) count++;
        else break;
        if (count >= 7) break;
      }
      return { unlocked: count >= 7, progress: count, goal: 7 };
    },
  },
  {
    id: "journal-7",
    title: "寫了一週",
    description: "在日誌記錄 7 天",
    emoji: "📓",
    category: "special",
    check: (s) => {
      const c = journalDayCount(s);
      return { unlocked: c >= 7, progress: Math.min(c, 7), goal: 7 };
    },
  },
  {
    id: "journal-30",
    title: "記錄一個月",
    description: "在日誌記錄 30 天",
    emoji: "📚",
    category: "special",
    check: (s) => {
      const c = journalDayCount(s);
      return { unlocked: c >= 30, progress: Math.min(c, 30), goal: 30 };
    },
  },
  {
    id: "weight-drop-1",
    title: "輕了 1 公斤",
    description: "從起始體重下降 1 公斤",
    emoji: "⚖️",
    category: "special",
    check: (s) => {
      const drop = weightDropKg(s);
      return {
        unlocked: drop >= 1,
        progress: Math.min(Math.round(drop * 10), 10),
        goal: 10,
      };
    },
  },
  {
    id: "weight-drop-3",
    title: "輕了 3 公斤",
    description: "從起始體重下降 3 公斤",
    emoji: "🎈",
    category: "special",
    check: (s) => {
      const drop = weightDropKg(s);
      return {
        unlocked: drop >= 3,
        progress: Math.min(Math.round(drop * 10), 30),
        goal: 30,
      };
    },
  },
  {
    id: "weight-drop-5",
    title: "輕了 5 公斤",
    description: "從起始體重下降 5 公斤",
    emoji: "🪶",
    category: "special",
    check: (s) => {
      const drop = weightDropKg(s);
      return {
        unlocked: drop >= 5,
        progress: Math.min(Math.round(drop * 10), 50),
        goal: 50,
      };
    },
  },
  {
    id: "category-collector",
    title: "六面手",
    description: "六種任務類別各完成過至少一個",
    emoji: "🎨",
    category: "special",
    check: (s) => {
      const covered = TASK_CATEGORIES.filter((c) => countByCategory(s, c) > 0).length;
      return {
        unlocked: covered === TASK_CATEGORIES.length,
        progress: covered,
        goal: TASK_CATEGORIES.length,
      };
    },
  },
];
