"use client";

import { CATEGORY_COLORS, CATEGORY_LABELS, DailyTask } from "@/lib/types";

interface Props {
  task: DailyTask;
  onToggle: (id: string) => void;
}

export function TaskItem({ task, onToggle }: Props) {
  return (
    <button
      type="button"
      onClick={() => onToggle(task.instanceId)}
      className={`group w-full rounded-2xl border p-4 text-left transition active:scale-[0.99] ${
        task.completed
          ? "border-emerald-200 bg-emerald-50/70 dark:border-emerald-900/40 dark:bg-emerald-950/30"
          : "border-stone-200 bg-white hover:border-stone-300 dark:border-stone-800 dark:bg-stone-900 dark:hover:border-stone-700"
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 transition ${
            task.completed
              ? "border-emerald-500 bg-emerald-500 text-white"
              : "border-stone-300 dark:border-stone-600"
          }`}
        >
          {task.completed && (
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
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xl leading-none">{task.emoji}</span>
            <span
              className={`text-base font-medium leading-snug ${
                task.completed
                  ? "text-stone-500 line-through decoration-stone-400 dark:text-stone-500"
                  : "text-stone-900 dark:text-stone-100"
              }`}
            >
              {task.title}
            </span>
          </div>
          {task.description && !task.completed && (
            <p className="mt-1.5 text-sm leading-relaxed text-stone-600 dark:text-stone-400">
              {task.description}
            </p>
          )}
          <div className="mt-2 flex items-center gap-2">
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-medium ${CATEGORY_COLORS[task.category]}`}
            >
              {CATEGORY_LABELS[task.category]}
            </span>
            <span className="flex gap-0.5">
              {[1, 2, 3].map((d) => (
                <span
                  key={d}
                  className={`h-1.5 w-1.5 rounded-full ${
                    d <= task.difficulty
                      ? "bg-stone-400 dark:bg-stone-500"
                      : "bg-stone-200 dark:bg-stone-800"
                  }`}
                />
              ))}
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}
