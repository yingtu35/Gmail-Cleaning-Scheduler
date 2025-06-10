import { eq, and, count, desc, sum, asc } from "drizzle-orm";
import { db } from "@/models/db";
import { UserTasksTable } from "@/models/schema";
import { Task, NewTask, NextScheduledTask, TaskCountsStats, TaskStatus, FormValues, TaskExecutionUpdate } from "@/types/task";
import { parseTask } from "@/utils/task";

export async function findTask(taskId: string, userId: string): Promise<Task | null> {
    const task = await db.query.UserTasksTable.findFirst({
        where: and(eq(UserTasksTable.id, taskId), eq(UserTasksTable.userId, userId)),
    });
    if (!task) {
        return null;
    }
    return parseTask(task);
}

export async function findTasksByUserId(userId: string): Promise<Task[]> {
    const tasks = await db.query.UserTasksTable.findMany({
        where: eq(UserTasksTable.userId, userId),
        orderBy: [desc(UserTasksTable.updatedAt)],
    });
    return tasks.map(parseTask);
}

export async function getTasksCountByUserId(userId: string): Promise<number> {
    const result = await db
      .select({ value: count(UserTasksTable.id) })
      .from(UserTasksTable)
      .where(eq(UserTasksTable.userId, userId));
    if (!result || result.length === 0) {
        return 0;
    }
    return result[0].value ?? 0;
}

export async function createTask(newTask: NewTask): Promise<{ id: string } | null> {
    const result = await db.insert(UserTasksTable).values(newTask).returning({
      id: UserTasksTable.id,
    });
    return result[0] ?? null;
}

export async function updateTask(taskId: string, userId: string, data: Partial<Task>): Promise<void> {
    await db.update(UserTasksTable)
      .set(data)
      .where(and(eq(UserTasksTable.id, taskId), eq(UserTasksTable.userId, userId)));
}

export async function deleteTask(taskId: string, userId: string): Promise<Task | null> {
    const result = await db.delete(UserTasksTable)
      .where(and(eq(UserTasksTable.id, taskId), eq(UserTasksTable.userId, userId)))
      .returning();
    return (result[0] as Task) ?? null;
}

export async function restoreTask(task: Task): Promise<void> {
    await db.insert(UserTasksTable).values(task);
}

export async function getTotalEmailsDeletedByUserId(userId: string): Promise<number> {
    const result = await db.select({
      value: sum(UserTasksTable.emailsDeleted),
    })
    .from(UserTasksTable)
    .where(eq(UserTasksTable.userId, userId));
    return Number(result[0]?.value ?? 0);
}

export async function getNextScheduledTaskByUserId(userId: string): Promise<NextScheduledTask | null> {
    const task = await db.query.UserTasksTable.findFirst({
        where: and(eq(UserTasksTable.userId, userId), eq(UserTasksTable.status, TaskStatus.ACTIVE)),
        orderBy: [asc(UserTasksTable.nextExecutedAt)],
        columns: {
          id: true,
          formValues: true,
          nextExecutedAt: true,
        }
    });
    return (task as NextScheduledTask) ?? null;
}

export async function getTaskCountsStatsByUserId(userId: string): Promise<TaskCountsStats | null> {
    const result = await db.select({
      successCounts: sum(UserTasksTable.successCounts),
      errorCounts: sum(UserTasksTable.errorCounts),
    })
    .from(UserTasksTable)
    .where(eq(UserTasksTable.userId, userId));
  
    if (!result || result.length === 0) {
      return null;
    }
    return {
      successCounts: Number(result[0]?.successCounts ?? 0),
      errorCounts: Number(result[0]?.errorCounts ?? 0),
    };
}

export async function getActiveTasksCountByUserId(userId: string): Promise<number> {
    const result = await db.select({
      value: count(),
    })
    .from(UserTasksTable)
    .where(and(eq(UserTasksTable.userId, userId), eq(UserTasksTable.status, TaskStatus.ACTIVE)));
    return result[0]?.value ?? 0;
}

export async function updateTaskExecutionResult(taskId: string, updates: TaskExecutionUpdate) {
    await db.update(UserTasksTable)
        .set(updates)
        .where(eq(UserTasksTable.id, taskId));
} 