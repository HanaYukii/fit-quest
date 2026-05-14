"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { ProfileGate } from "@/components/ProfileGate";
import { TaskItem } from "@/components/TaskItem";
import { ProgressBar } from "@/components/ProgressBar";
import { StreakBadge } from "@/components/StreakBadge";
import { prettyDate, todayISO } from "@/lib/date";
import { computeCurrentStreak } from "@/lib/streak";

function encouragement(pct: number, done: number, total: number): string {
  if (total === 0) return "點下面的按鈕來生成今天的任務 ✨";
  if (done === total) return "完美的一天，太棒了 ✨";
  if (pct >= 0.6) return "已經很厲害，再一個就 perfect！";
  if (pct >= 0.3) return "穩穩前進，繼續～";
  if (done > 0) return "好的開始 💪";
  return "今天是新的開始，做一件就好 🌱";
}

export default function HomePage() {
  return (
    <ProfileGate>
      <HomeContent />
    </ProfileGate>
  );
}

function HomeContent() {
  const {
    state,
    todayRecord,
    ensureTodayTasks,
    toggleTask,
    skipTask,
    incrementTally,
    addOneMoreTask,
    regenerateTodayTasks,
  } = useStore();

  useEffect(() => {
    ensureTodayTasks();
  }, [ensureTodayTasks]);

  const pinnedSet = useMemo(
    () => new Set(state.settings.pinnedFamilies ?? []),
    [state.settings.pinnedFamilies]
  );

  const rawTasks = todayRecord?.tasks ?? [];
  // Pinned families float to the top of the list. Array.sort is stable in
  // modern engines so the relative order within each group is preserved.
  const tasks = useMemo(
    () =>
      [...rawTasks].sort((a, b) => {
        const ap = pinnedSet.has(a.family) ? 0 : 1;
        const bp = pinnedSet.has(b.family) ? 0 : 1;
        return ap - bp;
      }),
    [rawTasks, pinnedSet]
  );

  const activeTasks = tasks.filter((t) => !t.skipped);
  const done = activeTasks.filter((t) => t.completed).length;
  const denominator = activeTasks.length;
  const pct = denominator === 0 ? 0 : done / denominator;

  const streak = useMemo(() => computeCurrentStreak(state.history), [state.history]);
  const nickname = state.profile?.nickname ?? "你";
  const today = todayISO();

  return (
    <div className="flex flex-1 flex-col gap-5 px-4 pt-6">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            {prettyDate(today)}
          </p>
          <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100">
            嗨，{nickname}
          </h1>
        </div>
        <StreakBadge streak={streak} />
      </header>

      <section className="rounded-2xl border border-stone-200 bg-white p-4 dark:border-stone-800 dark:bg-stone-900">
        <div className="flex items-end justify-between gap-2">
          <div>
            <div className="text-xs uppercase tracking-wide text-stone-500 dark:text-stone-400">
              今日進度
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-3xl font-bold tabular-nums text-stone-900 dark:text-stone-100">
                {done}
              </span>
              <span className="text-lg text-stone-500 dark:text-stone-400">
                / {denominator}
              </span>
              {tasks.length !== denominator && (
                <span className="text-xs text-stone-400 dark:text-stone-500">
                  （已跳過 {tasks.length - denominator}）
                </span>
              )}
            </div>
          </div>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
            {Math.round(pct * 100)}%
          </span>
        </div>
        <ProgressBar value={done} max={Math.max(1, denominator)} className="mt-3" />
        <p className="mt-3 text-sm text-stone-600 dark:text-stone-400">
          {encouragement(pct, done, denominator)}
        </p>
      </section>

      <section className="flex flex-col gap-3">
        {tasks.length === 0 ? (
          <button
            onClick={() => ensureTodayTasks()}
            className="rounded-2xl border-2 border-dashed border-stone-300 px-4 py-6 text-sm text-stone-600 hover:border-emerald-400 hover:text-emerald-600 dark:border-stone-700 dark:text-stone-400 dark:hover:border-emerald-500"
          >
            產生今天的任務
          </button>
        ) : (
          tasks.map((task) => (
            <TaskItem
              key={task.instanceId}
              task={task}
              pinned={pinnedSet.has(task.family)}
              onToggle={toggleTask}
              onSkip={skipTask}
              onIncrementTally={incrementTally}
            />
          ))
        )}
      </section>

      {tasks.length > 0 && (
        <section className="flex flex-col gap-2 pt-1">
          <button
            type="button"
            onClick={() => {
              const r = addOneMoreTask();
              if (r === "none-left") alert("家族都已經在今天的清單裡了。");
            }}
            className="rounded-2xl border-2 border-dashed border-stone-300 px-4 py-3 text-sm text-stone-600 hover:border-emerald-400 hover:text-emerald-600 dark:border-stone-700 dark:text-stone-400 dark:hover:border-emerald-500"
          >
            + 加一個任務
          </button>
          <button
            type="button"
            onClick={() => {
              if (confirm("要重新產生今天的任務嗎？已完成的進度會清空。")) {
                regenerateTodayTasks();
              }
            }}
            className="self-center text-xs text-stone-500 underline-offset-2 hover:underline dark:text-stone-400"
          >
            重新產生今天的任務
          </button>
        </section>
      )}

      <section className="grid grid-cols-2 gap-2 pt-2">
        <Link
          href="/meals"
          className="flex flex-col items-start gap-1 rounded-2xl border border-stone-200 bg-white p-3 transition hover:border-emerald-400 dark:border-stone-800 dark:bg-stone-900 dark:hover:border-emerald-500"
        >
          <span className="text-xl">🍽️</span>
          <span className="text-sm font-medium text-stone-900 dark:text-stone-100">
            今天吃什麼？
          </span>
          <span className="text-[11px] text-stone-500 dark:text-stone-400">
            按餐次跟場景看搭配
          </span>
        </Link>
        <Link
          href="/scenarios"
          className="flex flex-col items-start gap-1 rounded-2xl border border-stone-200 bg-white p-3 transition hover:border-emerald-400 dark:border-stone-800 dark:bg-stone-900 dark:hover:border-emerald-500"
        >
          <span className="text-xl">📚</span>
          <span className="text-sm font-medium text-stone-900 dark:text-stone-100">
            場景・觀念・食物
          </span>
          <span className="text-[11px] text-stone-500 dark:text-stone-400">
            隨手查現場該怎麼做
          </span>
        </Link>
      </section>
    </div>
  );
}
