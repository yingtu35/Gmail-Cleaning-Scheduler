import Landing from "@/app/components/landing/Landing";
import Tasks from "./components/tasks/tasks";
import { getAuthenticatedUser } from "@/app/lib/actions";

export default async function Home() {
  const { isAuthenticated, user } = await getAuthenticatedUser();
  return (
    <main className="min-h-screen items-center justify-between">
      {isAuthenticated && user ? (
        <Tasks />
      ) : (
        <Landing />
      )}
    </main>
  );
}
