"use client"

import { Button } from "@/components/ui/button";
import { authenticate } from "@/actions/auth";
import useLoadingButton from "@/hooks/useLoadingButton";
import { Loader } from "@/components/loader";

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