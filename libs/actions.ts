'use server'

import { eq, and, count, desc, sum } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "@/models/db";
import { UserTable, UserTasksTable } from "@/models/schema";
import { auth, signIn, signOut } from "@/auth";
import { createSchedule, updateSchedule, deleteSchedule, pauseSchedule, resumeSchedule } from "@/libs/aws/scheduler";
import { subscribe } from "@/libs/aws/sns";

import { User, NewUser, UserInfo, UserDateTimePromptType, SessionUser, UserInfoFromGoogle } from "@/types/user";
import { Task, FormValues, AIPromptType, NewTask } from "@/types/task";
import { createScheduleName, generateCreateScheduleCommand, generateUpdateScheduleCommand, parseJsonToFormValues } from "@/utils/schedule";
import { isValidUser, isValidUUID, hasReachedTaskLimit } from "@/utils/database";

import { getScheduleByPrompt } from "@/libs/openai/chat";

import log from "../utils/log";
import { parseTask } from "../utils/task";

export async function authenticate() {
  await signIn('google', { callbackUrl: '/' });
}

export async function logOut() {
  await signOut({ redirectTo: '/' });
}

export const getAuthenticatedUser = async () => {
  const session = await auth();
  if (!session) {
    return { isAuthenticated: false, user: null };
  }
  const user = session.user
  return { isAuthenticated: true, user };
}

// New function to get a lean user object from the session
export async function getSessionUser(): Promise<SessionUser | null> {
  const session = await auth();

  if (!session?.user?.id) { // Check for id as the primary indicator of a valid session user
    log.warn("getSessionUser: Session, session.user, or session.user.id is missing.");
    return null;
  }

  const sessionUser: SessionUser = {
    id: session.user.id,
    name: session.user.name ?? null,
    email: session.user.email ?? null,
    image: session.user.image ?? null,
    accessToken: session.access_token ?? null,
    expiresAt: session.expiresAt ?? null,
  };

  return sessionUser;
}

async function getDatabaseUser(): Promise<User | null> {
  const session = await auth();
  if (!session?.user?.id) { // Check for id as the primary indicator of a valid session user
    log.warn("getSessionUser: Session, session.user, or session.user.id is missing.");
    return null;
  }
  const user = await getDatabaseUserById(session.user.id);
  if (!user) {
    return null;
  }
  return user;
}

export async function getUserInfoByEmail(email: string): Promise<UserInfo | null> {
  const user = await db.query.UserTable.findFirst({
    where: eq(UserTable.email, email),
    columns: { 
      id: true,
      name: true,
      email: true,
      image: true
    }
  });
  if (!user) {
    return null;
  }
  return user as UserInfo;
}

// get user by id from the database
export async function getDatabaseUserById(id: string) {
  const user = await db.query.UserTable.findFirst({
    where: eq(UserTable.id, id)
  });
  if (!user) {
    return null;
  }
  return user as User;
}

export async function updateUserOnSignIn(user: UserInfoFromGoogle) {
  await db.update(UserTable).set({
    name: user.name,
    image: user.image,
  })
  .where(eq(UserTable.email, user.email))
  return;
}

// create a new user in the database
export async function createUserOnSignIn(user: NewUser) {
  await db.insert(UserTable).values(user)
  .onConflictDoUpdate({
    target: UserTable.email,
    set: {
      name: user.name,
      image: user.image,
      accessToken: user.accessToken,
      accessTokenUpdatedAt: user.accessTokenUpdatedAt,
      refreshToken: user.refreshToken,
    }
  })
  return;
}


export async function getTaskById(taskId: string): Promise<Task | null> {
  const sessionUser = await getSessionUser();
  if (!sessionUser) {
    return null;
  }
  // check if taskId follows the correct format
  if (!isValidUUID(taskId)) {
    return null;
  }
  const task = await db.query.UserTasksTable.findFirst({
    where: and(eq(UserTasksTable.id, taskId), eq(UserTasksTable.userId, sessionUser.id)),
  }) as Task | null;
  if (!task) {
    return null;
  }
  return parseTask(task);
}

export async function getTasks(): Promise<Task[]> {
  const sessionUser = await getSessionUser();
  if (!sessionUser) {
    return [];
  }
  // get the tasks for the user
  const tasks = await db.query.UserTasksTable.findMany({
    where: eq(UserTasksTable.userId, sessionUser.id),
    orderBy: [desc(UserTasksTable.updatedAt)],
  })
  const formattedTasks = tasks.map(parseTask);
  return formattedTasks;
}

