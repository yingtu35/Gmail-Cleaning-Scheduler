
import { getTasks } from "@/app/lib/actions";
import { Task } from "@/app/lib/definitions";
import Link from "next/link";
import TaskCard from "./card";
import TaskPagination from "./taskPagination";

const MOCK_TASKS: Task[] = [
  {
    id: "2",
    expiresAt: new Date(),
    userId: "1",
    formValues: {
      name: "Task 2",
      description: "Description 2",
      occurrence: {
        Occurrence: "Recurring",
        TimeZone: "UTC",
        Schedule: {
          date: "2022-01-01",
          time: "00:00",
        },
      },
      from: {
        enabled: false,
        from: "",
      },
      to: {
        enabled: false,
        to: "",
      },
      title: {
        enabled: false,
        title: "",
      },
      emailIs: {
        enabled: false,
        emailIs: ["unread"],
      },
      doesntHave: {
        enabled: false,
        doesntHave: "",
      },
    }
  },
  {
    id: "3",
    expiresAt: new Date(),
    userId: "1",
    formValues: {
      name: "Task 3",
      description: "Description 3",
      occurrence: {
        Occurrence: "Recurring",
        TimeZone: "UTC",
        Schedule: {
          date: "2022-01-01",
          time: "00:00",
        },
      },
      from: {
        enabled: false,
        from: "",
      },
      to: {
        enabled: false,
        to: "",
      },
      title: {
        enabled: false,
        title: "",
      },
      emailIs: {
        enabled: false,
        emailIs: ["unread"],
      },
      doesntHave: {
        enabled: false,
        doesntHave: "",
      },
    }
  },
];

const TASKS_PER_PAGE = 6;

export default async function TaskTable() {
  const tasks: Task[] = await getTasks();
  if (tasks.length === 0) {
    tasks.push(...MOCK_TASKS);
  }

  return (
    <div>
      <div className="grid grid-cols-autofit-300 gap-2">
        {tasks.map((task: Task) => (
          <>
            {/* <Link key={task.id} href={`/tasks/${task.id}`}> */}
            <TaskCard key={task.id} task={task} />
            {/* </Link> */}
            {/* <Button>
              <Link href={`/tasks/${task.id}/edit`}>
                Edit Task
              </Link>
            </Button> */}
          </>
        ))}
      </div>
      <TaskPagination />
    </div>
  );
}