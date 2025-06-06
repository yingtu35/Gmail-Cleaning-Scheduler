DO $$ BEGIN
 CREATE TYPE "public"."billing_interval" AS ENUM('month', 'year');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."subscription_status" AS ENUM('active', 'past_due', 'unpaid', 'canceled');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "membership_tier" (
	"id" serial PRIMARY KEY NOT NULL,
	"price_id" varchar(20) NOT NULL,
	"name" varchar(20) NOT NULL,
	"price_cents" integer NOT NULL,
	"billing_interval" "billing_interval" NOT NULL,
	"max_active_jobs" integer NOT NULL,
	"max_total_jobs" integer NOT NULL,
	"max_emails_per_exec" integer NOT NULL,
	"max_window_in_minutes" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "membership_tier_price_id_unique" UNIQUE("price_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "subscriptions" (
	"id" serial PRIMARY KEY NOT NULL,
	"subscription_id" varchar(20) NOT NULL,
	"user_id" integer NOT NULL,
	"membership_tier_id" integer NOT NULL,
	"status" "subscription_status" NOT NULL,
	"cancel_at" timestamp,
	"canceled_at" timestamp,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "subscriptions_subscription_id_unique" UNIQUE("subscription_id"),
	CONSTRAINT "subscriptions_user_id_unique" UNIQUE("user_id")
);