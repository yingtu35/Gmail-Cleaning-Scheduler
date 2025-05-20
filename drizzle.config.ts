import { defineConfig } from 'drizzle-kit'
import "dotenv-flow/config";

export default defineConfig({
  dialect: "postgresql",
  schema: "models/schema.ts",
  out: "models/migrations",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
})