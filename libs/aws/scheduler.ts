import { CreateScheduleCommand,
   UpdateScheduleCommand, 
   DeleteScheduleCommand,
   CreateScheduleCommandInput,
   UpdateScheduleCommandInput,
   DeleteScheduleCommandInput,
   CreateScheduleCommandOutput,
   UpdateScheduleCommandOutput,
   DeleteScheduleCommandOutput
} from "@aws-sdk/client-scheduler";
import { schedulerClient as client } from "./client";
import { CommandInput } from "@/types/aws";
import log from "@/app/utils/log";

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

export const updateSchedule = async (commandInput: CommandInput) => {
  const input: UpdateScheduleCommandInput = { // UpdateScheduleInput
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
    ActionAfterCompletion: "DELETE"
  };
  const command = new UpdateScheduleCommand(input);
  const response: UpdateScheduleCommandOutput = await client.send(command);
  log.debug(response); // { // UpdateScheduleOutput
  // { // UpdateScheduleOutput
  //   ScheduleArn: "STRING_VALUE", // required
  // };
  return response;
}