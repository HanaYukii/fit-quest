"use client";

import { useEffect, useRef } from "react";
import { useStore } from "@/lib/store";
import { todayISO } from "@/lib/date";

function nowHHMM(): string {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

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
      const fired = loadFired();
      const todayFired = fired[today] ?? [];

      const undone =
        todayRecord?.tasks.filter((t) => !t.completed).length ?? 0;

      for (const reminderTime of state.settings.reminderTimes) {
        if (reminderTime > now) continue;
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
      }

      const fresh: Record<string, string[]> = { [today]: todayFired };
      saveFired(fresh);
    };

    tick();
    intervalRef.current = setInterval(tick, 60_000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [loaded, state.settings.notifications, state.settings.reminderTimes, todayRecord]);

  return null;
}
