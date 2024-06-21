import Landing from "./components/landing/landing";
import Tasks from "./components/tasks/tasks";
// import { cookies } from 'next/headers'
import { getAuthenticatedUser } from "@/app/lib/actions";
// import { redirect } from "next/navigation";

export default async function Home() {
  // const cookieStore = cookies();
  const {isAuthenticated, user} = await getAuthenticatedUser();
  // const isSubscribed = cookieStore.get('isSubscribed');
  // const email = user.email;
  // if (!isSubscribed) {
  //   return redirect(`/confirm-subscription?email=${email}`);
  // }
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
