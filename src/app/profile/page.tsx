"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";
import { CONSTRAINT_LABELS, Constraint, UserProfile } from "@/lib/types";

type FormState = {
  nickname: string;
  heightCm: string;
  currentWeightKg: string;
  startWeightKg: string;
  targetWeightKg: string;
  constraints: Constraint[];
  wakeTime: string;
  sleepTime: string;
  notes: string;
};

function profileToForm(p: UserProfile | null): FormState {
  return {
    nickname: p?.nickname ?? "",
    heightCm: p?.heightCm?.toString() ?? "",
    currentWeightKg: p?.currentWeightKg?.toString() ?? "",
    startWeightKg: p?.startWeightKg?.toString() ?? "",
    targetWeightKg: p?.targetWeightKg?.toString() ?? "",
    constraints: p?.constraints ?? [],
    wakeTime: p?.wakeTime ?? "07:00",
    sleepTime: p?.sleepTime ?? "23:00",
    notes: p?.notes ?? "",
  };
}

function hasAdvancedData(p: UserProfile | null): boolean {
  if (!p) return false;
  return !!(
    p.startWeightKg ||
    p.targetWeightKg ||
    (p.constraints && p.constraints.length > 0) ||
    p.notes ||
    (p.wakeTime && p.wakeTime !== "07:00") ||
    (p.sleepTime && p.sleepTime !== "23:00")
  );
}

export default function ProfilePage() {
  const { state, loaded, setProfile } = useStore();
  const router = useRouter();
  const [form, setForm] = useState<FormState>(() => profileToForm(null));
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    if (loaded) {
      setForm(profileToForm(state.profile));
      // Auto-expand advanced if the user previously filled any of those fields.
      if (hasAdvancedData(state.profile)) setShowAdvanced(true);
    }
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
      heightCm: form.heightCm ? Number(form.heightCm) : undefined,
      currentWeightKg: form.currentWeightKg ? Number(form.currentWeightKg) : undefined,
      startWeightKg: form.startWeightKg ? Number(form.startWeightKg) : undefined,
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
          基本只要暱稱跟體重，其他可以之後再補。資料只存在你的裝置上。
        </p>
      </header>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <Section title="基本資料">
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
          <Field label="目前體重 (kg)">
            <input
              type="number"
              inputMode="decimal"
              step="0.1"
              value={form.currentWeightKg}
              onChange={(e) => update("currentWeightKg", e.target.value)}
              placeholder="例如 78.4"
              className={inputClass}
            />
          </Field>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            填了體重，喝水任務的目標會依體重自動算（30-40 ml/kg）。沒填會用 70kg 預設。
          </p>
        </Section>

        <button
          type="button"
          onClick={() => setShowAdvanced((v) => !v)}
          className="flex items-center justify-between rounded-xl border border-dashed border-stone-300 px-4 py-3 text-sm text-stone-600 hover:border-stone-400 dark:border-stone-700 dark:text-stone-400"
          aria-expanded={showAdvanced}
        >
          <span>
            更多選項
            <span className="ml-1 text-xs text-stone-400">
              （進度、作息、身體狀況）
            </span>
          </span>
          <span className={`transition-transform ${showAdvanced ? "rotate-90" : ""}`}>
            ›
          </span>
        </button>

        {showAdvanced && (
          <>
            <Section title="進度追蹤（選填）">
              <Field label="起始體重 (kg)">
                <input
                  type="number"
                  inputMode="decimal"
                  step="0.1"
                  value={form.startWeightKg}
                  onChange={(e) => update("startWeightKg", e.target.value)}
                  placeholder="開始記錄時的體重"
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
              <p className="text-xs text-stone-500 dark:text-stone-400">
                填了會解鎖「輕了 N 公斤」成就，跟進度頁的體重曲線。
              </p>
            </Section>

            <Section title="作息（影響睡前類任務）">
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
              <p className="text-xs text-stone-500 dark:text-stone-400">
                「提早上床」任務會根據這個時間算（例：23:00 上床 → 任務變成「22:45 前躺床」）。
              </p>
            </Section>

            <Section title="身體狀況（影響任務挑選）">
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

            <Section title="想跟自己說的話">
              <Field label="">
                <textarea
                  value={form.notes}
                  onChange={(e) => update("notes", e.target.value)}
                  rows={3}
                  placeholder="為什麼想減脂？目前最大的困難？AI 教練會看到這段。"
                  className={`${inputClass} resize-y`}
                />
              </Field>
            </Section>
          </>
        )}

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
