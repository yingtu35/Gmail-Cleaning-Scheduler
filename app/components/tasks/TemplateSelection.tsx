"use client"

import { useState } from 'react';
import { TEMPLATE_FORM_TYPE, TEMPLATE_TYPE } from '@/app/constants/createTask';
import { TEMPLATES, TASK_CREATION_OPTIONS, GENERAL_TEMPLATE_CARD } from '@/app/constants/template';
import TemplateCard from './templateCard';
import { Template } from '@/app/types/createTask';

interface TemplateSelectionProps {
  onSelectTemplate: (templateFormType: TEMPLATE_FORM_TYPE, templateType: TEMPLATE_TYPE) => void;
}

const TemplateTitle = ({ title, children }: { title: string; children?: React.ReactNode }) => (
  <div className="flex items-center p-4 gap-4">
    <h2 className="text-2xl font-semibold">{title}</h2>
    {children}
  </div>
);

export default function TemplateSelection({ onSelectTemplate }: TemplateSelectionProps) {
  const [isGeneralSelected, setIsGeneralSelected] = useState(false);

  // Wrapper function to handle template selection
  const handleTemplateSelection = (templateFormType: TEMPLATE_FORM_TYPE, templateType: TEMPLATE_TYPE, template: Template) => {
    if (template.title === GENERAL_TEMPLATE_CARD.title) {
      setIsGeneralSelected(true);
    } else {
      onSelectTemplate(templateFormType, templateType);
    }
  };

  if (isGeneralSelected) {
    return (
      <div className='min-h-screen flex flex-col w-full'>
          <TemplateTitle title="Select a template">
            <button 
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-700"
              onClick={() => setIsGeneralSelected(false)}
            >
              Back
            </button>
          </TemplateTitle>
          <p className='text-sm text-muted-foreground px-4'>Note: You can always change the template later.</p>
          <div className='flex flex-col w-full px-4 gap-4'>
            {TEMPLATES.map((template: Template) => (
              <div key={template.title}>
                <TemplateCard
                  template={template}
                  onSelectTemplate={onSelectTemplate}
                />
              </div>
            ))}
          </div>
      </div>
    );
  }
  
  return (
    <div className='min-h-screen flex flex-col w-full'>
      <TemplateTitle title='How would you like to create your new task?' />
        <div className='flex flex-col w-full px-4 gap-4'>
          {TASK_CREATION_OPTIONS.map((template: Template) => (
            <div key={template.title}>
              <TemplateCard
                template={template}
                onSelectTemplate={(formType, templateType) => handleTemplateSelection(formType, templateType, template)}
              />
            </div>
          ))}
        </div>
    </div>
  );
}
