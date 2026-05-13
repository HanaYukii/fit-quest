"use client";

import { useMemo, useState, useEffect } from "react";
import { useStore } from "@/lib/store";
import { ProfileGate } from "@/components/ProfileGate";
import { MoodPicker } from "@/components/MoodPicker";
import { MOOD_LABELS } from "@/lib/types";
import { prettyDate, todayISO } from "@/lib/date";

export default function JournalPage() {
  return (
    <ProfileGate>
      <JournalContent />
    </ProfileGate>
  );
}

function JournalContent() {
  const { state, saveJournal } = useStore();
  const today = todayISO();

  const todayEntry = useMemo(
    () => state.history.find((d) => d.date === today)?.journal,
    [state.history, today]
  );

  const [mood, setMood] = useState<1 | 2 | 3 | 4 | 5 | undefined>(todayEntry?.mood);
  const [weight, setWeight] = useState<string>(
    todayEntry?.weightKg !== undefined ? String(todayEntry.weightKg) : ""
  );
  const [text, setText] = useState<string>(todayEntry?.text ?? "");
  const [savedAt, setSavedAt] = useState<string | null>(null);

  useEffect(() => {
    setMood(todayEntry?.mood);
    setWeight(todayEntry?.weightKg !== undefined ? String(todayEntry.weightKg) : "");
    setText(todayEntry?.text ?? "");
  }, [todayEntry?.mood, todayEntry?.weightKg, todayEntry?.text]);

  function handleSave() {
    saveJournal(today, {
      mood,
      weightKg: weight ? Number(weight) : undefined,
      text: text.trim() || undefined,
    });
    setSavedAt(new Date().toLocaleTimeString("zh-TW"));
  }

  function handleMood(v: 1 | 2 | 3 | 4 | 5) {
    setMood(v);
    saveJournal(today, { mood: v });
  }

  const pastEntries = useMemo(
    () =>
      state.history
        .filter(
          (d) =>
            d.date !== today &&
            d.journal &&
            (d.journal.mood || d.journal.text || d.journal.weightKg !== undefined)
        )
        .sort((a, b) => b.date.localeCompare(a.date))
        .slice(0, 30),
    [state.history, today]
  );

  return (
    <div className="flex flex-1 flex-col gap-5 px-4 pt-6 pb-6">
      <header>
        <p className="text-xs text-stone-500 dark:text-stone-400">{prettyDate(today)}</p>
        <h1 className="text-2xl font-bold">今天怎麼樣？</h1>
      </header>

      <section className="rounded-2xl border border-stone-200 bg-white p-4 dark:border-stone-800 dark:bg-stone-900">
        <h2 className="text-sm font-semibold text-stone-700 dark:text-stone-300">
          心情
        </h2>
        <div className="mt-3">
          <MoodPicker value={mood} onChange={handleMood} />
        </div>
      </section>

      <section className="rounded-2xl border border-stone-200 bg-white p-4 dark:border-stone-800 dark:bg-stone-900">
        <h2 className="text-sm font-semibold text-stone-700 dark:text-stone-300">
          今天的體重（選填）
        </h2>
        <div className="mt-3 flex items-center gap-2">
          <input
            type="number"
            inputMode="decimal"
            step="0.1"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            onBlur={() =>
              saveJournal(today, { weightKg: weight ? Number(weight) : undefined })
            }
            placeholder="例如 78.4"
            className="flex-1 rounded-xl border border-stone-300 bg-white px-3 py-2 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:border-stone-700 dark:bg-stone-900 dark:focus:ring-emerald-900/50"
          />
          <span className="text-sm text-stone-500 dark:text-stone-400">kg</span>
        </div>
      </section>

      <section className="rounded-2xl border border-stone-200 bg-white p-4 dark:border-stone-800 dark:bg-stone-900">
        <h2 className="text-sm font-semibold text-stone-700 dark:text-stone-300">
          想記下的事
        </h2>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={6}
          placeholder="今天的飲食、有什麼想堅持/想調整的、有沒有什麼觸發點…只要寫一兩句就有用。"
          className="mt-3 w-full resize-y rounded-xl border border-stone-300 bg-white px-3 py-2 text-base leading-relaxed outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:border-stone-700 dark:bg-stone-900 dark:focus:ring-emerald-900/50"
        />
        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs text-stone-500 dark:text-stone-400">
            {savedAt ? `儲存於 ${savedAt}` : "下方點儲存後留存"}
          </span>
          <button
            onClick={handleSave}
            className="rounded-full bg-emerald-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600"
          >
            儲存
          </button>
        </div>
      </section>

      {pastEntries.length > 0 && (
        <section>
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-stone-500 dark:text-stone-400">
            過去的紀錄
          </h2>
          <ul className="flex flex-col gap-2">
            {pastEntries.map((d) => (
              <li
                key={d.date}
                className="rounded-2xl border border-stone-200 bg-white p-3 dark:border-stone-800 dark:bg-stone-900"
              >
                <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
                  <span>{prettyDate(d.date)}</span>
                  <div className="flex items-center gap-2">
                    {d.journal?.weightKg !== undefined && (
                      <span className="tabular-nums">{d.journal.weightKg} kg</span>
                    )}
                    {d.journal?.mood && (
                      <span className="text-base">
                        {MOOD_LABELS[d.journal.mood].emoji}
                      </span>
                    )}
                  </div>
                </div>
                {d.journal?.text && (
                  <p className="mt-1.5 line-clamp-4 whitespace-pre-wrap text-sm text-stone-700 dark:text-stone-300">
                    {d.journal.text}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
