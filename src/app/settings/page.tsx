"use client";

import Link from "next/link";
import { useState } from "react";
import { useStore } from "@/lib/store";
import {
  clearState,
  exportStateAsJSON,
  importStateFromJSON,
  saveState,
} from "@/lib/storage";
import {
  FAMILY_LABELS,
  FAMILY_PILLAR,
  Family,
  PILLARS,
  PILLAR_LABELS,
} from "@/lib/types";

export default function SettingsPage() {
  const { state, updateSettings, resetAll } = useStore();
  const [newTime, setNewTime] = useState("");
  const [keyDraft, setKeyDraft] = useState(state.settings.geminiKey ?? "");
  const [showKey, setShowKey] = useState(false);

  async function enableNotifications() {
    if (typeof window === "undefined" || !("Notification" in window)) {
      alert("這個瀏覽器不支援通知。");
      return;
    }
    const perm = await Notification.requestPermission();
    if (perm === "granted") {
      updateSettings({ notifications: true });
    } else {
      alert("需要允許瀏覽器通知才能收到提醒。");
    }
  }

  function disableNotifications() {
    updateSettings({ notifications: false });
  }

  function addReminderTime() {
    if (!newTime) return;
    if (state.settings.reminderTimes.includes(newTime)) {
      setNewTime("");
      return;
    }
    updateSettings({
      reminderTimes: [...state.settings.reminderTimes, newTime].sort(),
    });
    setNewTime("");
  }

  function removeReminderTime(t: string) {
    updateSettings({
      reminderTimes: state.settings.reminderTimes.filter((x) => x !== t),
    });
  }

  function setTaskCount(n: 3 | 4 | 5) {
    updateSettings({ taskCount: n });
  }

  function togglePinned(family: Family) {
    const pinned = state.settings.pinnedFamilies ?? [];
    const blocked = state.settings.blockedFamilies ?? [];
    const isPinned = pinned.includes(family);
    const nextPinned = isPinned
      ? pinned.filter((f) => f !== family)
      : [...pinned, family];
    // Pinning a blocked family auto-unblocks it.
    const patch: { pinnedFamilies: Family[]; blockedFamilies?: Family[] } = {
      pinnedFamilies: nextPinned,
    };
    if (!isPinned && blocked.includes(family)) {
      patch.blockedFamilies = blocked.filter((f) => f !== family);
    }
    updateSettings(patch);
  }

  function toggleBlocked(family: Family) {
    const pinned = state.settings.pinnedFamilies ?? [];
    const blocked = state.settings.blockedFamilies ?? [];
    const isBlocked = blocked.includes(family);
    const nextBlocked = isBlocked
      ? blocked.filter((f) => f !== family)
      : [...blocked, family];
    // Blocking a pinned family auto-unpins it.
    const patch: { blockedFamilies: Family[]; pinnedFamilies?: Family[] } = {
      blockedFamilies: nextBlocked,
    };
    if (!isBlocked && pinned.includes(family)) {
      patch.pinnedFamilies = pinned.filter((f) => f !== family);
    }
    updateSettings(patch);
  }

  const familiesByPillar = PILLARS.map((pillar) => ({
    pillar,
    families: (Object.keys(FAMILY_LABELS) as Family[]).filter(
      (f) => FAMILY_PILLAR[f] === pillar
    ),
  }));

  function handleExport() {
    const json = exportStateAsJSON(state);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `fit-quest-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = importStateFromJSON(reader.result as string);
      if (!result) {
        alert("檔案格式不對。");
        return;
      }
      if (
        confirm(
          "匯入會覆蓋目前的資料。確定嗎？\n建議先匯出目前的備份再執行。"
        )
      ) {
        saveState(result);
        location.reload();
      }
    };
    reader.readAsText(file);
  }

  function handleReset() {
    const confirmText = "全部刪除";
    const input = prompt(
      `這會刪除所有任務紀錄、日誌、成就，無法復原。\n要繼續請輸入「${confirmText}」：`
    );
    if (input === confirmText) {
      resetAll();
      clearState();
      location.href = "/profile";
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-5 px-4 pt-6 pb-6">
      <header>
        <h1 className="text-2xl font-bold">設定</h1>
      </header>

      <Section title="個人檔案">
        <Link
          href="/profile"
          className="flex items-center justify-between rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm dark:border-stone-800 dark:bg-stone-900"
        >
          <div>
            <div className="font-medium">編輯個人檔案</div>
            <div className="text-xs text-stone-500 dark:text-stone-400">
              身高體重、目標、身體狀況
            </div>
          </div>
          <span className="text-stone-400">›</span>
        </Link>
      </Section>

      <Section title="任務">
        <div className="rounded-2xl border border-stone-200 bg-white p-4 dark:border-stone-800 dark:bg-stone-900">
          <div className="text-sm font-medium">每日任務數量</div>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {([3, 4, 5] as const).map((n) => (
              <button
                key={n}
                onClick={() => setTaskCount(n)}
                className={`rounded-xl border-2 py-2 text-sm font-semibold transition ${
                  state.settings.taskCount === n
                    ? "border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300"
                    : "border-stone-200 bg-white text-stone-700 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-300"
                }`}
              >
                {n} 個
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs text-stone-500 dark:text-stone-400">
            執行率低時系統會自動降到 3 個，執行率高時會自動增加。
          </p>
        </div>
      </Section>

      <Section title="每日固定家族（釘住）">
        <div className="rounded-2xl border border-stone-200 bg-white p-4 dark:border-stone-800 dark:bg-stone-900">
          <p className="text-xs text-stone-500 dark:text-stone-400">
            釘住的家族每天都會出現，不佔輪換配額。例：釘「補水」就每天都會看到喝水任務。
            修改隔天起套用；今天想要立刻看到，去首頁按「加一個任務」。
          </p>
          <p className="mt-2 text-xs text-stone-500 dark:text-stone-400">
            目前釘住 {(state.settings.pinnedFamilies ?? []).length} 個家族
          </p>
          <div className="mt-3 flex flex-col gap-4">
            {familiesByPillar.map(({ pillar, families }) => (
              <div key={pillar}>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-stone-500 dark:text-stone-400">
                  {PILLAR_LABELS[pillar]}
                </h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {families.map((f) => {
                    const pinned = (state.settings.pinnedFamilies ?? []).includes(f);
                    const blocked = (state.settings.blockedFamilies ?? []).includes(f);
                    return (
                      <button
                        key={f}
                        type="button"
                        onClick={() => togglePinned(f)}
                        className={`rounded-full border px-3 py-1 text-xs transition ${
                          pinned
                            ? "border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300"
                            : blocked
                              ? "border-stone-200 bg-stone-50 text-stone-400 line-through dark:border-stone-800 dark:bg-stone-900/50 dark:text-stone-600"
                              : "border-stone-200 bg-white text-stone-600 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-400"
                        }`}
                      >
                        {pinned && "📌 "}
                        {FAMILY_LABELS[f]}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section title="不想看到的家族（排除）">
        <div className="rounded-2xl border border-stone-200 bg-white p-4 dark:border-stone-800 dark:bg-stone-900">
          <p className="text-xs text-stone-500 dark:text-stone-400">
            勾起來的家族不會被選進每日任務。例：本來就不太吃零食 → 排除「節制零食」；不喝咖啡 → 排除「咖啡因截止」。
            修改隔天起套用。
          </p>
          <p className="mt-2 text-xs text-stone-500 dark:text-stone-400">
            目前排除 {(state.settings.blockedFamilies ?? []).length} 個家族
          </p>
          <div className="mt-3 flex flex-col gap-4">
            {familiesByPillar.map(({ pillar, families }) => (
              <div key={pillar}>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-stone-500 dark:text-stone-400">
                  {PILLAR_LABELS[pillar]}
                </h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {families.map((f) => {
                    const pinned = (state.settings.pinnedFamilies ?? []).includes(f);
                    const blocked = (state.settings.blockedFamilies ?? []).includes(f);
                    return (
                      <button
                        key={f}
                        type="button"
                        onClick={() => toggleBlocked(f)}
                        className={`rounded-full border px-3 py-1 text-xs transition ${
                          blocked
                            ? "border-rose-400 bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-300"
                            : pinned
                              ? "border-stone-200 bg-stone-50 text-stone-400 dark:border-stone-800 dark:bg-stone-900/50 dark:text-stone-600"
                              : "border-stone-200 bg-white text-stone-600 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-400"
                        }`}
                        title={pinned ? "目前釘住中，點下會自動取消釘住" : ""}
                      >
                        {blocked && "🚫 "}
                        {FAMILY_LABELS[f]}
                        {pinned && !blocked && " 📌"}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section title="提醒通知">
        <div className="rounded-2xl border border-stone-200 bg-white p-4 dark:border-stone-800 dark:bg-stone-900">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium">瀏覽器通知</div>
              <div className="text-xs text-stone-500 dark:text-stone-400">
                打開 app 時，到時間會提醒你看任務
              </div>
            </div>
            {state.settings.notifications ? (
              <button
                onClick={disableNotifications}
                className="rounded-full bg-stone-200 px-4 py-1.5 text-sm font-medium dark:bg-stone-800"
              >
                關閉
              </button>
            ) : (
              <button
                onClick={enableNotifications}
                className="rounded-full bg-emerald-500 px-4 py-1.5 text-sm font-medium text-white"
              >
                開啟
              </button>
            )}
          </div>

          <div className="mt-4">
            <div className="text-sm font-medium">提醒時段</div>
            <ul className="mt-2 flex flex-wrap gap-2">
              {state.settings.reminderTimes.map((t) => (
                <li
                  key={t}
                  className="flex items-center gap-1.5 rounded-full bg-stone-100 px-3 py-1 text-sm dark:bg-stone-800"
                >
                  <span className="tabular-nums">{t}</span>
                  <button
                    onClick={() => removeReminderTime(t)}
                    className="text-stone-400 hover:text-stone-700"
                    aria-label="移除"
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex gap-2">
              <input
                type="time"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                className="flex-1 rounded-xl border border-stone-300 bg-white px-3 py-2 text-sm dark:border-stone-700 dark:bg-stone-900"
              />
              <button
                onClick={addReminderTime}
                disabled={!newTime}
                className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-medium text-white disabled:opacity-40"
              >
                新增
              </button>
            </div>
          </div>
        </div>
      </Section>

      <Section title="AI 教練">
        <div className="rounded-2xl border border-stone-200 bg-white p-4 dark:border-stone-800 dark:bg-stone-900">
          <div className="text-sm font-medium">Gemini API key（選填）</div>
          <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">
            設定後，「教練」頁可以丟具體場景拿個人化建議。免費版每天 1500 次以上夠個人用。
            申請：
            <a
              href="https://aistudio.google.com/apikey"
              target="_blank"
              rel="noreferrer"
              className="ml-1 underline"
            >
              aistudio.google.com/apikey
            </a>
          </p>
          <div className="mt-3 flex gap-2">
            <input
              type={showKey ? "text" : "password"}
              value={keyDraft}
              onChange={(e) => setKeyDraft(e.target.value)}
              placeholder="貼上 API key"
              className="flex-1 rounded-xl border border-stone-300 bg-white px-3 py-2 text-sm font-mono dark:border-stone-700 dark:bg-stone-900"
              autoComplete="off"
              spellCheck={false}
            />
            <button
              type="button"
              onClick={() => setShowKey((v) => !v)}
              className="rounded-xl border border-stone-200 bg-white px-3 text-xs dark:border-stone-800 dark:bg-stone-900"
            >
              {showKey ? "隱藏" : "顯示"}
            </button>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-[11px] text-stone-500 dark:text-stone-400">
              Key 只存在你的裝置（localStorage），不會上傳到任何伺服器
            </span>
            <div className="flex gap-2">
              {state.settings.geminiKey && (
                <button
                  type="button"
                  onClick={() => {
                    if (confirm("移除已儲存的 API key？")) {
                      updateSettings({ geminiKey: undefined });
                      setKeyDraft("");
                    }
                  }}
                  className="rounded-full bg-stone-100 px-3 py-1.5 text-xs font-medium text-stone-700 dark:bg-stone-800 dark:text-stone-300"
                >
                  移除
                </button>
              )}
              <button
                type="button"
                onClick={() => updateSettings({ geminiKey: keyDraft.trim() || undefined })}
                disabled={keyDraft.trim() === (state.settings.geminiKey ?? "")}
                className="rounded-full bg-emerald-500 px-4 py-1.5 text-xs font-semibold text-white disabled:opacity-40"
              >
                儲存
              </button>
            </div>
          </div>
        </div>
      </Section>

      <Section title="資料">
        <div className="flex flex-col gap-2">
          <button
            onClick={handleExport}
            className="rounded-2xl border border-stone-200 bg-white px-4 py-3 text-left text-sm dark:border-stone-800 dark:bg-stone-900"
          >
            <div className="font-medium">匯出備份</div>
            <div className="text-xs text-stone-500 dark:text-stone-400">
              下載一份 JSON 檔，可在新裝置匯入
            </div>
          </button>
          <label className="cursor-pointer rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm dark:border-stone-800 dark:bg-stone-900">
            <div className="font-medium">匯入備份</div>
            <div className="text-xs text-stone-500 dark:text-stone-400">
              從 JSON 檔還原資料（會覆蓋）
            </div>
            <input
              type="file"
              accept="application/json"
              onChange={handleImport}
              className="hidden"
            />
          </label>
          <button
            onClick={handleReset}
            className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-left text-sm text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/20 dark:text-rose-300"
          >
            <div className="font-medium">全部重置</div>
            <div className="text-xs opacity-80">
              刪除所有任務紀錄、日誌、成就（無法復原）
            </div>
          </button>
        </div>
      </Section>

      <p className="pt-2 text-center text-xs text-stone-400 dark:text-stone-500">
        fit-quest · 資料只存在你的裝置上
      </p>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-stone-500 dark:text-stone-400">
        {title}
      </h2>
      {children}
    </section>
  );
}
