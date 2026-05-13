interface Props {
  value: number;
  max: number;
  className?: string;
}

export function ProgressBar({ value, max, className = "" }: Props) {
  const pct = max <= 0 ? 0 : Math.min(100, Math.round((value / max) * 100));
  return (
    <div
      className={`h-2 w-full overflow-hidden rounded-full bg-stone-200 dark:bg-stone-800 ${className}`}
    >
      <div
        className="h-full rounded-full bg-emerald-500 transition-all duration-500 dark:bg-emerald-400"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
