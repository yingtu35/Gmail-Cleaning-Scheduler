'use server'

// specify all server actions here
import { auth, signIn, signOut } from "@/auth";
import { db } from "@/app/drizzle/db";
import { UserTable, UserTasksTable } from "@/app/drizzle/schema";
import { eq, and, sql } from "drizzle-orm";
import { UserInDB, Task, FormValues } from "./definitions";
import { revalidatePath } from "next/cache";
import { redirect } from 'next/navigation';
import { convertToUTCDate, createCommandInput } from "@/app/utils/schedule";

import { createSchedule, updateSchedule, deleteSchedule } from "@/app/aws/scheduler";

import { mockTaskData, mockLambdaPayload } from "../data/mock-data";
import { AdapterSession, AdapterUser } from "next-auth/adapters";
import { Session } from "next-auth";

export async function authenticate() {
  await signIn('google');
}

export async function logOut() {
  await signOut();
}

async function getUserId() {
  const session = await auth();
  // console.log("session get", session);
  if (!session) {
    return null;
  }
  if (session.user.id !== undefined) {
    return session.user.id;
  }
  return null;
}

export async function setUserId(session: {
  user: AdapterUser;
} & AdapterSession & Session) {
  // console.log('session', session) 
  if (!session || session.user.id !== undefined) {
    return;
  }
  const user = await getUserByEmail(session.user.email as string);
  if (!user || !user.id) {
    return;
  }
  session.user = Object.assign({}, session.user, { id: user.id });
  // console.log('session after', session)
  return;
}

async function getUserIdByEmail(email: string) {
  const user = await db.query.UserTable.findFirst({
    where: eq(UserTable.email, email),
    columns: { id: true}
  }) as UserInDB;
  return user;
}

// get user by email from the database
export async function getUserByEmail(email: string): Promise<UserInDB>{
  const user = await db.query.UserTable.findFirst({
    where: eq(UserTable.email, email)
  }) as UserInDB;
  return user;
}

async function getUserById(id: string): Promise<UserInDB> {
  const user = await db.query.UserTable.findFirst({
    where: eq(UserTable.id, id)
  }) as UserInDB;
  return user;
}

// create a new user in the database
export async function createUserOnSignIn(user: UserInDB) {
  const returnedUser = await db.insert(UserTable).values({
    name: user.name,
    email: user.email,
    image: user.image,
    accessToken: user.accessToken,
    expiresAt: user.expiresAt,
    refreshToken: user.refreshToken,
  })
  .onConflictDoUpdate({
    target: UserTable.email,
    set: {
      name: user.name,
      image: user.image,
      accessToken: user.accessToken,
      expiresAt: user.expiresAt,
      refreshToken: user.refreshToken,
    }
  })
  .returning({
    id: UserTable.id,
    name: UserTable.name,
    email: UserTable.email,
    image: UserTable.image,
  })
  console.log("returnedUser", returnedUser);
  return returnedUser;
}

export async function getTaskById(taskId: string): Promise<Task | null> {
  const userId = await getUserId();
  if (!userId) {
    return null;
  }
  const task = await db.query.UserTasksTable.findFirst({
    where: and(eq(UserTasksTable.id, taskId), eq(UserTasksTable.userId, userId as string)),
  }) as Task;
  // console.log("task", task);
  return task;
}

export async function getTasks(): Promise<Task[]> {
  const userId = await getUserId();
  if (!userId) {
    return [];
  }
  // get the tasks for the user
  const tasks = await db.query.UserTasksTable.findMany({
    where: eq(UserTasksTable.userId, userId as string),
    orderBy: (task, { desc }) => desc(task.updatedAt),
  }) as Task[];
  // return the tasks
  // console.log("tasks", tasks);
  return tasks;
}

