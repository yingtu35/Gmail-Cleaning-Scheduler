import Landing from "./components/landing/landing";
import Tasks from "./components/tasks/tasks";
import { auth } from "@/auth";

export default async function Home() {
  const session = await auth();
  const user = session?.user;
  return (
    <main className="min-h-screen items-center justify-between">
      { user ? (
        <Tasks />
      ) : (
        <Landing />
      )}
    </main>
  );
}
