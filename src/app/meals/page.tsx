"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  MEALS,
  MEAL_TYPE_LABELS,
  Meal,
  MealType,
  MealVenue,
  VENUE_LABELS,
} from "@/lib/meals";
import { useStore } from "@/lib/store";

type MealFilter = MealType | "all";
type VenueFilter = MealVenue | "all";

const MEAL_FILTERS: { value: MealFilter; label: string }[] = [
  { value: "all", label: "全部" },
  { value: "breakfast", label: MEAL_TYPE_LABELS.breakfast },
  { value: "lunch", label: MEAL_TYPE_LABELS.lunch },
  { value: "dinner", label: MEAL_TYPE_LABELS.dinner },
  { value: "snack", label: MEAL_TYPE_LABELS.snack },
];

const VENUE_FILTERS: { value: VenueFilter; label: string }[] = [
  { value: "all", label: "全部" },
  { value: "home", label: VENUE_LABELS.home },
  { value: "cvs", label: VENUE_LABELS.cvs },
  { value: "breakfast-shop", label: VENUE_LABELS["breakfast-shop"] },
  { value: "lunchbox", label: VENUE_LABELS.lunchbox },
  { value: "restaurant", label: VENUE_LABELS.restaurant },
  { value: "japanese", label: VENUE_LABELS.japanese },
  { value: "korean", label: VENUE_LABELS.korean },
  { value: "hot-pot", label: VENUE_LABELS["hot-pot"] },
  { value: "brunch-cafe", label: VENUE_LABELS["brunch-cafe"] },
];

function currentMealTypeByHour(hour: number): MealFilter {
  if (hour < 10) return "breakfast";
  if (hour < 14) return "lunch";
  if (hour < 17) return "snack";
  if (hour < 21) return "dinner";
  return "snack";
}

