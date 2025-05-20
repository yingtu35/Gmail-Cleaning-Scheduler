import { NewUser } from "@/types/user";
import { NewTask } from "@/types/task";

export const mockNewUser: NewUser = {
  name: "Test User",
  email: "test@gmail.com",
  image: "https://example.com/image.jpg",
  accessToken: "test-access-token",
  expiresAt: new Date(),
  refreshToken: "test-refresh-token",
}

export const mockNewTask: NewTask = {
  scheduleName: "Test Task",
  status: "active",
  emailsDeleted: 0,
  successCounts: 0,
  errorCounts: 0,
  userId: "test-user-id", // will be replaced by the user id when testing
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
}