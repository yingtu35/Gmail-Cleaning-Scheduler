export type LambdaInput = {
  email: string;
  access_token: string;
  refresh_token: string;
  expires_at: string;
  q: string;
  task_name: string;
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