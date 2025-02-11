ALTER TABLE "likes" ALTER COLUMN "created_at" SET DATA TYPE varchar(30);--> statement-breakpoint
ALTER TABLE "likes" ALTER COLUMN "created_at" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "likes" ADD COLUMN "indexed_at" varchar(30) NOT NULL;--> statement-breakpoint
ALTER TABLE "likes" DROP COLUMN "cid";