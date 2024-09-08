import { Task } from "@/app/lib/definitions";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button";

export default function TaskCard({ task }: { task: Task }) {
  const formValues = task.formValues
  return (
    <Card className="border p-4">
      <CardHeader>
        <CardTitle>{formValues.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>{formValues.description}</CardDescription>
        <CardDescription>{formValues.occurrence.Occurrence === "One-time" ? "One-time" : "Recurring"}</CardDescription>
      </CardContent>
      <CardFooter className="flex gap-4">
        <Button variant="destructive">
          Delete
        </Button>
        <Button>
          <a href={`/tasks/${task.id}/edit`}>Edit</a>
        </Button>
      </CardFooter>
    </Card>
  )
}
