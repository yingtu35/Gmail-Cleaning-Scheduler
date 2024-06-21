"use client"

import { useState, useEffect } from "react"
import { useFormState, useFormStatus } from "react-dom"
import { confirmSubscriptionByToken } from "@/app/lib/actions"
import { useRouter } from 'next/navigation'

function Submit() {
  const { pending } = useFormStatus()
  return (
    <button 
      type="submit" 
      disabled={pending}
      className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200"
    >
      {pending ? 'Confirming...' : 'Confirm Subscription'}
    </button>
  )
}

export function SubscriptionForm({ 
  email,
  resendConfirmationEmail
}: { 
  email: string
  resendConfirmationEmail: (email: string) => void
}) {
  const router = useRouter()
  const [token, setToken] = useState('')
  const [state, action] = useFormState(confirmSubscriptionByToken, null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    action(token)
  }

  useEffect(() => {
    if (state === "success") {
      setTimeout(() => {
        router.push('/')
      }, 5000)
    }
  }, [state, router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-gray-100 p-8 rounded-lg shadow-md w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-4">Confirm Your Subscription</h1>
        <p className="text-gray-700 mb-4">A confirmation token has been sent to <strong>{email}</strong>. Please enter it below to confirm your subscription.</p>
        <p className="text-gray-700 mb-4">Didn&apos;t receive the email? <button onClick={() => resendConfirmationEmail(email)} className="text-blue-500 hover:underline">Resend</button></p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="token" className="block text-gray-700 font-medium mb-2">
              Enter your confirmation token:
            </label>
            <input
              type="text"
              id="token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <Submit />
        </form>
        {state === "success" && <p className="mt-4 text-center text-gray-700">Subscription confirmed! Redirecting to the home page...</p>}
        {state === "error" && <p className="mt-4 text-center text-red-500">Failed to confirm subscription. Please try again.</p>}
      </div>
    </div>
  )
} 