export type LambdaInput = {
  user_id: string;
  email: string;
  access_token: string;
  refresh_token: string;
  q: string;
  task_name: string;
  task_id: string;
}

export type CommandInput = {
  name: string;
  scheduleExpression: string;
  description: string;
  startDate?: Date;
  endDate?: Date;
  scheduleExpressionTimezone: string;
  state: string;
  input: string;
}