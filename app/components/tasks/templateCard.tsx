import { useState } from 'react';
import { Template } from '@/app/types/createTask';
import TemplateIcon from './templateIcons/templateIcon';
import { TEMPLATE_FORM_TYPE, TEMPLATE_TYPE } from '@/app/constants/createTask';
import { Button } from '../button';
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
      className={`max-w-lg ${backgroundColor} text-white text-lg font-semibold rounded-lg shadow-lg transition duration-200 flex flex-col items-center justify-center space-y-8`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <p className='text-xl p-4'>{title}</p>
      <div className="relative w-full h-full rounded-lg flex items-center justify-center overflow-hidden">
        <TemplateIcon isHovered={isHovered} />
        <div
          className={`absolute bottom-0 left-0 right-0 w-full h-full ${backgroundColor} bg-opacity-75 flex flex-col items-center justify-center transition-transform duration-300 ease-in-out ${isHovered ? 'translate-y-0' : 'translate-y-full'
            }`}
        >
          <div className='min-h-36 border-b-2 p-4'>
            <p className='text-sm'>{description}</p>
          </div>
          <Button
            className='m-4 h-full justify-center'
            onClick={() => onSelectTemplate(formType, templateType)}
          >
            Select
          </Button>
        </div>
      </div>
    </div>
  )
}

export default TemplateCard