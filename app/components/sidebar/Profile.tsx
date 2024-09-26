import React from 'react'
import { User } from 'next-auth';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { logOut } from '@/app/lib/actions';

interface ProfileProps {
  user: ({
    id?: string | undefined;
  } & User) | undefined
}

export default function Profile({ user }: ProfileProps) {
  const profileImage = user?.image || undefined;
  const name = user?.name || "Unknown";
  const email = user?.email || "Unknown";
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className='flex justify-center items-center'>
        <Avatar className='mr-3'>
          <AvatarImage src={profileImage} alt={name} />
          <AvatarFallback>{name}</AvatarFallback>
        </Avatar>
        <p className='text-xs'>{email}</p>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>{name}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Subscribe to Premium</DropdownMenuItem>
        <DropdownMenuItem>Settings</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <form action={logOut}>
            <button type='submit'>Sign out</button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
