import { useState } from 'react';
import { Template } from '@/app/types/createTask';
import TemplateIcon from './templateIcons/templateIcon';
import { TEMPLATE_FORM_TYPE, TEMPLATE_TYPE } from '@/app/constants/createTask';

interface TemplateCardProps {
  template: Template;
  onSelectTemplate: (templateFormType: TEMPLATE_FORM_TYPE, templateType: TEMPLATE_TYPE) => void;
}

function TemplateCard({
  template,
  onSelectTemplate
}: TemplateCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { title, formType, templateType, backgroundColor, description } = template;

  return (
    <div
      className={`max-w-lg ${backgroundColor} text-white text-lg font-semibold rounded-lg shadow-lg transition-all duration-200 flex flex-col items-center justify-center space-y-4 cursor-pointer ${
        isHovered ? 'z-10 shadow-xl/30 shadow-gray-600/30 scale-105' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onSelectTemplate(formType, templateType)}
    >
      <p className='text-4xl pt-4'>{title}</p>
      <div className="relative w-full h-full rounded-lg flex items-center justify-center overflow-hidden">
        <div 
          className={`transition-all duration-300 ease-in-out ${
            isHovered ? 'transform translate-x-[-50%]' : 'transform translate-x-0'
          }`}
        >
          <TemplateIcon src={template.src} />
        </div>
        <div
          className={`absolute top-0 right-0 h-full w-1/2 ${backgroundColor} bg-opacity-75 flex items-center p-4 transition-transform duration-300 ease-in-out ${
            isHovered ? 'transform translate-x-0' : 'transform translate-x-full'
          }`}
        >
          <p className='text-lg'>{description}</p>
        </div>
      </div>
    </div>
  )
}

export default TemplateCard