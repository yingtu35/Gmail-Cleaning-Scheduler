import { Task } from "@/app/lib/definitions";

const MOCK_TASKS: Task[] = [
  {
    id: "2",
    expiresAt: new Date(),
    userId: "1",
    formValues: {
      name: "Task 2",
      description: "Description 2",
      occurrence: {
        Occurrence: "Recurring",
        TimeZone: "UTC",
        Schedule: {
          date: "2022-01-01",
          time: "00:00",
        },
      },
      from: {
        enabled: false,
        from: "",
      },
      to: {
        enabled: false,
        to: "",
      },
      title: {
        enabled: false,
        title: "",
      },
      emailIs: {
        enabled: false,
        emailIs: ["unread"],
      },
      doesntHave: {
        enabled: false,
        doesntHave: "",
      },
    }
  },
  {
    id: "3",
    expiresAt: new Date(),
    userId: "1",
    formValues: {
      name: "Task 3",
      description: "Description 3",
      occurrence: {
        Occurrence: "Recurring",
        TimeZone: "UTC",
        Schedule: {
          date: "2022-01-01",
          time: "00:00",
        },
      },
      from: {
        enabled: false,
        from: "",
      },
      to: {
        enabled: false,
        to: "",
      },
      title: {
        enabled: false,
        title: "",
      },
      emailIs: {
        enabled: false,
        emailIs: ["unread"],
      },
      doesntHave: {
        enabled: false,
        doesntHave: "",
      },
    }
  },
];

const MANY_TASKS: Task[] = [
  ...MOCK_TASKS,
  ...MOCK_TASKS,
  ...MOCK_TASKS,
  ...MOCK_TASKS,
  ...MOCK_TASKS,
  ...MOCK_TASKS,
  ...MOCK_TASKS,
  ...MOCK_TASKS,
  ...MOCK_TASKS,
  ...MOCK_TASKS,
  ...MOCK_TASKS,
  ...MOCK_TASKS,
];

const TOO_MANY_TASKS: Task[] = [
  ...MANY_TASKS,
  ...MANY_TASKS,
];

export { MOCK_TASKS, MANY_TASKS, TOO_MANY_TASKS };