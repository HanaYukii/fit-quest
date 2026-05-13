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

export default function SettingsPage() {
  const { state, updateSettings, resetAll } = useStore();
  const [newTime, setNewTime] = useState("");

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
