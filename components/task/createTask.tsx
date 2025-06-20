"use client"

import { useState } from 'react';
import { redirect } from 'next/navigation';
import { useSession } from 'next-auth/react';

import CreateForm from './form/create-form';
import CreateFormAI from './form/create-form-ai';
import {
  FormValues,
} from '@/types/task';

import { QUERY_TEMPLATE } from './form/constants/formValues';
import TemplateSelection from './form/template-selection/TemplateSelection';
import { TEMPLATE_FORM_TYPE, TEMPLATE_TYPE } from './form/template-selection/constants';
import { LoadingSpinner } from '../ui/loadingSpinner';
export default function CreateTask() {
  const [formValues, setFormValues] = useState<FormValues>(QUERY_TEMPLATE.QUERY_EMPTY_FORM);
  const [selectedTemplate, setSelectedTemplate] = useState<TEMPLATE_TYPE | null>(null);
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/api/auth/signin');
    },
  });
  function onSelectTemplate(templateFormType: TEMPLATE_FORM_TYPE, templateType: TEMPLATE_TYPE) {
    setSelectedTemplate(templateType);
    setFormValues(QUERY_TEMPLATE[templateFormType]);
  }

  function onEditAIGeneratedForm(generatedFormValues: FormValues) {
    setSelectedTemplate(TEMPLATE_TYPE.EMPTY);
    setFormValues(generatedFormValues);
  }

  function resetTemplate() {
    setSelectedTemplate(null);
    setFormValues(QUERY_TEMPLATE.QUERY_EMPTY_FORM);
  }

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center h-screen w-full">
        <LoadingSpinner />
      </div>
    )
  }
  

  if (selectedTemplate === null) {
    return <TemplateSelection onSelectTemplate={onSelectTemplate} />;
  }

  switch (selectedTemplate) {
    case TEMPLATE_TYPE.AI:
      return (
        <CreateFormAI
          onEditAIGeneratedForm={onEditAIGeneratedForm}
          resetTemplate={resetTemplate}
        />
      );
    default:
      return (
        <CreateForm
          formValues={formValues}
          resetTemplate={resetTemplate}
          session={session}
        />
      );
  }
}