"use client";

import { useMemo } from "react";
import { useStore } from "@/lib/store";
import { ACHIEVEMENTS } from "@/lib/achievements/definitions";
import { evaluateAchievements } from "@/lib/achievements/engine";
import { AchievementCard } from "@/components/AchievementCard";
import { ProgressBar } from "@/components/ProgressBar";

const CATEGORY_LABELS: Record<string, string> = {
  streak: "連續打卡",
  count: "累積里程",
  pillar: "支柱大師",
  family: "行為家族",
  milestone: "成長軌跡",
  special: "特殊紀念",
};

export default function AchievementsPage() {
  const { state } = useStore();

  const statuses = useMemo(() => {
    const all = evaluateAchievements(state);
    const byId = Object.fromEntries(all.map((s) => [s.id, s]));
    return ACHIEVEMENTS.map((def) => ({ def, ...byId[def.id] }));
  }, [state]);

  const unlocked = statuses.filter((s) => s.unlocked).length;
  const total = statuses.length;

  const grouped = useMemo(() => {
    const map: Record<string, typeof statuses> = {};
    for (const s of statuses) {
      const cat = s.def.category;
      if (!map[cat]) map[cat] = [];
      map[cat].push(s);
    }
    return map;
  }, [statuses]);

  return (
    <div className="flex flex-1 flex-col gap-5 px-4 pt-6 pb-6">
      <header>
        <h1 className="text-2xl font-bold">成就</h1>
        <p className="mt-1 text-sm text-stone-600 dark:text-stone-400">
          完成任務、寫日誌、減重達標都會解鎖。
        </p>
      </header>

      <section className="rounded-2xl border border-amber-200 bg-amber-50/60 p-4 dark:border-amber-900/40 dark:bg-amber-950/20">
        <div className="flex items-end justify-between">
          <div>
            <div className="text-xs uppercase tracking-wide text-amber-700 dark:text-amber-400">
              已解鎖
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-3xl font-bold tabular-nums text-amber-900 dark:text-amber-200">
                {unlocked}
              </span>
              <span className="text-stone-500 dark:text-stone-400">/ {total}</span>
            </div>
          </div>
          <span className="text-2xl">🏆</span>
        </div>
        <ProgressBar value={unlocked} max={total} className="mt-3" />
      </section>

      {Object.keys(CATEGORY_LABELS).map((cat) => {
        const items = grouped[cat] ?? [];
        if (items.length === 0) return null;
        return (
          <section key={cat} className="flex flex-col gap-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-stone-500 dark:text-stone-400">
              {CATEGORY_LABELS[cat]}
            </h2>
            <div className="flex flex-col gap-2">
              {items.map((item) => (
                <AchievementCard
                  key={item.def.id}
                  emoji={item.def.emoji}
                  title={item.def.title}
                  description={item.def.description}
                  unlocked={item.unlocked}
                  progress={item.progress}
                  goal={item.goal}
                  unlockedAt={item.unlockedAt}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
