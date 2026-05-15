"use client";

import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  AppSettings,
  AppState,
  DEFAULT_STATE,
  DailyRecord,
  DailyTask,
  JournalEntry,
  UserProfile,
} from "./types";
import { loadState, saveState } from "./storage";
import {
  generateDailyTasks,
  pickAdditionalTask,
  pickMissingPinnedTasks,
} from "./tasks/generator";
import { findNewlyUnlocked } from "./achievements/engine";
import { todayISO } from "./date";
import { ACHIEVEMENTS } from "./achievements/definitions";

type SetState = (updater: (prev: AppState) => AppState) => void;

interface StoreContextValue {
  state: AppState;
  loaded: boolean;
  todayRecord: DailyRecord | null;
  newAchievementsToShow: string[];
  acknowledgeAchievements: () => void;
  setProfile: (profile: UserProfile) => void;
  toggleTask: (instanceId: string) => void;
  skipTask: (instanceId: string) => void;
  incrementTally: (instanceId: string, delta?: number) => void;
  addOneMoreTask: () => "ok" | "none-left" | "no-profile";
  saveJournal: (date: string, entry: Partial<JournalEntry>) => void;
  ensureTodayTasks: () => void;
  regenerateTodayTasks: () => void;
  updateSettings: (patch: Partial<AppSettings>) => void;
  resetAll: () => void;
}

const StoreContext = createContext<StoreContextValue | null>(null);

function withTodayRecord(state: AppState, date: string): {
  state: AppState;
  record: DailyRecord;
} {
  const existing = state.history.find((d) => d.date === date);
  if (existing) return { state, record: existing };
  const newRec: DailyRecord = { date, tasks: [] };
  return {
    state: { ...state, history: [...state.history, newRec] },
    record: newRec,
  };
}

