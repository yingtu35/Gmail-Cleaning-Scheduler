import { Task } from "@/app/lib/definitions";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button";

const CardDropdown = ({ id }: { id: string | undefined }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="pr-6">&#8942;</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <a href={`/tasks/${id}`}>View</a>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <a href={`/tasks/${id}/edit`}>Edit</a>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <span className="text-red-600">Delete</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
};

export default function TaskCard({ task }: { task: Task }) {
  const formValues = task.formValues
  return (
    <Card className="border p-4">
      <div className="flex justify-between">
        <CardHeader>
          <CardTitle>{formValues.name}</CardTitle>
        </CardHeader>
        <CardDropdown id={task.id} />
      </div>
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
