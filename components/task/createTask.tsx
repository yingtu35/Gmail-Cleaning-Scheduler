"use client"

import { useState } from 'react';
import CreateForm from './form/create-form';
import CreateFormAI from './form/create-form-ai';
import {
  FormValues,
} from '@/app/lib/definitions';
import { QUERY_TEMPLATE } from '@/app/constants/formValues';
import { TEMPLATE_FORM_TYPE, TEMPLATE_TYPE } from '@/app/constants/createTask';
import TemplateSelection from '@/components/task/form/template-selection/TemplateSelection';

export default function CreateTask() {
  const [formValues, setFormValues] = useState<FormValues>(QUERY_TEMPLATE.QUERY_EMPTY_FORM);
  const [selectedTemplate, setSelectedTemplate] = useState<TEMPLATE_TYPE | null>(null);

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
        />
      );
  }
}