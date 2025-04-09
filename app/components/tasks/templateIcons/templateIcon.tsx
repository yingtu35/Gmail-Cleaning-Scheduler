import React from 'react'
import Image from 'next/image'

interface TemplateIconProps {
  src: string;
}

function TemplateIcon({ src }: TemplateIconProps) {
  return (
    <div className="h-48 w-48 m-4 bg-blue-300 rounded-full flex items-center justify-center overflow-hidden relative">
      <Image 
        src={src}
        alt="Basic Email Template" 
        fill
        sizes="192px"
        className="object-cover"
      />
    </div>
  )
}

export default TemplateIcon