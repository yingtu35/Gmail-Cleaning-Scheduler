import {
  FormValues,
} from '@/app/lib/definitions';

const DEFAULT_TIME_ZONE = 'America/Los_Angeles';

const DATE_ONE_DAY_FROM_NOW = new Date(Date.now() + 24 * 60 * 60 * 1000);
const DATE_THREE_MONTHS_FROM_NOW = new Date(Date.now() + 3 * 30 * 24 * 60 * 60 * 1000);
const DATE_THREE_MONTHS_BEFORE_NOW = new Date(Date.now() - 3 * 30 * 24 * 60 * 60 * 1000);
export const DATE_THREE_YEARS_FROM_NOW = new Date(Date.now() + 3 * 365 * 24 * 60 * 60 * 1000);

const DEFAULT_TIME = '00:00';

const DEFAULT_ONE_TIME_SCHEDULE = {
  date: DATE_ONE_DAY_FROM_NOW,
  time: DEFAULT_TIME,
}

const DEFAULT_RECURRING_SCHEDULE = {
  rate: {
    value: 90,
    unit: 'days'
  },
  startDate: new Date(),
  startTime: DEFAULT_TIME,
  endDate: DATE_THREE_MONTHS_FROM_NOW,
  endTime: DEFAULT_TIME,
}

const QUERY_EMPTY: FormValues = {
  name: '',
  description: '',
  occurrence: {
    Occurrence: 'One-time',
    TimeZone: DEFAULT_TIME_ZONE,
    Schedule: {
      date: DATE_ONE_DAY_FROM_NOW,
      time: DEFAULT_TIME,
    },
  },
  from: {
    enabled: false,
    from: '',
  },
  to: {
    enabled: false,
    to: '',
  },
  title: {
    enabled: false,
    title: '',
  },
  emailIs: {
    enabled: false,
    emailIs: ["unread"],
  },
  doesntHave: {
    enabled: false,
    doesntHave: '',
  },
  has: {
    enabled: false,
    has: [],
  },
  labels: {
    enabled: false,
    labels: '',
  },
  category: {
    enabled: false,
    category: [],
  },
  size: {
    enabled: false,
    size: {
      comparison: 'greater than',
      value: 1,
      unit: 'MB'
    }
  },
  age: {
    enabled: false,
    age: {
      comparison: 'older than',
      value: 3,
      unit: 'months'
    }
  },
  time: {
    enabled: false,
    time: {
      comparison: 'before',
      value: DATE_THREE_MONTHS_BEFORE_NOW.toISOString().split('T')[0]
    }
  },
  emailIn: {
    enabled: true,
    emailIn: ["inbox"],
  },
}

const QUERY_OLD_UNREAD: FormValues = {
  name: '',
  description: '',
  occurrence: {
    Occurrence: "Recurring",
    TimeZone: DEFAULT_TIME_ZONE,
    Schedule: {
      rate: {
        value: 90,
        unit: 'days'
      },
      startDate: new Date(),
      startTime: DEFAULT_TIME,
      endDate: DATE_THREE_MONTHS_FROM_NOW, 
      endTime: DEFAULT_TIME,
    }
  },
  from: {
    enabled: false,
    from: '',
  },
  to: {
    enabled: false,
    to: '',
  },
  title: {
    enabled: false,
    title: '',
  },
  emailIs: {
    enabled: true,
    emailIs: ["unread"],
  },
  doesntHave: {
    enabled: false,
    doesntHave: '',
  },
  has: {
    enabled: false,
    has: [],
  },
  labels: {
    enabled: false,
    labels: '',
  },
  category: {
    enabled: false,
    category: [],
  },
  size: {
    enabled: false,
    size: {
      comparison: 'greater than',
      value: 1,
      unit: 'MB'
    }
  },
  age: {
    enabled: true,
    age: {
      comparison: 'older than',
      value: 3,
      unit: 'months'
    }
  },
  time: {
    enabled: false,
    time: {
      comparison: 'before',
      value: DATE_THREE_MONTHS_BEFORE_NOW.toISOString().split('T')[0]
    }
  },
  emailIn: {
    enabled: true,
    emailIn: ["inbox"],
  },
}

const QUERY_LARGE_READ: FormValues = {
  name: '',
  description: '',
  occurrence: {
    Occurrence: 'One-time',
    TimeZone: DEFAULT_TIME_ZONE,
    Schedule: {
      date: DATE_ONE_DAY_FROM_NOW,
      time: DEFAULT_TIME,
    },
  },
  from: {
    enabled: false,
    from: '',
  },
  to: {
    enabled: false,
    to: '',
  },
  title: {
    enabled: false,
    title: '',
  },
  emailIs: {
    enabled: true,
    emailIs: ["read"],
  },
  doesntHave: {
    enabled: false,
    doesntHave: '',
  },
  has: {
    enabled: false,
    has: [],
  },
  labels: {
    enabled: false,
    labels: '',
  },
  category: {
    enabled: false,
    category: [],
  },
  size: {
    enabled: true,
    size: {
      comparison: 'greater than',
      value: 1,
      unit: 'MB'
    }
  },
  age: {
    enabled: false,
    age: {
      comparison: 'older than',
      value: 3,
      unit: 'months'
    }
  },
  time: {
    enabled: false,
    time: {
      comparison: 'before',
      value: DATE_THREE_MONTHS_BEFORE_NOW.toISOString().split('T')[0]
    }
  },
  emailIn: {
    enabled: true,
    emailIn: ["inbox"],
  },
}

