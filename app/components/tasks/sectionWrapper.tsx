import React from 'react'

interface SectionWrapperProps {
  title: string;
  children: React.ReactNode;
}

export function SectionWrapper({ title, children }: SectionWrapperProps) {
  return (
    <div className='space-y-4 rounded-lg border p-4 shadow-md'>
      <h2 className="text-xl font-semibold">{title}</h2>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  )
}

