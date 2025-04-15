import { TEMPLATE_BACKGROUND_COLOR, TEMPLATE_DESCRIPTION, TEMPLATE_FORM_TYPE, TEMPLATE_TITLE, TEMPLATE_TYPE, TEMPLATE_IMAGE_SRC } from "./createTask"
import { Template } from "../types/createTask"

export const TEMPLATES: Template[] = [
  {
    title: TEMPLATE_TITLE.EMPTY,
    formType: TEMPLATE_FORM_TYPE.EMPTY,
    templateType: TEMPLATE_TYPE.EMPTY,
    backgroundColor: TEMPLATE_BACKGROUND_COLOR.EMPTY,
    description: TEMPLATE_DESCRIPTION.EMPTY,
    src: TEMPLATE_IMAGE_SRC.EMPTY,
  },
  {
    title: TEMPLATE_TITLE.AI,
    formType: TEMPLATE_FORM_TYPE.AI,
    templateType: TEMPLATE_TYPE.AI,
    backgroundColor: TEMPLATE_BACKGROUND_COLOR.AI,
    description: TEMPLATE_DESCRIPTION.AI,
    src: TEMPLATE_IMAGE_SRC.AI,
  },
  {
    title: TEMPLATE_TITLE.OLD_UNREAD,
    formType: TEMPLATE_FORM_TYPE.OLD_UNREAD,
    templateType: TEMPLATE_TYPE.OLD_UNREAD,
    backgroundColor: TEMPLATE_BACKGROUND_COLOR.OLD_UNREAD,
    description: TEMPLATE_DESCRIPTION.OLD_UNREAD,
    src: TEMPLATE_IMAGE_SRC.OLD_UNREAD,
  },
  {
    title: TEMPLATE_TITLE.LARGE_READ,
    formType: TEMPLATE_FORM_TYPE.LARGE_READ,
    templateType: TEMPLATE_TYPE.LARGE_READ,
    backgroundColor: TEMPLATE_BACKGROUND_COLOR.LARGE_READ,
    description: TEMPLATE_DESCRIPTION.LARGE_READ,
    src: TEMPLATE_IMAGE_SRC.LARGE_READ,
  },
  {
    title: TEMPLATE_TITLE.LAST_YEAR,
    formType: TEMPLATE_FORM_TYPE.LAST_YEAR,
    templateType: TEMPLATE_TYPE.LAST_YEAR,
    backgroundColor: TEMPLATE_BACKGROUND_COLOR.LAST_YEAR,
    description: TEMPLATE_DESCRIPTION.LAST_YEAR,
    src: TEMPLATE_IMAGE_SRC.LAST_YEAR,
  },
  {
    title: TEMPLATE_TITLE.DRAFTS,
    formType: TEMPLATE_FORM_TYPE.DRAFTS,
    templateType: TEMPLATE_TYPE.DRAFTS,
    backgroundColor: TEMPLATE_BACKGROUND_COLOR.DRAFTS,
    description: TEMPLATE_DESCRIPTION.DRAFTS,
    src: TEMPLATE_IMAGE_SRC.DRAFTS,
  },
  {
    title: TEMPLATE_TITLE.NOT_PRIMARY,
    formType: TEMPLATE_FORM_TYPE.NOT_PRIMARY,
    templateType: TEMPLATE_TYPE.NOT_PRIMARY,
    backgroundColor: TEMPLATE_BACKGROUND_COLOR.NOT_PRIMARY,
    description: TEMPLATE_DESCRIPTION.NOT_PRIMARY,
    src: TEMPLATE_IMAGE_SRC.NOT_PRIMARY,
  },
]