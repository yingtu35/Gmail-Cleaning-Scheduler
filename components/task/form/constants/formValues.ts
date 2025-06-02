import { TZDate } from 'react-day-picker';
import {
  FormValues,
} from '@/types/task';
import {
  EMAIL_IS_ENUM,
  HAS_ENUM,
  CATEGORY_ENUM,
  EMAIL_IN_ENUM,
} from '@/validations/form';
import { capitalizeFirstLetter } from '@/utils/strings';

const DEFAULT_TIME_ZONE = '(UTC-08:00) America/Los_Angeles';
const TIMEZONE_UTC = 'UTC';

const _date = new Date();
const DAY_IN_MS = 24 * 60 * 60 * 1000;

const DATE_NOW = new TZDate(_date.getUTCFullYear(), _date.getUTCMonth(), _date.getUTCDate(), 0, 0, 0, 0, TIMEZONE_UTC); // Aligned to 00:00 UTC

export const DATE_TWO_DAYS_FROM_NOW = new TZDate(DATE_NOW.getTime() + 2 *DAY_IN_MS, TIMEZONE_UTC);
const DATE_THREE_MONTHS_FROM_NOW = new TZDate(DATE_NOW.getTime() + 3 * 30 * DAY_IN_MS, TIMEZONE_UTC);
const DATE_THREE_MONTHS_BEFORE_NOW = new TZDate(DATE_NOW.getTime() - 3 * 30 * DAY_IN_MS, TIMEZONE_UTC);
const DATE_FIRST_DAY_OF_YEAR = new TZDate(DATE_NOW.getFullYear(), 0, 1, 0, 0, 0, 0, TIMEZONE_UTC);

const CURRENT_TIME = "00:00";

const DEFAULT_ONE_TIME_SCHEDULE = {
  date: DATE_TWO_DAYS_FROM_NOW,
  time: CURRENT_TIME,
}

const DEFAULT_RECURRING_SCHEDULE = {
  rate: {
    value: 90,
    unit: 'days'
  },
  startDateAndTime: {
    date: DATE_TWO_DAYS_FROM_NOW,
    time: CURRENT_TIME,
  },
  endDateAndTime: {
    date: DATE_THREE_MONTHS_FROM_NOW,
    time: CURRENT_TIME,
  }
}

export const EMAIL_IS_OPTIONS = EMAIL_IS_ENUM.map((emailIs) => ({
  label: capitalizeFirstLetter(emailIs),
  value: emailIs,
}))

export const HAS_OPTIONS = HAS_ENUM.map((has) => ({
  label: capitalizeFirstLetter(has),
  value: has,
}))
export const CATEGORY_OPTIONS = CATEGORY_ENUM.map((category) => ({
  label: capitalizeFirstLetter(category),
  value: category,
}))
export const EMAIL_IN_OPTIONS = EMAIL_IN_ENUM.map((emailIn) => ({
  label: capitalizeFirstLetter(emailIn),
  value: emailIn,
}))

export const FIELDS_TO_VALIDATE: (keyof FormValues)[][] = [
  ['name', 'description', 'occurrence'],
  [], // check all fields
]

