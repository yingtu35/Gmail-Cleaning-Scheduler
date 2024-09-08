import React from 'react'
import { auth } from "@/auth"

import Sidebar from './Sidebar'
import Dashboard from '../dashboard/Dashboard'

export default async function Home() {
  const session = await auth();
  const user = session?.user;
  if (!user) return null;

  return (
    <div className="flex flex-row h-screen gap-4">
      <Sidebar />
      <Dashboard />
    </div>
  )
}
