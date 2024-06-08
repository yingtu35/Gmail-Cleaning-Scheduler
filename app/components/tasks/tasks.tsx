import TaskTable from "./table";
import { Suspense } from "react";
import Link from "next/link";
import { Button } from "@/app/components/button";

export default function Tasks() {
  return (
    <div>
      <Button>
        <Link href="/tasks/create">
          Create Task
        </Link>
      </Button>

      <Suspense fallback={<div>Loading...</div>}>
        <TaskTable />
      </Suspense>
    </div>
  )
}