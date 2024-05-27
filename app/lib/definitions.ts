// This file contains type definitions for the data.
// It describes the shape of the data, and what data type each property should accept.

export type UserIconType = {
  name: string;
  avatarUrl: string;
  htmlUrl: string;
}

export type UserInDB = {
  id?: string;
  name: string;
  email: string;
  image: string;
  accessToken: string;
  expiresAt: Date;
  refreshToken: string | undefined;
  createdAt?: Date;
}

export type Task = {
  id?: string;
  title: string;
  description?: string;
  tasks: string;
  createdAt?: Date;
  updatedAt?: Date;
  isRepeatable: boolean;
  repeatInterval?: string;
  repeatCount?: number;
  userId: string;
}