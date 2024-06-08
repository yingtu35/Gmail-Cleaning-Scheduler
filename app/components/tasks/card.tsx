import { Task } from "@/app/lib/definitions";

export default function TaskCard({ task }: { task: Task }) {
  return (
    <div className="border border-black border-solid">
      <h2>{task.title}</h2>
      <p>{task.description}</p>
      <p>{task.tasks}</p>
      <p>{task.isRepeatable ? "Repeatable" : "Not Repeatable"}</p>
      {task.isRepeatable && (
        <p>{task.repeatInterval}</p>
      )}
    </div>
  )
}