export async function getTasksCount(userId: string): Promise<number> {
  const numOfTasks = await db
    .select({
      value: count(UserTasksTable.id),
    })
    .from(UserTasksTable)
    .where(eq(UserTasksTable.userId, userId))
  return numOfTasks[0].value;
}

// create a new task for the user in the database
export async function createTask(data: FormValues) {
  try {
    const sessionUser = await getSessionUser();
    if (!sessionUser) {
      log.debug("User is not valid for createTask");
      // Directly throw the error message you want on the toast
      throw new Error("Authentication error. Please sign in again.");
    }
    
    // check if user has reached the limit of tasks
    const numOfTasks = await getTasksCount(sessionUser.id);
    if (hasReachedTaskLimit(numOfTasks)) {
      log.debug("User has reached the task limit");
      // Directly throw the error message you want on the toast
      throw new Error("You've reached the maximum number of tasks allowed.");
    }
    const user = await getDatabaseUserById(sessionUser.id);
    if (!isValidUser(user)) {
      log.debug("User is not valid for createTask");
      // Directly throw the error message you want on the toast
      throw new Error("Authentication error. Please sign in again.");
    }

    // create a new task in the database
    const scheduleName = createScheduleName(user.id);
    const newTask: NewTask = {
      scheduleName,
      formValues: data,
      userId: user.id,
    }
    const result = await db.insert(UserTasksTable).values(newTask).returning({
      id: UserTasksTable.id,
    })
    if (!result || result.length === 0) {
      log.error("Error creating task in DB after schedule creation", { taskName: newTask.scheduleName });
      // Directly throw the error message you want on the toast
      throw new Error("Failed to save task details. Please try again later or contact support.");
    }
    const returnedTaskId = result[0].id;
    // create a schedule for the task
    const commandInput = generateCreateScheduleCommand(data, user, returnedTaskId, scheduleName);

    const response = await createSchedule(commandInput);
    if (response.$metadata.httpStatusCode !== 200) {
      // Log the detailed AWS error response
      log.error("Error creating AWS schedule", { 
        statusCode: response.$metadata.httpStatusCode, 
        requestId: response.$metadata.requestId,
        errorDetails: response // Include the full response for more context if needed
      });
      // delete the task from the database
      await db.delete(UserTasksTable).where(eq(UserTasksTable.id, returnedTaskId));
      // Directly throw the error message you want on the toast
      throw new Error("Failed to set up the task schedule. Please try again later or contact support.");
    }
    revalidatePath("/");
    return returnedTaskId;
  } catch (error: any) {
    // Log the original error, regardless of what it is
    log.error("Exception caught in createTask", {
      originalMessage: error.message,
      stack: error.stack,
      // If it's an error we've constructed and thrown, its message is already user-friendly.
      // If it's an unexpected error, its original message will be logged here.
    });

    // Define a list of known user-friendly messages that we might have thrown
    const knownUserFriendlyMessages = [
        "Authentication error. Please sign in again.",
        "You've reached the maximum number of tasks allowed.",
    ];

    // If the error's message is one of our known user-friendly messages, re-throw it.
    // This ensures it propagates to the client toast.
    if (knownUserFriendlyMessages.includes(error.message)) {
        throw error; 
    }
    
    // For truly unexpected errors (e.g., from deep SDK calls not caught above, or runtime errors),
    // throw a generic user-friendly message. The detailed error is already logged above.
    error.cause = { nextNoDigest: true, originalCause: error.cause };
    throw new Error("An unexpected error occurred while creating your task. Our team has been notified. Please try again later.");
  }
}

