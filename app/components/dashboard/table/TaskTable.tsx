"use client";

import { useState } from "react";
import { Task } from "@/app/lib/definitions";
import TaskCard from "./TaskCard";
import TaskPagination from "./TaskPagination";

const TASKS_PER_PAGE = 4;

interface TaskTableProps {
  tasks: Task[];
}

export default function TaskTable({
  tasks
}: TaskTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(tasks.length / TASKS_PER_PAGE);

  const handleCurrentPageChange = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) {
      return;
    }
    setCurrentPage(page);
  };

  const paginatedTasks = tasks.slice(
    (currentPage - 1) * TASKS_PER_PAGE,
    currentPage * TASKS_PER_PAGE
  );
  return (
    <div>
      <div className="grid grid-cols-2 gap-2 mb-4">
        {paginatedTasks.map((task: Task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
      <TaskPagination currentPage={currentPage} totalPages={totalPages} onCurrentPageChange={handleCurrentPageChange} />
    </div>
  );
}