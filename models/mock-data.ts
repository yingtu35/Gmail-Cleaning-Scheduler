import { UserInDB } from "@/types/user";

export const mockUser: UserInDB = {
  id: "58b0fb58-48bb-4002-b2d9-4cc9ce1ce928",
  name: "Test User",
  email: "test@gmail.com",
  image: "https://example.com/image.jpg",
  accessToken: "test-access-token",
  expiresAt: new Date(),
  refreshToken: "test-refresh-token",
} 

// export const mockTasks: Task[] = [
//   {
//     title: "Task 1",
//     description: "Description 1",
//     tasks: "is:unread older_than:3m",
//     isRepeatable: false,
//     repeatCount: 0,
//     userId: mockUser.id as string,
//   },
//   {
//     title: "Task 2",
//     description: "Description 2",
//     tasks: "from:leetcode OR from:hackerrank",
//     isRepeatable: true,
//     repeatInterval: "3m",
//     repeatCount: 0,
//     userId: "58b0fb58-48bb-4002-b2d9-4cc9ce1ce928",
//   }
// ]