"use client";

import { useEffect, useMemo } from "react";
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
    regenerateTodayTasks,
  } = useStore();

  useEffect(() => {
    ensureTodayTasks();
  }, [ensureTodayTasks]);

  const tasks = todayRecord?.tasks ?? [];
  const done = tasks.filter((t) => t.completed).length;
  const pct = tasks.length === 0 ? 0 : done / tasks.length;

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
                / {tasks.length}
              </span>
            </div>
          </div>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
            {Math.round(pct * 100)}%
          </span>
        </div>
        <ProgressBar value={done} max={Math.max(1, tasks.length)} className="mt-3" />
        <p className="mt-3 text-sm text-stone-600 dark:text-stone-400">
          {encouragement(pct, done, tasks.length)}
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
            <TaskItem key={task.instanceId} task={task} onToggle={toggleTask} />
          ))
        )}
      </section>

      {tasks.length > 0 && (
        <div className="flex justify-center pt-2">
          <button
            onClick={() => {
              if (confirm("要重新產生今天的任務嗎？已完成的進度會清空。")) {
                regenerateTodayTasks();
              }
            }}
            className="text-xs text-stone-500 underline-offset-2 hover:underline dark:text-stone-400"
          >
            重新產生今天的任務
          </button>
        </div>
      )}
    </div>
  );
}
