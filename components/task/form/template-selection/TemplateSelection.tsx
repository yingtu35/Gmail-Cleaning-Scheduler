"use client"

import { Separator } from '@/components/ui/separator';
import { TEMPLATE_FORM_TYPE, TEMPLATE_TYPE } from '@/app/constants/createTask';
import { TEMPLATES, AI_TEMPLATE_CARD } from '@/app/constants/template';
import { TaskTemplate } from '@/types/task';

import TemplateCard from './templateCard';

interface TemplateSelectionProps {
  onSelectTemplate: (templateFormType: TEMPLATE_FORM_TYPE, templateType: TEMPLATE_TYPE) => void;
}

export default function TemplateSelection({ onSelectTemplate }: TemplateSelectionProps) {
  return (
    <div className='h-screen flex flex-col w-full'>
        <div className="flex flex-col justify-center p-4 gap-4 sticky top-0 bg-background z-10">
          <h2 className="text-2xl font-semibold">How would you like to create your new task?</h2>
          <Separator className="w-full" />
        </div>
        <div className='flex-1 overflow-y-auto px-4'>
          <div className="py-4">
            <h3 className="text-xl font-medium mb-2">AI Generated</h3>
            <TemplateCard
              template={AI_TEMPLATE_CARD}
              onSelectTemplate={onSelectTemplate}
            />
          </div>
          <Separator className="w-full my-4" />
          <div className="mt-4 pb-6">
            <h3 className="text-xl font-medium mb-2">Start from a Template</h3>
            {TEMPLATES.map((template: TaskTemplate) => (
              <div key={template.title} className="mb-3">
                <TemplateCard
                  template={template}
                  onSelectTemplate={onSelectTemplate}
                />
              </div>
            ))}
          </div>
        </div>
    </div>
  );
}
