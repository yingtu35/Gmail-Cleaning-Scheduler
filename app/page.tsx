import Landing from "@/components/landing";
import Dashboard from "@/components/dashboard";
import { getAuthenticatedUser } from "@/app/lib/actions";

export default async function App() {
  const { isAuthenticated, user } = await getAuthenticatedUser();
  return (
    isAuthenticated && user ? (
      <Dashboard />
    ) : (
      <Landing />
    )
  );
}
