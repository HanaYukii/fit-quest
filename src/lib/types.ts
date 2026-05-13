export type TaskCategory =
  | "movement"
  | "diet"
  | "sleep"
  | "hydration"
  | "mental"
  | "reflection";

export const TASK_CATEGORIES: TaskCategory[] = [
  "movement",
  "diet",
  "sleep",
  "hydration",
  "mental",
  "reflection",
];

export type Difficulty = 1 | 2 | 3;

export type Constraint =
  | "knee-issue"
  | "back-issue"
  | "diabetic"
  | "hypertension"
  | "vegetarian"
  | "no-equipment"
  | "small-space"
  | "late-sleeper";

export const CONSTRAINT_LABELS: Record<Constraint, string> = {
  "knee-issue": "膝蓋不舒服（避免跳躍/高衝擊）",
  "back-issue": "背部不適",
  diabetic: "血糖控制中（注意精緻澱粉）",
  hypertension: "高血壓（注意鹽分）",
  vegetarian: "素食",
  "no-equipment": "沒運動器材",
  "small-space": "居家空間小",
  "late-sleeper": "容易晚睡",
};

export interface TaskTemplate {
  id: string;
  category: TaskCategory;
  difficulty: Difficulty;
  title: string;
  description?: string;
  emoji: string;
  excludeFor?: Constraint[];
  estimatedMinutes?: number;
}

export interface DailyTask {
  instanceId: string;
  templateId: string;
  title: string;
  description?: string;
  emoji: string;
  category: TaskCategory;
  difficulty: Difficulty;
  completed: boolean;
  completedAt?: string;
}

export interface JournalEntry {
  mood?: 1 | 2 | 3 | 4 | 5;
  weightKg?: number;
  text?: string;
  updatedAt: string;
}

export interface DailyRecord {
  date: string;
  tasks: DailyTask[];
  journal?: JournalEntry;
}

export interface UserProfile {
  nickname: string;
  birthYear?: number;
  heightCm?: number;
  startWeightKg?: number;
  currentWeightKg?: number;
  targetWeightKg?: number;
  constraints: Constraint[];
  wakeTime?: string;
  sleepTime?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type AchievementCategory =
  | "streak"
  | "count"
  | "milestone"
  | "category"
  | "special";

export interface AchievementDefinition {
  id: string;
  title: string;
  description: string;
  emoji: string;
  category: AchievementCategory;
  check: (state: AppState) => { unlocked: boolean; progress: number; goal: number };
}

export interface UnlockedAchievement {
  id: string;
  unlockedAt: string;
}

export interface AppSettings {
  notifications: boolean;
  reminderTimes: string[];
  taskCount: 3 | 4 | 5;
  theme: "auto" | "light" | "dark";
}

export interface AppState {
  schemaVersion: 1;
  profile: UserProfile | null;
  history: DailyRecord[];
  unlockedAchievements: UnlockedAchievement[];
  settings: AppSettings;
}

export const DEFAULT_SETTINGS: AppSettings = {
  notifications: false,
  reminderTimes: ["09:00", "13:00", "19:00", "22:30"],
  taskCount: 4,
  theme: "auto",
};

export const DEFAULT_STATE: AppState = {
  schemaVersion: 1,
  profile: null,
  history: [],
  unlockedAchievements: [],
  settings: DEFAULT_SETTINGS,
};

export const CATEGORY_LABELS: Record<TaskCategory, string> = {
  movement: "運動",
  diet: "飲食",
  sleep: "作息",
  hydration: "補水",
  mental: "心理",
  reflection: "反思",
};

export const CATEGORY_COLORS: Record<TaskCategory, string> = {
  movement: "bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300",
  diet: "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300",
  sleep: "bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300",
  hydration: "bg-cyan-100 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300",
  mental: "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300",
  reflection: "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300",
};

export const CATEGORY_ACCENT: Record<TaskCategory, string> = {
  movement: "text-sky-600 dark:text-sky-400",
  diet: "text-orange-600 dark:text-orange-400",
  sleep: "text-indigo-600 dark:text-indigo-400",
  hydration: "text-cyan-600 dark:text-cyan-400",
  mental: "text-violet-600 dark:text-violet-400",
  reflection: "text-rose-600 dark:text-rose-400",
};

export const MOOD_LABELS: Record<1 | 2 | 3 | 4 | 5, { emoji: string; label: string }> = {
  1: { emoji: "😞", label: "很低落" },
  2: { emoji: "😕", label: "有點悶" },
  3: { emoji: "😐", label: "普通" },
  4: { emoji: "🙂", label: "不錯" },
  5: { emoji: "😄", label: "很棒" },
};
