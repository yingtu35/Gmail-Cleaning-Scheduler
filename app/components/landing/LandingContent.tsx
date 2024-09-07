import React from 'react'
import Logo from './Logo'
import { LandingSubtitle } from '@/app/constants/landing'

export default function LandingContent() {
  return (
    <div className='flex justify-center items-center w-6/12'>
      <div className='flex flex-col gap-4 items-center'>
        <Logo />
        <p className='font-semibold'>{LandingSubtitle}</p>
      </div>
    </div>
  )
}
