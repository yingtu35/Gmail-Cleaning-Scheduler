import Landing from "@/components/landing";
import Dashboard from "@/components/dashboard";
import { getAuthenticatedUser } from "@/actions/user";

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
