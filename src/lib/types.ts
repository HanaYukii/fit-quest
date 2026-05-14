// ───────────────────────── Pillar / Family ─────────────────────────

export type Pillar = "nutrition" | "movement" | "recovery" | "bonus";

export const PILLARS: Pillar[] = ["nutrition", "movement", "recovery", "bonus"];

export const PILLAR_LABELS: Record<Pillar, string> = {
  nutrition: "飲食",
  movement: "活動",
  recovery: "恢復",
  bonus: "加分",
};

export const PILLAR_COLORS: Record<Pillar, string> = {
  nutrition:
    "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300",
  movement: "bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300",
  recovery:
    "bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300",
  bonus: "bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300",
};

export const PILLAR_ACCENT: Record<Pillar, string> = {
  nutrition: "text-orange-600 dark:text-orange-400",
  movement: "text-sky-600 dark:text-sky-400",
  recovery: "text-indigo-600 dark:text-indigo-400",
  bonus: "text-stone-600 dark:text-stone-400",
};

export type Family =
  // nutrition
  | "veg-first"
  | "protein-anchor"
  | "drink-swap"
  | "portion"
  | "meal-photo"
  | "slow-eating"
  | "carb-quality"
  | "no-late-snack"
  | "pre-meal-consult"
  // movement
  | "post-meal-walk"
  | "daily-steps"
  | "neat-boost"
  | "low-impact-strength"
  // recovery
  | "bedtime-shift"
  | "device-free-night"
  | "caffeine-cutoff"
  | "morning-light"
  | "pre-sleep-routine"
  | "stress-pause"
  | "self-compassion"
  | "trigger-awareness"
  | "daily-journal"
  // bonus
  | "hydration"
  | "environment-prep";

export const FAMILY_PILLAR: Record<Family, Pillar> = {
  "veg-first": "nutrition",
  "protein-anchor": "nutrition",
  "drink-swap": "nutrition",
  portion: "nutrition",
  "meal-photo": "nutrition",
  "slow-eating": "nutrition",
  "carb-quality": "nutrition",
  "no-late-snack": "nutrition",
  "pre-meal-consult": "nutrition",
  "post-meal-walk": "movement",
  "daily-steps": "movement",
  "neat-boost": "movement",
  "low-impact-strength": "movement",
  "bedtime-shift": "recovery",
  "device-free-night": "recovery",
  "caffeine-cutoff": "recovery",
  "morning-light": "recovery",
  "pre-sleep-routine": "recovery",
  "stress-pause": "recovery",
  "self-compassion": "recovery",
  "trigger-awareness": "recovery",
  "daily-journal": "recovery",
  hydration: "bonus",
  "environment-prep": "bonus",
};

export const FAMILY_LABELS: Record<Family, string> = {
  "veg-first": "先吃菜",
  "protein-anchor": "蛋白質錨點",
  "drink-swap": "飲料替換",
  portion: "份量控制",
  "meal-photo": "餐照紀錄",
  "slow-eating": "細嚼慢嚥",
  "carb-quality": "主食選擇",
  "no-late-snack": "節制零食",
  "pre-meal-consult": "餐前自我諮詢",
  "post-meal-walk": "餐後散步",
  "daily-steps": "每日步數",
  "neat-boost": "起身活動",
  "low-impact-strength": "低衝擊肌力",
  "bedtime-shift": "提早上床",
  "device-free-night": "睡前無手機",
  "caffeine-cutoff": "咖啡因截止",
  "morning-light": "晨光曝曬",
  "pre-sleep-routine": "睡前儀式",
  "stress-pause": "壓力暫停",
  "self-compassion": "自我肯定",
  "trigger-awareness": "破功觀察",
  "daily-journal": "每日日誌",
  hydration: "補水",
  "environment-prep": "環境準備",
};

export type Level = 1 | 2 | 3;
export type Friction = "low" | "medium" | "high";
export type Verification = "self-report" | "photo" | "timer" | "count";

// ───────────────────────── Constraints ─────────────────────────

export type Constraint =
  | "knee-issue"
  | "back-issue"
  | "diabetic"
  | "hypertension"
  | "vegetarian"
  | "no-equipment"
  | "small-space"
  | "late-sleeper"
  | "fluid-restriction";

