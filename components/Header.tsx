"use client";

import { useTheme } from "@/hooks/useTheme";

interface Props {
  onAdd: () => void;
}

export default function Header({ onAdd }: Props) {
  const { dark, toggle } = useTheme();

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800">
      <div className="mx-auto max-w-md px-4 h-14 flex items-center justify-between">
        <span className="text-base font-semibold text-slate-800 dark:text-slate-100 tracking-tight">
          Таск-трекер
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={toggle}
            aria-label={dark ? "Светлая тема" : "Тёмная тема"}
            className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 cursor-pointer"
          >
            {dark ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <circle cx="12" cy="12" r="4" />
                <path strokeLinecap="round" d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z" />
              </svg>
            )}
          </button>
          <button
            onClick={onAdd}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer select-none"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" d="M8 3v10M3 8h10" />
            </svg>
            Добавить
          </button>
        </div>
      </div>
    </header>
  );
}
