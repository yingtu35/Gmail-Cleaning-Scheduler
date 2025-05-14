export type UserGoogle = {
  name: string;
  email: string;
  image: string;
  accessToken: string;
  expiresAt: Date;
  refreshToken: string | undefined;
}

export type UserInDB = {
  id: string;
  name: string;
  email: string;
  image: string;
  accessToken: string;
  expiresAt: Date;
  refreshToken: string | undefined;
  createdAt?: Date;
}

export type UserDateTimePromptType = {
  date: string;
  time: string;
  timezone: string;
}