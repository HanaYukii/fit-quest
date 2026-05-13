"use client";

import { useState } from "react";
import Link from "next/link";
import { SCENARIOS, Scenario } from "@/lib/scenarios";

export default function ScenariosPage() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className="flex flex-1 flex-col gap-4 px-4 pt-6 pb-6">
      <header>
        <h1 className="text-2xl font-bold">場景指南</h1>
        <p className="mt-1 text-sm text-stone-600 dark:text-stone-400">
          現在在哪？點下面對應的場景，看陷阱跟相對好的選擇。
        </p>
      </header>

      <div className="flex flex-wrap gap-2">
        {SCENARIOS.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setOpen(open === s.id ? null : s.id)}
            className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition ${
              open === s.id
                ? "border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300"
                : "border-stone-200 bg-white text-stone-700 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-300"
            }`}
          >
            <span className="text-base leading-none">{s.emoji}</span>
            <span>{s.title.split("（")[0]}</span>
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        {SCENARIOS.map((s) => (
          <ScenarioCard
            key={s.id}
            scenario={s}
            expanded={open === s.id}
            onToggle={() => setOpen(open === s.id ? null : s.id)}
          />
        ))}
      </div>

      <div className="mt-2 rounded-2xl border border-dashed border-stone-300 p-4 text-sm dark:border-stone-700">
        <p className="font-medium text-stone-700 dark:text-stone-300">
          想要更精準的建議？
        </p>
        <p className="mt-1 text-stone-600 dark:text-stone-400">
          設定好 AI 教練後，可以丟具體場景跟預算，拿到個人化的排序選項。
        </p>
        <Link
          href="/coach"
          className="mt-3 inline-flex items-center gap-1 rounded-full bg-emerald-500 px-4 py-1.5 text-sm font-semibold text-white"
        >
          🤖 去問教練
        </Link>
      </div>
    </div>
  );
}

function ScenarioCard({
  scenario,
  expanded,
  onToggle,
}: {
  scenario: Scenario;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <article
      className="overflow-hidden rounded-2xl border border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-900"
      id={scenario.id}
    >
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-start gap-3 p-4 text-left"
      >
        <span className="text-2xl leading-none">{scenario.emoji}</span>
        <div className="min-w-0 flex-1">
          <h2 className="text-base font-semibold text-stone-900 dark:text-stone-100">
            {scenario.title}
          </h2>
          <p className="mt-0.5 text-xs text-stone-500 dark:text-stone-400">
            {scenario.oneliner}
          </p>
        </div>
        <span
          className={`shrink-0 text-stone-400 transition-transform ${
            expanded ? "rotate-90" : ""
          }`}
        >
          ›
        </span>
      </button>

      {expanded && (
        <div className="space-y-4 border-t border-stone-100 px-4 py-4 dark:border-stone-800">
          <Section title="陷阱" tone="warn">
            {scenario.traps.map((t, i) => (
              <ListRow key={i} name={t.name} note={t.note} />
            ))}
          </Section>
          <Section title="相對好的選擇" tone="good">
            {scenario.better.map((t, i) => (
              <ListRow key={i} name={t.name} note={t.note} />
            ))}
          </Section>
        </div>
      )}
    </article>
  );
}

function Section({
  title,
  tone,
  children,
}: {
  title: string;
  tone: "warn" | "good";
  children: React.ReactNode;
}) {
  const color =
    tone === "warn"
      ? "text-rose-700 dark:text-rose-300"
      : "text-emerald-700 dark:text-emerald-300";
  return (
    <div>
      <h3
        className={`text-xs font-semibold uppercase tracking-wide ${color}`}
      >
        {title}
      </h3>
      <ul className="mt-2 space-y-2">{children}</ul>
    </div>
  );
}

function ListRow({ name, note }: { name: string; note?: string }) {
  return (
    <li className="text-sm leading-relaxed">
      <div className="font-medium text-stone-800 dark:text-stone-200">
        • {name}
      </div>
      {note && (
        <div className="mt-0.5 pl-3 text-xs text-stone-500 dark:text-stone-400">
          {note}
        </div>
      )}
    </li>
  );
}
