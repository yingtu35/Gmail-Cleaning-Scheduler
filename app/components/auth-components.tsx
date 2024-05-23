"use client"

import { Button } from "@/app/components/button";
import { authenticate, logOut } from "@/app/lib/actions";
import useLoadingButton from "@/app/hooks/useLoadingButton";
import { Loader } from "./loader";
// import { toast } from "sonner";

export function SignIn({
  provider,
  ...props
}: { provider?: string } & React.ComponentPropsWithRef<typeof Button>) {
  const { loading, disabled, handleButtonClick } = useLoadingButton(authenticate);

  return (
    <form
      action={handleButtonClick}
    >
      <Button {...props} disabled={disabled} className="disabled:bg-gray-300">
        {loading && <Loader />}
        Sign In with Google
      </Button>
    </form>
  )
}

export function SignOut() {
  // const handleSignOut = () => {
  //   toast.promise(logOut, {
  //     loading: "Signing out...",
  //     success: "Signed out",
  //     error: "Failed to sign out"
  //   });

  return (
    <form action={logOut}>
      <button type="submit" className="text-gray-700 block px-4 py-2 text-sm d-block mr-0 ml-auto transition-colors hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 active:bg-gray-300 aria-disabled:cursor-not-allowed aria-disabled:opacity-50">Sign Out</button>
    </form>
  )
}