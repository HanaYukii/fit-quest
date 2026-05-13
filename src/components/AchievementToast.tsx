"use client";

import { useEffect } from "react";
import { useStore, achievementById } from "@/lib/store";

export function AchievementToast() {
  const { newAchievementsToShow, acknowledgeAchievements } = useStore();
  const current = newAchievementsToShow[0];

  useEffect(() => {
    if (!current) return;
    const timer = setTimeout(() => acknowledgeAchievements(), 4500);
    return () => clearTimeout(timer);
  }, [current, acknowledgeAchievements]);

  if (!current) return null;
  const def = achievementById(current);
  if (!def) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-4">
      <div className="pointer-events-auto flex max-w-sm items-start gap-3 rounded-2xl border border-amber-200 bg-white p-3 shadow-xl shadow-amber-500/10 dark:border-amber-900/50 dark:bg-stone-900">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-2xl dark:bg-amber-900/30">
          {def.emoji}
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[11px] font-medium uppercase tracking-wide text-amber-700 dark:text-amber-400">
            解鎖成就
          </div>
          <div className="text-sm font-semibold text-stone-900 dark:text-stone-100">
            {def.title}
          </div>
          <div className="text-xs text-stone-600 dark:text-stone-400">
            {def.description}
          </div>
        </div>
        <button
          onClick={acknowledgeAchievements}
          className="ml-1 self-start rounded-full p-1 text-stone-400 hover:text-stone-700"
          aria-label="關閉"
        >
          ×
        </button>
      </div>
    </div>
  );
}
