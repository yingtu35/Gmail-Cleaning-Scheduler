import { SessionProvider } from "next-auth/react";
import CreateTask from "@/components/task/createTask"

export default function Page() {
  return (
    <SessionProvider>
      <CreateTask />
    </SessionProvider>
  )
}