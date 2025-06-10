'use server'

import { revalidatePath } from "next/cache";
import * as taskRepository from '@/libs/repositories/task';

import { createSchedule, updateSchedule, deleteSchedule, pauseSchedule, resumeSchedule } from "@/libs/aws/scheduler";
import { getSessionUser, getDatabaseUserById } from "./user";

import { Task, FormValues, NewTask, NextScheduledTask, TaskCountsStats, TaskStatus } from "@/types/task";

import { createScheduleName, generateCreateScheduleCommand, generateUpdateScheduleCommand } from "@/utils/schedule";
import { isValidUser, isValidUUID, hasReachedTaskLimit } from "@/utils/database";
import { deriveNextExecutionDatetime } from "@/utils/date";

import log from "@/utils/log";

export async function getTaskById(taskId: string): Promise<Task | null> {
    const sessionUser = await getSessionUser();
    if (!sessionUser) {
      return null;
    }
    if (!isValidUUID(taskId)) {
      return null;
    }
    const task = await taskRepository.findTask(taskId, sessionUser.id);
    if (!task) {
      return null;
    }
    return task;
}
  
export async function getTasks(): Promise<Task[]> {
    const sessionUser = await getSessionUser();
    if (!sessionUser) {
      return [];
    }
    const tasks = await taskRepository.findTasksByUserId(sessionUser.id);
    return tasks;
}
  
export async function getTasksCount(userId: string): Promise<number> {
    return await taskRepository.getTasksCountByUserId(userId);
}
  
export async function createTask(data: FormValues) {
    try {
      const sessionUser = await getSessionUser();
      if (!sessionUser) {
        log.debug("User is not valid for createTask");
        throw new Error("Authentication error. Please sign in again.");
      }
      
      const numOfTasks = await getTasksCount(sessionUser.id);
      if (hasReachedTaskLimit(numOfTasks)) {
        log.debug("User has reached the task limit");
        throw new Error("You've reached the maximum number of tasks allowed.");
      }
      const user = await getDatabaseUserById(sessionUser.id);
      if (!isValidUser(user)) {
        log.debug("User is not valid for createTask");
        throw new Error("Authentication error. Please sign in again.");
      }
  
      const scheduleName = createScheduleName(user.id);
      const nextExecutedAt = deriveNextExecutionDatetime(data);
      const newTask: NewTask = {
        scheduleName,
        formValues: data,
        nextExecutedAt,
        userId: user.id,
      }
      const result = await taskRepository.createTask(newTask);
      if (!result || !result.id) {
        log.error("Error creating task in DB after schedule creation", { taskName: newTask.scheduleName });
        throw new Error("Failed to save task details. Please try again later or contact support.");
      }
      const returnedTaskId = result.id;
      const commandInput = generateCreateScheduleCommand(data, user, returnedTaskId, scheduleName);
  
      const response = await createSchedule(commandInput);
      if (response.$metadata.httpStatusCode !== 200) {
        log.error("Error creating AWS schedule", { 
          statusCode: response.$metadata.httpStatusCode, 
          requestId: response.$metadata.requestId,
          errorDetails: response
        });
        let deleteSuccessful = false;
        try {
          await taskRepository.deleteTask(returnedTaskId, user.id);
          deleteSuccessful = true;
        } catch (deleteError: any) {
          log.error("Failed to delete task in DB after schedule creation error", {
            taskId: returnedTaskId,
            scheduleName,
            deleteErrorMessage: deleteError.message,
            deleteErrorStack: deleteError.stack,
          });
        }
        if (deleteSuccessful) {
          throw new Error("Failed to set up the task schedule. Please try again later or contact support.");
        } else {
          throw new Error("Critical error: The task was not set up properly. Please contact support immediately.");
        }
      }
      revalidatePath("/");
      return returnedTaskId;
    } catch (error: any) {
      log.error("Exception caught in createTask", {
        originalMessage: error.message,
        stack: error.stack,
      });
  
      const knownUserFriendlyMessages = [
          "Authentication error. Please sign in again.",
          "You've reached the maximum number of tasks allowed.",
      ];
  
      if (knownUserFriendlyMessages.includes(error.message)) {
          throw error; 
      }
      
      error.cause = { nextNoDigest: true, originalCause: error.cause };
      throw new Error("An unexpected error occurred while creating your task. Our team has been notified. Please try again later.");
    }
}
  
