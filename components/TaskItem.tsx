"use client";

import { Task } from "@/types/task";

interface Props {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

function formatDeadline(dateStr: string): { label: string; urgency: "overdue" | "today" | "soon" | "normal" } {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const deadline = new Date(dateStr + "T00:00:00");
  const diffDays = Math.round((deadline.getTime() - today.getTime()) / 86400000);
  const label = deadline.toLocaleDateString("ru-RU", { day: "numeric", month: "short" });
  if (diffDays < 0) return { label, urgency: "overdue" };
  if (diffDays === 0) return { label: "Сегодня", urgency: "today" };
  if (diffDays <= 2) return { label, urgency: "soon" };
  return { label, urgency: "normal" };
}

const urgencyStyle = {
  overdue: "bg-red-50 dark:bg-red-950/50 text-red-500 border-red-100 dark:border-red-900",
  today:   "bg-orange-50 dark:bg-orange-950/50 text-orange-500 border-orange-100 dark:border-orange-900",
  soon:    "bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-900",
  normal:  "bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border-slate-100 dark:border-slate-700",
};

export default function TaskItem({ task, onToggle, onDelete }: Props) {
  const deadline = task.deadline ? formatDeadline(task.deadline) : null;

  return (
    <div
      className={`group flex items-center gap-3 px-4 py-3.5 bg-white dark:bg-slate-900 rounded-xl border transition-all duration-200 ${
        task.completed
          ? "border-slate-100 dark:border-slate-800 opacity-60"
          : "border-slate-200 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-800 hover:shadow-sm"
      }`}
    >
      <button
        onClick={() => onToggle(task.id)}
        aria-label={task.completed ? "Отметить как активную" : "Отметить как выполненную"}
        className={`shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 cursor-pointer ${
          task.completed
            ? "bg-emerald-500 border-emerald-500"
            : "border-slate-300 dark:border-slate-600 hover:border-indigo-400"
        }`}
      >
        {task.completed && (
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2 6l3 3 5-5" />
          </svg>
        )}
      </button>

      <div className="flex-1 min-w-0">
        <span
          className={`block text-sm leading-snug transition-all duration-200 ${
            task.completed
              ? "line-through text-slate-400 dark:text-slate-600"
              : "text-slate-700 dark:text-slate-200"
          }`}
        >
          {task.text}
        </span>
        {deadline && !task.completed && (
          <span className={`inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-md border text-xs font-medium ${urgencyStyle[deadline.urgency]}`}>
            <svg className="w-3 h-3" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth={1.75}>
              <circle cx="6" cy="6" r="5" />
              <path strokeLinecap="round" d="M6 3.5V6l1.5 1.5" />
            </svg>
            {deadline.label}
          </span>
        )}
      </div>

      <button
        onClick={() => onDelete(task.id)}
        aria-label="Удалить задачу"
        className="shrink-0 opacity-0 group-hover:opacity-100 w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50 transition-all duration-200 cursor-pointer"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" d="M6 2h4M2.5 4h11l-1 9a1 1 0 01-1 1h-7a1 1 0 01-1-1l-1-9z" />
          <path strokeLinecap="round" d="M6 7v4M10 7v4" />
        </svg>
      </button>
    </div>
  );
}
