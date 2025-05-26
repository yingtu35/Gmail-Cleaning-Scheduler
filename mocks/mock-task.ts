import { Task } from "@/types/task";

export const mockTasks: Task[] = [
  {
    id: "task-001",
    scheduleName: "Schedule 1",
    createdAt: new Date("2025-03-10T10:00:00Z"),
    updatedAt: new Date("2025-03-10T10:00:00Z"),
    lastExecutedAt: new Date(new Date("2025-03-10T10:00:00Z").getTime() - (Math.floor(Math.random() * 7) + 1) * 24 * 60 * 60 * 1000),
    status: "active",
    emailsDeleted: 150,
    successCounts: 5,
    errorCounts: 1,
    userId: "user-123",
    formValues: {
      name: "Clean up old newsletters",
      description: "Remove old marketing emails",
      occurrence: {
        Occurrence: "Recurring",
        TimeZone: "(UTC-08:00) America/Los_Angeles",
        Schedule: {
          rate: {
            value: 7,
            unit: "days"
          },
          startDateAndTime: { date: new Date("2025-03-10"), time: "00:00" },
          endDateAndTime: { date: new Date("2025-05-10"), time: "00:00" }
        }
      },
      from: { enabled: true, from: ["newsletter@example.com"] },
      to: { enabled: false, to: [] },
      title: { enabled: false, title: [] },
      emailIs: { enabled: true, emailIs: ["read"] },
      doesntHave: { enabled: false, doesntHave: [] },
      has: { enabled: false, has: [] },
      labels: { enabled: false, labels: [] },
      category: {
        enabled: true,
        category: ["promotions"]
      },
      size: {
        enabled: false,
        size: {
          comparison: "greater than",
          value: 1,
          unit: "MB"
        }
      },
      age: {
        enabled: true,
        age: {
          comparison: "older than",
          value: 30,
          unit: "days"
        }
      },
      time: {
        enabled: false,
        time: {
          comparison: "before",
          value: new Date()
        }
      },
      emailIn: {
        enabled: true,
        emailIn: ["inbox"]
      }
    }
  },
  {
    id: "task-002",
    scheduleName: "Schedule 2",
    createdAt: new Date("2025-02-15T14:30:00Z"),
    updatedAt: new Date("2025-02-15T14:30:00Z"),
    lastExecutedAt: new Date(new Date("2025-02-15T14:30:00Z").getTime() - (Math.floor(Math.random() * 7) + 1) * 24 * 60 * 60 * 1000),
    status: "completed",
    emailsDeleted: 2500,
    successCounts: 25,
    errorCounts: 0,
    userId: "user-123",
    formValues: {
      name: "Delete large attachments",
      description: "Remove emails with large attachments to free up space",
      occurrence: {
        Occurrence: "One-time",
        TimeZone: "America/New_York",
        Schedule: {
          date: new Date("2025-04-01"),
          time: "14:30"
        }
      },
      from: {
        enabled: false,
        from: []
      },
      to: {
        enabled: false,
        to: []
      },
      title: {
        enabled: false,
        title: []
      },
      emailIs: {
        enabled: false,
        emailIs: []
      },
      doesntHave: {
        enabled: false,
        doesntHave: []
      },
      has: {
        enabled: true,
        has: ["attachment"]
      },
      labels: {
        enabled: false,
        labels: []
      },
      category: {
        enabled: false,
        category: []
      },
      size: {
        enabled: true,
        size: {
          comparison: "greater than",
          value: 10,
          unit: "MB"
        }
      },
      age: {
        enabled: true,
        age: {
          comparison: "older than",
          value: 6,
          unit: "months"
        }
      },
      time: {
        enabled: false,
        time: {
          comparison: "before",
          value: new Date()
        }
      },
      emailIn: {
        enabled: true,
        emailIn: ["inbox"]
      }
    }
  },
  {
    id: "task-003",
    scheduleName: "Schedule 3",
    createdAt: new Date("2025-03-01T09:15:00Z"),
    updatedAt: new Date("2025-03-05T11:20:00Z"),
    lastExecutedAt: new Date(new Date("2025-03-01T09:15:00Z").getTime() - (Math.floor(Math.random() * 7) + 1) * 24 * 60 * 60 * 1000),
    status: "paused",
    emailsDeleted: 50,
    successCounts: 2,
    errorCounts: 3,
    userId: "user-123",
    formValues: {
      name: "Archive social media notifications",
      description: "Move social media emails to archive",
      occurrence: {
        Occurrence: "Recurring",
        TimeZone: "Europe/London",
        Schedule: {
          rate: {
            value: 1,
            unit: "days"
          },
          startDateAndTime: { date: new Date("2025-03-01"), time: "00:00" },
          endDateAndTime: { date: new Date("2025-12-31"), time: "00:00" }
        }
      },
      from: {
        enabled: false,
        from: []
      },
      to: {
        enabled: false,
        to: []
      },
      title: {
        enabled: false,
        title: []
      },
      emailIs: {
        enabled: false,
        emailIs: []
      },
      doesntHave: {
        enabled: false,
        doesntHave: []
      },
      has: {
        enabled: false,
        has: []
      },
      labels: {
        enabled: false,
        labels: []
      },
      category: {
        enabled: true,
        category: ["social"]
      },
      size: {
        enabled: false,
        size: {
          comparison: "greater than",
          value: 1,
          unit: "MB"
        }
      },
      age: {
        enabled: true,
        age: {
          comparison: "older than",
          value: 2,
          unit: "days"
        }
      },
      time: {
        enabled: false,
        time: {
          comparison: "before",
          value: new Date()
        }
      },
      emailIn: {
        enabled: true,
        emailIn: ["inbox"]
      }
    }
  },
  {
    id: "task-004",
    scheduleName: "Schedule 4",
    createdAt: new Date("2025-01-20T16:45:00Z"),
    updatedAt: new Date("2025-01-20T16:45:00Z"),
    lastExecutedAt: new Date(new Date("2025-01-20T16:45:00Z").getTime() - (Math.floor(Math.random() * 7) + 1) * 24 * 60 * 60 * 1000),
    status: "active",
    emailsDeleted: 0,
    successCounts: 0,
    errorCounts: 0,
    userId: "user-456",
    formValues: {
      name: "Clean up old drafts",
      description: "Remove draft emails older than 3 months",
      occurrence: {
        Occurrence: "One-time",
        TimeZone: "Asia/Tokyo",
        Schedule: {
          date: new Date("2025-04-20"),
          time: "16:45"
        }
      },
      from: {
        enabled: false,
        from: []
      },
      to: {
        enabled: false,
        to: []
      },
      title: {
        enabled: false,
        title: []
      },
      emailIs: {
        enabled: false,
        emailIs: []
      },
      doesntHave: {
        enabled: false,
        doesntHave: []
      },
      has: {
        enabled: false,
        has: []
      },
      labels: {
        enabled: false,
        labels: []
      },
      category: {
        enabled: false,
        category: []
      },
      size: {
        enabled: false,
        size: {
          comparison: "greater than",
          value: 1,
          unit: "MB"
        }
      },
      age: {
        enabled: true,
        age: {
          comparison: "older than",
          value: 3,
          unit: "months"
        }
      },
      time: {
        enabled: false,
        time: {
          comparison: "before",
          value: new Date()
        }
      },
      emailIn: {
        enabled: true,
        emailIn: ["draft"]
      }
    }
  },
  {
    id: "task-005",
    scheduleName: "Schedule 5",
    createdAt: new Date("2025-03-25T08:30:00Z"),
    updatedAt: new Date("2025-03-25T08:30:00Z"),
    lastExecutedAt: new Date(new Date("2025-03-25T08:30:00Z").getTime() - (Math.floor(Math.random() * 7) + 1) * 24 * 60 * 60 * 1000),
    status: "completed",
    emailsDeleted: 1230,
    successCounts: 10,
    errorCounts: 2,
    userId: "user-456",
    formValues: {
      name: "Delete promotional emails",
      description: "Remove all promotional emails from the last week",
      occurrence: {
        Occurrence: "One-time",
        TimeZone: "America/Chicago",
        Schedule: {
          date: new Date("2025-04-10"),
          time: "08:30"
        }
      },
      from: {
        enabled: false,
        from: []
      },
      to: {
        enabled: false,
        to: []
      },
      title: {
        enabled: false,
        title: []
      },
      emailIs: {
        enabled: false,
        emailIs: []
      },
      doesntHave: {
        enabled: false,
        doesntHave: []
      },
      has: {
        enabled: false,
        has: []
      },
      labels: {
        enabled: false,
        labels: []
      },
      category: {
        enabled: true,
        category: ["promotions"]
      },
      size: {
        enabled: false,
        size: {
          comparison: "greater than",
          value: 1,
          unit: "MB"
        }
      },
      age: {
        enabled: true,
        age: {
          comparison: "older than",
          value: 7,
          unit: "days"
        }
      },
      time: {
        enabled: false,
        time: {
          comparison: "before",
          value: new Date()
        }
      },
      emailIn: {
        enabled: true,
        emailIn: ["inbox"]
      }
    }
  },
  {
    id: "task-006",
    scheduleName: "Schedule 6",
    createdAt: new Date("2025-02-28T17:00:00Z"),
    updatedAt: new Date("2025-03-01T09:15:00Z"),
    lastExecutedAt: new Date(new Date("2025-02-28T17:00:00Z").getTime() - (Math.floor(Math.random() * 7) + 1) * 24 * 60 * 60 * 1000),
    status: "active",
    emailsDeleted: 75,
    successCounts: 3,
    errorCounts: 0,
    userId: "user-789",
    formValues: {
      name: "Archive purchase receipts",
      description: "Move purchase receipts to a special folder",
      occurrence: {
        Occurrence: "Recurring",
        TimeZone: "(UTC-08:00) America/Los_Angeles",
        Schedule: {
          rate: {
            value: 1,
            unit: "days"
          },
          startDateAndTime: { date: new Date("2025-02-28"), time: "00:00" },
          endDateAndTime: { date: new Date("2026-02-28"), time: "00:00" }
        }
      },
      from: {
        enabled: false,
        from: []
      },
      to: {
        enabled: false,
        to: []
      },
      title: {
        enabled: false,
        title: []
      },
      emailIs: {
        enabled: false,
        emailIs: []
      },
      doesntHave: {
        enabled: false,
        doesntHave: []
      },
      has: {
        enabled: false,
        has: []
      },
      labels: {
        enabled: false,
        labels: []
      },
      category: {
        enabled: true,
        category: ["purchases"]
      },
      size: {
        enabled: false,
        size: {
          comparison: "greater than",
          value: 1,
          unit: "MB"
        }
      },
      age: {
        enabled: false,
        age: {
          comparison: "older than",
          value: 30,
          unit: "days"
        }
      },
      time: {
        enabled: false,
        time: {
          comparison: "before",
          value: new Date()
        }
      },
      emailIn: {
        enabled: true,
        emailIn: ["inbox"]
      }
    }
  },
  {
    id: "task-007",
    scheduleName: "Schedule 7",
    createdAt: new Date("2025-03-15T11:20:00Z"),
    updatedAt: new Date("2025-03-15T11:20:00Z"),
    lastExecutedAt: new Date(new Date("2025-03-15T11:20:00Z").getTime() - (Math.floor(Math.random() * 7) + 1) * 24 * 60 * 60 * 1000),
    status: "paused",
    emailsDeleted: 5,
    successCounts: 1,
    errorCounts: 1,
    userId: "user-789",
    formValues: {
      name: "Delete emails from specific sender",
      description: "Remove all emails from a specific sender",
      occurrence: {
        Occurrence: "One-time",
        TimeZone: "Europe/Berlin",
        Schedule: {
          date: new Date("2025-04-05"),
          time: "11:20"
        }
      },
      from: {
        enabled: true,
        from: ["noreply@unwanted-sender.com"]
      },
      to: {
        enabled: false,
        to: []
      },
      title: {
        enabled: false,
        title: []
      },
      emailIs: {
        enabled: false,
        emailIs: []
      },
      doesntHave: {
        enabled: false,
        doesntHave: []
      },
      has: {
        enabled: false,
        has: []
      },
      labels: {
        enabled: false,
        labels: []
      },
      category: {
        enabled: false,
        category: []
      },
      size: {
        enabled: false,
        size: {
          comparison: "greater than",
          value: 1,
          unit: "MB"
        }
      },
      age: {
        enabled: false,
        age: {
          comparison: "older than",
          value: 30,
          unit: "days"
        }
      },
      time: {
        enabled: false,
        time: {
          comparison: "before",
          value: new Date()
        }
      },
      emailIn: {
        enabled: true,
        emailIn: ["inbox"]
      }
    }
  },
  {
    id: "task-008",
    scheduleName: "Schedule 8",
    createdAt: new Date("2025-01-05T13:40:00Z"),
    updatedAt: new Date("2025-01-10T15:25:00Z"),
    lastExecutedAt: new Date(new Date("2025-01-05T13:40:00Z").getTime() - (Math.floor(Math.random() * 7) + 1) * 24 * 60 * 60 * 1000),
    status: "active",
    emailsDeleted: 420,
    successCounts: 12,
    errorCounts: 5,
    userId: "user-123",
    formValues: {
      name: "Move starred emails to important",
      description: "Add important label to starred emails",
      occurrence: {
        Occurrence: "Recurring",
        TimeZone: "Australia/Sydney",
        Schedule: {
          rate: {
            value: 12,
            unit: "hours"
          },
          startDateAndTime: { date: new Date("2025-01-05"), time: "00:00" },
          endDateAndTime: { date: new Date("2025-12-31"), time: "00:00" }
        }
      },
      from: {
        enabled: false,
        from: []
      },
      to: {
        enabled: false,
        to: []
      },
      title: {
        enabled: false,
        title: []
      },
      emailIs: {
        enabled: true,
        emailIs: ["starred"]
      },
      doesntHave: {
        enabled: false,
        doesntHave: []
      },
      has: {
        enabled: false,
        has: []
      },
      labels: {
        enabled: false,
        labels: []
      },
      category: {
        enabled: false,
        category: []
      },
      size: {
        enabled: false,
        size: {
          comparison: "greater than",
          value: 1,
          unit: "MB"
        }
      },
      age: {
        enabled: false,
        age: {
          comparison: "older than",
          value: 30,
          unit: "days"
        }
      },
      time: {
        enabled: false,
        time: {
          comparison: "before",
          value: new Date()
        }
      },
      emailIn: {
        enabled: true,
        emailIn: ["inbox"]
      }
    }
  },
  {
    id: "task-009",
    scheduleName: "Schedule 9",
    createdAt: new Date("2025-02-20T10:10:00Z"),
    updatedAt: new Date("2025-02-22T14:30:00Z"),
    lastExecutedAt: new Date(new Date("2025-02-20T10:10:00Z").getTime() - (Math.floor(Math.random() * 7) + 1) * 24 * 60 * 60 * 1000),
    status: "completed",
    emailsDeleted: 300,
    successCounts: 30,
    errorCounts: 0,
    userId: "user-456",
    formValues: {
      name: "Clean up sent items",
      description: "Archive old sent emails",
      occurrence: {
        Occurrence: "One-time",
        TimeZone: "UTC",
        Schedule: {
          date: new Date("2025-05-20"),
          time: "10:10"
        }
      },
      from: {
        enabled: false,
        from: []
      },
      to: {
        enabled: false,
        to: []
      },
      title: {
        enabled: false,
        title: []
      },
      emailIs: {
        enabled: false,
        emailIs: []
      },
      doesntHave: {
        enabled: false,
        doesntHave: []
      },
      has: {
        enabled: false,
        has: []
      },
      labels: {
        enabled: false,
        labels: []
      },
      category: {
        enabled: false,
        category: []
      },
      size: {
        enabled: false,
        size: {
          comparison: "greater than",
          value: 1,
          unit: "MB"
        }
      },
      age: {
        enabled: true,
        age: {
          comparison: "older than",
          value: 1,
          unit: "years"
        }
      },
      time: {
        enabled: false,
        time: {
          comparison: "before",
          value: new Date()
        }
      },
      emailIn: {
        enabled: true,
        emailIn: ["sent"]
      }
    }
  },
  {
    id: "task-010",
    scheduleName: "Schedule 10",
    createdAt: new Date("2025-03-30T09:00:00Z"),
    updatedAt: new Date("2025-03-30T09:00:00Z"),
    lastExecutedAt: new Date(new Date("2025-03-30T09:00:00Z").getTime() - (Math.floor(Math.random() * 7) + 1) * 24 * 60 * 60 * 1000),
    status: "active",
    emailsDeleted: 99,
    successCounts: 9,
    errorCounts: 0,
    userId: "user-789",
    formValues: {
      name: "Archive forum discussions",
      description: "Move forum emails to archive folder",
      occurrence: {
        Occurrence: "Recurring",
        TimeZone: "America/New_York",
        Schedule: {
          rate: {
            value: 3,
            unit: "days"
          },
          startDateAndTime: { date: new Date("2025-03-30"), time: "00:00" },
          endDateAndTime: { date: new Date("2025-04-30"), time: "00:00" }
        }
      },
      from: {
        enabled: false,
        from: []
      },
      to: {
        enabled: false,
        to: []
      },
      title: {
        enabled: false,
        title: []
      },
      emailIs: {
        enabled: false,
        emailIs: []
      },
      doesntHave: {
        enabled: false,
        doesntHave: []
      },
      has: {
        enabled: false,
        has: []
      },
      labels: {
        enabled: false,
        labels: []
      },
      category: {
        enabled: true,
        category: ["forums"]
      },
      size: {
        enabled: false,
        size: {
          comparison: "greater than",
          value: 1,
          unit: "MB"
        }
      },
      age: {
        enabled: true,
        age: {
          comparison: "older than",
          value: 7,
          unit: "days"
        }
      },
      time: {
        enabled: false,
        time: {
          comparison: "before",
          value: new Date()
        }
      },
      emailIn: {
        enabled: true,
        emailIn: ["inbox"]
      }
    }
  },
  {
    id: "task-011",
    scheduleName: "Schedule 11",
    createdAt: new Date("2025-02-05T15:45:00Z"),
    updatedAt: new Date("2025-02-10T09:15:00Z"),
    lastExecutedAt: new Date(new Date("2025-02-05T15:45:00Z").getTime() - (Math.floor(Math.random() * 7) + 1) * 24 * 60 * 60 * 1000),
    status: "paused",
    emailsDeleted: 10,
    successCounts: 0,
    errorCounts: 2,
    userId: "user-123",
    formValues: {
      name: "Clean up calendar invites",
      description: "Archive old calendar invitations",
      occurrence: {
        Occurrence: "Recurring",
        TimeZone: "Europe/Paris",
        Schedule: {
          rate: {
            value: 2,
            unit: "hours"
          },
          startDateAndTime: { date: new Date("2025-02-05"), time: "00:00" },
          endDateAndTime: { date: new Date("2025-12-31"), time: "00:00" }
        }
      },
      from: {
        enabled: false,
        from: []
      },
      to: {
        enabled: true,
        to: ["me@example.com"]
      },
      title: {
        enabled: true,
        title: ["invite", "meeting", "calendar"]
      },
      emailIs: {
        enabled: true,
        emailIs: ["read"]
      },
      doesntHave: {
        enabled: false,
        doesntHave: []
      },
      has: {
        enabled: false,
        has: []
      },
      labels: {
        enabled: false,
        labels: []
      },
      category: {
        enabled: true,
        category: ["updates"]
      },
      size: {
        enabled: false,
        size: {
          comparison: "greater than",
          value: 1,
          unit: "MB"
        }
      },
      age: {
        enabled: true,
        age: {
          comparison: "older than",
          value: 2,
          unit: "months"
        }
      },
      time: {
        enabled: false,
        time: {
          comparison: "before",
          value: new Date()
        }
      },
      emailIn: {
        enabled: true,
        emailIn: ["inbox"]
      }
    }
  },
  {
    id: "task-012",
    scheduleName: "Schedule 12",
    createdAt: new Date("2025-03-12T11:30:00Z"),
    updatedAt: new Date("2025-03-12T11:30:00Z"),
    lastExecutedAt: new Date(new Date("2025-03-12T11:30:00Z").getTime() - (Math.floor(Math.random() * 7) + 1) * 24 * 60 * 60 * 1000),
    status: "active",
    emailsDeleted: 600,
    successCounts: 60,
    errorCounts: 3,
    userId: "user-456",
    formValues: {
      name: "Archive travel confirmations",
      description: "Move travel-related emails to a dedicated folder",
      occurrence: {
        Occurrence: "One-time",
        TimeZone: "(UTC-08:00) America/Los_Angeles",
        Schedule: {
          date: new Date("2025-06-12"),
          time: "11:30"
        }
      },
      from: {
        enabled: false,
        from: []
      },
      to: {
        enabled: false,
        to: []
      },
      title: {
        enabled: true,
        title: ["reservation", "booking", "ticket", "itinerary", "confirmation"]
      },
      emailIs: {
        enabled: false,
        emailIs: []
      },
      doesntHave: {
        enabled: false,
        doesntHave: []
      },
      has: {
        enabled: false,
        has: []
      },
      labels: {
        enabled: false,
        labels: []
      },
      category: {
        enabled: true,
        category: ["reservations"]
      },
      size: {
        enabled: false,
        size: {
          comparison: "greater than",
          value: 1,
          unit: "MB"
        }
      },
      age: {
        enabled: true,
        age: {
          comparison: "older than",
          value: 30,
          unit: "days"
        }
      },
      time: {
        enabled: false,
        time: {
          comparison: "before",
          value: new Date()
        }
      },
      emailIn: {
        enabled: true,
        emailIn: ["inbox"]
      }
    }
  },
  {
    id: "task-013",
    scheduleName: "Schedule 13",
    createdAt: new Date("2025-03-20T14:15:00Z"),
    updatedAt: new Date("2025-03-22T09:30:00Z"),
    lastExecutedAt: new Date(new Date("2025-03-20T14:15:00Z").getTime() - (Math.floor(Math.random() * 7) + 1) * 24 * 60 * 60 * 1000),
    status: "completed",
    emailsDeleted: 1500,
    successCounts: 150,
    errorCounts: 0,
    userId: "user-789",
    formValues: {
      name: "Clean up Google Drive notifications",
      description: "Remove Google Drive notifications after archiving them",
      occurrence: {
        Occurrence: "One-time",
        TimeZone: "UTC",
        Schedule: {
          date: new Date("2025-04-10"),
          time: "14:15"
        }
      },
      from: {
        enabled: true,
        from: ["drive-shares-noreply@google.com"]
      },
      to: {
        enabled: false,
        to: []
      },
      title: {
        enabled: false,
        title: []
      },
      emailIs: {
        enabled: false,
        emailIs: []
      },
      doesntHave: {
        enabled: false,
        doesntHave: []
      },
      has: {
        enabled: true,
        has: ["drive"]
      },
      labels: {
        enabled: false,
        labels: []
      },
      category: {
        enabled: false,
        category: []
      },
      size: {
        enabled: false,
        size: {
          comparison: "greater than",
          value: 1,
          unit: "MB"
        }
      },
      age: {
        enabled: true,
        age: {
          comparison: "older than",
          value: 7,
          unit: "days"
        }
      },
      time: {
        enabled: false,
        time: {
          comparison: "before",
          value: new Date()
        }
      },
      emailIn: {
        enabled: true,
        emailIn: ["inbox"]
      }
    }
  },
  {
    id: "task-014",
    scheduleName: "Schedule 14",
    createdAt: new Date("2025-01-15T17:00:00Z"),
    updatedAt: new Date("2025-01-20T10:45:00Z"),
    lastExecutedAt: new Date(new Date("2025-01-15T17:00:00Z").getTime() - (Math.floor(Math.random() * 7) + 1) * 24 * 60 * 60 * 1000),
    status: "active",
    emailsDeleted: 80,
    successCounts: 4,
    errorCounts: 1,
    userId: "user-123",
    formValues: {
      name: "Organize important emails",
      description: "Apply 'Important' label to specific emails",
      occurrence: {
        Occurrence: "Recurring",
        TimeZone: "America/New_York",
        Schedule: {
          rate: {
            value: 12,
            unit: "hours"
          },
          startDateAndTime: { date: new Date("2025-01-15"), time: "00:00" },
          endDateAndTime: { date: new Date("2026-01-15"), time: "00:00" }
        }
      },
      from: {
        enabled: true,
        from: ["boss@company.com", "clients@company.com"]
      },
      to: {
        enabled: false,
        to: []
      },
      title: {
        enabled: true,
        title: ["urgent", "important", "priority", "deadline"]
      },
      emailIs: {
        enabled: true,
        emailIs: ["unread"]
      },
      doesntHave: {
        enabled: false,
        doesntHave: []
      },
      has: {
        enabled: false,
        has: []
      },
      labels: {
        enabled: false,
        labels: []
      },
      category: {
        enabled: true,
        category: ["primary"]
      },
      size: {
        enabled: false,
        size: {
          comparison: "greater than",
          value: 1,
          unit: "MB"
        }
      },
      age: {
        enabled: false,
        age: {
          comparison: "older than",
          value: 30,
          unit: "days"
        }
      },
      time: {
        enabled: false,
        time: {
          comparison: "before",
          value: new Date()
        }
      },
      emailIn: {
        enabled: true,
        emailIn: ["inbox"]
      }
    }
  },
  {
    id: "task-015",
    scheduleName: "Schedule 15",
    createdAt: new Date("2025-03-08T12:00:00Z"),
    updatedAt: new Date("2025-03-08T12:00:00Z"),
    lastExecutedAt: new Date(new Date("2025-03-08T12:00:00Z").getTime() - (Math.floor(Math.random() * 7) + 1) * 24 * 60 * 60 * 1000),
    status: "paused",
    emailsDeleted: 22,
    successCounts: 2,
    errorCounts: 0,
    userId: "user-456",
    formValues: {
      name: "Clean up newsletter subscriptions",
      description: "Delete old newsletter emails to free up space",
      occurrence: {
        Occurrence: "Recurring",
        TimeZone: "Asia/Singapore",
        Schedule: {
          rate: {
            value: 7,
            unit: "days"
          },
          startDateAndTime: { date: new Date("2025-03-08"), time: "00:00" },
          endDateAndTime: { date: new Date("2025-04-08"), time: "00:00" }
        }
      },
      from: {
        enabled: false,
        from: []
      },
      to: {
        enabled: false,
        to: []
      },
      title: {
        enabled: true,
        title: ["newsletter", "subscribe", "weekly digest"]
      },
      emailIs: {
        enabled: false,
        emailIs: []
      },
      doesntHave: {
        enabled: true,
        doesntHave: ["important"]
      },
      has: {
        enabled: false,
        has: []
      },
      labels: {
        enabled: false,
        labels: []
      },
      category: {
        enabled: true,
        category: ["promotions", "updates"]
      },
      size: {
        enabled: false,
        size: {
          comparison: "greater than",
          value: 1,
          unit: "MB"
        }
      },
      age: {
        enabled: true,
        age: {
          comparison: "older than",
          value: 14,
          unit: "days"
        }
      },
      time: {
        enabled: false,
        time: {
          comparison: "before",
          value: new Date()
        }
      },
      emailIn: {
        enabled: true,
        emailIn: ["inbox"]
      }
    }
  },
  {
    id: "task-016",
    scheduleName: "Schedule 16",
    createdAt: new Date("2025-02-25T08:20:00Z"),
    updatedAt: new Date("2025-02-25T08:20:00Z"),
    lastExecutedAt: new Date(new Date("2025-02-25T08:20:00Z").getTime() - (Math.floor(Math.random() * 7) + 1) * 24 * 60 * 60 * 1000),
    status: "active",
    emailsDeleted: 1000,
    successCounts: 100,
    errorCounts: 10,
    userId: "user-789",
    formValues: {
      name: "Archive completed project emails",
      description: "Archive emails related to completed projects",
      occurrence: {
        Occurrence: "Recurring",
        TimeZone: "Europe/London",
        Schedule: {
          rate: {
            value: 30,
            unit: "days"
          },
          startDateAndTime: { date: new Date("2025-02-25"), time: "00:00" },
          endDateAndTime: { date: new Date("2025-12-31"), time: "00:00" }
        }
      },
      from: {
        enabled: false,
        from: []
      },
      to: {
        enabled: false,
        to: []
      },
      title: {
        enabled: true,
        title: ["project-X", "project-Y", "QXZ-123"]
      },
      emailIs: {
        enabled: false,
        emailIs: []
      },
      doesntHave: {
        enabled: false,
        doesntHave: []
      },
      has: {
        enabled: true,
        has: ["document", "spreadsheet", "presentation"]
      },
      labels: {
        enabled: true,
        labels: ["completed-projects"]
      },
      category: {
        enabled: false,
        category: []
      },
      size: {
        enabled: false,
        size: {
          comparison: "greater than",
          value: 1,
          unit: "MB"
        }
      },
      age: {
        enabled: true,
        age: {
          comparison: "older than",
          value: 3,
          unit: "months"
        }
      },
      time: {
        enabled: false,
        time: {
          comparison: "before",
          value: new Date()
        }
      },
      emailIn: {
        enabled: true,
        emailIn: ["inbox", "sent"]
      }
    }
  },
  {
    id: "task-017",
    scheduleName: "Schedule 17",
    createdAt: new Date("2025-03-28T16:35:00Z"),
    updatedAt: new Date("2025-03-28T16:35:00Z"),
    lastExecutedAt: new Date(new Date("2025-03-28T16:35:00Z").getTime() - (Math.floor(Math.random() * 7) + 1) * 24 * 60 * 60 * 1000),
    status: "completed",
    emailsDeleted: 550,
    successCounts: 55,
    errorCounts: 0,
    userId: "user-123",
    formValues: {
      name: "Clean up email notifications",
      description: "Remove email notifications from apps and services",
      occurrence: {
        Occurrence: "One-time",
        TimeZone: "America/Chicago",
        Schedule: {
          date: new Date("2025-05-28"),
          time: "16:35"
        }
      },
      from: {
        enabled: true,
        from: ["notifications@", "noreply@", "no-reply@"]
      },
      to: {
        enabled: false,
        to: []
      },
      title: {
        enabled: false,
        title: []
      },
      emailIs: {
        enabled: true,
        emailIs: ["read"]
      },
      doesntHave: {
        enabled: false,
        doesntHave: []
      },
      has: {
        enabled: false,
        has: []
      },
      labels: {
        enabled: false,
        labels: []
      },
      category: {
        enabled: true,
        category: ["updates"]
      },
      size: {
        enabled: false,
        size: {
          comparison: "greater than",
          value: 1,
          unit: "MB"
        }
      },
      age: {
        enabled: true,
        age: {
          comparison: "older than",
          value: 14,
          unit: "days"
        }
      },
      time: {
        enabled: false,
        time: {
          comparison: "before",
          value: new Date()
        }
      },
      emailIn: {
        enabled: true,
        emailIn: ["inbox"]
      }
    }
  },
  {
    id: "task-018",
    scheduleName: "Schedule 18",
    createdAt: new Date("2025-03-01T10:00:00Z"),
    updatedAt: new Date("2025-03-05T14:20:00Z"),
    lastExecutedAt: new Date(new Date("2025-03-01T10:00:00Z").getTime() - (Math.floor(Math.random() * 7) + 1) * 24 * 60 * 60 * 1000),
    status: "active",
    emailsDeleted: 30,
    successCounts: 3,
    errorCounts: 0,
    userId: "user-456",
    formValues: {
      name: "Delete old chat notifications",
      description: "Clean up chat email notifications",
      occurrence: {
        Occurrence: "One-time",
        TimeZone: "Asia/Tokyo",
        Schedule: {
          date: new Date("2025-04-01"),
          time: "10:00"
        }
      },
      from: {
        enabled: true,
        from: ["chat@teams.com", "chat@slack.com", "notifications@discord.com"]
      },
      to: {
        enabled: false,
        to: []
      },
      title: {
        enabled: false,
        title: []
      },
      emailIs: {
        enabled: false,
        emailIs: []
      },
      doesntHave: {
        enabled: false,
        doesntHave: []
      },
      has: {
        enabled: false,
        has: []
      },
      labels: {
        enabled: false,
        labels: []
      },
      category: {
        enabled: true,
        category: ["social", "updates"]
      },
      size: {
        enabled: false,
        size: {
          comparison: "greater than",
          value: 1,
          unit: "MB"
        }
      },
      age: {
        enabled: true,
        age: {
          comparison: "older than",
          value: 3,
          unit: "days"
        }
      },
      time: {
        enabled: false,
        time: {
          comparison: "before",
          value: new Date()
        }
      },
      emailIn: {
        enabled: true,
        emailIn: ["inbox"]
      }
    }
  }
];

