"use client";

import { MOOD_LABELS } from "@/lib/types";

interface Props {
  value: 1 | 2 | 3 | 4 | 5 | undefined;
  onChange: (v: 1 | 2 | 3 | 4 | 5) => void;
}

export function MoodPicker({ value, onChange }: Props) {
  return (
    <div className="flex justify-between gap-1">
      {([1, 2, 3, 4, 5] as const).map((m) => {
        const active = value === m;
        const meta = MOOD_LABELS[m];
        return (
          <button
            key={m}
            type="button"
            onClick={() => onChange(m)}
            className={`flex flex-1 flex-col items-center gap-1 rounded-xl border-2 py-2.5 transition ${
              active
                ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30"
                : "border-stone-200 bg-white hover:border-stone-300 dark:border-stone-800 dark:bg-stone-900"
            }`}
            aria-label={meta.label}
          >
            <span className="text-2xl leading-none">{meta.emoji}</span>
            <span className="text-[11px] text-stone-600 dark:text-stone-400">
              {meta.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
