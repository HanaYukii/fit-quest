"use client";

import { useMemo } from "react";
import { useStore } from "@/lib/store";
import { ProfileGate } from "@/components/ProfileGate";
import { ProgressBar } from "@/components/ProgressBar";
import {
  CATEGORY_ACCENT,
  CATEGORY_LABELS,
  TASK_CATEGORIES,
  TaskCategory,
} from "@/lib/types";
import { daysAgoISO, prettyDate, todayISO } from "@/lib/date";
import { computeCurrentStreak, computeLongestStreak } from "@/lib/streak";

export default function StatsPage() {
  return (
    <ProfileGate>
      <StatsContent />
    </ProfileGate>
  );
}

function StatsContent() {
  const { state } = useStore();
  const today = todayISO();

  const last14Dates = useMemo(() => {
    const arr: string[] = [];
    for (let i = 13; i >= 0; i--) arr.push(daysAgoISO(i));
    return arr;
  }, []);

  const dayMap = useMemo(() => {
    const m = new Map<string, { done: number; total: number }>();
    for (const d of state.history) {
      m.set(d.date, {
        done: d.tasks.filter((t) => t.completed).length,
        total: d.tasks.length,
      });
    }
    return m;
  }, [state.history]);

  const streak = useMemo(() => computeCurrentStreak(state.history), [state.history]);
  const longestStreak = useMemo(
    () => computeLongestStreak(state.history),
    [state.history]
  );

  const last7 = state.history
    .filter((d) => d.date <= today && d.date >= daysAgoISO(6))
    .reduce(
      (acc, d) => ({
        done: acc.done + d.tasks.filter((t) => t.completed).length,
        total: acc.total + d.tasks.length,
      }),
      { done: 0, total: 0 }
    );
  const last7Rate = last7.total > 0 ? last7.done / last7.total : 0;

  const categoryStats = useMemo(() => {
    const map: Record<TaskCategory, { done: number; total: number }> = {
      movement: { done: 0, total: 0 },
      diet: { done: 0, total: 0 },
      sleep: { done: 0, total: 0 },
      hydration: { done: 0, total: 0 },
      mental: { done: 0, total: 0 },
      reflection: { done: 0, total: 0 },
    };
    const cutoff = daysAgoISO(29);
    for (const d of state.history) {
      if (d.date < cutoff) continue;
      for (const t of d.tasks) {
        map[t.category].total++;
        if (t.completed) map[t.category].done++;
      }
    }
    return map;
  }, [state.history]);

  const weightSeries = useMemo(() => {
    return state.history
      .filter((d) => d.journal?.weightKg !== undefined)
      .sort((a, b) => a.date.localeCompare(b.date))
      .map((d) => ({ date: d.date, weight: d.journal!.weightKg! }));
  }, [state.history]);

  return (
    <div className="flex flex-1 flex-col gap-5 px-4 pt-6 pb-6">
      <header>
        <h1 className="text-2xl font-bold">進度</h1>
      </header>

      <section className="grid grid-cols-2 gap-3">
        <StatTile label="目前連續" value={`${streak} 天`} emoji="🔥" />
        <StatTile label="最長連續" value={`${longestStreak} 天`} emoji="👑" />
        <StatTile
          label="近 7 天完成率"
          value={`${Math.round(last7Rate * 100)}%`}
          emoji="🎯"
        />
        <StatTile
          label="累積完成"
          value={`${state.history.reduce(
            (s, d) => s + d.tasks.filter((t) => t.completed).length,
            0
          )}`}
          emoji="✅"
        />
      </section>

      <section className="rounded-2xl border border-stone-200 bg-white p-4 dark:border-stone-800 dark:bg-stone-900">
        <h2 className="text-sm font-semibold text-stone-700 dark:text-stone-300">
          過去 14 天
        </h2>
        <div className="mt-3 grid grid-cols-7 gap-1.5">
          {last14Dates.map((d) => {
            const stats = dayMap.get(d);
            const rate = stats && stats.total > 0 ? stats.done / stats.total : 0;
            const isToday = d === today;
            return (
              <div
                key={d}
                className="flex flex-col items-center gap-1"
                title={`${d}: ${stats ? `${stats.done}/${stats.total}` : "無紀錄"}`}
              >
                <div
                  className={`h-7 w-full rounded-md ${
                    !stats
                      ? "bg-stone-100 dark:bg-stone-800"
                      : rate >= 0.8
                      ? "bg-emerald-500"
                      : rate >= 0.5
                      ? "bg-emerald-300 dark:bg-emerald-700"
                      : rate > 0
                      ? "bg-emerald-200 dark:bg-emerald-800"
                      : "bg-stone-200 dark:bg-stone-700"
                  } ${isToday ? "ring-2 ring-emerald-500" : ""}`}
                />
                <span className="text-[10px] text-stone-500 dark:text-stone-400">
                  {d.slice(8)}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      <section className="rounded-2xl border border-stone-200 bg-white p-4 dark:border-stone-800 dark:bg-stone-900">
        <h2 className="text-sm font-semibold text-stone-700 dark:text-stone-300">
          類別表現（近 30 天）
        </h2>
        <div className="mt-3 flex flex-col gap-2.5">
          {TASK_CATEGORIES.map((cat) => {
            const s = categoryStats[cat];
            const rate = s.total > 0 ? s.done / s.total : 0;
            return (
              <div key={cat}>
                <div className="flex items-center justify-between text-xs">
                  <span className={`font-medium ${CATEGORY_ACCENT[cat]}`}>
                    {CATEGORY_LABELS[cat]}
                  </span>
                  <span className="tabular-nums text-stone-500 dark:text-stone-400">
                    {s.done} / {s.total || 0}
                  </span>
                </div>
                <ProgressBar
                  value={s.done}
                  max={Math.max(1, s.total)}
                  className="mt-1"
                />
              </div>
            );
          })}
        </div>
      </section>

      {weightSeries.length >= 2 && (
        <section className="rounded-2xl border border-stone-200 bg-white p-4 dark:border-stone-800 dark:bg-stone-900">
          <h2 className="text-sm font-semibold text-stone-700 dark:text-stone-300">
            體重變化
          </h2>
          <WeightChart series={weightSeries} />
        </section>
      )}
    </div>
  );
}

function StatTile({
  label,
  value,
  emoji,
}: {
  label: string;
  value: string;
  emoji: string;
}) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-3 dark:border-stone-800 dark:bg-stone-900">
      <div className="flex items-center justify-between">
        <span className="text-xs text-stone-500 dark:text-stone-400">{label}</span>
        <span className="text-lg">{emoji}</span>
      </div>
      <div className="mt-1 text-xl font-bold text-stone-900 dark:text-stone-100">
        {value}
      </div>
    </div>
  );
}

function WeightChart({ series }: { series: { date: string; weight: number }[] }) {
  const max = Math.max(...series.map((s) => s.weight));
  const min = Math.min(...series.map((s) => s.weight));
  const range = Math.max(0.1, max - min);
  const w = 320;
  const h = 100;
  const points = series.map((s, i) => {
    const x = series.length === 1 ? w / 2 : (i / (series.length - 1)) * w;
    const y = h - ((s.weight - min) / range) * (h - 12) - 6;
    return { x, y, ...s };
  });
  const path = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(" ");

  const first = series[0];
  const last = series[series.length - 1];
  const delta = last.weight - first.weight;
  const dir = delta < 0 ? "下降" : delta > 0 ? "上升" : "持平";

  return (
    <div className="mt-3">
      <svg viewBox={`0 0 ${w} ${h}`} className="h-24 w-full">
        <path
          d={path}
          fill="none"
          stroke="rgb(16 185 129)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="2.5" fill="rgb(16 185 129)" />
        ))}
      </svg>
      <div className="mt-2 flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
        <span>
          {prettyDate(first.date)} · {first.weight} kg
        </span>
        <span
          className={
            delta < 0
              ? "font-semibold text-emerald-600 dark:text-emerald-400"
              : delta > 0
              ? "text-rose-500"
              : ""
          }
        >
          {dir} {Math.abs(delta).toFixed(1)} kg
        </span>
        <span>
          {prettyDate(last.date)} · {last.weight} kg
        </span>
      </div>
    </div>
  );
}
