"use client";

import { useState } from "react";
import Link from "next/link";
import { SCENARIOS, Scenario } from "@/lib/scenarios";
import { HEALTH_CONCEPTS, HealthConcept } from "@/lib/concepts";
import { BAD_FOODS, GOOD_FOODS, FoodGroup } from "@/lib/foods";

type Tab = "scenarios" | "concepts" | "foods";

export default function ScenariosPage() {
  const [tab, setTab] = useState<Tab>("scenarios");
  const [openScenario, setOpenScenario] = useState<string | null>(null);
  const [openConcept, setOpenConcept] = useState<string | null>(null);

  return (
    <div className="flex flex-1 flex-col gap-4 px-4 pt-6 pb-6">
      <header>
        <h1 className="text-2xl font-bold">場景與觀念</h1>
        <p className="mt-1 text-sm text-stone-600 dark:text-stone-400">
          人在現場時看「場景」；想理解為什麼這樣做就看「觀念」。
        </p>
      </header>

      <div className="flex gap-1 rounded-full border border-stone-200 bg-stone-50 p-1 dark:border-stone-800 dark:bg-stone-900">
        <TabButton current={tab} value="scenarios" onClick={setTab}>
          🎯 場景
        </TabButton>
        <TabButton current={tab} value="concepts" onClick={setTab}>
          💡 觀念
        </TabButton>
        <TabButton current={tab} value="foods" onClick={setTab}>
          🥗 食物
        </TabButton>
      </div>

      {tab === "scenarios" && (
        <ScenariosSection
          open={openScenario}
          onToggle={(id) =>
            setOpenScenario((prev) => (prev === id ? null : id))
          }
        />
      )}
      {tab === "concepts" && (
        <ConceptsSection
          open={openConcept}
          onToggle={(id) =>
            setOpenConcept((prev) => (prev === id ? null : id))
          }
        />
      )}
      {tab === "foods" && <FoodsSection />}

      <div className="mt-2 flex flex-col gap-2 rounded-2xl border border-dashed border-stone-300 p-4 text-sm dark:border-stone-700">
        <p className="font-medium text-stone-700 dark:text-stone-300">
          不知道吃什麼？
        </p>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/meals"
            className="inline-flex items-center gap-1 rounded-full bg-emerald-500 px-4 py-1.5 text-sm font-semibold text-white"
          >
            🍽️ 看一餐推薦
          </Link>
          <Link
            href="/coach"
            className="inline-flex items-center gap-1 rounded-full border border-stone-300 bg-white px-4 py-1.5 text-sm font-semibold text-stone-700 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-300"
          >
            🤖 問 AI 教練
          </Link>
        </div>
      </div>
    </div>
  );
}

function ScenariosSection({
  open,
  onToggle,
}: {
  open: string | null;
  onToggle: (id: string) => void;
}) {
  return (
    <>
      <div className="flex flex-wrap gap-2">
        {SCENARIOS.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => onToggle(s.id)}
            className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition ${
              open === s.id
                ? "border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300"
                : "border-stone-200 bg-white text-stone-700 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-300"
            }`}
          >
            <span className="text-base leading-none">{s.emoji}</span>
            <span>{s.title.split("（")[0].split(" /")[0]}</span>
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        {SCENARIOS.map((s) => (
          <ScenarioCard
            key={s.id}
            scenario={s}
            expanded={open === s.id}
            onToggle={() => onToggle(s.id)}
          />
        ))}
      </div>
    </>
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

function ConceptsSection({
  open,
  onToggle,
}: {
  open: string | null;
  onToggle: (id: string) => void;
}) {
  return (
    <>
      <div className="flex flex-wrap gap-2">
        {HEALTH_CONCEPTS.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => onToggle(c.id)}
            className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition ${
              open === c.id
                ? "border-violet-500 bg-violet-50 text-violet-700 dark:bg-violet-950/30 dark:text-violet-300"
                : "border-stone-200 bg-white text-stone-700 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-300"
            }`}
          >
            <span className="text-base leading-none">{c.emoji}</span>
            <span>{c.title.split("（")[0].split("：")[0]}</span>
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        {HEALTH_CONCEPTS.map((c) => (
          <ConceptCard
            key={c.id}
            concept={c}
            expanded={open === c.id}
            onToggle={() => onToggle(c.id)}
          />
        ))}
      </div>
    </>
  );
}

