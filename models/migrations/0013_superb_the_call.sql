DO $$ BEGIN
 CREATE TYPE "public"."membership_tier_name" AS ENUM('basic', 'pro', 'enterprise');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "membership_tier" ALTER COLUMN "name" SET DATA TYPE membership_tier_name USING "name"::membership_tier_name;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_status_next_executed_at_index" ON "task" ("user_id","status","next_executed_at");