export async function updateTask(data: FormValues, taskId: string) {
  try {
    const user = await getDatabaseUser();
    if (!isValidUser(user)) {
      log.debug("User is not valid for updateTask");
      throw new Error("Authentication error. Please sign in again.");
    }
    // get the task from the database
    const task = await getTaskById(taskId);
    if (!task) {
      log.warn("Task not found for updateTask", { taskId });
      throw new Error("Task not found. It might have been deleted.");
    }
    const commandInput = generateUpdateScheduleCommand(data, user, task.id, task.scheduleName);
    const response = await updateSchedule(commandInput);
    if (response.$metadata.httpStatusCode !== 200) {
      log.error("Error updating AWS schedule for updateTask", {
        statusCode: response.$metadata.httpStatusCode,
        requestId: response.$metadata.requestId,
        errorDetails: response,
        taskId,
      });
      throw new Error("Failed to update the task schedule. Please try again later or contact support.");
    }
    // update the task in the database
    await db.update(UserTasksTable)
      .set({
        updatedAt: new Date(),
        formValues: data,
      })
      .where(and(eq(UserTasksTable.id, taskId), eq(UserTasksTable.userId, user.id as string)))
    
    log.debug("Updated task successfully in DB", { taskId });
    revalidatePath(`/tasks/${taskId}`);
    return taskId;
  } catch (error: any) {
    log.error("Exception caught in updateTask", {
      originalMessage: error.message,
      stack: error.stack,
      taskId,
    });

    const knownUserFriendlyMessages = [
      "Authentication error. Please sign in again.",
      "Task not found. It might have been deleted.",
    ];

    if (knownUserFriendlyMessages.includes(error.message)) {
      throw error;
    }

    error.cause = { nextNoDigest: true, originalCause: error.cause };
    throw new Error("An unexpected error occurred while updating your task. Our team has been notified. Please try again later.");
  }
}

export async function deleteTask(taskId: string) {
  try {
    const sessionUser = await getSessionUser();
    if (!sessionUser) {
      log.debug("User is not valid for deleteTask");
      throw new Error("Authentication error. Please sign in again.");
    }
    // check if the task exists
    const task = await getTaskById(taskId);
    if (!task) {
      log.warn("Task not found for deleteTask", { taskId });
      throw new Error("Task not found. It might have been already deleted.");
    }

    const deletedTaskFromDB = await db.delete(UserTasksTable)
      .where(and(eq(UserTasksTable.id, taskId), eq(UserTasksTable.userId, sessionUser.id)))
      .returning();

    if (!deletedTaskFromDB || deletedTaskFromDB.length === 0) {
      log.error("Error deleting task from DB for deleteTask", { taskId });
      throw new Error("Failed to delete task details from the database. Please try again.");
    }

    const deletedTask = deletedTaskFromDB[0] as Task;
    const scheduleName = deletedTask.scheduleName;

    // delete the schedule for the task
    const response = await deleteSchedule(scheduleName);
    if (response.$metadata.httpStatusCode !== 200) {
      log.error("Error deleting AWS schedule for deleteTask", {
        statusCode: response.$metadata.httpStatusCode,
        requestId: response.$metadata.requestId,
        errorDetails: response,
        scheduleName,
        taskId,
      });
      // Attempt to restore the task in the database since schedule deletion failed
      try {
        await db.insert(UserTasksTable).values(deletedTask);
        log.info("Restored task in DB after failed schedule deletion", { taskId, scheduleName });
      } catch (restoreError: any) {
        log.error("Failed to restore task in DB after schedule deletion error", {
          taskId,
          scheduleName,
          restoreErrorMessage: restoreError.message,
          restoreErrorStack: restoreError.stack,
        });
        // Even if restore fails, the primary error is still about schedule deletion.
        // The log above captures the restore failure for debugging.
      }
      throw new Error("Failed to delete the task schedule. The task may still exist. Please try again later or contact support.");
    }

    log.debug("Deleted task successfully", { taskId, scheduleName });
    revalidatePath("/");
    return;
  } catch (error: any) {
    log.error("Exception caught in deleteTask", {
      originalMessage: error.message,
      stack: error.stack,
      taskId,
    });

    const knownUserFriendlyMessages = [
      "Authentication error. Please sign in again.",
      "Task not found. It might have been already deleted.",
      "You are not authorized to delete this task.",
    ];

    if (knownUserFriendlyMessages.includes(error.message)) {
      throw error;
    }

    error.cause = { nextNoDigest: true, originalCause: error.cause };
    throw new Error("An unexpected error occurred while deleting your task. Our team has been notified. Please try again later.");
  }
}

