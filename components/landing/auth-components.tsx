"use client"

import { Button } from "@/components/ui/button";
import { authenticate } from "@/app/lib/actions";
import useLoadingButton from "@/app/hooks/useLoadingButton";
import { Loader } from "./loader";

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