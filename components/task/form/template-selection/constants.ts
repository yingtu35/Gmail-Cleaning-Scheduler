import { TaskTemplateType } from "./types"

export enum TEMPLATE_TITLE {
  EMPTY = 'Empty',
  OLD_UNREAD = 'Old unread emails',
  LARGE_READ = 'Large read emails',
  LAST_YEAR = 'Last year',
  DRAFTS = 'Drafts',
  NOT_PRIMARY = 'Not primary',
  AI = 'Create with AI',
}

export enum TEMPLATE_FORM_TYPE {
  EMPTY = 'QUERY_EMPTY_FORM',
  OLD_UNREAD = 'QUERY_OLD_UNREAD_FORM',
  LARGE_READ = 'QUERY_LARGE_READ_FORM',
  LAST_YEAR = 'QUERY_LAST_YEAR_FORM',
  DRAFTS = 'QUERY_DRAFTS_FORM',
  NOT_PRIMARY = 'QUERY_NOT_PRIMARY_FORM',
  AI = 'QUERY_EMPTY_FORM',
}

export enum TEMPLATE_TYPE {
  EMPTY = 'Empty Form',
  OLD_UNREAD = 'Old Unread',
  LARGE_READ = 'Large Read',
  LAST_YEAR = 'Last Year',
  DRAFTS = 'Drafts',
  NOT_PRIMARY = 'Not Primary',
  AI = 'AI Assisted',
}

export enum TEMPLATE_BACKGROUND_COLOR {
  EMPTY = 'bg-gray-500',
  OLD_UNREAD = 'bg-blue-500',
  LARGE_READ = 'bg-green-500',
  LAST_YEAR = 'bg-yellow-500',
  DRAFTS = 'bg-pink-500',
  NOT_PRIMARY = 'bg-red-500',
  AI = 'bg-purple-500',
}

export enum TEMPLATE_DESCRIPTION {
  EMPTY = 'Build your own custom filter from scratch — total control is yours!',
  OLD_UNREAD = 'Clear out those old unread emails and enjoy a cleaner inbox instantly.',
  LARGE_READ = 'Free up space fast by removing those big, read emails you don’t need.',
  LAST_YEAR = 'Archive last year’s emails in one click and keep your inbox fresh.',
  DRAFTS = 'Say goodbye to forgotten drafts and tidy up with a tap.',
  NOT_PRIMARY = 'Sweep away non-primary emails and focus on what matters most.',
  AI = 'Let AI create the perfect filter for you — just sit back and relax.',
}

export enum TEMPLATE_IMAGE_SRC {
  EMPTY = '/template-icons/basic-email.png',
  OLD_UNREAD = '/template-icons/old-unread.png',
  LARGE_READ = '/template-icons/large-read.png',
  LAST_YEAR = '/template-icons/last-year.png',
  DRAFTS = '/template-icons/drafts.png',
  NOT_PRIMARY = '/template-icons/not-primary.png',
  AI = '/template-icons/ai.png',
}

const EMPTY_TEMPLATE_CARD: TaskTemplateType = {
  title: TEMPLATE_TITLE.EMPTY,
  formType: TEMPLATE_FORM_TYPE.EMPTY,
  templateType: TEMPLATE_TYPE.EMPTY,
  backgroundColor: TEMPLATE_BACKGROUND_COLOR.EMPTY,
  description: TEMPLATE_DESCRIPTION.EMPTY,
  src: TEMPLATE_IMAGE_SRC.EMPTY,
}

export const AI_TEMPLATE_CARD: TaskTemplateType = {
  title: TEMPLATE_TITLE.AI,
  formType: TEMPLATE_FORM_TYPE.AI,
  templateType: TEMPLATE_TYPE.AI,
  backgroundColor: TEMPLATE_BACKGROUND_COLOR.AI,
  description: TEMPLATE_DESCRIPTION.AI,
  src: TEMPLATE_IMAGE_SRC.AI,
}

export const TEMPLATES: TaskTemplateType[] = [
  EMPTY_TEMPLATE_CARD,
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