export async function pauseTask(taskId: string): Promise<void> {
  try {
    const sessionUser = await getSessionUser();
    if (!sessionUser) {
      log.debug("User is not valid for pauseTask");
      throw new Error("Authentication error. Please sign in again.");
    }

    // check if the task exists
    const task = await getTaskById(taskId);
    if (!task) {
      log.warn("Task not found for pauseTask", { taskId });
      throw new Error("Task not found. It might have been already deleted.");
    }

    // pause the schedule for the task
    const response = await pauseSchedule(task.scheduleName);
    if (response.$metadata.httpStatusCode !== 200) {
      log.error("Error pausing AWS schedule for pauseTask", {
        statusCode: response.$metadata.httpStatusCode,
        requestId: response.$metadata.requestId,
        errorDetails: response,
        taskId,
      });
      throw new Error("Failed to pause the task. Please try again later or contact support.");
    }
    // update the task in the database
    await db.update(UserTasksTable)
      .set({
        status: "paused",
      })
      .where(and(eq(UserTasksTable.id, taskId), eq(UserTasksTable.userId, sessionUser.id)))
    
    log.debug("Paused task successfully in DB", { taskId });
    revalidatePath(`/tasks/${taskId}`);
    return;
  } catch (error: any) {
    log.error("Exception caught in pauseTask", {
      originalMessage: error.message,
      stack: error.stack,
      taskId,
    });

    const knownUserFriendlyMessages = [
      "Authentication error. Please sign in again.",
      "Task not found. It might have been already deleted.",
      "You are not authorized to pause this task.",
    ];

    if (knownUserFriendlyMessages.includes(error.message)) {
      throw error;
    }

    error.cause = { nextNoDigest: true, originalCause: error.cause };
    throw new Error("An unexpected error occurred while pausing your task. Our team has been notified. Please try again later.");
  }
}

export async function resumeTask(taskId: string): Promise<void> {
  try {
    const sessionUser = await getSessionUser();
    if (!sessionUser) {
      log.debug("User is not valid for resumeTask");
      throw new Error("Authentication error. Please sign in again.");
    }

    // check if the task exists
    const task = await getTaskById(taskId);
    if (!task) {
      log.warn("Task not found for resumeTask", { taskId });
      throw new Error("Task not found. It might have been already deleted.");
    }

    // resume the schedule for the task
    const response = await resumeSchedule(task.scheduleName);
    if (response.$metadata.httpStatusCode !== 200) {
      log.error("Error resuming AWS schedule for resumeTask", {
        statusCode: response.$metadata.httpStatusCode,
        requestId: response.$metadata.requestId,
        errorDetails: response,
        taskId,
      });
      throw new Error("Failed to resume the task. Please try again later or contact support.");
    }
    // update the task in the database
    await db.update(UserTasksTable)
      .set({
        status: "active",
      })
      .where(and(eq(UserTasksTable.id, taskId), eq(UserTasksTable.userId, sessionUser.id)))
    
    log.debug("Resumed task successfully in DB", { taskId });
    revalidatePath(`/tasks/${taskId}`);
    return;
  } catch (error: any) {
    log.error("Exception caught in resumeTask", {
      originalMessage: error.message,
      stack: error.stack,
      taskId,
    });

    const knownUserFriendlyMessages = [
      "Authentication error. Please sign in again.",
      "Task not found. It might have been already deleted.",
      "You are not authorized to resume this task.",
    ];

    if (knownUserFriendlyMessages.includes(error.message)) {
      throw error;
    }

    error.cause = { nextNoDigest: true, originalCause: error.cause };
    throw new Error("An unexpected error occurred while resuming your task. Our team has been notified. Please try again later.");
  }
}

export async function getTotalEmailsDeleted(): Promise<number> {
  const sessionUser = await getSessionUser();
  if (!sessionUser) {
    return 0;
  }
  const totalEmailsDeleted = await db.select({
    value: sum(UserTasksTable.emailsDeleted),
  })
  .from(UserTasksTable)
  .where(eq(UserTasksTable.userId, sessionUser.id))
  log.debug("Total emails deleted", { totalEmailsDeleted });
  if (!totalEmailsDeleted || totalEmailsDeleted.length === 0) {
    return 0;
  }
  const total = totalEmailsDeleted[0].value;
  if (!total) {
    return 0;
  }
  return parseInt(total);
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

export async function generateScheduleByPrompt(userDateTimePrompt: UserDateTimePromptType, prompt: AIPromptType): Promise<FormValues | string>{
  const result = await getScheduleByPrompt(userDateTimePrompt, prompt);
  if (!result) {
    return "Sorry, There was an error processing your request. Please try again later.";
  }
  const formValues = parseJsonToFormValues(result);
  return formValues;
}