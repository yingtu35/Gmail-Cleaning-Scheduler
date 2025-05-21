import { 
  GetScheduleCommand,
  CreateScheduleCommand,
  UpdateScheduleCommand, 
  DeleteScheduleCommand,
  GetScheduleCommandInput,
  CreateScheduleCommandInput,
  UpdateScheduleCommandInput,
  DeleteScheduleCommandInput,
  GetScheduleCommandOutput,
  CreateScheduleCommandOutput,
  UpdateScheduleCommandOutput,
  DeleteScheduleCommandOutput,
  ResourceNotFoundException
} from "@aws-sdk/client-scheduler";
import { schedulerClient as client } from "./client";
import { CommandInput } from "@/types/aws";
import log from "@/utils/log";

export const createSchedule = async (commandInput: CommandInput) => {
  const input: CreateScheduleCommandInput = { // CreateScheduleInput
    Name: commandInput.name, // required
    // GroupName: "STRING_VALUE",
    ScheduleExpression: commandInput.scheduleExpression, // required
    StartDate: commandInput.startDate,
    EndDate: commandInput.endDate,
    Description: commandInput.description,
    ScheduleExpressionTimezone: commandInput.scheduleExpressionTimezone,
    State: commandInput.state === "ENABLED" ? "ENABLED" : "DISABLED",
    // KmsKeyArn: "STRING_VALUE",
    Target: { // Target
      Arn: process.env.LAMBDA_TARGET_ARN, // required
      RoleArn: process.env.SCHEDULER_ROLE_ARN, // required
      // DeadLetterConfig: { // DeadLetterConfig
      //   Arn: "STRING_VALUE",
      // },
      RetryPolicy: { // RetryPolicy
        MaximumEventAgeInSeconds: 60,
        MaximumRetryAttempts: 2,
      },
      Input: commandInput.input, //* Must be a JSON string
    },
    FlexibleTimeWindow: { // FlexibleTimeWindow
      Mode: "OFF", // required
      // MaximumWindowInMinutes: Number("int"),
    },
    // ClientToken: "STRING_VALUE",
    ActionAfterCompletion: "DELETE",
  };
  const command = new CreateScheduleCommand(input);
  const response: CreateScheduleCommandOutput = await client.send(command);
  log.debug("response", response);
  // { // CreateScheduleOutput
  //   ScheduleArn: "STRING_VALUE", // required
  // };
  return response;
}

export const deleteSchedule = async (name: string) => {
  const input: DeleteScheduleCommandInput = { // DeleteScheduleInput
    Name: name, // required
    // GroupName: "STRING_VALUE",
    // ClientToken: "STRING_VALUE",
  };
  const command = new DeleteScheduleCommand(input);
  const response: DeleteScheduleCommandOutput = await client.send(command);
  return response;
}

const getSchedule = async (name: string) => {
  const input: GetScheduleCommandInput = { // GetScheduleInput
    Name: name, // required
    // GroupName: "STRING_VALUE",
  };
  const command = new GetScheduleCommand(input);
  const response: GetScheduleCommandOutput = await client.send(command);
  return response;
}

export const updateSchedule = async (commandInput: CommandInput) => {
  try {
    const schedule = await getSchedule(commandInput.name);
    const input: UpdateScheduleCommandInput = { // UpdateScheduleInput
      Name: commandInput.name,
      ScheduleExpression: commandInput.scheduleExpression, // required
      StartDate: commandInput.startDate,
      EndDate: commandInput.endDate,
      Description: commandInput.description,
      ScheduleExpressionTimezone: commandInput.scheduleExpressionTimezone,
      State: commandInput.state === "ENABLED" ? "ENABLED" : "DISABLED",
      Target: { // Target
        Arn: schedule.Target?.Arn || process.env.LAMBDA_TARGET_ARN, // required
        RoleArn: schedule.Target?.RoleArn || process.env.SCHEDULER_ROLE_ARN, // required
        Input: commandInput.input, //* Must be a JSON string
        ...schedule.Target,
      },
      FlexibleTimeWindow: schedule.FlexibleTimeWindow || {
        Mode: "OFF",
      },
      ActionAfterCompletion: schedule.ActionAfterCompletion || "DELETE"
    };
    const command = new UpdateScheduleCommand(input);
    const response: UpdateScheduleCommandOutput = await client.send(command);
    log.debug(response); // { // UpdateScheduleOutput
    return response;
  } catch (error: unknown) {
    if (error instanceof ResourceNotFoundException) {
      log.error(error);
      throw new Error("Schedule not found");
    } else {
      log.error(error);
      throw error;
    }
  }
}

export const pauseSchedule = async (name: string) => {
  try {
    const schedule = await getSchedule(name);
    if (schedule.State === "ENABLED") {
      const input: UpdateScheduleCommandInput = {
        Name: schedule.Name,
        ScheduleExpression: schedule.ScheduleExpression,
        Target: schedule.Target,
        FlexibleTimeWindow: schedule.FlexibleTimeWindow,
        State: "DISABLED",
        ...schedule,
      };
      const command = new UpdateScheduleCommand(input);
      const response: UpdateScheduleCommandOutput = await client.send(command);
      return response;
    } else {
      log.debug("Schedule is already disabled", { name });
      return schedule;
    }
  } catch (error: unknown) {
    if (error instanceof ResourceNotFoundException) {
      log.error(error);
      throw new Error("Schedule not found");
    } else {
      log.error(error);
      throw error;
    }
  }
}