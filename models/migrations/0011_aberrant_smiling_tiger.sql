ALTER TABLE "subscriptions" DROP COLUMN "user_id";
--> statement-breakpoint
ALTER TABLE "subscriptions" ADD COLUMN "user_id" uuid NOT NULL;

--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_membership_tier_id_membership_tier_id_fk" FOREIGN KEY ("membership_tier_id") REFERENCES "public"."membership_tier"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "price_id_index" ON "membership_tier" ("price_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "subscription_id_index" ON "subscriptions" ("subscription_id");