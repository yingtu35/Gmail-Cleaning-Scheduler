ALTER TABLE "task" ADD COLUMN "expires_at" timestamp;--> statement-breakpoint
ALTER TABLE "task" ADD COLUMN "form_values" text NOT NULL;--> statement-breakpoint
ALTER TABLE "task" DROP COLUMN IF EXISTS "title";--> statement-breakpoint
ALTER TABLE "task" DROP COLUMN IF EXISTS "description";--> statement-breakpoint
ALTER TABLE "task" DROP COLUMN IF EXISTS "tasks";--> statement-breakpoint
ALTER TABLE "task" DROP COLUMN IF EXISTS "is_repeatable";--> statement-breakpoint
ALTER TABLE "task" DROP COLUMN IF EXISTS "repeat_interval";