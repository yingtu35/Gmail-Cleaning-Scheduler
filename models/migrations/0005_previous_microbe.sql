ALTER TABLE "task" ADD COLUMN "schedule_name" varchar(61) NOT NULL;--> statement-breakpoint
ALTER TABLE "task" ADD CONSTRAINT "task_schedule_name_unique" UNIQUE("schedule_name");