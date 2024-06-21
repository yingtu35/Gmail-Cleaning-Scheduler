import { auth } from "@/auth"
import Logo from "./logo";
import Profile from "./profile";

export default async function Header() {
  const session = await auth();
  // console.log("session", session);
  const user = session?.user;
  // console.log("user", user);
  return (
    <header className="sticky flex justify-center border-b">
      <div className="flex items-center justify-between w-full h-16 px-4 mx-auto sm:px-6">
        <Logo />
        { user && <Profile user={user} /> } 
      </div>
    </header>
  )
}
