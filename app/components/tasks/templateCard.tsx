import { useState } from 'react';
import { Template } from '@/app/types/createTask';
import TemplateIcon from './templateIcons/templateIcon';
import { TEMPLATE_FORM_TYPE, TEMPLATE_TYPE } from '@/app/constants/createTask';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

interface TemplateCardProps {
  template: Template;
  onSelectTemplate: (templateFormType: TEMPLATE_FORM_TYPE, templateType: TEMPLATE_TYPE) => void;
}

function TemplateCard({
  template,
  onSelectTemplate
}: TemplateCardProps) {
  const { title, formType, templateType, description, src } = template;

  return (
    <Card 
      className="cursor-pointer transition-colors"
      onClick={() => onSelectTemplate(formType, templateType)}
    >
      <div className="flex p-4 items-center">
        <div className="flex-shrink-0 mr-4">
          <TemplateIcon src={src} title={title} />
        </div>
        <div className="flex-grow">
          <CardHeader className="p-0">
            <CardTitle className="text-2xl font-semibold text-card-foreground">
              {title}
            </CardTitle>
            <CardDescription className="text-sm mt-2 text-muted-foreground">
              {description}
            </CardDescription>
          </CardHeader>
        </div>
      </div>
    </Card>
  );
}

export default TemplateCard