import Landing from "@/app/components/landing/Landing";
import Home from "@/app/components/home/Home";
import { getAuthenticatedUser } from "@/app/lib/actions";

export default async function App() {
  const { isAuthenticated, user } = await getAuthenticatedUser();
  return (
    <main className="min-h-screen items-center justify-between">
      {isAuthenticated && user ? (
        <Home />
      ) : (
        <Landing />
      )}
    </main>
  );
}
