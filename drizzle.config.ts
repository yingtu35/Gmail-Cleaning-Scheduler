import { defineConfig } from 'drizzle-kit'
import "dotenv-flow/config";

export default defineConfig({
  dialect: "postgresql",
  schema: "app/drizzle/schema.ts",
  out: "app/drizzle/migrations",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
})