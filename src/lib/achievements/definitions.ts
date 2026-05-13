import {
  AchievementDefinition,
  AppState,
  Family,
  PILLARS,
  Pillar,
} from "../types";
import { computeCurrentStreak } from "../streak";

function currentStreak(state: AppState): number {
  return computeCurrentStreak(state.history);
}

function totalCompleted(state: AppState): number {
  return state.history.reduce(
    (sum, d) => sum + d.tasks.filter((t) => t.completed).length,
    0
  );
}

function countByPillar(state: AppState, pillar: Pillar): number {
  return state.history.reduce(
    (sum, d) =>
      sum + d.tasks.filter((t) => t.completed && t.pillar === pillar).length,
    0
  );
}

function countByFamily(state: AppState, family: Family): number {
  return state.history.reduce(
    (sum, d) =>
      sum + d.tasks.filter((t) => t.completed && t.family === family).length,
    0
  );
}

function journalDayCount(state: AppState): number {
  return state.history.filter(
    (d) => d.journal && (d.journal.text || d.journal.mood)
  ).length;
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

// ───────────────────────── factories ─────────────────────────

function streakAch(
  goal: number,
  title: string,
  emoji: string
): AchievementDefinition {
  return {
    id: `streak-${goal}`,
    title,
    description: `連續達標 ${goal} 天（每天至少完成 1 個飲食或活動 anchor）`,
    emoji,
    category: "streak",
    check: (s) => {
      const cur = currentStreak(s);
      return { unlocked: cur >= goal, progress: Math.min(cur, goal), goal };
    },
  };
}

function totalAch(
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

function pillarAch(
  pillar: Pillar,
  goal: number,
  title: string,
  emoji: string,
  description?: string
): AchievementDefinition {
  return {
    id: `pillar-${pillar}-${goal}`,
    title,
    description: description ?? `完成 ${goal} 個${title}類任務`,
    emoji,
    category: "pillar",
    check: (s) => {
      const cur = countByPillar(s, pillar);
      return { unlocked: cur >= goal, progress: Math.min(cur, goal), goal };
    },
  };
}

function familyAch(
  family: Family,
  goal: number,
  title: string,
  emoji: string,
  description?: string
): AchievementDefinition {
  return {
    id: `family-${family}-${goal}`,
    title,
    description: description ?? `${title}：累積完成 ${goal} 次`,
    emoji,
    category: "family",
    check: (s) => {
      const cur = countByFamily(s, family);
      return { unlocked: cur >= goal, progress: Math.min(cur, goal), goal };
    },
  };
}

export const ACHIEVEMENTS: AchievementDefinition[] = [
  // Streak — anchor-aware
  streakAch(3, "三天上手", "🌱"),
  streakAch(7, "一週堅持", "🔥"),
  streakAch(14, "兩週習慣", "⚡"),
  streakAch(30, "一個月鐵粉", "🏆"),
  streakAch(60, "兩個月里程", "💎"),
  streakAch(100, "百日不墜", "👑"),

  // Total counts
  totalAch(10, "起步走", "👣"),
  totalAch(50, "半百任務", "🎯"),
  totalAch(100, "破百達人", "💯"),
  totalAch(300, "三百小成", "🥇"),
  totalAch(500, "五百中關", "🥈"),
  totalAch(1000, "千次行動", "🌟"),

  // Pillar mastery — nutrition and movement are the two anchors, weighted more
  pillarAch("nutrition", 30, "飲食 30", "🥗", "完成 30 個飲食任務"),
  pillarAch("nutrition", 100, "飲食 100", "🍱", "完成 100 個飲食任務"),
  pillarAch("movement", 30, "活動 30", "🚶", "完成 30 個活動任務"),
  pillarAch("movement", 100, "活動 100", "🏃", "完成 100 個活動任務"),
  pillarAch("recovery", 30, "恢復 30", "🌙", "完成 30 個恢復任務"),

  // Family mastery — key behavior families
  familyAch("protein-anchor", 15, "蛋白質達人", "🥚"),
  familyAch("veg-first", 15, "蔬菜先行", "🥬"),
  familyAch("post-meal-walk", 15, "餐後行者", "🚶"),
  familyAch("drink-swap", 10, "戒糖飲", "🚱"),
  familyAch("bedtime-shift", 10, "早睡冠軍", "🌜"),
  familyAch("daily-journal", 15, "日誌達人", "📓"),
  familyAch("trigger-awareness", 10, "破功觀察家", "🔍"),

  // Milestones
  {
    id: "milestone-first-day",
    title: "踏出第一步",
    description: "完成任何 1 個任務",
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
    description: "單日把所有任務（非跳過）都完成",
    emoji: "🌈",
    category: "milestone",
    check: (s) => {
      const hasPerfect = s.history.some((d) => {
        const active = d.tasks.filter((t) => !t.skipped);
        return active.length > 0 && active.every((t) => t.completed);
      });
      return { unlocked: hasPerfect, progress: hasPerfect ? 1 : 0, goal: 1 };
    },
  },
  {
    id: "pillar-collector",
    title: "四面手",
    description: "飲食、活動、恢復、加分四支柱各完成過至少 1 個任務",
    emoji: "🎨",
    category: "milestone",
    check: (s) => {
      const covered = PILLARS.filter((p) => countByPillar(s, p) > 0).length;
      return {
        unlocked: covered === PILLARS.length,
        progress: covered,
        goal: PILLARS.length,
      };
    },
  },

  // Special
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
];
