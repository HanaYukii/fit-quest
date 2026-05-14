"use client";

import {
  DailyTask,
  PILLAR_COLORS,
  PILLAR_LABELS,
} from "@/lib/types";

interface Props {
  task: DailyTask;
  onToggle: (id: string) => void;
  onSkip: (id: string) => void;
  onIncrementTally: (id: string, delta?: number) => void;
}

const FRICTION_DOTS = {
  low: 1,
  medium: 2,
  high: 3,
} as const;

export function TaskItem({ task, onToggle, onSkip, onIncrementTally }: Props) {
  const state: "completed" | "skipped" | "pending" = task.completed
    ? "completed"
    : task.skipped
      ? "skipped"
      : "pending";

  const cardClass =
    state === "completed"
      ? "border-emerald-200 bg-emerald-50/70 dark:border-emerald-900/40 dark:bg-emerald-950/30"
      : state === "skipped"
        ? "border-stone-200 bg-stone-100/70 opacity-70 dark:border-stone-800 dark:bg-stone-900/50"
        : "border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-900";

  const isTally = !!task.tally;
  const tallyCount = task.tallyCount ?? 0;
  const tallyTarget = task.tally?.target ?? 1;
  const tallyUnit = task.tally?.unit ?? "";

  return (
    <div className={`relative rounded-2xl border ${cardClass} transition`}>
      <button
        type="button"
        onClick={() =>
          isTally
            ? !task.completed && onIncrementTally(task.instanceId, 1)
            : onToggle(task.instanceId)
        }
        className="flex w-full items-start gap-3 p-4 text-left active:scale-[0.99]"
      >
        {!isTally && (
          <div
            className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 transition ${
              state === "completed"
                ? "border-emerald-500 bg-emerald-500 text-white"
                : state === "skipped"
                  ? "border-stone-300 bg-stone-200 dark:border-stone-600 dark:bg-stone-700"
                  : "border-stone-300 dark:border-stone-600"
            }`}
          >
            {state === "completed" && (
              <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none">
                <path
                  d="M3 8.5L6.5 12L13 4.5"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
            {state === "skipped" && (
              <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none">
                <path
                  d="M3 8 L13 8"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  className="text-stone-500 dark:text-stone-400"
                />
              </svg>
            )}
          </div>
        )}
        {isTally && (
          <div
            className={`mt-0.5 flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl border text-xs font-semibold ${
              state === "completed"
                ? "border-emerald-500 bg-emerald-500 text-white"
                : "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/40 dark:text-emerald-300"
            }`}
          >
            <span className="text-base leading-tight tabular-nums">
              {tallyCount}
            </span>
            <span className="text-[10px] leading-tight opacity-80">
              / {tallyTarget}
            </span>
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-2">
            {!isTally && (
              <span className="text-xl leading-none">{task.emoji}</span>
            )}
            <span
              className={`pr-12 text-base font-medium leading-snug ${
                state === "completed"
                  ? "text-stone-500 line-through decoration-stone-400 dark:text-stone-500"
                  : state === "skipped"
                    ? "text-stone-500 dark:text-stone-500"
                    : "text-stone-900 dark:text-stone-100"
              }`}
            >
              {isTally && <span className="mr-1">{task.emoji}</span>}
              {task.title}
            </span>
          </div>
          {task.description && state === "pending" && (
            <p className="mt-1.5 pr-12 text-sm leading-relaxed text-stone-600 dark:text-stone-400">
              {task.description}
            </p>
          )}
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-medium ${PILLAR_COLORS[task.pillar]}`}
            >
              {PILLAR_LABELS[task.pillar]}
            </span>
            <span className="text-[11px] text-stone-500 dark:text-stone-400">
              Lv. {task.level}
            </span>
            <span
              className="flex gap-0.5"
              title={`難度感受：${
                task.friction === "low"
                  ? "低門檻"
                  : task.friction === "medium"
                    ? "中等"
                    : "需要意志力"
              }`}
            >
              {[1, 2, 3].map((d) => (
                <span
                  key={d}
                  className={`h-1.5 w-1.5 rounded-full ${
                    d <= FRICTION_DOTS[task.friction]
                      ? "bg-stone-400 dark:bg-stone-500"
                      : "bg-stone-200 dark:bg-stone-800"
                  }`}
                />
              ))}
            </span>
            {isTally && (
              <span className="ml-auto text-[11px] text-emerald-700 dark:text-emerald-300">
                點卡片 +1 {tallyUnit}
              </span>
            )}
            {state === "skipped" && (
              <span className="ml-auto text-[11px] text-stone-500 dark:text-stone-400">
                今天跳過
              </span>
            )}
          </div>
        </div>
      </button>
      <button
        type="button"
        onClick={() => onSkip(task.instanceId)}
        className="absolute right-3 top-3 rounded-full px-2 py-1 text-[11px] text-stone-500 hover:bg-stone-100 hover:text-stone-700 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-stone-200"
        aria-label={state === "skipped" ? "取消跳過" : "標記為跳過"}
      >
        {state === "skipped" ? "取消跳過" : "跳過"}
      </button>
      {isTally && tallyCount > 0 && (
        <button
          type="button"
          onClick={() => onIncrementTally(task.instanceId, -1)}
          className="absolute right-3 bottom-3 rounded-full bg-stone-100 px-2 py-1 text-[11px] text-stone-600 hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-300 dark:hover:bg-stone-700"
          aria-label="減一"
        >
          −1
        </button>
      )}
    </div>
  );
}