export const CONSTRAINT_LABELS: Record<Constraint, string> = {
  "knee-issue": "膝蓋不舒服（避免跳躍/高衝擊）",
  "back-issue": "背部不適",
  diabetic: "血糖控制中（注意精緻澱粉）",
  hypertension: "高血壓（注意鹽分）",
  vegetarian: "素食",
  "no-equipment": "沒運動器材",
  "small-space": "居家空間小",
  "late-sleeper": "容易晚睡（建議用「比平常早」的時點）",
  "fluid-restriction": "醫囑限水（腎臟病/透析/心衰竭等，水量需依醫療人員指示）",
};

// ───────────────────────── Profile ─────────────────────────

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

// ───────────────────────── Task templates / instances ─────────────────────────

/**
 * When set, the task is tracked as a tally (tap-to-increment counter) rather
 * than a single checkbox. The task auto-completes once tallyCount >= target.
 */
export interface TallyConfig {
  unit: string; // e.g. "杯", "次"
  target: number; // e.g. 8
}

export interface TaskTemplate {
  id: string;
  family: Family;
  pillar: Pillar;
  level: Level;
  emoji: string;
  /** Static title used when no profile-driven build is provided. */
  title: string;
  description?: string;
  effortMinutes?: number;
  friction: Friction;
  verification: Verification;
  /** If set, this is a repeatable tally task. */
  tally?: TallyConfig;
  /** Profile-driven tally (e.g., hydration scaled by body weight). Replaces `tally` when set. */
  buildTally?: (profile: UserProfile) => TallyConfig;
  /** Skip this template if user has any of these constraints. */
  excludeFor?: Constraint[];
  /** Boost selection weight if user has any of these (constraint-aware preference). */
  preferFor?: Constraint[];
  /** Profile-driven title (e.g., "比 {sleepTime} 早 15 分鐘"). When set, replaces static title. */
  buildTitle?: (profile: UserProfile) => string;
  buildDescription?: (profile: UserProfile) => string | undefined;
}

export interface DailyTask {
  instanceId: string;
  templateId: string;
  title: string;
  description?: string;
  emoji: string;
  family: Family;
  pillar: Pillar;
  level: Level;
  friction: Friction;
  verification: Verification;
  /** Snapshot of tally config from template (if any), so per-instance behaviour is stable. */
  tally?: TallyConfig;
  /** Current tally count for repeatable tasks. Undefined for non-tally tasks. */
  tallyCount?: number;
  completed: boolean;
  completedAt?: string;
  skipped: boolean;
  skippedAt?: string;
}

// ───────────────────────── Journal / records ─────────────────────────

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

// ───────────────────────── Achievements ─────────────────────────

export type AchievementCategory =
  | "streak"
  | "count"
  | "milestone"
  | "pillar"
  | "family"
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

// ───────────────────────── Settings + state ─────────────────────────

export interface AppSettings {
  notifications: boolean;
  reminderTimes: string[];
  taskCount: 3 | 4 | 5;
  theme: "auto" | "light" | "dark";
  /** Families that should appear in the daily list every day, on top of the rotating quota. */
  pinnedFamilies: Family[];
  /** Optional: user-provided Gemini API key for the in-app coach. Stored in localStorage. */
  geminiKey?: string;
}

export interface AppState {
  schemaVersion: 2;
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
  pinnedFamilies: ["hydration"],
};

export const DEFAULT_STATE: AppState = {
  schemaVersion: 2,
  profile: null,
  history: [],
  unlockedAchievements: [],
  settings: DEFAULT_SETTINGS,
};

// ───────────────────────── Mood ─────────────────────────

export const MOOD_LABELS: Record<
  1 | 2 | 3 | 4 | 5,
  { emoji: string; label: string }
> = {
  1: { emoji: "😞", label: "很低落" },
  2: { emoji: "😕", label: "有點悶" },
  3: { emoji: "😐", label: "普通" },
  4: { emoji: "🙂", label: "不錯" },
  5: { emoji: "😄", label: "很棒" },
};
