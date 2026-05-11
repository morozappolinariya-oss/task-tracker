"use client";

import { useState, useRef, useEffect } from "react";
import { CategoryType } from "@/types/task";

interface Props {
  onAdd: (text: string, category: CategoryType, deadline?: string) => void;
  onClose?: () => void;
}

const CATEGORIES: { value: CategoryType; label: string; icon: string }[] = [
  { value: "work",     label: "Работа",  icon: "💼" },
  { value: "home",     label: "Дом",     icon: "🏠" },
  { value: "personal", label: "Личное",  icon: "👤" },
];

const inputCls = "w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-700 focus:border-indigo-400 dark:focus:border-indigo-600 transition-all duration-200";

export default function AddTaskForm({ onAdd, onClose }: Props) {
  const [text, setText] = useState("");
  const [category, setCategory] = useState<CategoryType>("work");
  const [deadline, setDeadline] = useState("");
  const [dateFocused, setDateFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => { inputRef.current?.focus(); }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onAdd(text, category, deadline || undefined);
    onClose?.();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        ref={inputRef}
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Название задачи..."
        className={inputCls}
      />

      <div className="flex gap-2">
        {CATEGORIES.map(({ value, label, icon }) => (
          <button
            key={value}
            type="button"
            onClick={() => setCategory(value)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border text-sm font-medium transition-all duration-200 cursor-pointer ${
              category === value
                ? "bg-indigo-50 dark:bg-indigo-950/60 border-indigo-300 dark:border-indigo-700 text-indigo-600 dark:text-indigo-400"
                : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600"
            }`}
          >
            <span>{icon}</span>
            {label}
          </button>
        ))}
      </div>

      <div className="relative">
        <input
          type="date"
          value={deadline}
          min={today}
          onChange={(e) => setDeadline(e.target.value)}
          onFocus={() => setDateFocused(true)}
          onBlur={() => setDateFocused(false)}
          className={`${inputCls} ${
            deadline ? "" : dateFocused ? "text-slate-400 dark:text-slate-500" : "text-transparent"
          }`}
        />
        {!deadline && !dateFocused && (
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-400 dark:text-slate-500">
            Дедлайн (необязательно)
          </span>
        )}
      </div>

      <button
        type="submit"
        disabled={!text.trim()}
        className="w-full py-3 bg-indigo-500 hover:bg-indigo-600 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-600 text-white rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer disabled:cursor-not-allowed select-none"
      >
        Добавить задачу
      </button>
    </form>
  );
}
