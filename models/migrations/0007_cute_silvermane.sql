ALTER TABLE "user" ADD COLUMN "access_token_updated_at" timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE "task" ADD COLUMN "last_executed_at" timestamp;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "index_access_token_updated_at" ON "user" ("access_token_updated_at");--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN IF EXISTS "expires_at";