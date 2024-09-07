import React from 'react'

interface TemplateIconProps {
  isHovered: boolean
}
function TemplateIcon({
  isHovered
}: TemplateIconProps) {
  return (
    <div className={`h-48 w-48 m-4 bg-blue-300 rounded-full transition-opacity duration-300 ${isHovered ? 'opacity-0' : 'opacity-100'
      }`}></div>
  )
}

export default TemplateIcon