function applyAchievementUnlocks(state: AppState): AppState {
  const newly = findNewlyUnlocked(state);
  if (newly.length === 0) return state;
  return {
    ...state,
    unlockedAchievements: [...state.unlockedAchievements, ...newly],
  };
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setRawState] = useState<AppState>(DEFAULT_STATE);
  const [loaded, setLoaded] = useState(false);
  const [pendingAchievements, setPendingAchievements] = useState<string[]>([]);
  const baselineUnlockedRef = useRef<Set<string> | null>(null);

  useEffect(() => {
    setRawState(loadState());
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) saveState(state);
  }, [state, loaded]);

  useEffect(() => {
    if (!loaded) return;
    if (baselineUnlockedRef.current === null) {
      baselineUnlockedRef.current = new Set(
        state.unlockedAchievements.map((a) => a.id)
      );
      return;
    }
    const baseline = baselineUnlockedRef.current;
    const newIds = state.unlockedAchievements
      .filter((a) => !baseline.has(a.id))
      .map((a) => a.id);
    if (newIds.length > 0) {
      setPendingAchievements((prev) => {
        const merged = new Set([...prev, ...newIds]);
        return Array.from(merged);
      });
      for (const id of newIds) baseline.add(id);
    }
  }, [loaded, state.unlockedAchievements]);

  const update: SetState = useCallback((updater) => {
    setRawState((prev) => {
      const next = updater(prev);
      return applyAchievementUnlocks(next);
    });
  }, []);

  const today = todayISO();

  const todayRecord = useMemo(
    () => state.history.find((d) => d.date === today) ?? null,
    [state.history, today]
  );

  const setProfile = useCallback(
    (profile: UserProfile) => {
      update((prev) => ({ ...prev, profile }));
    },
    [update]
  );

  const ensureTodayTasks = useCallback(() => {
    update((prev) => {
      if (!prev.profile) return prev;
      const existing = prev.history.find((d) => d.date === today);
      const pinned = prev.settings.pinnedFamilies ?? [];

      if (existing && existing.tasks.length > 0) {
        // Backfill any pinned families that aren't represented yet today —
        // catches the case where the user pinned a family after today's
        // tasks were already generated.
        const missingPinned = pickMissingPinnedTasks(
          prev.profile,
          prev.history,
          existing.tasks,
          pinned
        );
        if (missingPinned.length === 0) return prev;
        const otherDays = prev.history.filter((d) => d.date !== today);
        return {
          ...prev,
          history: [
            ...otherDays,
            { ...existing, tasks: [...existing.tasks, ...missingPinned] },
          ],
        };
      }

      const tasks = generateDailyTasks(prev.profile, prev.history, prev.settings);
      const otherDays = prev.history.filter((d) => d.date !== today);
      const newRecord: DailyRecord = {
        date: today,
        tasks,
        journal: existing?.journal,
      };
      return { ...prev, history: [...otherDays, newRecord] };
    });
  }, [update, today]);

  const regenerateTodayTasks = useCallback(() => {
    update((prev) => {
      if (!prev.profile) return prev;
      const tasks = generateDailyTasks(prev.profile, prev.history, prev.settings);
      const existing = prev.history.find((d) => d.date === today);
      const otherDays = prev.history.filter((d) => d.date !== today);
      const newRecord: DailyRecord = {
        date: today,
        tasks,
        journal: existing?.journal,
      };
      return { ...prev, history: [...otherDays, newRecord] };
    });
  }, [update, today]);

  const toggleTask = useCallback(
    (instanceId: string) => {
      update((prev) => {
        const history = prev.history.map((day) => {
          if (!day.tasks.some((t) => t.instanceId === instanceId)) return day;
          return {
            ...day,
            tasks: day.tasks.map((t) => {
              if (t.instanceId !== instanceId) return t;
              const nextCompleted = !t.completed;
              return {
                ...t,
                completed: nextCompleted,
                completedAt: nextCompleted ? new Date().toISOString() : undefined,
                // Completing a task clears any skipped flag.
                skipped: nextCompleted ? false : t.skipped,
                skippedAt: nextCompleted ? undefined : t.skippedAt,
              };
            }),
          };
        });
        return { ...prev, history };
      });
    },
    [update]
  );

  const incrementTally = useCallback(
    (instanceId: string, delta: number = 1) => {
      update((prev) => {
        const history = prev.history.map((day) => {
          if (!day.tasks.some((t) => t.instanceId === instanceId)) return day;
          return {
            ...day,
            tasks: day.tasks.map((t) => {
              if (t.instanceId !== instanceId) return t;
              if (!t.tally) return t;
              const next = Math.max(0, (t.tallyCount ?? 0) + delta);
              const target = t.tally.target;
              const completed = next >= target;
              return {
                ...t,
                tallyCount: next,
                completed,
                completedAt:
                  completed && !t.completed
                    ? new Date().toISOString()
                    : completed
                      ? t.completedAt
                      : undefined,
                skipped: false,
                skippedAt: undefined,
              };
            }),
          };
        });
        return { ...prev, history };
      });
    },
    [update]
  );

  const addOneMoreTask = useCallback((): "ok" | "none-left" | "no-profile" => {
    let result: "ok" | "none-left" | "no-profile" = "ok";
    update((prev) => {
      if (!prev.profile) {
        result = "no-profile";
        return prev;
      }
      const today = todayISO();
      const todayRec = prev.history.find((d) => d.date === today);
      const existing = todayRec?.tasks ?? [];
      const newTask = pickAdditionalTask(
        prev.profile,
        prev.history,
        existing,
        prev.settings.blockedFamilies ?? []
      );
      if (!newTask) {
        result = "none-left";
        return prev;
      }
      const otherDays = prev.history.filter((d) => d.date !== today);
      const updatedRecord: DailyRecord = todayRec
        ? { ...todayRec, tasks: [...existing, newTask] }
        : { date: today, tasks: [newTask] };
      return { ...prev, history: [...otherDays, updatedRecord] };
    });
    return result;
  }, [update]);

  const skipTask = useCallback(
    (instanceId: string) => {
      update((prev) => {
        const history = prev.history.map((day) => {
          if (!day.tasks.some((t) => t.instanceId === instanceId)) return day;
          return {
            ...day,
            tasks: day.tasks.map((t) => {
              if (t.instanceId !== instanceId) return t;
              const nextSkipped = !t.skipped;
              return {
                ...t,
                skipped: nextSkipped,
                skippedAt: nextSkipped ? new Date().toISOString() : undefined,
                // Skipping clears the completed flag.
                completed: nextSkipped ? false : t.completed,
                completedAt: nextSkipped ? undefined : t.completedAt,
              };
            }),
          };
        });
        return { ...prev, history };
      });
    },
    [update]
  );

  const saveJournal = useCallback(
    (date: string, entry: Partial<JournalEntry>) => {
      update((prev) => {
        const { state: stateWithDay, record } = withTodayRecord(prev, date);
        const history = stateWithDay.history.map((day) =>
          day.date === record.date
            ? {
                ...day,
                journal: {
                  ...(day.journal ?? { updatedAt: new Date().toISOString() }),
                  ...entry,
                  updatedAt: new Date().toISOString(),
                },
              }
            : day
        );
        return { ...stateWithDay, history };
      });
    },
    [update]
  );

  const updateSettings = useCallback(
    (patch: Partial<AppSettings>) => {
      update((prev) => ({
        ...prev,
        settings: { ...prev.settings, ...patch },
      }));
    },
    [update]
  );

  const resetAll = useCallback(() => {
    setRawState(DEFAULT_STATE);
  }, []);

  const acknowledgeAchievements = useCallback(() => {
    // Dismiss only the front-of-queue item so subsequent achievements still surface.
    setPendingAchievements((prev) => prev.slice(1));
  }, []);

  const value: StoreContextValue = {
    state,
    loaded,
    todayRecord,
    newAchievementsToShow: pendingAchievements,
    acknowledgeAchievements,
    setProfile,
    toggleTask,
    skipTask,
    incrementTally,
    addOneMoreTask,
    saveJournal,
    ensureTodayTasks,
    regenerateTodayTasks,
    updateSettings,
    resetAll,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreContextValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}

export function achievementById(id: string) {
  return ACHIEVEMENTS.find((a) => a.id === id);
}
