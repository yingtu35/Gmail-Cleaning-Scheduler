import { TEMPLATE_FORM_TYPE, TEMPLATE_TYPE, TEMPLATE_BACKGROUND_COLOR } from '@/app/constants/createTask';
import TemplateIcon from './templateIcons/templateIcon';
interface TemplateCardProps {
  name: string;
  formType: TEMPLATE_FORM_TYPE;
  templateType: TEMPLATE_TYPE;
  backgroundColor: TEMPLATE_BACKGROUND_COLOR;
  onSelectTemplate: (templateFormType: TEMPLATE_FORM_TYPE, templateType: TEMPLATE_TYPE) => void;
}
function TemplateCard({
  name,
  formType,
  templateType,
  backgroundColor,
  onSelectTemplate
}: TemplateCardProps) {
  return (
    <div
      className={`max-w-lg p-4 ${backgroundColor} text-white text-lg font-semibold rounded-lg shadow-lg hover:bg-blue-600 transition duration-200 cursor-pointer flex flex-col items-center justify-center space-y-8`}
      onClick={() => onSelectTemplate(formType, templateType)}
    >
      <TemplateIcon />
      <p className='text-xl'>{name}</p>
    </div>
  )
}

export default TemplateCard