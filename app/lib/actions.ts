'use server'

// specify all server actions here
import { auth, signIn, signOut } from "@/auth";
import { db } from "@/app/drizzle/db";
import { UserTable, UserTasksTable } from "@/app/drizzle/schema";
import { eq, and, sql } from "drizzle-orm";
import { UserInDB, Task } from "./definitions";
import { revalidatePath } from "next/cache";
import { redirect } from 'next/navigation';

import { createSchedule } from "@/app/aws/scheduler";

import { mockTaskData, mockLambdaPayload } from "../data/mock-data";

export async function authenticate() {
  await signIn('google');
}

export async function logOut() {
  await signOut();
}

async function getUserId() {
  const session = await auth();
  if (!session) {
    return null;
  }
  if (session.user.id !== undefined) {
    return session.user.id;
  }
  const email = session.user.email as string;
  const user = await getUserIdByEmail(email);
  // save the id in the session
  if (!user) {
    return null;
  }
  session.user.id = user.id;
  return user.id;
}

async function setUserId(id: string) {
  const session = await auth();
  if (!session) {
    return;
  }
  session.user.id = id;
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
  // ! Cannot call setUserId on newly created user
  setUserId(returnedUser[0].id);
  console.log("returnedUser", returnedUser);
  return returnedUser;
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
    columns: {
      repeatInterval: false
    },
    extras: {
      repeatInterval: sql<string>`${UserTasksTable.repeatInterval}::text`.as("repeatInterval")
    }
  }) as Task[];
  // return the tasks
  // console.log("tasks", tasks);
  return tasks;
}

// create a new task for the user in the database
export async function createTask(data: FormData) {
  // console.log("data", data);
  // parse the data using zod
  // form the task object
  // const userId = await getUserId();
  // if (!userId) {
  //   return;
  // }

  // const newTask: Task = {
  //   title: mockTaskData["title"] as string,
  //   description: mockTaskData["description"] as string,
  //   tasks: mockTaskData["tasks"] as string,
  //   isRepeatable: mockTaskData["isRepeatable"] === "true",
  //   repeatInterval: mockTaskData["repeatInterval"] as string,
  //   userId: userId as string,
  // }
  // // insert the data into the database
  // const returnedTask = await db.insert(UserTasksTable).values(newTask).returning({
  //   id: UserTasksTable.id,
  //   title: UserTasksTable.title,
  //   description: UserTasksTable.description,
  //   tasks: UserTasksTable.tasks,
  //   isRepeatable: UserTasksTable.isRepeatable,
  //   repeatInterval: UserTasksTable.repeatInterval,
  //   userId: UserTasksTable.userId,
  // })
  // console.log("returnedTask", returnedTask);
  // create a schedule for the task
  const name = data.get("title") as string;
  const description = data.get("description") as string;
  const expression = "at(2024-05-31T18:00:00)";
  const response = await createSchedule(name, description, expression, JSON.stringify(mockLambdaPayload));
  console.log("response", response);
  // revalidate path
  revalidatePath("/");
  // redirect to the task page
  redirect("/");
}

export async function updateTask(data: FormData) {
  // parse the data using zod
  // update the data in the database
  const userId = await getUserId();
  if (!userId) {
    return;
  }
  const updatedTask: Task = {
    id: data.get("id") as string,
    title: data.get("title") as string,
    description: data.get("description") as string,
    tasks: data.get("tasks") as string,
    isRepeatable: data.get("isRepeatable") === "true",
    repeatInterval: data.get("repeatInterval") as string,
    userId: userId as string,
  }
  const returnedTask = await db.update(UserTasksTable).set(updatedTask)
  .where(eq(UserTasksTable.id, updatedTask.id as string))
  .returning({
    id: UserTasksTable.id,
    title: UserTasksTable.title,
    description: UserTasksTable.description,
    tasks: UserTasksTable.tasks,
    isRepeatable: UserTasksTable.isRepeatable,
    repeatInterval: UserTasksTable.repeatInterval,
    userId: UserTasksTable.userId,
  })
  console.log("returnedTask", returnedTask);
  // reinvalidate the cache
  revalidatePath("/");
  // redirect to the task page
  redirect("/");
}

export async function deleteTask(taskId: string) {
  const userId = await getUserId();
  if (!userId) {
    return;
  }
  // delete the task from the database
  const deletedTaskId = await db.delete(UserTasksTable)
    .where(and( eq(UserTasksTable.id, taskId), 
                eq(UserTasksTable.userId, userId as string))
          )
    .returning({ deletedId: UserTasksTable.id})
  console.log("deletedTaskId", deletedTaskId);
  // reinvalidate the cache
  revalidatePath("/");
}


