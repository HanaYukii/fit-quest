"use client";

import { ReactNode } from "react";
import { StoreProvider } from "@/lib/store";
import { BottomNav } from "./BottomNav";
import { AchievementToast } from "./AchievementToast";
import { ReminderRunner } from "./ReminderRunner";

export function ClientShell({ children }: { children: ReactNode }) {
  return (
    <StoreProvider>
      <div className="mx-auto flex min-h-[100dvh] max-w-screen-sm flex-col">
        <main className="flex flex-1 flex-col pb-4">{children}</main>
        <BottomNav />
      </div>
      <AchievementToast />
      <ReminderRunner />
    </StoreProvider>
  );
}
