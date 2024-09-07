import React from 'react'
import { SignIn } from "@/app/components/auth-components";

export default function LandingSignIn() {
  return (
    <div className='flex justify-center items-center w-6/12'>
      <div className='flex flex-col items-center gap-4'>
        <h1 className="text-2xl font-bold text-center">Start with One Click</h1>
        <SignIn />
      </div>
    </div>
  )
}
