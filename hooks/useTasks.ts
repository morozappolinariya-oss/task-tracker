"use client";

import { useState, useEffect, useCallback } from "react";
import { Task, FilterType, CategoryType } from "@/types/task";

function sortByDeadline(tasks: Task[]): Task[] {
  return [...tasks].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    if (a.deadline && b.deadline) return a.deadline.localeCompare(b.deadline);
    if (a.deadline) return -1;
    if (b.deadline) return 1;
    return b.createdAt - a.createdAt;
  });
}

// Normalize DB row → Task (DB uses snake_case, Task uses camelCase)
function rowToTask(row: Record<string, unknown>): Task {
  return {
    id: row.id as string,
    text: row.text as string,
    completed: row.completed as boolean,
    createdAt: Number(row.created_at),
    deadline: (row.deadline as string) || undefined,
    category: row.category as CategoryType,
  };
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<FilterType>("all");
  const [mounted, setMounted] = useState(false);

  // Load tasks from API on mount
  useEffect(() => {
    fetch("/api/tasks")
      .then((r) => r.json())
      .then((rows: Record<string, unknown>[]) => {
        if (Array.isArray(rows)) {
          setTasks(sortByDeadline(rows.map(rowToTask)));
        }
      })
      .catch(() => {})
      .finally(() => setMounted(true));
  }, []);

  const addTask = useCallback(async (text: string, category: CategoryType, deadline?: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: trimmed, category, deadline: deadline || null }),
    });

    if (!res.ok) return;

    const row: Record<string, unknown> = await res.json();
    const newTask = rowToTask(row);

    setTasks((prev) => sortByDeadline([newTask, ...prev]));
  }, []);

  const toggleTask = useCallback(async (id: string) => {
    // Optimistic update
    setTasks((prev) =>
      sortByDeadline(
        prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
      )
    );

    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    await fetch(`/api/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !task.completed }),
    });
  }, [tasks]);

  const deleteTask = useCallback(async (id: string) => {
    // Optimistic update
    setTasks((prev) => prev.filter((t) => t.id !== id));

    await fetch(`/api/tasks/${id}`, { method: "DELETE" });
  }, []);

  const filteredTasks = tasks.filter((t) => {
    if (filter === "completed") return t.completed;
    if (filter === "all") return true;
    return t.category === filter;
  });

  const completedCount = tasks.filter((t) => t.completed).length;
  const totalCount = tasks.length;

  const categoryCounts: Record<FilterType, number> = {
    all: totalCount,
    work: tasks.filter((t) => t.category === "work").length,
    home: tasks.filter((t) => t.category === "home").length,
    personal: tasks.filter((t) => t.category === "personal").length,
    completed: completedCount,
  };

  const progress = (() => {
    if (filter === "all") {
      return { completed: completedCount, total: totalCount };
    }
    if (filter === "completed") {
      return { completed: completedCount, total: totalCount };
    }
    const inCategory = tasks.filter((t) => t.category === filter);
    return {
      completed: inCategory.filter((t) => t.completed).length,
      total: inCategory.length,
    };
  })();

  return {
    tasks: filteredTasks,
    totalCount,
    completedCount,
    categoryCounts,
    progress,
    filter,
    setFilter,
    addTask,
    toggleTask,
    deleteTask,
    mounted,
  };
}