export async function updateTask(data: FormValues, taskId: string) {
    try {
      const sessionUser = await getSessionUser();
      if (!sessionUser?.id) {
        log.debug("User is not valid for updateTask");
        throw new Error("Authentication error. Please sign in again.");
      }
      const user = await getDatabaseUserById(sessionUser.id);
      if (!isValidUser(user)) {
        log.debug("User is not valid for updateTask");
        throw new Error("Authentication error. Please sign in again.");
      }
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
      const nextExecutedAt = deriveNextExecutionDatetime(data);
      await taskRepository.updateTask(taskId, user.id, {
        updatedAt: new Date(),
        formValues: data,
        nextExecutedAt,
      });
      
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
      const task = await getTaskById(taskId);
      if (!task) {
        log.warn("Task not found for deleteTask", { taskId });
        throw new Error("Task not found. It might have been already deleted.");
      }
  
      const deletedTask = await taskRepository.deleteTask(taskId, sessionUser.id);
  
      if (!deletedTask) {
        log.error("Error deleting task from DB for deleteTask", { taskId });
        throw new Error("Failed to delete task details from the database. Please try again.");
      }
  
      const scheduleName = deletedTask.scheduleName;
  
      const response = await deleteSchedule(scheduleName);
      if (response.$metadata.httpStatusCode !== 200) {
        log.error("Error deleting AWS schedule for deleteTask", {
          statusCode: response.$metadata.httpStatusCode,
          requestId: response.$metadata.requestId,
          errorDetails: response,
          scheduleName,
          taskId,
        });
        let restoreSuccessful = false;  
        try {  
          await taskRepository.restoreTask(deletedTask);  
          log.info("Restored task in DB after failed schedule deletion", { taskId, scheduleName });  
          restoreSuccessful = true;  
        } catch (restoreError: any) {  
          log.error("Failed to restore task in DB after schedule deletion error", {  
            taskId,  
            scheduleName,  
            restoreErrorMessage: restoreError.message,  
            restoreErrorStack: restoreError.stack,  
          });  
        }  

        if (restoreSuccessful) {  
          throw new Error("Failed to delete the task schedule. The task has been restored in the database, but the schedule may still exist. Please try again later or contact support.");  
        } else {  
          throw new Error("Critical error: Failed to delete the task schedule AND failed to restore the task in the database. The task data may be lost. Please contact support immediately.");  
        }      
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
  
      const task = await getTaskById(taskId);
      if (!task) {
        log.warn("Task not found for pauseTask", { taskId });
        throw new Error("Task not found. It might have been already deleted.");
      }
  
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
      await taskRepository.updateTask(taskId, sessionUser.id, {
        status: TaskStatus.PAUSED,
      });
      
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
  
      const task = await getTaskById(taskId);
      if (!task) {
        log.warn("Task not found for resumeTask", { taskId });
        throw new Error("Task not found. It might have been already deleted.");
      }
  
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
      await taskRepository.updateTask(taskId, sessionUser.id, {
        status: TaskStatus.ACTIVE,
      });
      
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
    return await taskRepository.getTotalEmailsDeletedByUserId(sessionUser.id);
}
  
export async function getNextScheduledTask(): Promise<NextScheduledTask | null> {
    const sessionUser = await getSessionUser();
    if (!sessionUser) {
      return null;
    }
    const task = await taskRepository.getNextScheduledTaskByUserId(sessionUser.id);
    if (!task) {
      return null;
    }
    return task;
}
  
export async function getTaskCountsStats(): Promise<TaskCountsStats | null> {
    const sessionUser = await getSessionUser();
    if (!sessionUser) {
      return null;
    }
    const taskCountsStats = await taskRepository.getTaskCountsStatsByUserId(sessionUser.id);
    if (!taskCountsStats) {
      return null;
    }
    return taskCountsStats;
}
  
export async function getActiveTasksCount(): Promise<number> {
    const sessionUser = await getSessionUser();
    if (!sessionUser) {
      return 0;
    }
    return await taskRepository.getActiveTasksCountByUserId(sessionUser.id);
} 