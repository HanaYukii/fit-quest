"use client";

import { useEffect, useRef } from "react";
import { useStore } from "@/lib/store";
import { timeToMinutes, todayISO } from "@/lib/date";

function nowHHMM(): string {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

// Only fire a reminder if "now" is within this many minutes after the configured
// time. Prevents the late-open-app flood (4 overdue reminders firing at 23:00).
const REMINDER_WINDOW_MIN = 3;

const FIRED_KEY = "fit-quest:reminders-fired";

function loadFired(): Record<string, string[]> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(FIRED_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveFired(map: Record<string, string[]>): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(FIRED_KEY, JSON.stringify(map));
}

export function ReminderRunner() {
  const { state, loaded, todayRecord } = useStore();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!loaded) return;
    if (!state.settings.notifications) return;
    if (typeof window === "undefined") return;

    const tick = () => {
      const today = todayISO();
      const now = nowHHMM();
      const nowMin = timeToMinutes(now);
      const fired = loadFired();
      const todayFired = fired[today] ?? [];

      const undone =
        todayRecord?.tasks.filter((t) => !t.completed).length ?? 0;

      let changed = false;
      for (const reminderTime of state.settings.reminderTimes) {
        const reminderMin = timeToMinutes(reminderTime);
        const age = nowMin - reminderMin;
        // Outside the firing window — either still in the future, or too late
        // (we never want to flood with reminders the user already missed).
        if (age < 0 || age > REMINDER_WINDOW_MIN) {
          // Still mark as "skipped" so we don't fire them later in the day either.
          if (age > REMINDER_WINDOW_MIN && !todayFired.includes(reminderTime)) {
            todayFired.push(reminderTime);
            changed = true;
          }
          continue;
        }
        if (todayFired.includes(reminderTime)) continue;

        if (
          "Notification" in window &&
          Notification.permission === "granted" &&
          undone > 0
        ) {
          try {
            new Notification("fit-quest", {
              body: `今天還有 ${undone} 個任務沒打勾，要不要看一下？`,
              icon: "/icon.svg",
            });
          } catch {
            // Some browsers (iOS Safari outside PWA) throw — silent.
          }
        }
        todayFired.push(reminderTime);
        changed = true;
      }

      if (changed) saveFired({ [today]: todayFired });
    };

    tick();
    intervalRef.current = setInterval(tick, 60_000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [loaded, state.settings.notifications, state.settings.reminderTimes, todayRecord]);

  return null;
}
