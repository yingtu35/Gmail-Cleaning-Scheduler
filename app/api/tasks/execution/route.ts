import { eq, and } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

import { db } from "@/models/db";
import { UserTable, UserTasksTable } from "@/models/schema";
import log from "@/utils/log";
import { calculateNextExecutionDatetime, convertDateTimeObjectToDate, isStringDateFormat } from "@/utils/date";
import { parseJsonToFormValues } from "@/utils/schedule";
import { TaskStatus } from "@/types/task";
import * as userRepository from '@/libs/repositories/user';
import * as taskRepository from '@/libs/repositories/task';

export async function POST(request: NextRequest) {
  const apiKey = request.headers.get("x-api-key");
  const LAMBDA_API_KEY = process.env.LAMBDA_API_KEY;

  if (!apiKey || apiKey !== LAMBDA_API_KEY) {
    return NextResponse.json({ error: "Invalid API key" }, { status: 401 });
  }

  try {
    const { 
      userId, 
      taskId, 
      isSuccessful, 
      emailsDeleted, 
      lastExecutedAt, 
      accessToken, 
      accessTokenUpdatedAt
    } = await request.json();
  
    if (!userId || !taskId || isSuccessful === undefined || isSuccessful === null || !emailsDeleted || !lastExecutedAt || !accessToken || !accessTokenUpdatedAt) {
      log.error("Missing required fields", { userId, taskId, isSuccessful, emailsDeleted, lastExecutedAt, accessToken, accessTokenUpdatedAt });
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!isStringDateFormat(lastExecutedAt)) {
      log.error("Invalid lastExecutedAt format", { lastExecutedAt });
      return NextResponse.json({ error: "Invalid lastExecutedAt" }, { status: 400 });
    }

    if (!isStringDateFormat(accessTokenUpdatedAt)) {
      log.error("Invalid accessTokenUpdatedAt format", { accessTokenUpdatedAt });
      return NextResponse.json({ error: "Invalid accessTokenUpdatedAt" }, { status: 400 });
    }

    const user = await userRepository.getUserById(userId);

    if (!user) {
      log.error("User not found", { userId });
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const task = await taskRepository.findTask(taskId, userId);

    if (!task) {
      log.error("Task not found", { userId, taskId });
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    const { formValues } = task;
    const { occurrence } = parseJsonToFormValues(JSON.stringify(formValues));
    const lastExecutedAtDate = new Date(lastExecutedAt);
    const accessTokenUpdatedAtDate = new Date(accessTokenUpdatedAt);

    let newStatus: TaskStatus;
    let nextExecutedAt: Date | null = null;
    if (occurrence.Occurrence === "One-time") {
      newStatus = TaskStatus.COMPLETED;
    } else {
      const { rate, endDateAndTime } = occurrence.Schedule;
      nextExecutedAt = calculateNextExecutionDatetime(lastExecutedAtDate, rate);
      if (nextExecutedAt > convertDateTimeObjectToDate(endDateAndTime)) {
        newStatus = TaskStatus.COMPLETED;
      } else {
        newStatus = TaskStatus.ACTIVE;
      }
    }

    // update user
    await userRepository.updateUserToken(userId, accessToken, accessTokenUpdatedAtDate);

    // update task
    await taskRepository.updateTaskExecutionResult(taskId, {
      status: newStatus,
      emailsDeleted: task.emailsDeleted + emailsDeleted,
      successCounts: task.successCounts + (isSuccessful ? 1 : 0),
      errorCounts: task.errorCounts + (isSuccessful ? 0 : 1),
      lastExecutedAt: lastExecutedAtDate,
      nextExecutedAt: nextExecutedAt,
    });
  } catch (error) {
    log.error("Error updating user and task", { error });
    return NextResponse.json({ error: "Error updating user and task" }, { status: 500 });
  }

  return NextResponse.json({ success: true }, { status: 200 });
}