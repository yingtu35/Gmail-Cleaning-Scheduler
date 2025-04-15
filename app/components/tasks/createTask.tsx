"use client"

import { useState } from 'react';
import CreateForm from './create-form';
import CreateFormAI from './create-form-ai';
import {
  FormValues,
  AIPromptValues,
} from '@/app/lib/definitions';
import { QUERY_TEMPLATE } from '@/app/constants/formValues';
import { INITIAL_AI_STATE } from '@/app/constants/aiPromptValues';
import { TEMPLATE_FORM_TYPE, TEMPLATE_TYPE } from '@/app/constants/createTask';
import { TEMPLATES } from '@/app/constants/template';
import TemplateCard from './templateCard';
import { Template } from '@/app/types/createTask';

export default function CreateTask() {
  const [formValues, setFormValues] = useState<FormValues>(QUERY_TEMPLATE.QUERY_EMPTY_FORM);
  const [aiPromptValues, setAIPromptValues] = useState<AIPromptValues>(INITIAL_AI_STATE);
  const [selectedTemplate, setSelectedTemplate] = useState<TEMPLATE_TYPE | null>(null);

  function onSelectTemplate(templateFormType: TEMPLATE_FORM_TYPE, templateType: TEMPLATE_TYPE) {
    setSelectedTemplate(templateType);
    setFormValues(QUERY_TEMPLATE[templateFormType]);
  }

  function onEditAIGeneratedForm() {
    setSelectedTemplate(TEMPLATE_TYPE.EMPTY);
  }

  if (selectedTemplate === null) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-100 w-full'>
        <div className="flex flex-col items-center w-full">
          <h1 className="text-6xl font-bold mb-8 text-center">Select a Template</h1>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full px-4'>
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
      </div>
    )
  }

  switch (selectedTemplate) {
    case TEMPLATE_TYPE.AI:
      return (
        <CreateFormAI
          formValues={formValues}
          onEditAIGeneratedForm={onEditAIGeneratedForm}
          setFormValues={setFormValues}
          aiPromptValues={aiPromptValues}
          setAIPromptValues={setAIPromptValues}
        />
      );
    default:
      return (
        <CreateForm
          formValues={formValues}
          setFormValues={setFormValues}
        />
      );
  }
}