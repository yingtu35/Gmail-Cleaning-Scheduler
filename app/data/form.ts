// This file contains all initial data for the form.
import {
  FormValues,
} from '@/app/lib/definitions';

export const INITIAL_STATE: FormValues = {
  name: '',
  description: '',
  occurrence: {
    Occurrence: 'One-time',
    TimeZone: 'PST',
    Schedule: {
      // default date is today plus 1 day
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
      // get the date 90 days from now in the format 'YYYY-MM-DD'
      value: new Date(Date.now() - 3 * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    }
  },
  emailIn: {
    enabled: true,
    emailIn: ["inbox"],
  },
}