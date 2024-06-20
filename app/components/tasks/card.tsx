import { Task } from "@/app/lib/definitions";
export default function TaskCard({ task }: { task: Task }) {
  const formValues = task.formValues
  return (
    <div className="border p-4">
      <h2>{formValues.name}</h2>
      <p>{formValues.description}</p>
      <p>{formValues.occurrence.Occurrence === "One-time" ? "One-time" : "Recurring"}</p>
    </div>
  )
}
