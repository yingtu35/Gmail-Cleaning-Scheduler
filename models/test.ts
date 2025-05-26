import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";
import "dotenv-flow/config";

import { neon } from "@neondatabase/serverless";
import { NewUser, User } from "@/types/user";
import { Task, NewTask } from "@/types/task";

import { UserTable, UserTasksTable } from "./schema";
import { mockNewUser, mockNewTask } from "./mock-data";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

async function createUser(user: NewUser) {
  const returnedUser = await db.insert(UserTable).values({
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image,
    accessToken: user.accessToken,
    accessTokenUpdatedAt: user.accessTokenUpdatedAt,
    refreshToken: user.refreshToken,
  }).returning();
  console.log("User created");
  return returnedUser[0] as User;
}

async function updateUser(user: User) {
  await db.update(UserTable)
  .set({
    name: "Updated User",
  })
  .where(eq(UserTable.id, user.id as string));
  console.log("User updated");
}

async function createTask(task: NewTask) {
  const returnedTask = await db.insert(UserTasksTable).values(task).returning();
  console.log("Task created");
  return returnedTask[0] as Task;
}

async function updateTask(task: Task) {
  await db.update(UserTasksTable)
  .set({
    status: "completed",
  })
  .where(eq(UserTasksTable.id, task.id as string));
  console.log("Task updated");
}

async function deleteTask(task: Task) {
  await db.delete(UserTasksTable)
  .where(eq(UserTasksTable.id, task.id as string));
  console.log("Task deleted");
}

async function deleteUser(user: User) {
  await db.delete(UserTable)
  .where(eq(UserTable.id, user.id as string));
  console.log("User deleted");
}

async function test() {
  // create user
  const user = await createUser(mockNewUser);

  // create tasks
  const mockUserCreatedTask = {
    ...mockNewTask,
    userId: user.id
  } as NewTask;
  const task = await createTask(mockUserCreatedTask);

  // update user
  await updateUser(user);

  // update task
  await updateTask(task);

  // delete task
  await deleteTask(task);

  // delete user
  await deleteUser(user);
}

async function clear() {
  await db.delete(UserTasksTable);
  await db.delete(UserTable);
}

async function main() {
  await clear();
  console.log("Start testing...");
  try {
    await test();
    console.log("Testing completed");
  } catch (error) {
    console.error("Error during testing:", error);
    process.exit(1);
  } finally {
    await clear();
    console.log("Clearing completed");
  }
}

main();