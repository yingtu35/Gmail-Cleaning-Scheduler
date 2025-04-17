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

export enum MAX_TASKS_COUNT {
  FREE = 5,
  PRO = 20,
}