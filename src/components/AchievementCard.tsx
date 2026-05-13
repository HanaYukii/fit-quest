import { ProgressBar } from "./ProgressBar";

interface Props {
  emoji: string;
  title: string;
  description: string;
  unlocked: boolean;
  progress: number;
  goal: number;
  unlockedAt?: string;
}

export function AchievementCard({
  emoji,
  title,
  description,
  unlocked,
  progress,
  goal,
  unlockedAt,
}: Props) {
  return (
    <div
      className={`rounded-2xl border p-4 transition ${
        unlocked
          ? "border-amber-200 bg-amber-50/70 dark:border-amber-900/40 dark:bg-amber-950/20"
          : "border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-900"
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl ${
            unlocked
              ? "bg-amber-100 dark:bg-amber-900/30"
              : "bg-stone-100 grayscale dark:bg-stone-800"
          }`}
        >
          {emoji}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3
              className={`text-sm font-semibold ${
                unlocked
                  ? "text-stone-900 dark:text-stone-100"
                  : "text-stone-500 dark:text-stone-400"
              }`}
            >
              {title}
            </h3>
            {unlocked && (
              <span className="rounded-full bg-amber-200 px-1.5 py-0.5 text-[10px] font-medium text-amber-900 dark:bg-amber-900/50 dark:text-amber-200">
                已解鎖
              </span>
            )}
          </div>
          <p
            className={`mt-0.5 text-xs ${
              unlocked
                ? "text-stone-700 dark:text-stone-300"
                : "text-stone-500 dark:text-stone-500"
            }`}
          >
            {description}
          </p>
          {!unlocked && (
            <div className="mt-2 flex items-center gap-2">
              <ProgressBar value={progress} max={goal} className="flex-1" />
              <span className="text-[11px] tabular-nums text-stone-500 dark:text-stone-400">
                {progress}/{goal}
              </span>
            </div>
          )}
          {unlocked && unlockedAt && (
            <p className="mt-1 text-[11px] text-stone-500 dark:text-stone-400">
              {new Date(unlockedAt).toLocaleDateString("zh-TW")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
