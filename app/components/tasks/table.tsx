import { getTasks } from "@/app/lib/actions";
import { Task } from "@/app/lib/definitions";

export default async function TaskTable() {
  const tasks: Task[] = await getTasks();
  if (tasks.length === 0) {
    return <div>No tasks found</div>;
  }

  return (
    <div>
      {tasks.map((task: Task) => (
          <div key={task.id}>
            <h2>{task.title}</h2>
            <p>{task.description}</p>
            <p>{task.tasks}</p>
            <p>{task.isRepeatable ? "Repeatable" : "Not Repeatable"}</p>
            {task.isRepeatable && (
              <p>{task.repeatInterval}</p>
            )}
            <br/>
          </div>
      ))}
    </div>
  );
}