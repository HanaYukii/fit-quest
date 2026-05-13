"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { useStore } from "@/lib/store";

export function ProfileGate({ children }: { children: ReactNode }) {
  const { state, loaded } = useStore();

  if (!loaded) {
    return (
      <div className="flex flex-1 items-center justify-center p-6 text-sm text-stone-500">
        載入中…
      </div>
    );
  }

  if (!state.profile) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
        <div className="text-5xl">🌱</div>
        <h2 className="text-xl font-semibold">先完成個人檔案</h2>
        <p className="max-w-sm text-sm text-stone-600 dark:text-stone-400">
          告訴我一些基本資訊，我才能幫你產生適合的任務、追蹤合理的目標。
        </p>
        <Link
          href="/profile"
          className="rounded-full bg-emerald-500 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-600"
        >
          開始設定
        </Link>
      </div>
    );
  }

  return <>{children}</>;
}
