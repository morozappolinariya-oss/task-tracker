"use client";

import { useState, useEffect, useCallback } from "react";
import { Task, FilterType, CategoryType } from "@/types/task";

const STORAGE_KEY = "task-tracker-tasks";

function sortByDeadline(tasks: Task[]): Task[] {
  return [...tasks].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    if (a.deadline && b.deadline) return a.deadline.localeCompare(b.deadline);
    if (a.deadline) return -1;
    if (b.deadline) return 1;
    return b.createdAt - a.createdAt;
  });
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<FilterType>("all");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setTasks(JSON.parse(stored));
    } catch {
      // ignore corrupted storage
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    }
  }, [tasks, mounted]);

  const addTask = useCallback((text: string, category: CategoryType, deadline?: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setTasks((prev) =>
      sortByDeadline([
        {
          id: crypto.randomUUID(),
          text: trimmed,
          completed: false,
          createdAt: Date.now(),
          category,
          deadline: deadline || undefined,
        },
        ...prev,
      ])
    );
  }, []);

  const toggleTask = useCallback((id: string) => {
    setTasks((prev) =>
      sortByDeadline(
        prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
      )
    );
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
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
