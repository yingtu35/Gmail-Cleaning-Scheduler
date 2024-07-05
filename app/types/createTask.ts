import { TEMPLATE_FORM_TYPE, TEMPLATE_TYPE, TEMPLATE_BACKGROUND_COLOR } from "@/app/constants/createTask";

export type Template = {
  name: string;
  formType: TEMPLATE_FORM_TYPE;
  templateType: TEMPLATE_TYPE;
  backgroundColor: TEMPLATE_BACKGROUND_COLOR;
}

export const TEMPLATES: Template[] = [
  {
    name: 'Start empty',
    formType: TEMPLATE_FORM_TYPE.EMPTY,
    templateType: TEMPLATE_TYPE.EMPTY,
    backgroundColor: TEMPLATE_BACKGROUND_COLOR.EMPTY,
  },
  {
    name: 'Old unread emails',
    formType: TEMPLATE_FORM_TYPE.OLD_UNREAD,
    templateType: TEMPLATE_TYPE.OLD_UNREAD,
    backgroundColor: TEMPLATE_BACKGROUND_COLOR.OLD_UNREAD,
  },
  {
    name: 'Large read emails',
    formType: TEMPLATE_FORM_TYPE.LARGE_READ,
    templateType: TEMPLATE_TYPE.LARGE_READ,
    backgroundColor: TEMPLATE_BACKGROUND_COLOR.LARGE_READ,
  },
  {
    name: 'Last year',
    formType: TEMPLATE_FORM_TYPE.LAST_YEAR,
    templateType: TEMPLATE_TYPE.LAST_YEAR,
    backgroundColor: TEMPLATE_BACKGROUND_COLOR.LAST_YEAR,
  },
  {
    name: 'Drafts',
    formType: TEMPLATE_FORM_TYPE.DRAFTS,
    templateType: TEMPLATE_TYPE.DRAFTS,
    backgroundColor: TEMPLATE_BACKGROUND_COLOR.DRAFTS,
  },
  {
    name: 'Not primary',
    formType: TEMPLATE_FORM_TYPE.NOT_PRIMARY,
    templateType: TEMPLATE_TYPE.NOT_PRIMARY,
    backgroundColor: TEMPLATE_BACKGROUND_COLOR.NOT_PRIMARY,
  },
  {
    name: 'AI Assisted',
    formType: TEMPLATE_FORM_TYPE.AI,
    templateType: TEMPLATE_TYPE.AI,
    backgroundColor: TEMPLATE_BACKGROUND_COLOR.AI,
  },
]