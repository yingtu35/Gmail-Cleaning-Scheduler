import { getAuthenticatedUser } from "@/app/lib/actions"
import { SectionCards } from "@/components/section-cards"

export default async function Overview() {
  const { isAuthenticated, user } = await getAuthenticatedUser();
  if (!isAuthenticated || !user) return null;
  const { name } = user;
  return (
    <>
      <div className="flex flex-col my-4 px-4 lg:px-6">
        <h1 className="text-2xl font-bold">Welcome back {name}!</h1>
        <p className="text-muted-foreground text-md">
          Here is a summary of your Gmail cleaning tasks (mock data)
        </p>
      </div>
      <SectionCards />
    </>
  )
}