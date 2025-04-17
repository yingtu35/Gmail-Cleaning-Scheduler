import {
  FormValues,
} from '@/app/lib/definitions';

const QUERY_EMPTY: FormValues = {
  name: '',
  description: '',
  occurrence: {
    Occurrence: 'One-time',
    TimeZone: 'America/Los_Angeles',
    Schedule: {
      date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      time: '00:00',
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
      value: new Date(Date.now() - 3 * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
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
    TimeZone: 'America/Los_Angeles',
    Schedule: {
      rate: {
        value: 90,
        unit: 'days'
      },
      startDate: '',
      endDate: ''
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
      value: new Date(Date.now() - 3 * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
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
    TimeZone: 'America/Los_Angeles',
    Schedule: {
      date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      time: '00:00',
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
      value: new Date(Date.now() - 3 * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
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
    TimeZone: 'America/Los_Angeles',
    Schedule: {
      date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      time: '00:00',
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
    TimeZone: 'America/Los_Angeles',
    Schedule: {
      date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      time: '00:00',
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
    TimeZone: 'America/Los_Angeles',
    Schedule: {
      date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      time: '00:00',
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