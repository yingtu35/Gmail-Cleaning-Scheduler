'use server'

import { eq, and, count } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from 'next/navigation';

import { db } from "@/app/drizzle/db";
import { UserTable, UserTasksTable } from "@/app/drizzle/schema";
import { auth, signIn, signOut } from "@/auth";
import { createSchedule, updateSchedule, deleteSchedule } from "@/app/aws/scheduler";
import { subscribe } from "@/app/aws/sns";

import { UserInDB, Task, FormValues, AIPromptType, UserDateTimePromptType, UserGoogle } from "@/app/lib/definitions";
import { convertToUTCDate, generateCreateScheduleCommand, generateUpdateScheduleCommand, parseJsonToFormValues } from "@/app/utils/schedule";
import { isValidUser, isValidUUID, hasReachedTaskLimit } from "@/app/utils/database";

import { getEmailSearchesExplanation, getScheduleByPrompt } from "@/app/openai/chat";

import log from "../utils/log";
import { parseTask } from "../utils/task";

export async function authenticate() {
  await signIn('google', { callbackUrl: '/' });
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

export async function updateUserOnSignIn(user: UserGoogle) {
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
export async function createUserOnSignIn(user: UserGoogle) {
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
  })
  if (!task) {
    return null;
  }
  return parseTask(task);
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
  })
  const formattedTasks = tasks.map(parseTask);
  return formattedTasks;
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
  const user = await getUser();
  if (!isValidUser(user)) {
    log.debug("user is not valid");
    throw new Error("User is not valid");
  }

  // check if user has reached the limit of tasks
  const numOfTasks = await getTasksCount(user);
  if (hasReachedTaskLimit(numOfTasks)) {
    log.debug("user has reached the limit of tasks");
    throw new Error("User has reached the limit of tasks");
  }
  // create a schedule for the task
  const commandInput = generateCreateScheduleCommand(data, user);
  const response = await createSchedule(commandInput);
  if (response.$metadata.httpStatusCode !== 200) {
    console.error("error creating schedule", response);
    throw new Error("Error creating schedule. Please try again later.");
  }
  // create a new task in the database
  const newTask: Task = {
    scheduleName: commandInput.name,
    expiresAt: data.occurrence.Occurrence === 'Recurring' ? convertToUTCDate(data.occurrence.Schedule.endDateAndTime, data.occurrence.TimeZone) : null,
    repeatCount: 0,
    formValues: data,
    userId: user.id as string,
  }
  const result = await db.insert(UserTasksTable).values(newTask).returning({
    id: UserTasksTable.id,
  })
  if (!result) {
    log.error("error creating task");
    throw new Error("Error creating task. Please try again later.");
  }
  const returnedTaskId = result[0].id;
  log.debug("created task", returnedTaskId);
  revalidatePath("/");
  return returnedTaskId;
}

export async function updateTask(data: FormValues, taskId: string) {
  const user = await getUser();
  if (!isValidUser(user)) {
    throw new Error("User is not valid");
  }
  // get the task from the database
  const task = await getTaskById(taskId);
  if (!task) {
    throw new Error("Task not found");
  }
  const commandInput = generateUpdateScheduleCommand(data, user, task.scheduleName);
  const response = await updateSchedule(commandInput);
  if (response.$metadata.httpStatusCode !== 200) {
    log.error("error updating schedule", response);
    throw new Error("Error updating schedule. Please try again later.");
  }
  // update the task in the database
  try {
    await db.update(UserTasksTable)
    .set({
      updatedAt: new Date(),
      expiresAt: data.occurrence.Occurrence === 'Recurring' ? convertToUTCDate(data.occurrence.Schedule.endDateAndTime, data.occurrence.TimeZone) : null,
      repeatCount: 0,
      formValues: data,
    })
    .where(and(eq(UserTasksTable.id, taskId), eq(UserTasksTable.userId, user.id as string)))
  } catch (error) {
    log.error("error updating task", error);
    throw new Error("Error updating task. Please try again later.");
  }
  revalidatePath(`/tasks/${taskId}`);
  return taskId;
}

export async function deleteTask(taskId: string) {
  const user = await getUser();
  if (!isValidUser(user)) {
    throw new Error("User is not valid");
  }
  // check if the task exists
  const task = await getTaskById(taskId);
  if (!task) {
    throw new Error("Task not found");
  }
  // check if the user is the owner of the task
  if (task.userId !== user.id) {
    throw new Error("You are not the owner of the task");
  }
  // TODO: should ensure task is both deleted from the database and the schedule
  const result = await db.delete(UserTasksTable)
    .where(and(eq(UserTasksTable.id, taskId), eq(UserTasksTable.userId, user.id)))
    .returning({
      id: UserTasksTable.id,
      scheduleName: UserTasksTable.scheduleName,
      createdAt: UserTasksTable.createdAt,
      updatedAt: UserTasksTable.updatedAt,
      expiresAt: UserTasksTable.expiresAt,
      repeatCount: UserTasksTable.repeatCount,
      formValues: UserTasksTable.formValues,
      userId: UserTasksTable.userId,
    })
  if (!result) {
    console.error("error deleting task");
    throw new Error("Error deleting task. Please try again later.");
  }
  const deletedTask = result[0] as Task;
  const scheduleName = deletedTask.scheduleName; 

  // delete the schedule for the task
  const response = await deleteSchedule(scheduleName);
  if (response.$metadata.httpStatusCode !== 200) {
    log.error("error deleting schedule", response);
    // insert the task back into the database
    await db.insert(UserTasksTable).values(deletedTask);
    throw new Error("Error deleting schedule. Please try again later.");
  }
  revalidatePath("/");
  return;
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

export async function generateScheduleByPrompt(userDateTimePrompt: UserDateTimePromptType, prompt: AIPromptType): Promise<FormValues | string>{
  const result = await getScheduleByPrompt(userDateTimePrompt, prompt);
  if (!result) {
    return "Sorry, There was an error processing your request. Please try again later.";
  }
  const formValues = parseJsonToFormValues(result);
  return formValues;
}