"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { href: "/", label: "今日", icon: "🎯" },
  { href: "/journal", label: "日誌", icon: "📓" },
  { href: "/stats", label: "進度", icon: "📊" },
  { href: "/achievements", label: "成就", icon: "🏆" },
  { href: "/settings", label: "設定", icon: "⚙️" },
];

export function BottomNav() {
  const path = usePathname();
  return (
    <nav className="sticky bottom-0 z-30 border-t border-stone-200 bg-white/85 backdrop-blur dark:border-stone-800 dark:bg-stone-950/85">
      <ul className="mx-auto flex max-w-screen-sm">
        {ITEMS.map((item) => {
          const active =
            item.href === "/"
              ? path === "/"
              : path.startsWith(item.href);
          return (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                className={`flex flex-col items-center gap-0.5 py-2.5 text-xs transition ${
                  active
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-stone-500 dark:text-stone-400"
                }`}
              >
                <span className="text-lg leading-none">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
