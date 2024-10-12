import React from 'react'
import Image from 'next/image'
import logo from '@/public/logo.svg'
import { SideBarLogo } from '@/app/constants/home';

export default function Logo() {
  return (
    <Image
      src={logo}
      alt={SideBarLogo.alt}
      width={SideBarLogo.width}
      height={SideBarLogo.height}
    />
  )
}
