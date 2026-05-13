"use client";

import Link from "next/link";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { COACH_TEMPLATES, askCoach, CoachResult } from "@/lib/ai/gemini";

export default function CoachPage() {
  const { state, loaded } = useStore();
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState<CoachResult | null>(null);
  const [loading, setLoading] = useState(false);

  const apiKey = state.settings.geminiKey?.trim();

  async function handleAsk(prompt: string) {
    if (!prompt.trim()) return;
    setQuestion(prompt);
    setLoading(true);
    setResult(null);
    const r = await askCoach(apiKey, prompt, state.profile);
    setResult(r);
    setLoading(false);
  }

  if (!loaded) {
    return (
      <div className="flex flex-1 items-center justify-center text-sm text-stone-500">
        載入中…
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4 px-4 pt-6 pb-6">
      <header>
        <h1 className="text-2xl font-bold">AI 教練</h1>
        <p className="mt-1 text-sm text-stone-600 dark:text-stone-400">
          吃東西/破功/睡眠/卡關都可以問。會根據你的個人檔案調整建議。
        </p>
      </header>

      {!apiKey && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4 dark:border-amber-900/40 dark:bg-amber-950/20">
          <h2 className="text-sm font-semibold text-amber-900 dark:text-amber-200">
            需要先設定 Gemini API key
          </h2>
          <ol className="mt-2 list-decimal space-y-1 pl-5 text-xs text-amber-900 dark:text-amber-200">
            <li>
              到{" "}
              <a
                href="https://aistudio.google.com/apikey"
                target="_blank"
                rel="noreferrer"
                className="underline"
              >
                aistudio.google.com/apikey
              </a>{" "}
              用 Google 帳號登入
            </li>
            <li>點「Create API key」拿到一串 key</li>
            <li>
              到{" "}
              <Link href="/settings" className="underline">
                設定頁
              </Link>{" "}
              貼上儲存
            </li>
          </ol>
          <p className="mt-2 text-xs text-amber-800 dark:text-amber-300">
            免費額度個人用每天 1500 次以上夠用。Key 只存在你的裝置裡。
          </p>
        </div>
      )}

      <section className="flex flex-col gap-2">
        <label
          htmlFor="coach-question"
          className="text-sm font-medium text-stone-700 dark:text-stone-300"
        >
          想問什麼？
        </label>
        <textarea
          id="coach-question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          rows={3}
          placeholder="例如：我現在在 7-11 想買晚餐，預算 120 元，希望吃飽。"
          className="w-full resize-y rounded-xl border border-stone-300 bg-white px-3 py-2 text-base leading-relaxed outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:border-stone-700 dark:bg-stone-900 dark:focus:ring-emerald-900/50"
        />
        <button
          type="button"
          onClick={() => handleAsk(question)}
          disabled={loading || !question.trim()}
          className="self-end rounded-full bg-emerald-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:opacity-40"
        >
          {loading ? "教練思考中…" : "諮詢"}
        </button>
      </section>

      <section>
        <div className="mb-2 text-xs uppercase tracking-wide text-stone-500 dark:text-stone-400">
          快速問題
        </div>
        <div className="flex flex-wrap gap-2">
          {COACH_TEMPLATES.map((t) => (
            <button
              key={t.label}
              type="button"
              onClick={() => handleAsk(t.prompt)}
              disabled={loading}
              className="rounded-full border border-stone-200 bg-white px-3 py-1.5 text-xs text-stone-700 transition hover:border-emerald-400 hover:text-emerald-700 disabled:opacity-50 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-300"
            >
              {t.label}
            </button>
          ))}
        </div>
      </section>

      {(loading || result) && (
        <section className="rounded-2xl border border-stone-200 bg-white p-4 dark:border-stone-800 dark:bg-stone-900">
          {loading && (
            <div className="flex items-center gap-2 text-sm text-stone-600 dark:text-stone-400">
              <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-emerald-500"></span>
              教練思考中…
            </div>
          )}
          {result && result.ok && (
            <div className="whitespace-pre-wrap text-[15px] leading-relaxed text-stone-800 dark:text-stone-200">
              {result.text}
            </div>
          )}
          {result && !result.ok && (
            <div className="text-sm text-rose-600 dark:text-rose-400">
              {result.message}
              {result.reason === "no-key" && (
                <>
                  {" "}
                  <Link href="/settings" className="underline">
                    去設定
                  </Link>
                </>
              )}
            </div>
          )}
        </section>
      )}

      <p className="mt-2 text-center text-[11px] text-stone-400 dark:text-stone-500">
        AI 給的是參考方向，不是醫療建議。重大健康狀況請找專業。
      </p>
    </div>
  );
}