export default function MealsPage() {
  const { state } = useStore();
  const constraints = state.profile?.constraints ?? [];
  const hasHypertension = constraints.includes("hypertension");
  const isVegetarian = constraints.includes("vegetarian");

  const [mealType, setMealType] = useState<MealFilter>(() =>
    currentMealTypeByHour(new Date().getHours())
  );
  const [venue, setVenue] = useState<VenueFilter>("all");
  const [shuffleKey, setShuffleKey] = useState(0);

  const filtered = useMemo(() => {
    const matched = MEALS.filter((m) => {
      const matchType = mealType === "all" || m.mealTypes.includes(mealType);
      const matchVenue = venue === "all" || m.venues.includes(venue);
      return matchType && matchVenue;
    });
    // Deterministic shuffle based on key so the order changes with button click.
    const seed = shuffleKey;
    return matched
      .map((m) => ({ m, sort: hash(m.id + seed) }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ m }) => m);
  }, [mealType, venue, shuffleKey]);

  return (
    <div className="flex flex-1 flex-col gap-4 px-4 pt-6 pb-6">
      <header>
        <h1 className="text-2xl font-bold">今天吃什麼？</h1>
        <p className="mt-1 text-sm text-stone-600 dark:text-stone-400">
          挑餐次跟場景，下面就是符合條件的搭配。
        </p>
        <p className="mt-1 text-[11px] text-stone-500 dark:text-stone-500">
          ⓘ 熱量/蛋白質為粗估，常見誤差 ±20-30%；台灣外食份量差異大，看相對量比絕對值重要。
        </p>
      </header>

      {hasHypertension && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-3 text-xs leading-relaxed text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/20 dark:text-amber-200">
          🩺 你的個人檔案勾選了高血壓。下面有些組合（火鍋湯底、韓式泡菜、滷味醬汁、加工料、便當醬汁、味噌湯）鈉含量較高，建議：湯不喝、醬料減半、避免加工料、泡菜小菜不續。
        </div>
      )}
      {isVegetarian && (
        <div className="rounded-2xl border border-violet-200 bg-violet-50/70 p-3 text-xs leading-relaxed text-violet-900 dark:border-violet-900/40 dark:bg-violet-950/20 dark:text-violet-200">
          🌱 你的個人檔案勾選了素食。下面組合多包含肉類；可把蛋白質換成豆腐/豆漿/雞蛋/天貝/毛豆，或到「教練」客製純素版本。
        </div>
      )}

      <section>
        <div className="mb-1.5 text-xs font-medium uppercase tracking-wide text-stone-500 dark:text-stone-400">
          餐次
        </div>
        <div className="flex flex-wrap gap-2">
          {MEAL_FILTERS.map((f) => (
            <Chip
              key={f.value}
              active={mealType === f.value}
              onClick={() => setMealType(f.value)}
            >
              {f.label}
            </Chip>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-1.5 text-xs font-medium uppercase tracking-wide text-stone-500 dark:text-stone-400">
          場景
        </div>
        <div className="flex flex-wrap gap-2">
          {VENUE_FILTERS.map((f) => (
            <Chip
              key={f.value}
              active={venue === f.value}
              onClick={() => setVenue(f.value)}
            >
              {f.label}
            </Chip>
          ))}
        </div>
      </section>

      <div className="flex items-center justify-between">
        <span className="text-xs text-stone-500 dark:text-stone-400">
          找到 {filtered.length} 份搭配
        </span>
        <button
          type="button"
          onClick={() => setShuffleKey((k) => k + 1)}
          className="rounded-full bg-stone-100 px-3 py-1.5 text-xs font-medium text-stone-700 dark:bg-stone-800 dark:text-stone-300"
        >
          🔀 換順序
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {filtered.length === 0 ? (
          <p className="rounded-2xl border-2 border-dashed border-stone-300 px-4 py-8 text-center text-sm text-stone-500 dark:border-stone-700 dark:text-stone-400">
            這個組合沒有現成搭配。試試問「教練」做客製建議。
          </p>
        ) : (
          filtered.map((m) => <MealCard key={m.id} meal={m} />)
        )}
      </div>

      <div className="mt-2 rounded-2xl border border-dashed border-stone-300 p-4 text-sm dark:border-stone-700">
        <p className="font-medium text-stone-700 dark:text-stone-300">
          想要更貼自己狀況？
        </p>
        <p className="mt-1 text-xs text-stone-600 dark:text-stone-400">
          告訴 AI 教練「我在 X、預算 Y、想吃 Z」會拿到帶你的體重/目標調過的建議。
        </p>
        <Link
          href="/coach"
          className="mt-3 inline-flex rounded-full bg-emerald-500 px-4 py-1.5 text-sm font-semibold text-white"
        >
          🤖 問教練
        </Link>
      </div>
    </div>
  );
}

function MealCard({ meal }: { meal: Meal }) {
  return (
    <article className="rounded-2xl border border-stone-200 bg-white p-4 dark:border-stone-800 dark:bg-stone-900">
      <header className="flex items-start gap-3">
        <span className="text-2xl leading-none">{meal.emoji}</span>
        <div className="min-w-0 flex-1">
          <h2 className="text-base font-semibold text-stone-900 dark:text-stone-100">
            {meal.name}
          </h2>
          <div className="mt-1 flex flex-wrap gap-1.5 text-[11px]">
            {meal.mealTypes.map((t) => (
              <span
                key={t}
                className="rounded-full bg-emerald-100 px-2 py-0.5 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
              >
                {MEAL_TYPE_LABELS[t]}
              </span>
            ))}
            {meal.venues.map((v) => (
              <span
                key={v}
                className="rounded-full bg-stone-100 px-2 py-0.5 text-stone-600 dark:bg-stone-800 dark:text-stone-400"
              >
                {VENUE_LABELS[v]}
              </span>
            ))}
          </div>
        </div>
      </header>

      <ul className="mt-3 space-y-1.5 text-sm leading-relaxed text-stone-700 dark:text-stone-300">
        {meal.components.map((c, i) => (
          <li key={i}>• {c}</li>
        ))}
      </ul>

      {meal.notes && (
        <p className="mt-2 text-xs text-stone-500 dark:text-stone-400">
          💡 {meal.notes}
        </p>
      )}

      <div className="mt-3 flex items-center gap-3 border-t border-stone-100 pt-3 text-xs dark:border-stone-800">
        <span className="font-medium text-stone-700 dark:text-stone-300">
          ~{meal.estKcal} kcal
        </span>
        <span className="text-stone-500 dark:text-stone-400">·</span>
        <span className="font-medium text-stone-700 dark:text-stone-300">
          ~{meal.estProtein}g 蛋白質
        </span>
      </div>
    </article>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-sm transition ${
        active
          ? "border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300"
          : "border-stone-200 bg-white text-stone-600 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-400"
      }`}
    >
      {children}
    </button>
  );
}

// Small deterministic hash for stable shuffle order.
function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  }
  return h;
}
