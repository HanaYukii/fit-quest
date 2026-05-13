"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";
import { CONSTRAINT_LABELS, Constraint, UserProfile } from "@/lib/types";

type FormState = {
  nickname: string;
  birthYear: string;
  heightCm: string;
  startWeightKg: string;
  currentWeightKg: string;
  targetWeightKg: string;
  constraints: Constraint[];
  wakeTime: string;
  sleepTime: string;
  notes: string;
};

function profileToForm(p: UserProfile | null): FormState {
  return {
    nickname: p?.nickname ?? "",
    birthYear: p?.birthYear?.toString() ?? "",
    heightCm: p?.heightCm?.toString() ?? "",
    startWeightKg: p?.startWeightKg?.toString() ?? "",
    currentWeightKg: p?.currentWeightKg?.toString() ?? "",
    targetWeightKg: p?.targetWeightKg?.toString() ?? "",
    constraints: p?.constraints ?? [],
    wakeTime: p?.wakeTime ?? "07:00",
    sleepTime: p?.sleepTime ?? "23:00",
    notes: p?.notes ?? "",
  };
}

export default function ProfilePage() {
  const { state, loaded, setProfile } = useStore();
  const router = useRouter();
  const [form, setForm] = useState<FormState>(() => profileToForm(null));

  useEffect(() => {
    if (loaded) setForm(profileToForm(state.profile));
  }, [loaded, state.profile]);

  const isEditing = !!state.profile;

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function toggleConstraint(c: Constraint) {
    setForm((f) => ({
      ...f,
      constraints: f.constraints.includes(c)
        ? f.constraints.filter((x) => x !== c)
        : [...f.constraints, c],
    }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.nickname.trim()) {
      alert("請填一個暱稱（隨便取都行）");
      return;
    }
    const now = new Date().toISOString();
    const profile: UserProfile = {
      nickname: form.nickname.trim(),
      birthYear: form.birthYear ? Number(form.birthYear) : undefined,
      heightCm: form.heightCm ? Number(form.heightCm) : undefined,
      startWeightKg: form.startWeightKg ? Number(form.startWeightKg) : undefined,
      currentWeightKg: form.currentWeightKg ? Number(form.currentWeightKg) : undefined,
      targetWeightKg: form.targetWeightKg ? Number(form.targetWeightKg) : undefined,
      constraints: form.constraints,
      wakeTime: form.wakeTime || undefined,
      sleepTime: form.sleepTime || undefined,
      notes: form.notes.trim() || undefined,
      createdAt: state.profile?.createdAt ?? now,
      updatedAt: now,
    };
    setProfile(profile);
    router.push("/");
  }

  return (
    <div className="flex flex-1 flex-col gap-5 px-4 pt-6 pb-6">
      <header>
        <h1 className="text-2xl font-bold">
          {isEditing ? "編輯個人檔案" : "個人檔案"}
        </h1>
        <p className="mt-1 text-sm text-stone-600 dark:text-stone-400">
          只存在你的裝置上。沒填的欄位 AI 也不會猜，任務會用預設邏輯。
        </p>
      </header>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <Section title="基本">
          <Field label="暱稱" required>
            <input
              type="text"
              value={form.nickname}
              onChange={(e) => update("nickname", e.target.value)}
              placeholder="想被怎麼稱呼"
              className={inputClass}
              required
            />
          </Field>
          <Field label="出生年（選填）">
            <input
              type="number"
              inputMode="numeric"
              min={1900}
              max={2025}
              value={form.birthYear}
              onChange={(e) => update("birthYear", e.target.value)}
              placeholder="例如 1995"
              className={inputClass}
            />
          </Field>
          <Field label="身高 (cm)">
            <input
              type="number"
              inputMode="decimal"
              value={form.heightCm}
              onChange={(e) => update("heightCm", e.target.value)}
              placeholder="例如 168"
              className={inputClass}
            />
          </Field>
        </Section>

        <Section title="體重">
          <Field label="起始體重 (kg)">
            <input
              type="number"
              inputMode="decimal"
              step="0.1"
              value={form.startWeightKg}
              onChange={(e) => update("startWeightKg", e.target.value)}
              placeholder="開始減脂時的體重"
              className={inputClass}
            />
          </Field>
          <Field label="目前體重 (kg)">
            <input
              type="number"
              inputMode="decimal"
              step="0.1"
              value={form.currentWeightKg}
              onChange={(e) => update("currentWeightKg", e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="目標體重 (kg)">
            <input
              type="number"
              inputMode="decimal"
              step="0.1"
              value={form.targetWeightKg}
              onChange={(e) => update("targetWeightKg", e.target.value)}
              className={inputClass}
            />
          </Field>
        </Section>

        <Section title="作息（用來理解你的時段）">
          <div className="grid grid-cols-2 gap-3">
            <Field label="平常幾點起床">
              <input
                type="time"
                value={form.wakeTime}
                onChange={(e) => update("wakeTime", e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="平常幾點睡覺">
              <input
                type="time"
                value={form.sleepTime}
                onChange={(e) => update("sleepTime", e.target.value)}
                className={inputClass}
              />
            </Field>
          </div>
        </Section>

        <Section title="身體狀況（選填，會影響任務挑選）">
          <div className="flex flex-col gap-2">
            {(Object.keys(CONSTRAINT_LABELS) as Constraint[]).map((c) => (
              <label
                key={c}
                className="flex items-center gap-3 rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm dark:border-stone-800 dark:bg-stone-900"
              >
                <input
                  type="checkbox"
                  checked={form.constraints.includes(c)}
                  onChange={() => toggleConstraint(c)}
                  className="h-4 w-4 accent-emerald-500"
                />
                <span>{CONSTRAINT_LABELS[c]}</span>
              </label>
            ))}
          </div>
        </Section>

        <Section title="想跟自己說的話（選填）">
          <Field label="">
            <textarea
              value={form.notes}
              onChange={(e) => update("notes", e.target.value)}
              rows={3}
              placeholder="為什麼想減脂？目前最大的困難？"
              className={`${inputClass} resize-y`}
            />
          </Field>
        </Section>

        <div className="sticky bottom-16 -mx-4 mt-2 border-t border-stone-200 bg-white/95 px-4 py-3 backdrop-blur dark:border-stone-800 dark:bg-stone-950/95">
          <button
            type="submit"
            className="w-full rounded-full bg-emerald-500 py-3 text-base font-semibold text-white transition hover:bg-emerald-600"
          >
            {isEditing ? "儲存變更" : "完成，開始任務"}
          </button>
        </div>
      </form>
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border border-stone-300 bg-white px-3 py-2 text-base text-stone-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100 dark:focus:ring-emerald-900/50";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-stone-500 dark:text-stone-400">
        {title}
      </h2>
      <div className="flex flex-col gap-3">{children}</div>
    </section>
  );
}

function Field({
  label,
  children,
  required,
}: {
  label: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      {label && (
        <span className="text-sm text-stone-700 dark:text-stone-300">
          {label}
          {required && <span className="text-rose-500"> *</span>}
        </span>
      )}
      {children}
    </label>
  );
}
