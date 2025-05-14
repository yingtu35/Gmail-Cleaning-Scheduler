import { TEMPLATE_TITLE, TEMPLATE_FORM_TYPE, TEMPLATE_TYPE, TEMPLATE_BACKGROUND_COLOR, TEMPLATE_DESCRIPTION } from "./constants";

export type TaskTemplateType = {
  title: TEMPLATE_TITLE;
  formType: TEMPLATE_FORM_TYPE;
  templateType: TEMPLATE_TYPE;
  backgroundColor: TEMPLATE_BACKGROUND_COLOR;
  description: TEMPLATE_DESCRIPTION;
  src: string;
}