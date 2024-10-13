'use server'

import { auth, signIn, signOut } from "@/auth";
import { revalidatePath } from "next/cache";
import { redirect } from 'next/navigation';

import { db } from "@/app/drizzle/db";
import { UserTable, UserTasksTable } from "@/app/drizzle/schema";
import { eq, and, count } from "drizzle-orm";

import { createSchedule, updateSchedule, deleteSchedule } from "@/app/aws/scheduler";
import { subscribe } from "@/app/aws/sns";

import { UserInDB, Task, FormValues, AIPromptValues } from "@/app/lib/definitions";
import { convertToUTCDate, createCommandInput } from "@/app/utils/schedule";
import { isValidUser, isValidUUID, hasReachedTaskLimit } from "@/app/utils/database";

import { getEmailSearchesExplanation, getScheduleByPrompt } from "@/app/openai/chat";
import log from "../utils/log";

export async function authenticate() {
  await signIn('google');
}

export async function logOut() {
  await signOut();
}

export const getAuthenticatedUser = async () => {
  const session = await auth();
  if (!session) {
    return { isAuthenticated: false, user: null };
  }
  const user = session.user
  return { isAuthenticated: true, user };
}

async function getUser() {
  const email = await getUserEmail();
  if (!email) {
    return null;
  }
  const user = await getUserByEmail(email);
  if (!user) {
    return null;
  }
  return user;
}

async function getUserEmail() {
  const session = await auth();
  if (!session || !session.user.email) {
    return null;
  }
  return session.user.email;
}

export async function getUserIdByEmail(email: string) {
  const user = await db.query.UserTable.findFirst({
    where: eq(UserTable.email, email),
    columns: { id: true}
  }) as UserInDB;
  return user;
}

// get user by email from the database
export async function getUserByEmail(email: string) {
  const user = await db.query.UserTable.findFirst({
    where: eq(UserTable.email, email)
  });
  if (!user) {
    return null;
  }
  return user as UserInDB;
}

export async function updateUserOnSignIn(user: UserInDB) {
  await db.update(UserTable).set({
    name: user.name,
    image: user.image,
    accessToken: user.accessToken,
    expiresAt: user.expiresAt,
    refreshToken: user.refreshToken,
  })
  .where(eq(UserTable.email, user.email))
  return;
}

// create a new user in the database
export async function createUserOnSignIn(user: UserInDB) {
  await db.insert(UserTable).values(user)
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
  return;
}


export async function getTaskById(taskId: string): Promise<Task | null> {
  const user = await getUser();
  if (!isValidUser(user)) {
    return null;
  }
  // check if taskId follows the correct format
  if (!isValidUUID(taskId)) {
    return null;
  }
  const task = await db.query.UserTasksTable.findFirst({
    where: and(eq(UserTasksTable.id, taskId), eq(UserTasksTable.userId, user.id as string)),
  }) as Task;
  return task;
}

export async function getTasks(): Promise<Task[]> {
  const user = await getUser();
  if (!isValidUser(user)) {
    return [];
  }
  // get the tasks for the user
  const tasks = await db.query.UserTasksTable.findMany({
    where: eq(UserTasksTable.userId, user.id as string),
    orderBy: (task, { desc }) => desc(task.updatedAt),
  }) as Task[];
  return tasks;
}

export async function getTasksCount(user: UserInDB): Promise<number> {
  const numOfTasks = await db
    .select({
      value: count(UserTasksTable.id),
    })
    .from(UserTasksTable)
    .where(eq(UserTasksTable.userId, user.id as string))
  return numOfTasks[0].value;
}

// create a new task for the user in the database
export async function createTask(data: FormValues) {
  // TODO: parse the data using zod
  const user = await getUser();
  if (!isValidUser(user)) {
    return;
  }

  // check if user has reached the limit of tasks
  const numOfTasks = await getTasksCount(user);
  if (hasReachedTaskLimit(numOfTasks)) {
    return;
  }
  // create a schedule for the task
  const commandInput = createCommandInput(data, user);
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
    userId: user.id as string,
  }
  const result = await db.insert(UserTasksTable).values(newTask).returning({
    id: UserTasksTable.id,
  })
  if (!result) {
    log.error("error creating task");
    return;
  }
  const returnedTask = result[0] as Task;
  log.debug("created task", returnedTask);
  revalidatePath("/");
  redirect(`/tasks/${returnedTask.id}`);
}

export async function updateTask(data: FormValues, taskId: string) {
  // TODO: parse the data using zod
  // update the data in the database
  const user = await getUser();
  if (!isValidUser(user)) {
    return;
  }
  const commandInput = createCommandInput(data, user);
  const response = await updateSchedule(commandInput);
  if (response.$metadata.httpStatusCode !== 200) {
    log.error("error updating schedule", response);
    return;
  }
  // update the task in the database
  try {
    await db.update(UserTasksTable)
    .set({
      updatedAt: new Date(),
      expiresAt: 'endDate' in data.occurrence.Schedule ? convertToUTCDate(data.occurrence.Schedule.endDate, data.occurrence.TimeZone) : null,
      repeatCount: 0,
      formValues: data,
    })
    .where(and(eq(UserTasksTable.id, taskId), eq(UserTasksTable.userId, user.id as string)))

    revalidatePath(`/tasks/${taskId}`);
    redirect(`/tasks/${taskId}`);
  } catch (error) {
    log.error("error updating task", error);
    return;
  }
}

export async function deleteTask(taskId: string) {
  const user = await getUser();
  if (!isValidUser(user)) {
    return;
  }
  // check if the task exists
  const task = await getTaskById(taskId);
  if (!task) {
    return;
  }
  // check if the user is the owner of the task
  if (task.userId !== user.id) {
    return;
  }
  // TODO: should ensure task is both deleted from the database and the schedule
  const result = await db.delete(UserTasksTable)
    .where(and(eq(UserTasksTable.id, taskId), eq(UserTasksTable.userId, user.id)))
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
  const taskName = deletedTask.formValues.name; 

  // delete the schedule for the task
  const response = await deleteSchedule(taskName);
  if (response.$metadata.httpStatusCode !== 200) {
    log.error("error deleting schedule", response);
    // insert the task back into the database
    await db.insert(UserTasksTable).values(deletedTask);
    return;
  }
  revalidatePath("/");
  redirect("/");
}

export async function subscribeEmailNotification(email: string) {
  // subscribe the email
  const response = await subscribe(email);
  if (response.$metadata.httpStatusCode !== 200) {
    console.error("error subscribing", response);
    throw new Error("Error subscribing");
  }
  return;
}

export async function getSearchQueryExplanation(prevState: any, query: string) {
  const result = await getEmailSearchesExplanation(query);
  return result;
}

export async function generateScheduleByPrompt(prompt: AIPromptValues): Promise<FormValues | string>{
  const result = await getScheduleByPrompt(prompt);
  if (!result) {
    return "Sorry, There was an error processing your request. Please try again later.";
  }
  const formValues = JSON.parse(result) as FormValues;
  log.debug("generated schedule", formValues);
  return formValues;
}