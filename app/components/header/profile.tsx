'use client'

import { SignOut } from "@/app/components/auth-components"
import { User } from "next-auth";
import { UserIconType } from "@/app/lib/definitions";
import Image from "next/image";
import useDropdown from "@/app/hooks/useDropdown";
import defaultUser from "@/public/user.png";

export default function Profile({ user } : { user: User }) {
  const { open, handleClickItem, dropdownRef } = useDropdown();
  const profileImage = user.image ? user.image : defaultUser;

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button 
        onClick={handleClickItem}
        type="button"
      >
        <Image
          src={profileImage}
          alt="user avatar"
          width={40}
          height={40}
          className="rounded-full"
        />
      </button>

  {/* <!--
    Dropdown menu, show/hide based on menu state.

    Entering: "transition ease-out duration-100"
      From: "transform opacity-0 scale-95"
      To: "transform opacity-100 scale-100"
    Leaving: "transition ease-in duration-75"
      From: "transform opacity-100 scale-100"
      To: "transform opacity-0 scale-95"
  --> */}
      { open && 
        <div className="absolute w-screen md:w-auto right-0 z-10 mt-2 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabIndex={-1}>
          <div className="py-1 text-center" role="none">
            {/* <!-- Active: "bg-gray-100 text-gray-900", Not Active: "text-gray-700" --> */}
            <p className="text-gray-700 block px-4 py-2 text-sm" tabIndex={-1} id="menu-header">Sign in as <strong>{user.name}</strong></p>
          </div>
          <div className="flex justify-center py-1" role="none">
            <SignOut />
          </div>
        </div>
      }
    </div>
  )
}

export const UserIcon = ({ user } : { user: UserIconType }) => {
  const { name, avatarUrl, htmlUrl } = user;
  return (
    <a href={htmlUrl} target="_blank" rel="noopener noreferrer">
      <Image
        src={avatarUrl}
        alt={`${name} icon`}
        width={50}
        height={50}
        className="rounded-full border-2 border-blue-200"
      />
    </a>
  )
}