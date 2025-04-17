import React from 'react'
import Image from 'next/image'
import { TEMPLATE_TITLE } from '@/app/constants/createTask';

interface TemplateIconProps {
  src: string;
  title: TEMPLATE_TITLE;
}

function TemplateIcon({ 
  src,
  title,
}: TemplateIconProps) {
  return (
    <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center overflow-hidden relative">
      <Image 
        src={src}
        alt={`${title} icon`}
        fill
        className="object-cover"
      />
    </div>
  )
}

export default TemplateIcon