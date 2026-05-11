"use client";

import { useState } from "react";
import { useTasks } from "@/hooks/useTasks";
import Header from "@/components/Header";
import Modal from "@/components/Modal";
import AddTaskForm from "@/components/AddTaskForm";
import FilterTabs from "@/components/FilterTabs";
import TaskList from "@/components/TaskList";
import ProgressBar from "@/components/ProgressBar";

const EMPTY_MESSAGES: Record<string, string> = {
  all:       "Задач пока нет. Нажмите «Добавить»!",
  work:      "Нет задач по работе",
  home:      "Нет домашних задач",
  personal:  "Нет личных задач",
  completed: "Нет завершённых задач",
};

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);

  const {
    tasks,
    totalCount,
    categoryCounts,
    progress,
    filter,
    setFilter,
    addTask,
    toggleTask,
    deleteTask,
    mounted,
  } = useTasks();

  return (
    <>
      <Header onAdd={() => setModalOpen(true)} />

      <main className="mx-auto w-full max-w-md px-4 py-5 space-y-4">

        {mounted && totalCount > 0 && (
          <FilterTabs
            current={filter}
            onChange={setFilter}
            counts={categoryCounts}
          />
        )}

        {mounted && progress.total > 0 && (
          <ProgressBar completed={progress.completed} total={progress.total} />
        )}

        {mounted ? (
          <TaskList
            tasks={tasks}
            onToggle={toggleTask}
            onDelete={deleteTask}
            emptyMessage={EMPTY_MESSAGES[filter]}
          />
        ) : (
          <div className="py-16 flex justify-center">
            <div className="w-5 h-5 border-2 border-slate-200 border-t-indigo-400 rounded-full animate-spin" />
          </div>
        )}
      </main>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <AddTaskForm onAdd={addTask} onClose={() => setModalOpen(false)} />
      </Modal>
    </>
  );
}
