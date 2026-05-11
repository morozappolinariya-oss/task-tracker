"use client";

interface Props {
  completed: number;
  total: number;
}

export default function ProgressBar({ completed, total }: Props) {
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400">
        <span>Прогресс</span>
        <span className="font-medium text-slate-700 dark:text-slate-300">
          {completed} / {total} выполнено
        </span>
      </div>
      <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-indigo-400 to-emerald-400 rounded-full transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
      {total > 0 && percent === 100 && (
        <p className="text-xs text-emerald-500 font-medium text-center pt-0.5">
          Все задачи выполнены!
        </p>
      )}
    </div>
  );
}