const QUERY_EMPTY: FormValues = {
  name: '',
  description: '',
  occurrence: {
    Occurrence: 'One-time',
    TimeZone: DEFAULT_TIME_ZONE,
    Schedule: {
      date: DATE_TWO_DAYS_FROM_NOW,
      time: CURRENT_TIME,
    },
  },
  from: {
    enabled: false,
    from: [],
  },
  to: {
    enabled: false,
    to: [],
  },
  title: {
    enabled: false,
    title: [],
  },
  emailIs: {
    enabled: false,
    emailIs: ["unread"],
  },
  doesntHave: {
    enabled: false,
    doesntHave: [],
  },
  has: {
    enabled: false,
    has: [],
  },
  labels: {
    enabled: false,
    labels: [],
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
      value: DATE_THREE_MONTHS_BEFORE_NOW
    }
  },
  emailIn: {
    enabled: false,
    emailIn: [],
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
      startDateAndTime: {
        date: DATE_TWO_DAYS_FROM_NOW,
        time: CURRENT_TIME,
      },
      endDateAndTime: {
        date: DATE_THREE_MONTHS_FROM_NOW, 
        time: CURRENT_TIME,
      },
    }
  },
  from: {
    enabled: false,
    from: [],
  },
  to: {
    enabled: false,
    to: [],
  },
  title: {
    enabled: false,
    title: [],
  },
  emailIs: {
    enabled: true,
    emailIs: ["unread"],
  },
  doesntHave: {
    enabled: false,
    doesntHave: [],
  },
  has: {
    enabled: false,
    has: [],
  },
  labels: {
    enabled: false,
    labels: [],
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
      value: DATE_THREE_MONTHS_BEFORE_NOW
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
      date: DATE_TWO_DAYS_FROM_NOW,
      time: CURRENT_TIME,
    },
  },
  from: {
    enabled: false,
    from: [],
  },
  to: {
    enabled: false,
    to: [],
  },
  title: {
    enabled: false,
    title: [],
  },
  emailIs: {
    enabled: true,
    emailIs: ["read"],
  },
  doesntHave: {
    enabled: false,
    doesntHave: [],
  },
  has: {
    enabled: false,
    has: [],
  },
  labels: {
    enabled: false,
    labels: [],
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
      value: DATE_THREE_MONTHS_BEFORE_NOW
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
      date: DATE_TWO_DAYS_FROM_NOW,
      time: CURRENT_TIME,
    },
  },
  from: {
    enabled: false,
    from: [],
  },
  to: {
    enabled: false,
    to: [],
  },
  title: {
    enabled: false,
    title: [],
  },
  emailIs: {
    enabled: false,
    emailIs: ["unread"],
  },
  doesntHave: {
    enabled: false,
    doesntHave: [],
  },
  has: {
    enabled: false,
    has: [],
  },
  labels: {
    enabled: false,
    labels: [],
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
      value: DATE_FIRST_DAY_OF_YEAR
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
      date: DATE_TWO_DAYS_FROM_NOW,
      time: CURRENT_TIME,
    },
  },
  from: {
    enabled: false,
    from: [],
  },
  to: {
    enabled: false,
    to: [],
  },
  title: {
    enabled: false,
    title: [],
  },
  emailIs: {
    enabled: false,
    emailIs: [],
  },
  doesntHave: {
    enabled: false,
    doesntHave: [],
  },
  has: {
    enabled: false,
    has: [],
  },
  labels: {
    enabled: false,
    labels: [],
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
      value: DATE_FIRST_DAY_OF_YEAR
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
      date: DATE_TWO_DAYS_FROM_NOW,
      time: CURRENT_TIME,
    },
  },
  from: {
    enabled: false,
    from: [],
  },
  to: {
    enabled: false,
    to: [],
  },
  title: {
    enabled: false,
    title: [],
  },
  emailIs: {
    enabled: false,
    emailIs: [],
  },
  doesntHave: {
    enabled: false,
    doesntHave: [],
  },
  has: {
    enabled: false,
    has: [],
  },
  labels: {
    enabled: false,
    labels: [],
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
      value: DATE_FIRST_DAY_OF_YEAR
    }
  },
  emailIn: {
    enabled: false,
    emailIn: [],
  },
}
// Simple template satisfying formValuesSchema
const QUERY_AI_TEMPLATE: FormValues = {
  name: 'a',
  description: '',
  occurrence: {
    Occurrence: 'One-time',
    TimeZone: DEFAULT_TIME_ZONE,
    Schedule: { date: DATE_TWO_DAYS_FROM_NOW, time: CURRENT_TIME },
  },
  from: { enabled: false, from: [] },
  to: { enabled: false, to: [] },
  title: { enabled: false, title: [] },
  emailIs: { enabled: false, emailIs: [] },
  doesntHave: { enabled: false, doesntHave: [] },
  has: { enabled: false, has: [] },
  labels: { enabled: false, labels: [] },
  category: { enabled: false, category: [] },
  size: { enabled: false, size: { comparison: 'greater than', value: 0, unit: 'MB' } },
  age: { enabled: false, age: { comparison: 'older than', value: 0, unit: 'days' } },
  time: { enabled: false, time: { comparison: 'before', value: DATE_FIRST_DAY_OF_YEAR } },
  emailIn: { enabled: true, emailIn: ["inbox"] },
};

type QueryName = 'QUERY_EMPTY_FORM' | 
'QUERY_OLD_UNREAD_FORM' | 
'QUERY_LARGE_READ_FORM' | 
'QUERY_LAST_YEAR_FORM' | 
'QUERY_DRAFTS_FORM' | 
'QUERY_NOT_PRIMARY_FORM' |
'QUERY_AI_TEMPLATE';

export const QUERY_TEMPLATE: Record<QueryName, FormValues> = {
  QUERY_EMPTY_FORM: QUERY_EMPTY,
  QUERY_OLD_UNREAD_FORM: QUERY_OLD_UNREAD,
  QUERY_LARGE_READ_FORM: QUERY_LARGE_READ,
  QUERY_LAST_YEAR_FORM: QUERY_LAST_YEAR,
  QUERY_DRAFTS_FORM: QUERY_DRAFTS,
  QUERY_NOT_PRIMARY_FORM: QUERY_NOT_PRIMARY,
  QUERY_AI_TEMPLATE: QUERY_AI_TEMPLATE,
}

export const DEFAULT_SCHEDULE = {
  oneTime: DEFAULT_ONE_TIME_SCHEDULE,
  recurring: DEFAULT_RECURRING_SCHEDULE,
}
