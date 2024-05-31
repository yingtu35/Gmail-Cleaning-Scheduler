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
import { client } from "./client";

export const createSchedule = async (name: string, description: string, expression: string, payload: string) => {
  const input: CreateScheduleCommandInput = { // CreateScheduleInput
    Name: name, // required
    // GroupName: "STRING_VALUE",
    ScheduleExpression: expression, // required
    // StartDate: new Date("TIMESTAMP"),
    // EndDate: new Date("TIMESTAMP"),
    Description: description,
    ScheduleExpressionTimezone: "Asia/Taipei",
    // State: "STRING_VALUE",
    // KmsKeyArn: "STRING_VALUE",
    Target: { // Target
      Arn: "arn:aws:lambda:us-west-2:051514083281:function:TestGmailDeletion", // required
      RoleArn: "arn:aws:iam::051514083281:role/service-role/Amazon_EventBridge_Scheduler_LAMBDA_28318b7a96", // required
      // DeadLetterConfig: { // DeadLetterConfig
      //   Arn: "STRING_VALUE",
      // },
      RetryPolicy: { // RetryPolicy
        MaximumEventAgeInSeconds: 60,
        MaximumRetryAttempts: 2,
      },
      Input: payload, //* Must be a JSON string
    },
    FlexibleTimeWindow: { // FlexibleTimeWindow
      Mode: "OFF", // required
      // MaximumWindowInMinutes: Number("int"),
    },
    // ClientToken: "STRING_VALUE",
    // ActionAfterCompletion: "STRING_VALUE",
  };
  const command = new CreateScheduleCommand(input);
  const response: CreateScheduleCommandOutput = await client.send(command);
  console.log("response", response);
  // { // CreateScheduleOutput
  //   ScheduleArn: "STRING_VALUE", // required
  // };
  return response;
}

export const deleteSchedule = async (name: string) => {
  const input: DeleteScheduleCommandInput = { // DeleteScheduleInput
    Name: name, // required
    GroupName: "STRING_VALUE",
    // ClientToken: "STRING_VALUE",
  };
  const command = new DeleteScheduleCommand(input);
  const response: DeleteScheduleCommandOutput = await client.send(command);
  // {};
}

export const updateSchedule = async (name: string, description: string, expression: string, payload: string) => {
  const input: UpdateScheduleCommandInput = { // UpdateScheduleInput
    Name: name, // required
    // GroupName: "STRING_VALUE",
    ScheduleExpression: expression, // required
    // StartDate: new Date("TIMESTAMP"),
    // EndDate: new Date("TIMESTAMP"),
    Description: description,
    ScheduleExpressionTimezone: "STRING_VALUE",
    // State: "STRING_VALUE",
    // KmsKeyArn: "STRING_VALUE",
    Target: { // Target
      Arn: "STRING_VALUE", // required
      RoleArn: "STRING_VALUE", // required
      DeadLetterConfig: { // DeadLetterConfig
        Arn: "STRING_VALUE",
      },
      RetryPolicy: { // RetryPolicy
        MaximumEventAgeInSeconds: Number("int"),
        MaximumRetryAttempts: Number("int"),
      },
      Input: payload, //* Must be a JSON string
    },
    FlexibleTimeWindow: { // FlexibleTimeWindow
      Mode: "OFF", // required
      MaximumWindowInMinutes: Number("int"),
    },
    // ClientToken: "STRING_VALUE",
    // ActionAfterCompletion: "STRING_VALUE",
  };
  const command = new UpdateScheduleCommand(input);
  const response: UpdateScheduleCommandOutput = await client.send(command);
  console.log(response); // { // UpdateScheduleOutput
  // { // UpdateScheduleOutput
  //   ScheduleArn: "STRING_VALUE", // required
  // };
}