function ConceptCard({
  concept,
  expanded,
  onToggle,
}: {
  concept: HealthConcept;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <article
      className="overflow-hidden rounded-2xl border border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-900"
      id={concept.id}
    >
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-start gap-3 p-4 text-left"
      >
        <span className="text-2xl leading-none">{concept.emoji}</span>
        <div className="min-w-0 flex-1">
          <h2 className="text-base font-semibold text-stone-900 dark:text-stone-100">
            {concept.title}
          </h2>
          <p className="mt-0.5 text-xs text-stone-500 dark:text-stone-400">
            {concept.oneliner}
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
        <div className="space-y-3 border-t border-stone-100 px-4 py-4 dark:border-stone-800">
          {concept.body.map((p, i) => (
            <p
              key={i}
              className="text-sm leading-relaxed text-stone-700 dark:text-stone-300"
            >
              {p}
            </p>
          ))}
          {concept.takeaways && concept.takeaways.length > 0 && (
            <div className="rounded-xl bg-violet-50 p-3 dark:bg-violet-950/30">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-violet-700 dark:text-violet-300">
                記住這幾件
              </h3>
              <ul className="mt-1.5 space-y-1">
                {concept.takeaways.map((t, i) => (
                  <li
                    key={i}
                    className="text-sm leading-relaxed text-stone-700 dark:text-stone-300"
                  >
                    • {t}
                  </li>
                ))}
              </ul>
            </div>
          )}
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
      <h3 className={`text-xs font-semibold uppercase tracking-wide ${color}`}>
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

function TabButton({
  current,
  value,
  onClick,
  children,
}: {
  current: Tab;
  value: Tab;
  onClick: (t: Tab) => void;
  children: React.ReactNode;
}) {
  const active = current === value;
  return (
    <button
      type="button"
      onClick={() => onClick(value)}
      className={`flex-1 rounded-full py-2 text-sm font-medium transition ${
        active
          ? "bg-white text-stone-900 shadow-sm dark:bg-stone-700 dark:text-stone-100"
          : "text-stone-500 dark:text-stone-400"
      }`}
    >
      {children}
    </button>
  );
}

function FoodsSection() {
  const [side, setSide] = useState<"good" | "bad">("good");
  const groups = side === "good" ? GOOD_FOODS : BAD_FOODS;
  return (
    <>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setSide("good")}
          className={`flex-1 rounded-xl border-2 py-2 text-sm font-semibold transition ${
            side === "good"
              ? "border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300"
              : "border-stone-200 bg-white text-stone-600 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-400"
          }`}
        >
          🟢 好食物
        </button>
        <button
          type="button"
          onClick={() => setSide("bad")}
          className={`flex-1 rounded-xl border-2 py-2 text-sm font-semibold transition ${
            side === "bad"
              ? "border-rose-500 bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-300"
              : "border-stone-200 bg-white text-stone-600 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-400"
          }`}
        >
          🔴 壞食物
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {groups.map((g) => (
          <FoodGroupCard key={g.category} group={g} tone={side} />
        ))}
      </div>
    </>
  );
}

function FoodGroupCard({ group, tone }: { group: FoodGroup; tone: "good" | "bad" }) {
  return (
    <article className="rounded-2xl border border-stone-200 bg-white p-4 dark:border-stone-800 dark:bg-stone-900">
      <h2 className="flex items-center gap-2 text-sm font-semibold text-stone-800 dark:text-stone-200">
        <span className="text-lg">{group.emoji}</span>
        <span>{group.category}</span>
        <span
          className={`ml-auto rounded-full px-2 py-0.5 text-[11px] font-medium ${
            tone === "good"
              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
              : "bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300"
          }`}
        >
          {tone === "good" ? "多吃" : "少吃 / 避開"}
        </span>
      </h2>
      <ul className="mt-3 space-y-2">
        {group.items.map((it, i) => (
          <ListRow key={i} name={it.name} note={it.note} />
        ))}
      </ul>
    </article>
  );
}
