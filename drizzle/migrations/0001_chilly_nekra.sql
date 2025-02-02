ALTER TABLE "users" RENAME COLUMN "avatar" TO "avatar_link";--> statement-breakpoint
ALTER TABLE "users" RENAME COLUMN "bio" TO "description";--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT "users_did_unique";--> statement-breakpoint
ALTER TABLE "users" ADD PRIMARY KEY ("did");--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "id";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "email";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "is_active";