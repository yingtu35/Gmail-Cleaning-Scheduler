import React from 'react'
import Image from 'next/image'

interface TemplateIconProps {
  src: string;
}

function TemplateIcon({ src }: TemplateIconProps) {
  return (
    <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center overflow-hidden relative">
      <Image 
        src={src}
        alt="Template Icon" 
        fill
        className="object-cover"
      />
    </div>
  )
}

export default TemplateIcon