// create a new task for the user in the database
export async function createTask(data: FormValues) {
  // console.log("data", data);
  // parse the data using zod
  // form the task object
  const userId = await getUserId();
  if (!userId) {
    return;
  }
  const user = await getUserById(userId);
  // create a schedule for the task
  // console.log("data", data)
  const commandInput = createCommandInput(data, user);
  // console.log("commandInput", commandInput);
  const response = await createSchedule(commandInput);
  if (response.$metadata.httpStatusCode !== 200) {
    console.error("error creating schedule", response);
    return;
  }
  // create a new task in the database
  const newTask: Task = {
    expiresAt: 'endDate' in data.occurrence.Schedule ? convertToUTCDate(data.occurrence.Schedule.endDate, data.occurrence.TimeZone) : null,
    repeatCount: 0,
    formValues: data,
    userId: userId
  }
  const result = await db.insert(UserTasksTable).values(newTask).returning({
    id: UserTasksTable.id,
    createdAt: UserTasksTable.createdAt,
    updatedAt: UserTasksTable.updatedAt,
    expiresAt: UserTasksTable.expiresAt,
    repeatCount: UserTasksTable.repeatCount,
    formValues: UserTasksTable.formValues,
    userId: UserTasksTable.userId,
  })
  if (!result) {
    console.error("error creating task");
    return;
  }
  const returnedTask = result[0] as Task;
  console.log("returnedTask", returnedTask);
  revalidatePath("/");
  redirect(`/tasks/${returnedTask.id}`);
}

export async function updateTask(data: FormValues, taskId: string) {
  // parse the data using zod
  // update the data in the database
  const userId = await getUserId();
  if (!userId) {
    return;
  }
  const user = await getUserById(userId);
  const commandInput = createCommandInput(data, user);
  const response = await updateSchedule(commandInput);
  // console.log("updated response", response);
  if (response.$metadata.httpStatusCode !== 200) {
    console.error("error creating schedule", response);
    return;
  }
  // update the task in the database
  const result = await db.update(UserTasksTable)
  .set({
    updatedAt: new Date(),
    expiresAt: 'endDate' in data.occurrence.Schedule ? convertToUTCDate(data.occurrence.Schedule.endDate, data.occurrence.TimeZone) : null,
    repeatCount: 0,
    formValues: data,
  })
  .where(and(eq(UserTasksTable.id, taskId), eq(UserTasksTable.userId, userId as string)))
  .returning({
    id: UserTasksTable.id,
    createdAt: UserTasksTable.createdAt,
    updatedAt: UserTasksTable.updatedAt,
    expiresAt: UserTasksTable.expiresAt,
    repeatCount: UserTasksTable.repeatCount,
    formValues: UserTasksTable.formValues,
    userId: UserTasksTable.userId,
  });
  if (!result) {
    console.error("error updating task");
    return;
  }
  const updatedTask = result[0] as Task;
  console.log("updatedTask", updatedTask);
  // reinvalidate the cache
  revalidatePath(`/tasks/${taskId}`);
  // redirect to the task page
  redirect(`/tasks/${taskId}`);
}

export async function deleteTask(taskId: string) {
  const userId = await getUserId();
  if (!userId) {
    return;
  }
  // check if the task exists
  const task = await getTaskById(taskId);
  if (!task) {
    return;
  }
  // check if the user is the owner of the task
  if (task.userId !== userId) {
    return;
  }
  const result = await db.delete(UserTasksTable)
    .where(and(eq(UserTasksTable.id, taskId), eq(UserTasksTable.userId, userId as string)))
    .returning({
      id: UserTasksTable.id,
      createdAt: UserTasksTable.createdAt,
      updatedAt: UserTasksTable.updatedAt,
      expiresAt: UserTasksTable.expiresAt,
      repeatCount: UserTasksTable.repeatCount,
      formValues: UserTasksTable.formValues,
      userId: UserTasksTable.userId,
    })
  if (!result) {
    console.error("error deleting task");
    return;
  }
  const deletedTask = result[0] as Task;
  console.log("deletedTask", deletedTask); 
  const taskName = deletedTask.formValues.name; 

  // delete the schedule for the task
  const response = await deleteSchedule(taskName);
  if (response.$metadata.httpStatusCode !== 200) {
    console.error("error deleting schedule", response);
    // insert the task back into the database
    await db.insert(UserTasksTable).values(deletedTask);
    return;
  }
  console.log("deleted response", response);
  // reinvalidate the cache
  revalidatePath("/");
  redirect("/");
}


