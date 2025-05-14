import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";
import "dotenv-flow/config";

import { neon } from "@neondatabase/serverless";
import { UserInDB } from "@/types/user";

import { UserTable, UserTasksTable } from "./schema";
import { mockUser } from "./mock-data";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

async function createUser(user: UserInDB) {
  const returnedUser = await db.insert(UserTable).values({
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image,
    accessToken: user.accessToken,
    expiresAt: user.expiresAt,
    refreshToken: user.refreshToken,
  }).returning({
    id: UserTable.id,
  });
  return returnedUser;
}

async function updateUser(user: UserInDB) {
  await db.update(UserTable)
  .set({
    name: "Updated User",
  })
  .where(eq(UserTable.id, user.id as string));
}

// async function createTasks(tasks: Task[]) {
//   const returnedTasks = await db.insert(UserTasksTable)
//   .values(tasks)
//   .returning({
//     id: UserTasksTable.id,
//     title: UserTasksTable.title,
//     description: UserTasksTable.description,
//     tasks: UserTasksTable.tasks,
//     isRepeatable: UserTasksTable.isRepeatable,
//     repeatInterval: UserTasksTable.repeatInterval,
//     repeatCount: UserTasksTable.repeatCount,
//     userId: UserTasksTable.userId,
//   })
//   return returnedTasks;
// }

async function test() {
  // create user
  const users = await createUser(mockUser);

  // create tasks
  // const tasks = await createTasks(mockTasks);

  // update user
  await updateUser(mockUser);

  // // update task
  // await db.update(UserTasksTable)
  // .set({
  //   title: "Updated Task",
  // })
  // .where(eq(UserTasksTable.id, tasks[0].id as string));

  // // delete task
  // await db.delete(UserTasksTable)
  // .where(eq(UserTasksTable.title, tasks[1].title));
}

async function clear() {
  await db.delete(UserTasksTable);
  await db.delete(UserTable);
}

async function main() {
  // await clear();
  // try {
  //   await test();
  //   console.log("Testing completed");
  // } catch (error) {
  //   console.error("Error during testing:", error);
  //   process.exit(1);
  // }
  await clear();
  console.log("Clearing completed");
}

main();