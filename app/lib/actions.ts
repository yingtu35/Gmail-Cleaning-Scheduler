'use server'
// specify all server actions here
import { auth, signIn, signOut } from "@/auth";
import { AdapterSession, AdapterUser } from "next-auth/adapters";
import { Session } from "next-auth";
import { revalidatePath } from "next/cache";
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers'

import { db } from "@/app/drizzle/db";
import { UserTable, UserTasksTable } from "@/app/drizzle/schema";
import { eq, and } from "drizzle-orm";

import { createSchedule, updateSchedule, deleteSchedule } from "@/app/aws/scheduler";
import { subscribe, confirmSubscription } from "@/app/aws/sns";

import { UserInDB, Task, FormValues } from "@/app/lib/definitions";
import { convertToUTCDate, createCommandInput } from "@/app/utils/schedule";

export async function authenticate() {
  await signIn('google');
}

export async function logOut() {
  await signOut();
}

// async function getUserId() {
//   const session = await auth();
//   // console.log("session get", session);
//   if (!session) {
//     return null;
//   }
//   if (session.user.id !== undefined) {
//     return session.user.id;
//   }
//   return null;
// }

// export async function setUserId(session: {
//   user: AdapterUser;
// } & AdapterSession & Session) {
//   // console.log('session', session) 
//   console.log("calling setUserId")
//   if (!session || session.user.id !== undefined) {
//     return;
//   }
//   const user = await getUserByEmail(session.user.email as string);
//   if (!user || !user.id) {
//     return;
//   }
//   session.user = Object.assign({}, session.user, { id: user.id });
//   // console.log('session after', session)
//   return;
// }

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
  console.log("calling getUserByEmail")
  const user = await db.query.UserTable.findFirst({
    where: eq(UserTable.email, email)
  });
  if (!user) {
    return null;
  }
  // console.log("user", user)
  return user as UserInDB;
}

async function getUserById(id: string): Promise<UserInDB> {
  const user = await db.query.UserTable.findFirst({
    where: eq(UserTable.id, id)
  }) as UserInDB;
  return user;
}

export async function updateUserOnSignIn(user: UserInDB) {
  console.log("calling updateUserOnSignIn")
  await db.update(UserTable).set({
    name: user.name,
    image: user.image,
    accessToken: user.accessToken,
    expiresAt: user.expiresAt,
    refreshToken: user.refreshToken,
  })
  .where(eq(UserTable.email, user.email))
  // .returning({
  //   id: UserTable.id,
  //   name: UserTable.name,
  //   email: UserTable.email,
  //   image: UserTable.image,
  // })
  // console.log("returnedUser", returnedUser);
  return;
}

// create a new user in the database
export async function createUserOnSignIn(user: UserInDB) {
  console.log("calling createUserOnSignIn")
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
  // .returning({
  //   id: UserTable.id,
  //   name: UserTable.name,
  //   email: UserTable.email,
  //   image: UserTable.image,
  // })
  // console.log("returnedUser", returnedUser);
  return;
}

export async function getTaskById(taskId: string): Promise<Task | null> {
  const user = await getUser();
  if (!user || !user.id) {
    return null;
  }
  const task = await db.query.UserTasksTable.findFirst({
    where: and(eq(UserTasksTable.id, taskId), eq(UserTasksTable.userId, user.id)),
  }) as Task;
  // console.log("task", task);
  return task;
}

export async function getTasks(): Promise<Task[]> {
  const user = await getUser();
  if (!user || !user.id) {
    return [];
  }
  // get the tasks for the user
  console.log("calling getTasks")
  const tasks = await db.query.UserTasksTable.findMany({
    where: eq(UserTasksTable.userId, user.id),
    orderBy: (task, { desc }) => desc(task.updatedAt),
  }) as Task[];
  // return the tasks
  // console.log("tasks", tasks);
  return tasks;
}

// create a new task for the user in the database
export async function createTask(data: FormValues) {
  // TODO: parse the data using zod
  const user = await getUser();
  if (!user || !user.id) {
    return;
  }
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
    userId: user.id
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
  const user = await getUser();
  if (!user || !user.id) {
    return;
  }
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
  .where(and(eq(UserTasksTable.id, taskId), eq(UserTasksTable.userId, user.id)))
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
  const user = await getUser();
  if (!user || !user.id) {
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

export async function subscribeEmailNotification(email: string) {
  // subscribe the email
  const response = await subscribe(email);
  if (response.$metadata.httpStatusCode !== 200) {
    console.error("error subscribing", response);
    throw new Error("Error subscribing");
  }
  console.log("subscribing email send");
  return;
  // return the response
}


// export async function confirmSubscriptionByToken(prevState: any, token: string) {
//   const cookieStore = cookies();
//   // confirm the subscription
//   // const response = await confirmSubscription(token);
//   // console.log("response", response);
//   // if (response.$metadata.httpStatusCode !== 200) {
//   //   console.error("error confirming subscription", response);
//   //   return "Error confirming subscription";
//   // }
//   console.log("confirming subscription");
//   // set the cookie
//   cookieStore.set("isSubscribed", "true");
//   return "success";
//   // return the response
// }

