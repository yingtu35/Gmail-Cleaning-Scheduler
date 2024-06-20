export const mockEmail = "yingtu35@gmail.com"

export const mockTaskData = {
  title: "Schedule test 2",
  description: "This is a schedule test 2",
  tasks: "from:leetcode in:inbox",
  isRepeatable: "true",
  repeatInterval: "7 days",
  email: mockEmail
}

export const mockLambdaPayload = {
  email: "yingtu35@gmail.com",
  accessToken: process.env.ACCESS_TOKEN,
  expiresAt: "2024-05-28T01:00:21.000Z",
  refreshToken: process.env.REFRESH_TOKEN,
  q: "from:daily.dev is:unread"
}