import { config } from "./config";

import { SchedulerClient } from "@aws-sdk/client-scheduler";
import { SNSClient } from "@aws-sdk/client-sns";

export const schedulerClient = new SchedulerClient(config);
export const snsClient = new SNSClient(config);
