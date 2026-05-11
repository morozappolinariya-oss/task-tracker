"use client";

import { FilterType } from "@/types/task";

const FILTERS: { value: FilterType; label: string }[] = [
  { value: "all",       label: "Все" },
  { value: "work",      label: "Работа" },
  { value: "home",      label: "Дом" },
  { value: "personal",  label: "Личное" },
  { value: "completed", label: "Завершённые" },
];

interface Props {
  current: FilterType;
  onChange: (f: FilterType) => void;
  counts: Record<FilterType, number>;
}

export default function FilterTabs({ current, onChange, counts }: Props) {
  return (
    <div className="flex gap-1 overflow-x-auto -mx-4 px-4">
      {FILTERS.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => onChange(value)}
          className={`shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer whitespace-nowrap ${
            current === value
              ? "bg-indigo-500 text-white shadow-sm"
              : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-700 dark:hover:text-slate-200"
          }`}
        >
          {label}
          <span
            className={`text-xs px-1.5 py-0.5 rounded-full transition-all duration-200 ${
              current === value
                ? "bg-white/25 text-white"
                : "bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400"
            }`}
          >
            {counts[value]}
          </span>
        </button>
      ))}
    </div>
  );
}
