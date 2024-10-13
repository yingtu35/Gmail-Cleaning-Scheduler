import Link from "next/link";
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
import { deleteTask } from "@/app/lib/actions";

const CardDropdown = ({ id }: { id: string | undefined }) => {
  const onDeleteCard = async () => {
    if (!id) return;
    confirm("Are you sure you want to delete this task?") && await deleteTask(id);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="pr-6">&#8942;</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <a href={`/tasks/${id}`}>View</a>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link href={`/tasks/${id}/edit`}>Edit</Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" onClick={onDeleteCard}>
          <span className="text-red-500">Delete</span>
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
        This is a footer
      </CardFooter>
    </Card>
  )
}
