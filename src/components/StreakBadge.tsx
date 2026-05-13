interface Props {
  streak: number;
}

export function StreakBadge({ streak }: Props) {
  const flame = streak >= 30 ? "🔥🔥🔥" : streak >= 7 ? "🔥🔥" : streak > 0 ? "🔥" : "🌱";
  return (
    <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
      <span>{flame}</span>
      <span>連續打卡 {streak} 天</span>
    </div>
  );
}