const QUERY_LAST_YEAR: FormValues = {
  name: '',
  description: '',
  occurrence: {
    Occurrence: 'One-time',
    TimeZone: DEFAULT_TIME_ZONE,
    Schedule: {
      date: DATE_ONE_DAY_FROM_NOW,
      time: DEFAULT_TIME,
    },
  },
  from: {
    enabled: false,
    from: '',
  },
  to: {
    enabled: false,
    to: '',
  },
  title: {
    enabled: false,
    title: '',
  },
  emailIs: {
    enabled: false,
    emailIs: ["unread"],
  },
  doesntHave: {
    enabled: false,
    doesntHave: '',
  },
  has: {
    enabled: false,
    has: [],
  },
  labels: {
    enabled: false,
    labels: '',
  },
  category: {
    enabled: false,
    category: [],
  },
  size: {
    enabled: false,
    size: {
      comparison: 'greater than',
      value: 1,
      unit: 'MB'
    }
  },
  age: {
    enabled: false,
    age: {
      comparison: 'older than',
      value: 3,
      unit: 'months'
    }
  },
  time: {
    enabled: true,
    time: {
      comparison: 'before',
      // value should be the first day of the year
      value: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0]
    }
  },
  emailIn: {
    enabled: true,
    emailIn: ["inbox"],
  },
}

const QUERY_DRAFTS: FormValues = {
  name: '',
  description: '',
  occurrence: {
    Occurrence: 'One-time',
    TimeZone: DEFAULT_TIME_ZONE,
    Schedule: {
      date: DATE_ONE_DAY_FROM_NOW,
      time: DEFAULT_TIME,
    },
  },
  from: {
    enabled: false,
    from: '',
  },
  to: {
    enabled: false,
    to: '',
  },
  title: {
    enabled: false,
    title: '',
  },
  emailIs: {
    enabled: false,
    emailIs: [],
  },
  doesntHave: {
    enabled: false,
    doesntHave: '',
  },
  has: {
    enabled: false,
    has: [],
  },
  labels: {
    enabled: false,
    labels: '',
  },
  category: {
    enabled: false,
    category: [],
  },
  size: {
    enabled: false,
    size: {
      comparison: 'greater than',
      value: 1,
      unit: 'MB'
    }
  },
  age: {
    enabled: false,
    age: {
      comparison: 'older than',
      value: 3,
      unit: 'months'
    }
  },
  time: {
    enabled: false,
    time: {
      comparison: 'before',
      // value should be the first day of the year
      value: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0]
    }
  },
  emailIn: {
    enabled: true,
    emailIn: ["draft"],
  },
}

const QUERY_NOT_PRIMARY: FormValues = {
  name: '',
  description: '',
  occurrence: {
    Occurrence: 'One-time',
    TimeZone: DEFAULT_TIME_ZONE,
    Schedule: {
      date: DATE_ONE_DAY_FROM_NOW,
      time: DEFAULT_TIME,
    },
  },
  from: {
    enabled: false,
    from: '',
  },
  to: {
    enabled: false,
    to: '',
  },
  title: {
    enabled: false,
    title: '',
  },
  emailIs: {
    enabled: false,
    emailIs: [],
  },
  doesntHave: {
    enabled: false,
    doesntHave: '',
  },
  has: {
    enabled: false,
    has: [],
  },
  labels: {
    enabled: false,
    labels: '',
  },
  category: {
    enabled: true,
    category: ["social", "updates", "forums", "promotions", "reservations", "purchases"],
  },
  size: {
    enabled: false,
    size: {
      comparison: 'greater than',
      value: 1,
      unit: 'MB'
    }
  },
  age: {
    enabled: false,
    age: {
      comparison: 'older than',
      value: 3,
      unit: 'months'
    }
  },
  time: {
    enabled: false,
    time: {
      comparison: 'before',
      // value should be the first day of the year
      value: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0]
    }
  },
  emailIn: {
    enabled: false,
    emailIn: [],
  },
}

export type QueryName = 'QUERY_EMPTY_FORM' | 
'QUERY_OLD_UNREAD_FORM' | 
'QUERY_LARGE_READ_FORM' | 
'QUERY_LAST_YEAR_FORM' | 
'QUERY_DRAFTS_FORM' | 
'QUERY_NOT_PRIMARY_FORM' |
'QUERY_GENERAL_FORM';

export const QUERY_TEMPLATE: Record<QueryName, FormValues> = {
  QUERY_EMPTY_FORM: QUERY_EMPTY,
  QUERY_OLD_UNREAD_FORM: QUERY_OLD_UNREAD,
  QUERY_LARGE_READ_FORM: QUERY_LARGE_READ,
  QUERY_LAST_YEAR_FORM: QUERY_LAST_YEAR,
  QUERY_DRAFTS_FORM: QUERY_DRAFTS,
  QUERY_NOT_PRIMARY_FORM: QUERY_NOT_PRIMARY,
  QUERY_GENERAL_FORM: QUERY_EMPTY,
}

export const DEFAULT_SCHEDULE = {
  oneTime: DEFAULT_ONE_TIME_SCHEDULE,
  recurring: DEFAULT_RECURRING_SCHEDULE,
}