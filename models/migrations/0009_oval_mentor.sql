ALTER TABLE "user" ALTER COLUMN "access_token_updated_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "task" ALTER COLUMN "status" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "task" ALTER COLUMN "emails_deleted" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "task" ALTER COLUMN "success_counts" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "task" ALTER COLUMN "error_counts" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "task" ALTER COLUMN "last_executed_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "task" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "task" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "task" ADD COLUMN "next_executed_at" timestamp with time zone;