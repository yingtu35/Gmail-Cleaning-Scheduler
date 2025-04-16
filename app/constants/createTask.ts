export enum TEMPLATE_TITLE {
  EMPTY = 'Start empty',
  OLD_UNREAD = 'Old unread emails',
  LARGE_READ = 'Large read emails',
  LAST_YEAR = 'Last year',
  DRAFTS = 'Drafts',
  NOT_PRIMARY = 'Not primary',
  AI = 'AI Assisted',
  GENERAL = 'Start with a template',
}

export enum TEMPLATE_FORM_TYPE {
  EMPTY = 'QUERY_EMPTY_FORM',
  OLD_UNREAD = 'QUERY_OLD_UNREAD_FORM',
  LARGE_READ = 'QUERY_LARGE_READ_FORM',
  LAST_YEAR = 'QUERY_LAST_YEAR_FORM',
  DRAFTS = 'QUERY_DRAFTS_FORM',
  NOT_PRIMARY = 'QUERY_NOT_PRIMARY_FORM',
  AI = 'QUERY_EMPTY_FORM',
  GENERAL = 'QUERY_GENERAL_FORM',
}

export enum TEMPLATE_TYPE {
  EMPTY = 'Empty Form',
  OLD_UNREAD = 'Old Unread',
  LARGE_READ = 'Large Read',
  LAST_YEAR = 'Last Year',
  DRAFTS = 'Drafts',
  NOT_PRIMARY = 'Not Primary',
  AI = 'AI Assisted',
  GENERAL = 'General',
}

export enum TEMPLATE_BACKGROUND_COLOR {
  EMPTY = 'bg-gray-500',
  OLD_UNREAD = 'bg-blue-500',
  LARGE_READ = 'bg-green-500',
  LAST_YEAR = 'bg-yellow-500',
  DRAFTS = 'bg-pink-500',
  NOT_PRIMARY = 'bg-red-500',
  AI = 'bg-purple-500',
  GENERAL = 'bg-gray-700',
}

export enum TEMPLATE_DESCRIPTION {
  EMPTY = 'Start with an empty form. Customize your own filters.',
  OLD_UNREAD = 'Delete all unread emails older than 3 months.',
  LARGE_READ = 'Delete all read emails larger than 500KB.',
  LAST_YEAR = 'Depending on the current date, delete all emails from last year.',
  DRAFTS = 'Delete all drafts. How simple is that?',
  NOT_PRIMARY = 'This will delete all emails that are not in the primary tab.',
  AI = 'Use our AI to generate a form for you.',
  GENERAL = 'Use a template to get started quickly.',
}

export enum TEMPLATE_IMAGE_SRC {
  EMPTY = '/template-icons/basic-email.png',
  OLD_UNREAD = '/template-icons/old-unread.png',
  LARGE_READ = '/template-icons/large-read.png',
  LAST_YEAR = '/template-icons/last-year.png',
  DRAFTS = '/template-icons/drafts.png',
  NOT_PRIMARY = '/template-icons/not-primary.png',
  AI = '/template-icons/ai.png',
  GENERAL = '/template-icons/old-unread.png',
}

export enum MAX_TASKS_COUNT {
  FREE = 5,
  PRO = 20,
}