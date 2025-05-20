DO $$ BEGIN
 CREATE TYPE "public"."status" AS ENUM('active', 'paused', 'completed');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "updated_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "task" ADD COLUMN "status" "status" DEFAULT 'active';--> statement-breakpoint
ALTER TABLE "task" ADD COLUMN "emails_deleted" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "task" ADD COLUMN "success_counts" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "task" ADD COLUMN "error_counts" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "task" DROP COLUMN IF EXISTS "expires_at";--> statement-breakpoint
ALTER TABLE "task" DROP COLUMN IF EXISTS "repeat_count";