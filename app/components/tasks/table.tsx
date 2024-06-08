import { getTasks } from "@/app/lib/actions";
import { Task } from "@/app/lib/definitions";
import Link from "next/link";
import TaskCard from "./card";

export default async function TaskTable() {
  const tasks: Task[] = await getTasks();
  if (tasks.length === 0) {
    return <div>No tasks found</div>;
  }

  return (
    <div className="grid grid-cols-autofit-300 gap-2">
      {tasks.map((task: Task) => (
        <Link key={task.id} href={`/tasks/${task.id}`}>
          <TaskCard key={task.id} task={task} />
        </Link>
      ))}
    </div>
  );
}